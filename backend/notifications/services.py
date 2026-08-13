"""WhatsApp Cloud API fan-out — one send per team recipient."""

from __future__ import annotations

import json
import logging
import re
import urllib.error
import urllib.request

from django.conf import settings

from notifications.models import NotificationLog, WhatsAppNotifyRecipient

logger = logging.getLogger(__name__)


def normalize_e164(phone: str, default_cc: str = "92") -> str:
    digits = re.sub(r"\D+", "", phone or "")
    if not digits:
        return ""
    if digits.startswith("00"):
        digits = digits[2:]
    if digits.startswith("0") and len(digits) >= 10:
        digits = default_cc + digits[1:]
    if not digits.startswith(default_cc) and len(digits) == 10:
        digits = default_cc + digits
    return digits


def whatsapp_is_configured() -> bool:
    return bool(
        (settings.WHATSAPP_API_TOKEN or "").strip()
        and (settings.WHATSAPP_PHONE_NUMBER_ID or "").strip()
    )


def build_order_message(order) -> str:
    lines = [
        f"[{order.company.name}] New Order #{order.order_number}",
        f"Customer: {order.customer_name} / {order.customer_phone}",
        f"Items: {order.items.count()}",
    ]
    for item in order.items.all()[:12]:
        lines.append(
            f"- {item.product_name} x{item.quantity} — {order.currency} {item.line_total}"
        )
    lines.append(f"Total: {order.currency} {order.total}")
    lines.append(f"Payment: {order.payment_status.upper()} (Rapid Gateway)")
    return "\n".join(lines)


def _send_cloud_api(to_e164: str, body: str, order) -> tuple[bool, str]:
    token = (settings.WHATSAPP_API_TOKEN or "").strip()
    phone_id = (settings.WHATSAPP_PHONE_NUMBER_ID or "").strip()
    if not token or not phone_id:
        return False, "STUB: WhatsApp Cloud API credentials not configured"

    template = (getattr(settings, "WHATSAPP_TEMPLATE_NAME", "") or "").strip()
    lang = (getattr(settings, "WHATSAPP_TEMPLATE_LANG", "") or "en").strip() or "en"

    if template:
        # Business-initiated alerts require an approved template.
        payload = {
            "messaging_product": "whatsapp",
            "to": to_e164,
            "type": "template",
            "template": {
                "name": template,
                "language": {"code": lang},
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {"type": "text", "text": order.order_number},
                            {"type": "text", "text": order.customer_name},
                            {
                                "type": "text",
                                "text": f"{order.currency} {order.total}",
                            },
                        ],
                    }
                ],
            },
        }
    else:
        payload = {
            "messaging_product": "whatsapp",
            "to": to_e164,
            "type": "text",
            "text": {"preview_url": False, "body": body},
        }

    url = f"https://graph.facebook.com/v21.0/{phone_id}/messages"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            return True, raw[:500]
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        logger.warning("WhatsApp HTTP %s: %s", exc.code, raw)
        return False, f"HTTP {exc.code}: {raw[:400]}"
    except urllib.error.URLError as exc:
        return False, f"Network error: {exc.reason}"


def notify_order_whatsapp(order) -> dict:
    company = order.company
    recipients = list(
        WhatsAppNotifyRecipient.objects.filter(company=company, is_active=True)
    )
    if not recipients:
        phones = settings.WHATSAPP_NOTIFY_FALLBACK.get(company.slug, [])
        recipients = [
            WhatsAppNotifyRecipient(
                company=company,
                label=f"Fallback {i + 1}",
                phone=phone,
                is_active=True,
            )
            for i, phone in enumerate(phones)
        ]

    message = build_order_message(order)
    configured = whatsapp_is_configured()
    template = (getattr(settings, "WHATSAPP_TEMPLATE_NAME", "") or "").strip()
    results = []
    success_count = 0

    for recipient in recipients:
        to = normalize_e164(recipient.phone)
        if not to:
            NotificationLog.objects.create(
                company=company,
                order_number=order.order_number,
                channel="whatsapp",
                recipient_phone=recipient.phone,
                recipient_label=recipient.label,
                success=False,
                detail="Invalid phone number",
            )
            results.append(
                {
                    "label": recipient.label,
                    "phone": recipient.phone,
                    "success": False,
                    "detail": "Invalid phone",
                }
            )
            continue

        if configured:
            ok, detail = _send_cloud_api(to, message, order)
        else:
            ok, detail = (
                False,
                "STUB: set WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID "
                f"in backend/.env to deliver to {to}",
            )

        NotificationLog.objects.create(
            company=company,
            order_number=order.order_number,
            channel="whatsapp",
            recipient_phone=to,
            recipient_label=recipient.label,
            success=ok,
            detail=detail[:2000],
        )
        if ok:
            success_count += 1
        results.append(
            {
                "label": recipient.label,
                "phone": to,
                "success": ok,
                "stub": not configured,
                "detail": detail[:300],
            }
        )

    if success_count > 0:
        order.whatsapp_notified = True
        order.save(update_fields=["whatsapp_notified", "updated_at"])

    return {
        "sent": success_count,
        "total_recipients": len(results),
        "configured": configured,
        "template": template or None,
        "recipients": results,
        "message": message,
        "hint": (
            None
            if configured
            else "WhatsApp Cloud API is not configured. Adding numbers in Settings "
            "only chooses who would receive alerts — Meta credentials are required "
            "to send real messages."
        ),
    }
