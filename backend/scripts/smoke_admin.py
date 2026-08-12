import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.test import Client

c = Client()
r = c.post(
    "/api/v1/admin/login/",
    data={"username": "admin", "password": "admin123"},
    content_type="application/json",
)
print("login", r.status_code, r.json())
token = r.json()["token"]
r2 = c.get(
    "/api/v1/admin/dashboard/summary/",
    HTTP_AUTHORIZATION=f"Token {token}",
    HTTP_X_COMPANY_SLUG="sams",
)
print("dash", r2.status_code, r2.json())
r3 = c.get(
    "/api/v1/admin/categories/",
    HTTP_AUTHORIZATION=f"Token {token}",
    HTTP_X_COMPANY_SLUG="am",
)
print("am cats", r3.status_code, r3.json())
