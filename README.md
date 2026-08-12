# SAMS Enterprises Platform

Household e-commerce for **SAMS Enterprises** — storefront + admin panel (SAMS only).

Child brands include **Sanmate**, **Wyped**, and more (created in admin).

## Docs

➡️ **[Development phases (full roadmap)](./docs/DEVELOPMENT_PHASES.md)**

## Stack

| Layer | Tech |
| --- | --- |
| Storefront + Admin | React |
| API | Django + DRF |
| Database | PostgreSQL (SQLite for local) |
| Media | Upload → URL (local / Cloudflare) |
| Payments | Paysafe |
| Analytics | Google Analytics 4 |

## Design

- **Landing:** fully animated (GSAP / Framer; glass, soft neumo, liquid/crystal accents)  
- **Rest of shop:** polished, premium, calmer motion  
- **Admin:** clear SaaS UI for **SAMS Enterprises** only  

## Quick start

**API**

```bash
cd backend
.\.venv\Scripts\activate
python manage.py migrate
python manage.py seed_dev
python manage.py runserver
```

**Storefront + admin** — new terminal

```bash
cd web
npm install
npm run dev
```

- Shop: http://localhost:5173  
- **Admin:** http://localhost:5173/admin (`admin` / `admin123`) — SAMS only  
- API: http://127.0.0.1:8000/api/v1/sams/products/
