import mimetypes
import re
import uuid
from pathlib import Path

from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.company_context import get_admin_company

from .r2_storage import r2_is_configured, upload_fileobj

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
MAX_BYTES = 8 * 1024 * 1024  # 8 MB


def _safe_name(name: str) -> str:
    base = Path(name).name
    base = re.sub(r"[^a-zA-Z0-9._-]+", "-", base).strip("-") or "image"
    return base[:120]


class AdminMediaUploadView(APIView):
    """
    Accept an image file, upload to Cloudflare R2 when configured,
    otherwise store locally for development.
    Returns a public URL to save on product/banner/category fields.
    Key layout: {company}/{uuid}-{filename}
    """

    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "No file provided. Use multipart field 'file'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if upload.size and upload.size > MAX_BYTES:
            return Response(
                {"detail": "File too large (max 8MB)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ext = Path(upload.name).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            return Response(
                {
                    "detail": (
                        "Unsupported type. Allowed: "
                        f"{', '.join(sorted(ALLOWED_EXTENSIONS))}"
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        company = get_admin_company(request)
        safe = _safe_name(upload.name)
        key = f"{company.slug}/{uuid.uuid4().hex[:12]}-{safe}"
        content_type = (
            upload.content_type
            or mimetypes.guess_type(upload.name)[0]
            or "application/octet-stream"
        )

        if r2_is_configured():
            try:
                upload.seek(0)
                url = upload_fileobj(upload, key, content_type=content_type)
            except Exception as exc:  # noqa: BLE001 — surface to admin UI
                return Response(
                    {"detail": f"R2 upload failed: {exc}"},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            return Response(
                {
                    "url": url,
                    "path": key,
                    "company": company.slug,
                    "storage": "cloudflare-r2",
                },
                status=status.HTTP_201_CREATED,
            )

        # Local fallback for development without R2 credentials
        saved_path = default_storage.save(key, upload)
        relative = (
            f"{settings.MEDIA_URL.rstrip('/')}/"
            f"{saved_path.replace(chr(92), '/')}"
        )
        url = request.build_absolute_uri(relative)
        return Response(
            {
                "url": url,
                "path": saved_path.replace("\\", "/"),
                "company": company.slug,
                "storage": "local",
                "hint": (
                    "R2 not configured — saved locally. "
                    "Set CF_ACCOUNT_ID, CF_R2_BUCKET, CF_R2_ACCESS_KEY_ID, "
                    "CF_R2_SECRET_ACCESS_KEY, CF_MEDIA_BASE_URL in backend/.env"
                ),
            },
            status=status.HTTP_201_CREATED,
        )
