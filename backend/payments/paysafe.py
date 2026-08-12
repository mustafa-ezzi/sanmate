"""Paysafe Payments API client — per-company merchant credentials."""

from __future__ import annotations

import base64
import hashlib
import hmac
import logging
from decimal import Decimal
from typing import Any

import urllib.error
import urllib.request
import json

from django.conf import settings

logger = logging.getLogger(__name__)


class PaysafeError(Exception):
    def __init__(self, message: str, status: int | None = None, payload: Any = None):
        super().__init__(message)
        self.status = status
        self.payload = payload


def get_company_keys(company_slug: str) -> dict[str, str]:
    keys = settings.PAYSAFE_COMPANY_KEYS.get(company_slug, {})
    return {
        "api_key": (keys.get("api_key") or "").strip(),
        "public_key": (keys.get("public_key") or "").strip(),
        "account_id": (keys.get("account_id") or "").strip(),
    }


def is_configured(company_slug: str) -> bool:
    keys = get_company_keys(company_slug)
    return bool(keys["api_key"] and keys["public_key"])


def base_url() -> str:
    env = (settings.PAYSAFE_ENV or "test").lower()
    if env in ("live", "prod", "production"):
        return "https://api.paysafe.com/paymenthub/v1"
    return "https://api.test.paysafe.com/paymenthub/v1"


def amount_minor_units(total: Decimal | str | float, currency: str = "PKR") -> int:
    """Paysafe expects minor units (e.g. cents). PKR uses 2 decimal places."""
    value = Decimal(str(total))
    return int((value * 100).quantize(Decimal("1")))


def _auth_header(api_key: str) -> str:
    # api_key format: username:password
    token = base64.b64encode(api_key.encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def paysafe_request(
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
            "Authorization": _auth_header(api_key),
            "Content-Type": "application/json",
            "Accept": "application/json",
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
        logger.warning("Paysafe HTTP %s: %s", exc.code, payload)
        raise PaysafeError(
            f"Paysafe error {exc.code}",
            status=exc.code,
            payload=payload,
        ) from exc
    except urllib.error.URLError as exc:
        raise PaysafeError(f"Paysafe unreachable: {exc.reason}") from exc


def process_payment(
    *,
    company_slug: str,
    merchant_ref: str,
    amount: Decimal,
    currency: str,
    payment_handle_token: str,
    description: str = "",
) -> dict:
    keys = get_company_keys(company_slug)
    if not keys["api_key"]:
        raise PaysafeError("Paysafe API key not configured for this company.")

    body: dict[str, Any] = {
        "merchantRefNum": merchant_ref,
        "amount": amount_minor_units(amount, currency),
        "currencyCode": currency.upper(),
        "dupCheck": True,
        "settleWithAuth": True,
        "paymentHandleToken": payment_handle_token,
        "description": description or f"Order {merchant_ref}",
    }
    if keys["account_id"]:
        body["accountId"] = keys["account_id"]

    return paysafe_request("POST", "payments", api_key=keys["api_key"], body=body)


def verify_webhook_signature(raw_body: bytes, signature_header: str) -> bool:
    secret = (settings.PAYSAFE_WEBHOOK_SECRET or "").encode("utf-8")
    if not secret:
        # No secret configured — allow in DEBUG only
        return bool(settings.DEBUG)
    digest = hmac.new(secret, raw_body, hashlib.sha256).hexdigest()
    provided = (signature_header or "").strip()
    if provided.lower().startswith("sha256="):
        provided = provided.split("=", 1)[1]
    return hmac.compare_digest(digest, provided)
