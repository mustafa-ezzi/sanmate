"""Cloudflare R2 uploads via the S3-compatible API."""

from __future__ import annotations

import logging
from typing import BinaryIO

from django.conf import settings

logger = logging.getLogger(__name__)


def r2_is_configured() -> bool:
    return bool(
        (settings.CF_ACCOUNT_ID or "").strip()
        and (settings.CF_R2_BUCKET or "").strip()
        and (settings.CF_R2_ACCESS_KEY_ID or "").strip()
        and (settings.CF_R2_SECRET_ACCESS_KEY or "").strip()
        and (settings.CF_MEDIA_BASE_URL or "").strip()
    )


def _client():
    import boto3
    from botocore.config import Config

    account = settings.CF_ACCOUNT_ID.strip()
    return boto3.client(
        "s3",
        endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.CF_R2_ACCESS_KEY_ID.strip(),
        aws_secret_access_key=settings.CF_R2_SECRET_ACCESS_KEY.strip(),
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )


def upload_fileobj(
    fileobj: BinaryIO,
    key: str,
    *,
    content_type: str = "application/octet-stream",
) -> str:
    """
    Upload to R2 and return the public URL.
    Public access must be enabled on the bucket or a custom domain
    pointed at CF_MEDIA_BASE_URL.
    """
    if not r2_is_configured():
        raise RuntimeError("Cloudflare R2 is not configured")

    client = _client()
    bucket = settings.CF_R2_BUCKET.strip()
    extra = {"ContentType": content_type} if content_type else {}
    client.upload_fileobj(fileobj, bucket, key, ExtraArgs=extra)

    base = settings.CF_MEDIA_BASE_URL.rstrip("/")
    return f"{base}/{key.lstrip('/')}"
