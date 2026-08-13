from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from orders.serializers import OrderSerializer
from payments.models import PaymentEvent
from payments.paypak import (
    PayPakError,
    get_company_keys,
    initiate_payment,
    is_configured,
    verify_ipn_signature,
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


class PayPakConfigView(APIView):
    """Public checkout config for the active company (no secrets)."""

    def get(self, request, company_slug):
        company, err = _company_or_404(company_slug)
        if err:
            return err
        keys = get_company_keys(company_slug)
        configured = is_configured(company_slug)
        simulate = settings.DEBUG and not configured
        return Response(
            {
                "company": company_slug,
                "provider": "paypak",
                "env": settings.PAYPAK_ENV,
                "currency": getattr(
                    getattr(company, "settings", None),
                    "currency",
                    "PKR",
                ),
                "merchant_id": keys["merchant_id"] if configured else "",
                "configured": configured,
                "simulate_allowed": simulate,
            }
        )


class PayPakInitiateView(APIView):
    """
    Create a PayPak checkout session and return redirect URL.
    Frontend should send the browser to checkout_url.
    """

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

        if not is_configured(company_slug):
            return Response(
                {
                    "detail": "PayPak not configured. Use simulate endpoint in DEBUG.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        storefront = (
            (getattr(settings, "PAYPAK_STOREFRONT_BASE", "") or "").rstrip("/")
            or request.headers.get("Origin")
            or "http://localhost:5173"
        )
        return_url = f"{storefront}/checkout/return?order={order.order_number}"
        cancel_url = f"{storefront}/checkout?cancelled=1&order={order.order_number}"
        ipn_url = _absolute(request, "/api/v1/webhooks/paypak/")

        order.payment_status = Order.PaymentStatus.PENDING
        order.save(update_fields=["payment_status", "updated_at"])

        try:
            result = initiate_payment(
                company_slug=company_slug,
                order_number=order.order_number,
                amount=order.total,
                currency=order.currency or "PKR",
                customer_name=order.customer_name,
                customer_email=order.customer_email or "",
                customer_phone=order.customer_phone or "",
                description=f"{company.name} order {order.order_number}",
                return_url=return_url,
                cancel_url=cancel_url,
                ipn_url=ipn_url,
            )
        except PayPakError as exc:
            mark_order_failed(
                order,
                event_type="payment.failed",
                payload={"error": str(exc), "body": exc.payload},
            )
            return Response(
                {"detail": str(exc), "paypak": exc.payload},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        payment_id = result.get("transaction_id") or ""
        if payment_id:
            order.provider_payment_id = payment_id
            order.save(update_fields=["provider_payment_id", "updated_at"])

        PaymentEvent.objects.create(
            company=company,
            order=order,
            provider="paypak",
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


class PayPakSimulatePaymentView(APIView):
    """DEBUG only: mark order paid without PayPak keys."""

    def post(self, request, company_slug):
        company, err = _company_or_404(company_slug)
        if err:
            return err

        if not settings.DEBUG or is_configured(company_slug):
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
            payload={"mode": "simulate", "provider": "paypak"},
        )
        return Response(
            {
                "status": "COMPLETED",
                "simulated": True,
                "order": OrderSerializer(order).data,
            }
        )


class PayPakOrderStatusView(APIView):
    """Storefront polls this after returning from PayPak checkout."""

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


class PayPakWebhookView(APIView):
    """IPN / webhook from PayPak — marks order paid and triggers WhatsApp."""

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payload = request.data if isinstance(request.data, dict) else {}
        sig = (
            request.headers.get("X-PayPak-Signature")
            or request.headers.get("X-Signature")
            or str(payload.get("signature") or "")
        )
        if not verify_ipn_signature(payload, sig):
            return Response({"detail": "Invalid signature."}, status=401)

        merchant_ref = str(
            payload.get("merchantRefNum")
            or payload.get("merchant_ref")
            or payload.get("order_number")
            or payload.get("orderId")
            or ""
        )
        payment_id = str(
            payload.get("transactionId")
            or payload.get("transaction_id")
            or payload.get("id")
            or ""
        )
        event = str(
            payload.get("status")
            or payload.get("eventType")
            or payload.get("event_type")
            or ""
        ).upper()
        event_type = str(payload.get("eventType") or payload.get("status") or "webhook")

        order = None
        if merchant_ref:
            order = (
                Order.objects.filter(order_number=merchant_ref)
                .select_related("company")
                .first()
            )

        if order:
            PaymentEvent.objects.create(
                company=order.company,
                order=order,
                provider="paypak",
                event_type=event_type,
                external_id=payment_id,
                payload=payload,
            )
            if any(
                x in event
                for x in ("COMPLETED", "SETTLED", "PAID", "SUCCESS", "APPROVED")
            ):
                mark_order_paid(
                    order,
                    provider_payment_id=payment_id,
                    event_type="webhook.completed",
                    payload=payload,
                )
            elif any(x in event for x in ("FAILED", "DECLINED", "CANCELLED", "VOID")):
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
                    provider="paypak",
                    event_type=event_type,
                    external_id=payment_id,
                    payload=payload,
                )

        return Response({"ok": True})
