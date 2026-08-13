from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from orders.serializers import OrderSerializer
from payments.models import PaymentEvent
from payments.rapid_gateway import (
    RapidGatewayError,
    create_payment,
    is_configured,
    verify_webhook_signature,
)
from payments.services import mark_order_failed, mark_order_paid


def _company_or_404(company_slug):
    from companies.models import Company

    company = (
        Company.objects.filter(slug=company_slug, is_active=True)
        .select_related("settings")
        .first()
    )
    if not company or not company.storefront_enabled:
        return None, Response(
            {"detail": "Company storefront not available."},
            status=status.HTTP_404_NOT_FOUND,
        )
    return company, None


def _absolute(request, path: str) -> str:
    return request.build_absolute_uri(path)


def _storefront_base(request) -> str:
    configured = (getattr(settings, "STOREFRONT_BASE_URL", "") or "").rstrip("/")
    if configured:
        return configured
    origin = (request.headers.get("Origin") or "").rstrip("/")
    if origin:
        return origin
    return "http://localhost:5173"


class RapidGatewayConfigView(APIView):
    """Public checkout config (no secrets)."""

    def get(self, request, company_slug):
        company, err = _company_or_404(company_slug)
        if err:
            return err
        configured = is_configured()
        simulate = settings.DEBUG and not configured
        return Response(
            {
                "company": company_slug,
                "provider": "rapid_gateway",
                "env": settings.RAPID_GATEWAY_ENV,
                "currency": getattr(
                    getattr(company, "settings", None),
                    "currency",
                    "PKR",
                ),
                "merchant_id": settings.RAPID_GATEWAY_MERCHANT_ID if configured else "",
                "public_key": settings.RAPID_GATEWAY_PUBLIC_KEY if configured else "",
                "configured": configured,
                "simulate_allowed": simulate,
            }
        )


class RapidGatewayInitiateView(APIView):
    """Create a Rapid Gateway payment and return checkout_url for redirect."""

    def post(self, request, company_slug):
        company, err = _company_or_404(company_slug)
        if err:
            return err

        order_number = (request.data.get("order_number") or "").strip()
        if not order_number:
            return Response(
                {"detail": "order_number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = Order.objects.filter(
            company=company,
            order_number=order_number,
        ).first()
        if not order:
            return Response({"detail": "Order not found."}, status=404)

        if order.payment_status == Order.PaymentStatus.PAID:
            return Response(
                {
                    "detail": "Already paid.",
                    "order": OrderSerializer(order).data,
                }
            )

        if not is_configured():
            return Response(
                {
                    "detail": "Rapid Gateway not configured. Use simulate endpoint in DEBUG.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        storefront = _storefront_base(request)
        return_url = f"{storefront}/checkout?order={order.order_number}&paid=1"
        webhook_url = _absolute(request, "/api/v1/webhooks/rapid-gateway/")

        order.payment_status = Order.PaymentStatus.PENDING
        order.save(update_fields=["payment_status", "updated_at"])

        try:
            result = create_payment(
                order_number=order.order_number,
                amount=order.total,
                currency=order.currency or "PKR",
                customer_phone=order.customer_phone or "",
                customer_email=order.customer_email or "",
                customer_name=order.customer_name or "",
                return_url=return_url,
                webhook_url=webhook_url,
            )
        except RapidGatewayError as exc:
            mark_order_failed(
                order,
                event_type="payment.failed",
                payload={"error": str(exc), "body": exc.payload},
            )
            return Response(
                {"detail": str(exc), "rapid_gateway": exc.payload},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        payment_id = result.get("payment_id") or ""
        if payment_id:
            order.paysafe_payment_id = payment_id
            order.save(update_fields=["paysafe_payment_id", "updated_at"])

        PaymentEvent.objects.create(
            company=company,
            order=order,
            provider="rapid_gateway",
            event_type="payment.initiated",
            external_id=payment_id,
            payload=result.get("raw") or result,
        )

        return Response(
            {
                "status": "PENDING",
                "checkout_url": result["checkout_url"],
                "payment_id": payment_id,
                "order": OrderSerializer(order).data,
            }
        )


class RapidGatewaySimulatePaymentView(APIView):
    """DEBUG only: mark order paid without Rapid Gateway keys."""

    def post(self, request, company_slug):
        company, err = _company_or_404(company_slug)
        if err:
            return err

        if not settings.DEBUG or is_configured():
            return Response(
                {"detail": "Simulate only allowed in DEBUG without live keys."},
                status=status.HTTP_403_FORBIDDEN,
            )

        order_number = (request.data.get("order_number") or "").strip()
        order = Order.objects.filter(
            company=company,
            order_number=order_number,
        ).first()
        if not order:
            return Response({"detail": "Order not found."}, status=404)

        order = mark_order_paid(
            order,
            provider_payment_id=f"sim_{order.order_number}",
            event_type="payment.simulated",
            payload={"mode": "simulate", "provider": "rapid_gateway"},
        )
        return Response(
            {
                "status": "COMPLETED",
                "simulated": True,
                "order": OrderSerializer(order).data,
            }
        )


class RapidGatewayOrderStatusView(APIView):
    """Storefront polls this after returning from Rapid checkout."""

    def get(self, request, company_slug, order_number):
        company, err = _company_or_404(company_slug)
        if err:
            return err
        order = Order.objects.filter(
            company=company,
            order_number=order_number,
        ).first()
        if not order:
            return Response({"detail": "Order not found."}, status=404)
        return Response({"order": OrderSerializer(order).data})


class RapidGatewayWebhookView(APIView):
    """Signed webhook from Rapid Gateway — marks order paid and triggers WhatsApp."""

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        raw_body = request.body
        timestamp = (
            request.headers.get("X-RapidGateway-Timestamp")
            or request.headers.get("X-RapidPay-Timestamp")
            or ""
        )
        signature = (
            request.headers.get("X-RapidGateway-Signature")
            or request.headers.get("X-RapidPay-Signature")
            or ""
        )
        if not verify_webhook_signature(
            raw_body=raw_body,
            timestamp=timestamp,
            signature=signature,
        ):
            return Response({"detail": "Invalid signature."}, status=401)

        payload = request.data if isinstance(request.data, dict) else {}
        event_type = str(
            payload.get("eventType")
            or request.headers.get("X-RapidGateway-Event")
            or ""
        )
        status_raw = str(payload.get("status") or "").upper()
        merchant_ref = str(
            payload.get("merchantTransactionId")
            or payload.get("merchant_transaction_id")
            or payload.get("merchantRefNum")
            or payload.get("order_number")
            or ""
        )
        payment_id = str(
            payload.get("gatewayTxnRef")
            or payload.get("gateway_txn_ref")
            or payload.get("id")
            or ""
        )

        order = None
        if merchant_ref:
            order = (
                Order.objects.filter(order_number=merchant_ref)
                .select_related("company")
                .first()
            )

        completed = (
            "completed" in event_type.lower()
            or status_raw in ("SUCCESS", "COMPLETED", "PAID", "SETTLED")
        ) and "failed" not in event_type.lower()
        failed = "failed" in event_type.lower() or status_raw in (
            "FAILED",
            "DECLINED",
            "CANCELLED",
        )

        if order:
            PaymentEvent.objects.create(
                company=order.company,
                order=order,
                provider="rapid_gateway",
                event_type=event_type or "webhook",
                external_id=payment_id,
                payload=payload,
            )
            if completed:
                mark_order_paid(
                    order,
                    provider_payment_id=payment_id,
                    event_type="webhook.completed",
                    payload=payload,
                )
            elif failed:
                mark_order_failed(
                    order,
                    event_type="webhook.failed",
                    payload=payload,
                )
        else:
            from companies.models import Company

            fallback = Company.objects.filter(slug="sams").first()
            if fallback:
                PaymentEvent.objects.create(
                    company=fallback,
                    order=None,
                    provider="rapid_gateway",
                    event_type=event_type or "webhook",
                    external_id=payment_id,
                    payload=payload,
                )

        return Response({"ok": True})
