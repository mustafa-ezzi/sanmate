# Backend — Multi-company API (SAMS + AM)

Django + DRF. **Phase 1 focus: SAMS Enterprises.**  
AM is seeded as an inactive storefront stub for the shared admin company switcher.

## Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env            # optional
python manage.py migrate
python manage.py seed_dev
python manage.py runserver
```

- Django admin: http://127.0.0.1:8000/django-admin/ (`admin` / `admin123`)
- API root examples below

SQLite is used by default. Set `DATABASE_URL=postgres://...` for PostgreSQL.

## Key decisions (Phase 0)

| Topic | Decision |
| --- | --- |
| Focus | SAMS storefront now; AM website later |
| Child brands | Created in admin (seed has Sanmate / Wyped as dummy) |
| Currency | PKR |
| Paysafe | Separate merchant accounts per company |
| R2 | Same bucket, `sams/` / `am/` prefixes |
| GA4 | Different Measurement ID per company |

## Public API (SAMS)

```
GET  /api/v1/sams/
GET  /api/v1/sams/categories/
GET  /api/v1/sams/products/
GET  /api/v1/sams/products/sanmate-waste-pipe/
GET  /api/v1/sams/banners/
GET  /api/v1/sams/carousels/home-hero/
GET  /api/v1/sams/policies/privacy/
POST /api/v1/sams/orders/
```

## Admin API

Send `X-Company-Slug: sams` (or `am`). Requires staff login.

```
GET  /api/v1/admin/companies/
POST /api/v1/admin/context/          {"company_slug":"sams"}
GET  /api/v1/admin/dashboard/summary/
GET  /api/v1/admin/categories/
GET  /api/v1/admin/products/
POST /api/v1/admin/media/upload/     (R2 stub)
```

## Reseed

```bash
python manage.py seed_dev --flush
```
