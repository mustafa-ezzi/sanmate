"""Django settings — multi-company SAMS + AM platform."""

import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-only-change-me",
)
DEBUG = os.getenv("DJANGO_DEBUG", "True").lower() in ("1", "true", "yes")
ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,testserver").split(",")
    if h.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "django_filters",
    # Local
    "companies",
    "accounts",
    "catalog",
    "cms",
    "orders",
    "payments",
    "notifications",
    "admin_api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "companies.middleware.CompanyContextMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Database: SQLite by default; Postgres via DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if DATABASE_URL.startswith("postgres"):
    parsed = urlparse(DATABASE_URL)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": parsed.path.lstrip("/"),
            "USER": parsed.username or "",
            "PASSWORD": parsed.password or "",
            "HOST": parsed.hostname or "",
            "PORT": str(parsed.port or ""),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Karachi"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = [
    o.strip().rstrip("/")
    for o in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
]

from corsheaders.defaults import default_headers  # noqa: E402

CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-company-slug",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 24,
}

# Cloudflare R2 — same bucket, company-prefixed paths (sams/…)
CF_ACCOUNT_ID = os.getenv("CF_ACCOUNT_ID", "")
CF_API_TOKEN = os.getenv("CF_API_TOKEN", "")  # legacy / unused for S3 uploads
CF_MEDIA_BASE_URL = os.getenv("CF_MEDIA_BASE_URL", "")
CF_R2_BUCKET = os.getenv("CF_R2_BUCKET", "")
CF_R2_ACCESS_KEY_ID = os.getenv("CF_R2_ACCESS_KEY_ID", "") or os.getenv(
    "AWS_ACCESS_KEY_ID", ""
)
CF_R2_SECRET_ACCESS_KEY = os.getenv("CF_R2_SECRET_ACCESS_KEY", "") or os.getenv(
    "AWS_SECRET_ACCESS_KEY", ""
)

# Rapid Gateway (Pakistan) — https://rapidgateway.pk/
RAPID_GATEWAY_ENV = os.getenv("RAPID_GATEWAY_ENV", "test")
RAPID_GATEWAY_SECRET_KEY = os.getenv("RAPID_GATEWAY_SECRET_KEY", "") or os.getenv(
    "RG_SECRET_KEY", ""
)
RAPID_GATEWAY_PUBLIC_KEY = os.getenv("RAPID_GATEWAY_PUBLIC_KEY", "")
RAPID_GATEWAY_MERCHANT_ID = os.getenv("RAPID_GATEWAY_MERCHANT_ID", "")
RAPID_GATEWAY_API_BASE = os.getenv(
    "RAPID_GATEWAY_API_BASE",
    "https://api.rapidgateway.pk/v1",
)
RAPID_GATEWAY_WEBHOOK_SECRET = os.getenv("RAPID_GATEWAY_WEBHOOK_SECRET", "")
# Public storefront origin for payment return_url (e.g. https://yourstore.up.railway.app)
STOREFRONT_BASE_URL = os.getenv("STOREFRONT_BASE_URL", "").rstrip("/")

# Legacy Paysafe env (unused — kept so old Railway vars do not crash imports)
PAYSAFE_ENV = os.getenv("PAYSAFE_ENV", "test")
PAYSAFE_WEBHOOK_SECRET = os.getenv("PAYSAFE_WEBHOOK_SECRET", "")
PAYSAFE_COMPANY_KEYS = {
    "sams": {
        "api_key": os.getenv("PAYSAFE_SAMS_API_KEY", ""),
        "public_key": os.getenv("PAYSAFE_SAMS_PUBLIC_KEY", ""),
        "account_id": os.getenv("PAYSAFE_SAMS_ACCOUNT_ID", ""),
    },
    "am": {
        "api_key": os.getenv("PAYSAFE_AM_API_KEY", ""),
        "public_key": os.getenv("PAYSAFE_AM_PUBLIC_KEY", ""),
        "account_id": os.getenv("PAYSAFE_AM_ACCOUNT_ID", ""),
    },
}

WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN", "")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
# Optional: Meta-approved template for business-initiated order alerts.
# Free-form text only works inside a 24h user-initiated chat window.
WHATSAPP_TEMPLATE_NAME = os.getenv("WHATSAPP_TEMPLATE_NAME", "")
WHATSAPP_TEMPLATE_LANG = os.getenv("WHATSAPP_TEMPLATE_LANG", "en")
WHATSAPP_NOTIFY_FALLBACK = {
    "sams": [
        n.strip()
        for n in os.getenv("WHATSAPP_SAMS_NOTIFY_TO", "").split(",")
        if n.strip()
    ],
    "am": [
        n.strip()
        for n in os.getenv("WHATSAPP_AM_NOTIFY_TO", "").split(",")
        if n.strip()
    ],
}
