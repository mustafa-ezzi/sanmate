"""Mark orders paid (idempotent) and trigger WhatsApp fan-out."""

from __future__ import annotations

import logging

from django.db import transaction

from orders.models import Order
from payments.models import PaymentEvent

logger = logging.getLogger(__name__)


@transaction.atomic
def mark_order_paid(
    order: Order,
    *,
    provider_payment_id: str = "",
    event_type: str = "payment.completed",
    payload: dict | None = None,
) -> Order:
    order = Order.objects.select_for_update().get(pk=order.pk)

    already_paid = order.payment_status == Order.PaymentStatus.PAID
    if not already_paid:
        order.payment_status = Order.PaymentStatus.PAID
        order.status = Order.Status.PAID
        if provider_payment_id:
            order.provider_payment_id = provider_payment_id
        order.save(
            update_fields=[
                "payment_status",
                "status",
                "provider_payment_id",
                "updated_at",
            ]
        )

    PaymentEvent.objects.create(
        company=order.company,
        order=order,
        provider="paypak",
        event_type=event_type,
        external_id=provider_payment_id or order.provider_payment_id,
        payload=payload or {},
    )

    if not order.whatsapp_notified or event_type == "whatsapp.resend":
        try:
            from notifications.services import notify_order_whatsapp

            notify_order_whatsapp(order)
            order.refresh_from_db()
        except Exception:
            logger.exception("WhatsApp notify failed for %s", order.order_number)

    return order


def mark_order_failed(
    order: Order,
    *,
    event_type: str = "payment.failed",
    payload: dict | None = None,
) -> Order:
    order.payment_status = Order.PaymentStatus.FAILED
    order.save(update_fields=["payment_status", "updated_at"])
    PaymentEvent.objects.create(
        company=order.company,
        order=order,
        provider="paypak",
        event_type=event_type,
        payload=payload or {},
    )
    return order
