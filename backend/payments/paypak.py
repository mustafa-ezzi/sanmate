"""PayPak (1LINK AFS) e-commerce payment client — SAMS merchant credentials."""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import urllib.error
import urllib.request
from decimal import Decimal
from typing import Any
from urllib.parse import urlencode

from django.conf import settings

logger = logging.getLogger(__name__)


class PayPakError(Exception):
    def __init__(self, message: str, status: int | None = None, payload: Any = None):
        super().__init__(message)
        self.status = status
        self.payload = payload


def get_company_keys(company_slug: str) -> dict[str, str]:
    keys = settings.PAYPAK_COMPANY_KEYS.get(company_slug, {})
    return {
        "merchant_id": (keys.get("merchant_id") or "").strip(),
        "api_key": (keys.get("api_key") or "").strip(),
        "secret_key": (keys.get("secret_key") or "").strip(),
    }


def is_configured(company_slug: str) -> bool:
    keys = get_company_keys(company_slug)
    return bool(keys["merchant_id"] and keys["api_key"] and keys["secret_key"])


def base_url() -> str:
    override = (getattr(settings, "PAYPAK_API_BASE", "") or "").strip()
    if override:
        return override.rstrip("/")
    env = (settings.PAYPAK_ENV or "test").lower()
    if env in ("live", "prod", "production"):
        return "https://api.1link.net.pk/paypak/ecommerce/v1"
    return "https://sandbox.1link.net.pk/paypak/ecommerce/v1"


def amount_pkr(total: Decimal | str | float) -> str:
    return f"{Decimal(str(total)).quantize(Decimal('0.01'))}"


def _sign(payload: dict[str, str], secret_key: str) -> str:
    """HMAC-SHA256 over sorted key=value pairs (common PK gateway pattern)."""
    message = "&".join(f"{k}={payload[k]}" for k in sorted(payload.keys()) if k != "signature")
    return hmac.new(
        secret_key.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def paypak_request(
    method: str,
    path: str,
    *,
    api_key: str,
    body: dict | None = None,
) -> dict:
    url = f"{base_url().rstrip('/')}/{path.lstrip('/')}"
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method=method.upper(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-API-Key": api_key,
        },
    )
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
        logger.warning("PayPak HTTP %s: %s", exc.code, payload)
        raise PayPakError(
            f"PayPak error {exc.code}",
            status=exc.code,
            payload=payload,
        ) from exc
    except urllib.error.URLError as exc:
        raise PayPakError(f"PayPak unreachable: {exc.reason}") from exc


def initiate_payment(
    *,
    company_slug: str,
    order_number: str,
    amount: Decimal,
    currency: str,
    customer_name: str,
    customer_email: str,
    customer_phone: str,
    description: str,
    return_url: str,
    cancel_url: str,
    ipn_url: str,
) -> dict:
    """
    Start a PayPak e-commerce purchase.
    Returns checkout_url + transaction_id for browser redirect.
    """
    keys = get_company_keys(company_slug)
    if not is_configured(company_slug):
        raise PayPakError("PayPak is not configured for this company.")

    body: dict[str, Any] = {
        "merchantId": keys["merchant_id"],
        "merchantRefNum": order_number,
        "amount": amount_pkr(amount),
        "currency": (currency or "PKR").upper(),
        "description": description or f"Order {order_number}",
        "customerName": customer_name,
        "customerEmail": customer_email or "",
        "customerPhone": customer_phone or "",
        "returnUrl": return_url,
        "cancelUrl": cancel_url,
        "ipnUrl": ipn_url,
    }
    body["signature"] = _sign(
        {k: str(v) for k, v in body.items()},
        keys["secret_key"],
    )

    result = paypak_request(
        "POST",
        "purchase",
        api_key=keys["api_key"],
        body=body,
    )

    checkout_url = (
        result.get("checkoutUrl")
        or result.get("checkout_url")
        or result.get("redirectUrl")
        or result.get("redirect_url")
        or result.get("paymentUrl")
        or ""
    )
    transaction_id = str(
        result.get("transactionId")
        or result.get("transaction_id")
        or result.get("id")
        or ""
    )

    if not checkout_url:
        # Some gateways return a form action + fields; build a GET fallback
        form_action = result.get("formAction") or result.get("form_action") or ""
        if form_action and isinstance(result.get("formFields"), dict):
            checkout_url = f"{form_action}?{urlencode(result['formFields'])}"

    if not checkout_url:
        raise PayPakError(
            "PayPak did not return a checkout URL. Check API credentials / response.",
            payload=result,
        )

    return {
        "checkout_url": checkout_url,
        "transaction_id": transaction_id,
        "raw": result,
    }


def verify_ipn_signature(payload: dict, signature: str) -> bool:
    secret = (settings.PAYPAK_WEBHOOK_SECRET or "").strip()
    if not secret:
        return bool(settings.DEBUG)
    provided = (signature or "").strip()
    if provided.lower().startswith("sha256="):
        provided = provided.split("=", 1)[1]
    expected = _sign({k: str(v) for k, v in payload.items() if k != "signature"}, secret)
    return hmac.compare_digest(expected, provided)
