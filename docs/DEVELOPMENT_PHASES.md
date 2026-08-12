# SAMS Enterprises — Development Phases

**Product:** Household e-commerce platform for **SAMS Enterprises**  
**Child brands / categories (examples):** Sanmate (sanitary), Wyped (wipers, mops & cleaning), … — created in admin  

**Stack:** React (storefront + admin) · Django + DRF · PostgreSQL · Cloudflare (media URLs) · Paysafe · Google Analytics · WhatsApp order notifications  

---

## Vision

**SAMS Enterprises only** for v1:

- One storefront (`VITE_COMPANY_SLUG=sams`)
- One admin panel — **SAMS Enterprises** (no company switcher, no AM)
- Products, orders, revenue, CMS, WhatsApp recipients — all SAMS

Customer experience:

- Cinematic, **fully animated landing** (first impression)
- Browse child brands / categories → many products
- Place orders on the website → **Paysafe** payment
- Order also notifies the **whole ops team via WhatsApp** — same message sent **individually to multiple numbers** (server-side only; not shown on storefront)
- Admin operates products, CMS, policies, heroes, carousels, orders, analytics settings

---

## Admin Panel (SAMS only)

```
┌────────────────────────────────────────────────────────────┐
│  ADMIN PANEL — SAMS Enterprises                            │
│  Dashboard · Brands · Products · Banners · Policies · …    │
└────────────────────────────────────────────────────────────┘
```

### Rules

1. Admin APIs always resolve company **`sams`** (AM is not supported in admin).  
2. Storefront uses `VITE_COMPANY_SLUG=sams`.  
3. Paysafe / WhatsApp / GA settings are for SAMS (`CompanySettings` + env).  

### Admin modules

1. Dashboard — sales, revenue, profit estimates, orders today, low stock  
2. Categories / child brands — CRUD  
3. Products — CRUD, image upload → URL, stock, pricing  
4. Heroes / banners & carousels — CRUD, reorder, schedule  
5. Policies — privacy, return, exchange, shipping, terms (dynamic)  
6. Orders — list, detail, status, payment, resend WhatsApp (to **all** team numbers)  
7. Settings — GA, contact email, currency, Paysafe refs, **WhatsApp notify recipients**  
8. Media upload → URL  

Admin UI: React under `/admin/*`, token auth.

---

## Design & Motion Direction

### Landing page (must impress)

Fully animated, cinematic first impression:

- Lenis smooth scroll  
- GSAP ScrollTrigger product/brand storytelling  
- Framer Motion page transitions & staggered reveals  
- Optional **liquid / crystal** decorative components (blobs, refractive glass panels)  
- Selective **glassmorphism** (nav, floating cards)  
- Soft **neumorphism** accents on feature tiles where it fits (not overused)  
- Hero + brand portals (Sanmate / Wyped) feel “Apple-tier” without layout bugs  

### Rest of the website

Normal but polished & premium:

- Clean catalogue grids, clear PDP, trustworthy checkout  
- Light glass / soft depth, consistent navy + orange  
- Stable layouts only (no duplicate mobile/desktop DOM, careful with pins)  
- Motion: tasteful fade/slide; heavy pinning reserved for landing  

### Theme toolkit (use where it elevates UX)

| Style | Where to use |
| --- | --- |
| Glassmorphism | Landing nav, overlays, promo cards |
| Neumorphism | Soft feature / trust blocks (light sections) |
| Liquid / crystal | Landing hero accents, CTA orbs, brand portals |
| Classic premium flat | Catalogue, PDP, cart, policies, admin |

Admin panel stays **clear SaaS-admin** (readable tables, not experimental glass).

### Brand tokens (SAMS v1)

| Token | Value | Usage |
| --- | --- | --- |
| Navy | `#1B1D63` | Headings, footer, primary surfaces |
| Orange | `#F5630D` | CTAs, accents |
| Logo | `sams-logo.jpg` | SAMS storefront + admin when context = SAMS |

---

## System Architecture

```
┌──────────────────────┐
│ Storefront: SAMS     │
│ + Admin SPA (/admin) │
└──────────┬───────────┘
           │ company=sams
           ▼
┌──────────────────────┐
│ Django REST API      │
│ Admin locked to sams │
└──────────┬───────────┘
     ┌─────┼─────┐
     ▼     ▼     ▼
 PostgreSQL  Cloudflare  Paysafe (SAMS)
     │
     ▼
 WhatsApp notify (SAMS team list)
```

### Repo layout (target)

```
sanmate/
├── docs/
│   └── DEVELOPMENT_PHASES.md
├── backend/                 ← Django API (SAMS)
├── web/                     ← React storefront + /admin
├── pictures/
└── README.md
```

---

## Core Domain Model

| Entity | Notes |
| --- | --- |
| **Company** | `sams` — name, slug, logo URL, theme JSON, domains, active |
| **CompanySettings** | GA ID, currency, Paysafe account refs, contact email |
| **WhatsAppNotifyRecipient** | FK → Company — label (e.g. Mustafa) + phone; each gets order alerts individually |
| **Category / ChildBrand** | FK → Company (Sanmate, Wyped, …) |
| **Product** | FK → Company (+ Category). SKU unique per company |
| **ProductImage** | Image URLs (upload), sort |
| **Banner / Hero** | FK → Company |
| **Carousel + Slide** | FK → Company |
| **Policy** | FK → Company + type (privacy, return, exchange, …) |
| **Order / OrderItem** | FK → Company — sales/revenue/profit |
| **AdminUser** | Staff for SAMS admin panel |

**Hard rule:** Admin panel always operates on company `sams`.

---

## Storefront — SAMS Enterprises

1. **Landing (fully animated)** — company hero, Sanmate / Wyped portals, featured products  
2. Category / brand pages  
3. Catalogue — filter, search, sort  
4. Product detail  
5. Cart & Checkout (Paysafe)  
6. Dynamic policy pages  

Orders:

- Created for SAMS  
- WhatsApp notify uses SAMS **recipient list** — message sent **individually to every active number**  
- Numbers are **not** shown on the public storefront in development  

---

## Phase 0 — Discovery & Foundations *(Week 1)*

### Locked decisions

| Topic | Decision |
| --- | --- |
| Focus | **SAMS Enterprises** storefront + admin only (no AM in admin) |
| Child brands | **Created in Admin Panel** (not hardcoded) |
| Currency | **PKR** |
| Paysafe | SAMS merchant account (env `PAYSAFE_SAMS_*`) |
| Cloudflare R2 | Media under `sams/…` prefix |
| Google Analytics | SAMS GA4 Measurement ID |

### Checklist

- [x] Align SAMS-only admin + storefront vision  
- [x] Child brands = admin-created (CRUD)  
- [x] Currency = PKR  
- [x] Admin = SAMS Enterprises only (no company switcher)  
- [ ] Shipping regions for SAMS  
- [ ] Paysafe **test** merchant access for SAMS  
- [ ] Cloudflare R2 bucket + API token  
- [ ] GA4 property for SAMS  
- [ ] PostgreSQL local + staging  
- [x] SAMS logo in assets (`web/public/images/sams-logo.jpg`)  

---

## Phase 1 — Backend Foundation *(Weeks 1–2)*

**Build focus:** SAMS storefront APIs + SAMS-only admin APIs.

- [x] Django apps: `companies`, `accounts`, `catalog`, `cms`, `orders`, `payments`, `notifications`  
- [x] `Company` + `CompanySettings` (currency **PKR**)  
- [x] Catalogue/CMS/order models FK → `Company`  
- [x] Admin always resolves company **`sams`**  
- [x] DRF public APIs at `/api/v1/sams/…`  
- [x] Admin APIs under `/api/v1/admin/…` + Django admin  
- [x] Media upload → URL  
- [x] Seed: Company `sams` + Sanmate/Wyped + products  
- [x] WhatsApp recipient list seeded (Owner, Mustafa, Mustansir, Ali)  

**Public APIs**

```
GET  /api/v1/sams/categories/
GET  /api/v1/sams/products/
GET  /api/v1/sams/products/{slug}/
GET  /api/v1/sams/banners/
GET  /api/v1/sams/carousels/{key}/
GET  /api/v1/sams/policies/{type}/
POST /api/v1/sams/orders/
POST /api/v1/sams/payments/paysafe/...
POST /api/v1/webhooks/paysafe/
```

**Admin APIs** (always SAMS)

```
POST /api/v1/admin/login/
CRUD /api/v1/admin/{resource}/
GET  /api/v1/admin/dashboard/summary/
POST /api/v1/admin/media/upload/
```

---

## Phase 2 — SAMS Storefront (React) *(Weeks 2–4)*

- [x] `VITE_COMPANY_SLUG=sams`  
- [x] Fully **animated landing** (GSAP + Framer + glass / liquid accents)  
- [x] Catalogue, PDP, cart, checkout — polished, not over-animated  
- [x] Routes: `/`, `/brands/:slug`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/policies/:type`  
- [x] GA4 events (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`, page views)  
- [x] Mobile-first, **single** responsive layouts (no duplicate grids)  
- [x] Vite proxy `/api` → Django (`web/vite.config.ts`)  

**How to check:** run backend `python manage.py runserver`, then `cd web && npm run dev` → http://localhost:5173  

Reuse motion ideas from the existing Sanmate showcase; storefront is SAMS multi-brand commerce.

---

## Phase 3 — SAMS Admin Panel *(Weeks 3–5)*

- [x] Login + role checks (token auth: `POST /api/v1/admin/login/`)  
- [x] Admin locked to **SAMS Enterprises** (no company switcher / no AM)  
- [x] Dashboard cards: sales, revenue, profit, orders  
- [x] Full CRUD: categories, products, banners, policies (+ carousels API)  
- [x] Order management + WhatsApp resend (fan-out to all recipients)  
- [x] Settings (GA, Paysafe refs, storefront toggle, WhatsApp team)  

**UI:** http://localhost:5173/admin · Dev login `admin` / `admin123`  

**How to check:** start backend + `npm run dev` → open `/admin` → confirm header shows “SAMS Enterprises” only → edit a product.  

---

## Phase 4 — Paysafe *(Weeks 4–6)*

Prefer **Paysafe Checkout** + Payments API + webhooks.

| Env | Base URL |
| --- | --- |
| Test | `https://api.test.paysafe.com/paymenthub/v1` |
| Live | `https://api.paysafe.com/paymenthub/v1` |

Docs: [Get Started](https://developer.paysafe.com/en/api-docs/payments-api/get-started/) · [Checkout](https://developer.paysafe.com/en/api-docs/paysafe-checkout/before-you-begin/)

Keys for SAMS:

```env
PAYSAFE_ENV=test
PAYSAFE_SAMS_API_KEY=username:password
PAYSAFE_SAMS_PUBLIC_KEY=...
PAYSAFE_SAMS_ACCOUNT_ID=...
PAYSAFE_WEBHOOK_SECRET=...
```

### Implemented

- [x] `GET /api/v1/{company}/payments/paysafe/config/` — public key / simulate flag  
- [x] `POST /api/v1/{company}/payments/paysafe/process/` — charge `paymentHandleToken`  
- [x] `POST /api/v1/{company}/payments/paysafe/simulate/` — DEBUG only when keys missing  
- [x] `POST /api/v1/webhooks/paysafe/` — reconcile + mark paid  
- [x] Checkout UI: order → Paysafe Checkout (or simulate) → paid  
- [x] Idempotent `mark_order_paid` → WhatsApp fan-out  

Flow: cart → order `pending_payment` → Checkout / simulate → `paid` → WhatsApp → webhook reconcile.

**How to check (no Paysafe keys yet):** checkout a product → “Place order & pay” → simulate marks paid → Admin → Orders shows paid + Resend WhatsApp logs recipients.

**How to check (with keys):** set `PAYSAFE_SAMS_*` → real Checkout opens → process endpoint charges → paid.

---

## Phase 5 — WhatsApp Notifications *(Week 5–6)*

### Multi-recipient team alerts

Order notifications are **not** single-number. Each company has a list of team members; on every **paid** order the backend sends the **same message to each recipient individually**.

| Example recipients (SAMS) | Role / label |
| --- | --- |
| Owner number | Primary / you |
| Mustafa | Team |
| Mustansir | Team |
| Ali | Team |

### Implemented

- [x] `WhatsAppNotifyRecipient` model + Admin Settings CRUD  
- [x] Fan-out on paid (and admin Resend) — one send per phone  
- [x] Partial failure handling (log success/fail per recipient)  
- [x] Meta WhatsApp Cloud API when `WHATSAPP_API_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` set  
- [x] STUB mode when credentials missing (logs message; numbers never on storefront)  
- [x] PK phone normalize → E.164 (`03xx` → `923xx`)  

```env
WHATSAPP_SAMS_NOTIFY_TO=03363399445,03XXXXXXXXX
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

**How to check:** complete a simulated payment → open Django admin `Notification logs` or click **Resend WhatsApp** on an order → confirm one log row per team member.

---

## Phase 6 — Google Analytics *(Week 5)*

- [ ] GA4 for SAMS in `CompanySettings`  
- [ ] Events: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`  

---

## Phase 7 — Cloudflare Media *(from Phase 1)*

- [x] Admin **file upload** → public URL saved on products/banners/brands  
- [x] Local `MEDIA_ROOT` storage for development (`/media/sams/…`)  
- [ ] R2 bucket PUT when CF credentials are set  
- [x] DB stores URLs only  

**Admin UX:** choose image file → `POST /api/v1/admin/media/upload/` → returned `url` stored in DB.  

---

## Phase 8 — Hardening & Launch *(Weeks 6–8)*

- [ ] Security: CORS, rate limits, secrets in env  
- [ ] Performance, SEO, a11y  
- [ ] UAT on SAMS catalogue  
- [ ] Deploy storefront + API + Postgres  

---

## Environment Variables (summary)

```env
DJANGO_SECRET_KEY=
DATABASE_URL=postgres://...
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=

CF_ACCOUNT_ID=
CF_API_TOKEN=
CF_MEDIA_BASE_URL=

PAYSAFE_ENV=test
PAYSAFE_SAMS_API_KEY=
PAYSAFE_SAMS_PUBLIC_KEY=
PAYSAFE_SAMS_ACCOUNT_ID=
PAYSAFE_WEBHOOK_SECRET=

WHATSAPP_SAMS_NOTIFY_TO=03363399445,03XXXXXXXXX,03XXXXXXXXX,03XXXXXXXXX
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

VITE_API_BASE_URL=
VITE_COMPANY_SLUG=sams
VITE_GA_MEASUREMENT_ID=
VITE_PAYSAFE_PUBLIC_KEY=
VITE_PAYSAFE_ENV=test
```

---

## Suggested Timeline

| Phase | Duration | Outcome |
| --- | --- | --- |
| 0 Foundations | 1 week | SAMS decisions, accounts |
| 1 Backend | 1–2 weeks | APIs + seed SAMS |
| 2 SAMS storefront | 2 weeks | Animated landing + shop |
| 3 SAMS admin | 1–2 weeks | CMS + dashboards (SAMS only) |
| 4 Paysafe | 1–2 weeks | Checkout |
| 5–7 Parallel | — | WhatsApp, GA, Cloudflare |
| 8 Launch | 1–2 weeks | SAMS live |

**Rough total to SAMS launch:** 7–10 weeks.

---

## Immediate Next Steps

1. ~~Phases 1–5~~ ✅ Backend, storefront, SAMS-only admin, Paysafe, WhatsApp  
2. Add real Paysafe + WhatsApp Cloud credentials in `.env` for production tests  
3. Phase 6 GA polish · Phase 7 R2 · Phase 8 launch  

---

## Out of Scope for v1

- Multi-company / AM admin or storefront  
- Full ERP sync  
- Native apps  
- Public WhatsApp numbers on storefront (dev)  
- Group WhatsApp as the only channel (v1 sends **individually** to each team number)  

---

## Contacts & Ops

- **SAMS public email:** `info.samsenterprise.pk@gmail.com`  
- **WhatsApp notify:** multiple team numbers (e.g. owner, Mustafa, Mustansir, Ali) — managed in admin; not on storefront  
- **SAMS brands to seed first:** Sanmate · Wyped  

---

*Document owner: SAMS Enterprises web project*  
*Last updated: 2026-08-11*
