from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from orders.serializers import OrderSerializer
from payments.models import PaymentEvent
from payments.paysafe import (
    PaysafeError,
    get_company_keys,
    is_configured,
    process_payment,
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


class PaysafeConfigView(APIView):
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
                "env": settings.PAYSAFE_ENV,
                "currency": getattr(
                    getattr(company, "settings", None),
                    "currency",
                    "PKR",
                ),
                "public_key": keys["public_key"] if configured else "",
                "account_id": keys["account_id"] if configured else "",
                "configured": configured,
                "simulate_allowed": simulate,
            }
        )


class PaysafeProcessPaymentView(APIView):
    """
    After Paysafe Checkout returns paymentHandleToken,
    charge via Payments API and mark order paid → WhatsApp.
    """

    def post(self, request, company_slug):
        company, err = _company_or_404(company_slug)
        if err:
            return err

        order_number = (request.data.get("order_number") or "").strip()
        handle = (request.data.get("payment_handle_token") or "").strip()
        if not order_number or not handle:
            return Response(
                {"detail": "order_number and payment_handle_token are required."},
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
                    "detail": "Paysafe not configured. Use simulate endpoint in DEBUG.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        order.payment_status = Order.PaymentStatus.PENDING
        order.save(update_fields=["payment_status", "updated_at"])

        try:
            result = process_payment(
                company_slug=company_slug,
                merchant_ref=order.order_number,
                amount=order.total,
                currency=order.currency or "PKR",
                payment_handle_token=handle,
                description=f"{company.name} order {order.order_number}",
            )
        except PaysafeError as exc:
            mark_order_failed(
                order,
                event_type="payment.failed",
                payload={"error": str(exc), "body": exc.payload},
            )
            return Response(
                {"detail": str(exc), "paysafe": exc.payload},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        payment_status = (result.get("status") or "").upper()
        payment_id = str(result.get("id") or "")

        if payment_status in ("COMPLETED", "RECEIVED", "PENDING", "HELD"):
            # COMPLETED / RECEIVED = success; PENDING may settle via webhook
            if payment_status in ("COMPLETED", "RECEIVED"):
                order = mark_order_paid(
                    order,
                    paysafe_payment_id=payment_id,
                    event_type="payment.completed",
                    payload=result,
                )
            else:
                PaymentEvent.objects.create(
                    company=company,
                    order=order,
                    provider="paysafe",
                    event_type=f"payment.{payment_status.lower()}",
                    external_id=payment_id,
                    payload=result,
                )
                order.paysafe_payment_id = payment_id
                order.save(update_fields=["paysafe_payment_id", "updated_at"])
            return Response(
                {
                    "status": payment_status,
                    "payment_id": payment_id,
                    "order": OrderSerializer(order).data,
                }
            )

        mark_order_failed(order, event_type="payment.declined", payload=result)
        return Response(
            {"detail": "Payment not completed.", "paysafe": result},
            status=status.HTTP_402_PAYMENT_REQUIRED,
        )


class PaysafeSimulatePaymentView(APIView):
    """
    Local/dev only: mark order paid without Paysafe keys.
    Enabled when DEBUG=True and company has no Paysafe API key.
    """

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
            paysafe_payment_id=f"sim_{order.order_number}",
            event_type="payment.simulated",
            payload={"mode": "simulate"},
        )
        return Response(
            {
                "status": "COMPLETED",
                "simulated": True,
                "order": OrderSerializer(order).data,
            }
        )


class PaysafeWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        raw = request.body
        sig = request.headers.get("X-Paysafe-Signature") or request.headers.get(
            "Signature",
            "",
        )
        if not verify_webhook_signature(raw, sig):
            return Response({"detail": "Invalid signature."}, status=401)

        payload = request.data if isinstance(request.data, dict) else {}
        merchant_ref = (
            payload.get("merchantRefNum")
            or (payload.get("payload") or {}).get("merchantRefNum")
            or ""
        )
        payment_id = str(
            payload.get("id")
            or (payload.get("payload") or {}).get("id")
            or ""
        )
        event = str(payload.get("eventType") or payload.get("type") or "").upper()
        event_type = str(
            payload.get("eventType") or payload.get("type") or "webhook"
        )

        order = None
        if merchant_ref:
            order = Order.objects.filter(order_number=merchant_ref).select_related(
                "company"
            ).first()

        if order:
            PaymentEvent.objects.create(
                company=order.company,
                order=order,
                provider="paysafe",
                event_type=event_type,
                external_id=payment_id,
                payload=payload,
            )
            if any(x in event for x in ("COMPLETED", "SETTLED", "PAID", "SUCCESS")):
                mark_order_paid(
                    order,
                    paysafe_payment_id=payment_id,
                    event_type="webhook.completed",
                    payload=payload,
                )
            elif any(x in event for x in ("FAILED", "DECLINED", "CANCELLED")):
                mark_order_failed(
                    order,
                    event_type="webhook.failed",
                    payload=payload,
                )
        else:
            # Orphan webhook — attach to SAMS if present for audit, else skip DB
            from companies.models import Company

            fallback = Company.objects.filter(slug="sams").first()
            if fallback:
                PaymentEvent.objects.create(
                    company=fallback,
                    order=None,
                    provider="paysafe",
                    event_type=event_type,
                    external_id=payment_id,
                    payload=payload,
                )

        return Response({"ok": True})
