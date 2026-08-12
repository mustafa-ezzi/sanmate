# SAMS Enterprises Storefront (Phase 2)

React + Vite + Tailwind + GSAP + Framer Motion + Lenis.

## Run

1. Start API (from repo `backend/`):

```bash
.\.venv\Scripts\activate
python manage.py runserver
```

2. Start storefront:

```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173 — Vite proxies `/api` → `http://127.0.0.1:8000`.

## Env

See `.env.example`:

- `VITE_COMPANY_SLUG=sams`
- `VITE_API_BASE_URL=/api/v1`
- `VITE_GA_MEASUREMENT_ID=` (optional; also reads from company settings)

## Routes

| Path | Page |
| --- | --- |
| `/` | Animated landing |
| `/brands/:slug` | Brand / child category |
| `/products` | Catalogue |
| `/products/:slug` | Product detail |
| `/cart` | Cart |
| `/checkout` | Checkout (order create; Paysafe later) |
| `/policies/:type` | CMS policies |
| `/admin` | Shared admin panel (Phase 3) |
| `/admin/login` | Admin login |

### Admin (SAMS Enterprises only)

1. API running on `:8000`
2. Open http://localhost:5173/admin/login
3. `admin` / `admin123`
4. No company switcher — everything is SAMS
