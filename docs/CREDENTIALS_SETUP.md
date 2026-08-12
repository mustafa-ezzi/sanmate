# SAMS credentials — how to create and where to find them

Copy `backend/.env.example` to `backend/.env` (local) and paste the same keys into **Railway → your backend service → Variables**. Never commit real secrets.

This project currently uses **SAMS only**. Fill the `PAYSAFE_SAMS_*` and `WHATSAPP_*` values. The `*_AM_*` keys can stay empty.

---

## 1. Cloudflare R2 (product / banner images)

**What they do:** Admin uploads a picture → backend puts the file in R2 → the public URL is saved in the database (`image_url`) → the storefront loads the picture from that URL.

### Create an R2 bucket

1. Log in at [https://dash.cloudflare.com](https://dash.cloudflare.com).
2. In the left sidebar open **R2 Object Storage**.
3. Click **Create bucket**.
4. Name it something like `sams-media` (lowercase, no spaces).
5. Create the bucket.

`CF_R2_BUCKET` = the **exact bucket name** (example: `sams-media`).

### `CF_ACCOUNT_ID`

1. Stay in the Cloudflare dashboard.
2. Click **R2 Object Storage** (or any Cloudflare overview page).
3. On the right sidebar, copy **Account ID** (32-character hex).

You can also find it under **Workers & Pages** or in the URL:  
`https://dash.cloudflare.com/<ACCOUNT_ID>/r2/overview`

`CF_ACCOUNT_ID` = that Account ID.

### `CF_R2_ACCESS_KEY_ID` and `CF_R2_SECRET_ACCESS_KEY`

These are **R2 API tokens**, not a normal Cloudflare API token.

1. Cloudflare dashboard → **R2 Object Storage**.
2. Open **Manage R2 API Tokens** (top right, or **Overview → API**).
3. Click **Create API token**.
4. Permissions: **Object Read & Write** (needed to upload).
5. Apply to: this bucket (`sams-media`) or all buckets.
6. Create the token.

Cloudflare shows **Access Key ID** and **Secret Access Key** **once**. Copy both immediately.

- `CF_R2_ACCESS_KEY_ID` = Access Key ID  
- `CF_R2_SECRET_ACCESS_KEY` = Secret Access Key  

If you lose the secret, create a new token.

### `CF_MEDIA_BASE_URL` (public URL, no trailing slash)

The storefront needs a **public** URL for each file. Pick one:

**Option A — R2.dev public development URL (fastest for testing)**

1. Open the bucket → **Settings**.
2. Under **Public development URL**, click **Enable**.
3. Copy the URL, like `https://pub-xxxxxxxx.r2.dev`.

`CF_MEDIA_BASE_URL=https://pub-xxxxxxxx.r2.dev`

**Option B — Custom domain (production)**

1. Bucket → **Settings → Custom Domains**.
2. Connect something like `media.yourdomain.com`.
3. Wait until it is active.

`CF_MEDIA_BASE_URL=https://media.yourdomain.com`

Do **not** add a trailing slash. Uploaded files become:

`https://pub-xxxxxxxx.r2.dev/sams/abc123-photo.jpg`

### Checklist

```env
CF_ACCOUNT_ID=32-char-hex-from-cloudflare
CF_R2_BUCKET=sams-media
CF_R2_ACCESS_KEY_ID=your-r2-access-key-id
CF_R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
CF_MEDIA_BASE_URL=https://pub-xxxxxxxx.r2.dev
```

Leave `CF_API_TOKEN` empty (legacy, unused for uploads).

Restart Django after saving. Admin → **Settings** should show **R2 connected**. Then upload an image on a product/banner — the saved URL should start with `CF_MEDIA_BASE_URL`.

---

## 2. WhatsApp Cloud API (order alerts)

**What they do:** When an order is paid (or you click **Resend WhatsApp**), SAMS sends one message to each number in Admin → Settings.

Adding a phone in Settings is **not enough**. Meta credentials must be in `.env`.

### Create the Meta app

1. Go to [https://developers.facebook.com](https://developers.facebook.com) and log in.
2. **My Apps → Create App**.
3. Choose **Business**.
4. Open the app → **Add product → WhatsApp → Set up**.
5. Connect / create a **Meta Business Portfolio**.

### `WHATSAPP_PHONE_NUMBER_ID`

1. In the app: **WhatsApp → API setup** (sometimes **WhatsApp → Getting started**).
2. Under **From**, select the WhatsApp number (test number first, live number later).
3. Copy **Phone number ID** (digits only, not the human phone number).

`WHATSAPP_PHONE_NUMBER_ID=10987xxxxxxxxxx`

Also note **WhatsApp Business Account ID** — you need it for templates, not for this `.env` file.

### `WHATSAPP_API_TOKEN`

**Temporary (testing, ~24 hours)**

1. Same **API setup** page.
2. Copy **Temporary access token**.

**Permanent (production)**

1. Open [Meta Business Suite](https://business.facebook.com/) → **Business settings**.
2. **Users → System users**.
3. Create a system user (Admin).
4. **Generate token**.
5. Permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
6. Assign the system user to your WhatsApp Business Account / phone number.
7. Copy the token.

`WHATSAPP_API_TOKEN=EAAxxxxxxxx`

Keep it secret. If it expires, generate a new one.

### Add your personal number for testing

On **API setup**, under **To**, add and verify your WhatsApp number (OTP). Until the number is **live**, Meta only delivers to verified test recipients.

### `WHATSAPP_TEMPLATE_NAME` and `WHATSAPP_TEMPLATE_LANG`

Business-initiated alerts (new orders to staff who have **not** messaged you in the last 24 hours) **require an approved template**. Free-form text only works inside that 24-hour window.

#### Create the template

1. [WhatsApp Manager](https://business.facebook.com/latest/whatsapp_manager)  
   or Developers → **WhatsApp → Message templates**.
2. **Create template**.
3. Category: **Utility**.
4. **Name:** `order_alert` (lowercase, underscores only — this becomes `WHATSAPP_TEMPLATE_NAME`).
5. **Language:** English. Meta’s language code is usually `en` or `en_US`. Use **exactly** the code shown next to the template after it is approved. That is `WHATSAPP_TEMPLATE_LANG`.
6. Body (must have **exactly 3** variables, in this order):

```text
New order {{1}}
Customer: {{2}}
Total: {{3}}
```

| Variable | This app sends |
| --- | --- |
| `{{1}}` | Order number (e.g. `SAMS-260812103846`) |
| `{{2}}` | Customer name |
| `{{3}}` | Currency + total (e.g. `PKR 4500`) |

7. Submit and wait until status is **Approved**.

Then:

```env
WHATSAPP_TEMPLATE_NAME=order_alert
WHATSAPP_TEMPLATE_LANG=en
```

If Meta lists the language as `en_US`, use `en_US`, not `en`.

### Optional notify fallback

`WHATSAPP_SAMS_NOTIFY_TO` is only used if **no** recipients exist in Admin → Settings. Prefer adding names/numbers in the admin UI.

### Checklist

```env
WHATSAPP_API_TOKEN=EAAxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=10987xxxxxxxxxx
WHATSAPP_TEMPLATE_NAME=order_alert
WHATSAPP_TEMPLATE_LANG=en
```

Restart Django. Admin → Settings should show **Cloud API credentials detected**. Then **Orders → Resend WhatsApp**.

---

## 3. Paysafe (checkout)

**What they do:** Customer pays on checkout. SAMS uses **its own** Paysafe merchant account (`PAYSAFE_SAMS_*`). Without these keys and with `DJANGO_DEBUG=True`, checkout uses the **simulate** endpoint (fake paid, useful in local dev).

You need a Paysafe merchant / partner account. Start at [https://www.paysafe.com](https://www.paysafe.com) or the portal they gave you:

- Test: [https://developer.paysafe.com](https://developer.paysafe.com) and the **Paysafe Back Office (test)**  
- Live: production Back Office (Paysafe emails this after go-live)

### `PAYSAFE_ENV`

- Local / staging: `test`
- Production: `live`

```env
PAYSAFE_ENV=test
```

### `PAYSAFE_SAMS_API_KEY`

Server-side secret used to process payments.

1. Log in to **Paysafe Back Office** (test or live).
2. Open **Settings → API Keys** (sometimes **Developer → API Keys** or **Business Portal → Integrations**).
3. Copy the **Private / Secret API key** (often looks like `private-xxxxx` or a long Base64 string).

`PAYSAFE_SAMS_API_KEY=...`

Never expose this in the frontend.

### `PAYSAFE_SAMS_PUBLIC_KEY`

Used by the browser checkout (Paysafe.js / Checkout).

Same API Keys page → copy the **Public API key**.

`PAYSAFE_SAMS_PUBLIC_KEY=...`

### `PAYSAFE_SAMS_ACCOUNT_ID`

The merchant **account number** that receives the money (not the API key).

1. Back Office → **Accounts** / **Business accounts** / **Settings**.
2. Copy the **Account ID** / **Account number** (digits).

`PAYSAFE_SAMS_ACCOUNT_ID=100xxxxxx`

If you have several accounts (cards vs wallets), use the one enabled for this storefront.

### `PAYSAFE_WEBHOOK_SECRET`

Paysafe calls your backend when payment status changes.

1. Back Office → **Developer → Webhooks** (or **Notifications**).
2. Create a webhook pointing at:

`https://YOUR-RAILWAY-BACKEND-HOST/api/v1/sams/payments/paysafe/webhook/`

(Exact path must match production; confirm in `backend/config/urls.py` / payments URLs if you change routing.)

3. Copy the **webhook signing secret / HMAC key**.

`PAYSAFE_WEBHOOK_SECRET=...`

If Paysafe has not issued a webhook secret yet, leave it empty for test simulate-only; set it before live payments.

### `PAYSAFE_AM_*`

Leave empty. Admin is SAMS-only; AM keys are unused.

### Checklist (SAMS)

```env
PAYSAFE_ENV=test
PAYSAFE_SAMS_API_KEY=your-private-api-key
PAYSAFE_SAMS_PUBLIC_KEY=your-public-api-key
PAYSAFE_SAMS_ACCOUNT_ID=100xxxxxx
PAYSAFE_WEBHOOK_SECRET=your-webhook-secret
```

After keys are set, restart Django. Checkout should stop using simulate (unless keys are still blank).

---

## 4. Where to paste everything

### Local

1. Copy `backend/.env.example` → `backend/.env`.
2. Fill the values above.
3. Restart: `python manage.py runserver`.

### Railway (production)

1. Railway project → **backend** service → **Variables**.
2. Add the same keys (do not wrap values in quotes unless the value itself contains spaces).
3. Redeploy / restart the service.

Frontend (`web/.env`) does **not** need R2, WhatsApp, or Paysafe secrets. Images load from the URL the API already stored.

---

## 5. Quick “am I done?” checks

| Area | How to verify |
| --- | --- |
| R2 | Admin → Settings shows R2 connected. Upload a product image; URL starts with `CF_MEDIA_BASE_URL`. |
| WhatsApp | Admin → Settings shows Cloud API detected. Resend on an order; phone receives the template (or Meta error in the toast). |
| Paysafe | Checkout no longer says simulate. Test card from Paysafe docs works in `PAYSAFE_ENV=test`. |

If something fails, the admin toast / Django logs usually include Meta HTTP errors or R2 `AccessDenied` (wrong keys or bucket name).
