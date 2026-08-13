"""Rapid Gateway (Pakistan) — cards, JazzCash, easypaisa, Raast."""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import time
import urllib.error
import urllib.request
from decimal import Decimal
from typing import Any

from django.conf import settings

logger = logging.getLogger(__name__)


class RapidGatewayError(Exception):
    def __init__(self, message: str, status: int | None = None, payload: Any = None):
        super().__init__(message)
        self.status = status
        self.payload = payload


def is_configured() -> bool:
    return bool((settings.RAPID_GATEWAY_SECRET_KEY or "").strip())


def base_url() -> str:
    return (settings.RAPID_GATEWAY_API_BASE or "https://api.rapidgateway.pk/v1").rstrip(
        "/"
    )


def amount_pkr(total: Decimal | str | float) -> float:
    return float(Decimal(str(total)).quantize(Decimal("0.01")))


def normalize_phone(phone: str) -> str:
    digits = "".join(c for c in (phone or "") if c.isdigit())
    if digits.startswith("92") and len(digits) >= 12:
        return f"+{digits}"
    if digits.startswith("0") and len(digits) == 11:
        return f"+92{digits[1:]}"
    if digits:
        return f"+{digits}" if not phone.strip().startswith("+") else phone.strip()
    return ""


def _request(
    method: str,
    path: str,
    *,
    body: dict | None = None,
    idempotency_key: str = "",
) -> dict:
    secret = (settings.RAPID_GATEWAY_SECRET_KEY or "").strip()
    if not secret:
        raise RapidGatewayError("Rapid Gateway secret key is not configured.")

    url = f"{base_url()}/{path.lstrip('/')}"
    data = None if body is None else json.dumps(body).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {secret}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if idempotency_key:
        headers["Idempotency-Key"] = idempotency_key

    req = urllib.request.Request(url, data=data, method=method.upper(), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            payload = {"raw": raw}
        logger.warning("Rapid Gateway HTTP %s: %s", exc.code, payload)
        raise RapidGatewayError(
            f"Rapid Gateway error {exc.code}",
            status=exc.code,
            payload=payload,
        ) from exc
    except urllib.error.URLError as exc:
        raise RapidGatewayError(f"Rapid Gateway unreachable: {exc.reason}") from exc


def create_payment(
    *,
    order_number: str,
    amount: Decimal,
    currency: str,
    customer_phone: str,
    customer_email: str = "",
    customer_name: str = "",
    return_url: str,
    webhook_url: str = "",
    methods: list[str] | None = None,
) -> dict:
    """
    POST /v1/payments — returns checkout_url for browser redirect.
    """
    body: dict[str, Any] = {
        "amount": amount_pkr(amount),
        "currency": (currency or "PKR").upper(),
        "methods": methods
        or ["card", "easypaisa", "jazzcash", "raast", "bank_transfer"],
        "customer": {},
        "return_url": return_url,
        "merchant_transaction_id": order_number,
    }
    phone = normalize_phone(customer_phone)
    if phone:
        body["customer"]["phone"] = phone
    if customer_email:
        body["customer"]["email"] = customer_email
    if customer_name:
        body["customer"]["name"] = customer_name
    if webhook_url:
        body["webhook_url"] = webhook_url

    result = _request(
        "POST",
        "payments",
        body=body,
        idempotency_key=order_number,
    )

    checkout_url = (
        result.get("checkout_url")
        or result.get("checkoutUrl")
        or result.get("redirect_url")
        or result.get("redirectUrl")
        or result.get("payment_url")
        or ""
    )
    payment_id = str(
        result.get("id")
        or result.get("payment_id")
        or result.get("gatewayTxnRef")
        or result.get("gateway_txn_ref")
        or ""
    )

    if not checkout_url:
        raise RapidGatewayError(
            "Rapid Gateway did not return a checkout URL. Check API credentials / response.",
            payload=result,
        )

    return {
        "checkout_url": checkout_url,
        "payment_id": payment_id,
        "raw": result,
    }


def verify_webhook_signature(
    *,
    raw_body: bytes,
    timestamp: str,
    signature: str,
) -> bool:
    """
    HMAC-SHA256(salt, timestamp + '.' + rawBody) → uppercase hex.
    Header: X-RapidGateway-Signature / X-RapidGateway-Timestamp.
    """
    salt = (settings.RAPID_GATEWAY_WEBHOOK_SECRET or "").strip()
    if not salt:
        return bool(settings.DEBUG)
    if not timestamp or not signature:
        return False
    try:
        ts = int(timestamp)
    except (TypeError, ValueError):
        return False
    if abs(int(time.time()) - ts) > 300:
        return False

    msg = timestamp.encode("utf-8") + b"." + raw_body
    expected = hmac.new(salt.encode("utf-8"), msg, hashlib.sha256).hexdigest().upper()
    return hmac.compare_digest(expected, signature.strip().upper())
