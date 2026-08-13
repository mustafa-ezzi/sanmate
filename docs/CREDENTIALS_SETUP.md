# SAMS credentials — how to create and where to find them

Copy `backend/.env.example` to `backend/.env` (local) and paste the same keys into **Railway → your backend service → Variables**. Never commit real secrets.

This project currently uses **SAMS only**. Fill the `RAPID_GATEWAY_*` and `WHATSAPP_*` values.

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

## 3. Rapid Gateway (checkout)

**What they do:** Customer pays on checkout. SAMS uses **[Rapid Gateway](https://rapidgateway.pk/)** — one Pakistan payment gateway for cards (Visa / Mastercard / PayPak), JazzCash, easypaisa, Raast, and bank transfer. Without keys and with `DJANGO_DEBUG=True`, checkout can use a **simulate** path for local testing.

Rapid Gateway is SBP-licensed; you do not need separate JazzCash/easypaisa merchant contracts.

### Get an account & keys

1. Go to [https://rapidgateway.pk/](https://rapidgateway.pk/) → **Request Sandbox Access** / contact sales, or call **+92 315 4020909**.
2. Complete a short onboarding call + KYC (CNIC for sole prop, NTN/incorporation for companies).
3. **Sandbox** secret key is emailed the same day — use this while building.
4. **Live** secret key is issued after KYC (often within about an hour).
5. Full API schemas ship with your sandbox kit (they do not publish live secrets publicly).

Useful links:

- Gateway overview: [Payment Gateway Pakistan](https://rapidgateway.pk/payment-gateway-pakistan)
- JazzCash / easypaisa guide: [Integrate JazzCash & easypaisa](https://rapidgateway.pk/resources/integrate-jazzcash-easypaisa-pakistan)
- Webhooks: [Payment Webhooks Guide](https://rapidgateway.pk/resources/payment-webhooks-guide)

### `RAPID_GATEWAY_ENV`

- Local / staging: `test` (sandbox)
- Production: `live`

```env
RAPID_GATEWAY_ENV=test
```

### `RAPID_GATEWAY_SECRET_KEY`

Server-side Bearer token used to create payments (`Authorization: Bearer …`).

1. After onboarding, open the Rapid Gateway merchant portal / email kit.
2. Copy the **Secret key** (sandbox first, then live).
3. Never put this in the frontend or commit it to git.

```env
RAPID_GATEWAY_SECRET_KEY=sk_test_xxxxxxxx
```

(Their docs sometimes call this `RG_SECRET_KEY` — same value.)

### `RAPID_GATEWAY_PUBLIC_KEY` (optional)

Some dashboard / client widgets show a public key. If Rapid gives you one, store it here. Checkout that only uses the server `POST /v1/payments` flow may leave this empty.

```env
RAPID_GATEWAY_PUBLIC_KEY=
```

### `RAPID_GATEWAY_MERCHANT_ID` (optional)

If the portal shows a merchant / account ID for SAMS, save it for reference (and admin Settings). Not always required for the Bearer API call.

```env
RAPID_GATEWAY_MERCHANT_ID=
```

### `RAPID_GATEWAY_API_BASE`

Default production API:

```env
RAPID_GATEWAY_API_BASE=https://api.rapidgateway.pk/v1
```

Only change this if Rapid gives you a different sandbox base URL in your kit.

### `RAPID_GATEWAY_WEBHOOK_SECRET`

Rapid POSTs signed JSON when a payment completes / fails / is refunded.

1. Portal → **Developers → Webhooks** (or **Settings → Webhooks**).
2. Register your webhook URL:

`https://YOUR-RAILWAY-BACKEND-HOST/api/v1/webhooks/rapid-gateway/`

3. Copy the **webhook salt / signing secret**.

```env
RAPID_GATEWAY_WEBHOOK_SECRET=your-webhook-salt
```

Signature (from their guide): HMAC-SHA256 over `timestamp + "." + rawBody`, hex uppercase, header `X-RapidGateway-Signature`. Also check `X-RapidGateway-Timestamp` (reject if skew > 5 minutes).

### Typical create-payment shape (for reference)

```http
POST https://api.rapidgateway.pk/v1/payments
Authorization: Bearer <RAPID_GATEWAY_SECRET_KEY>
Content-Type: application/json
Idempotency-Key: <order_number>

{
  "amount": 4250,
  "currency": "PKR",
  "methods": ["easypaisa", "jazzcash", "card"],
  "customer": { "phone": "+923XXXXXXXXX" },
  "return_url": "https://yourstore.pk/checkout?order=SAMS-…",
  "webhook_url": "https://YOUR-BACKEND/api/v1/webhooks/rapid-gateway/"
}
```

Response includes `checkout_url` — redirect the customer there to pay.

### Checklist (SAMS)

```env
RAPID_GATEWAY_ENV=test
RAPID_GATEWAY_SECRET_KEY=sk_test_xxxxxxxx
RAPID_GATEWAY_PUBLIC_KEY=
RAPID_GATEWAY_MERCHANT_ID=
RAPID_GATEWAY_API_BASE=https://api.rapidgateway.pk/v1
RAPID_GATEWAY_WEBHOOK_SECRET=your-webhook-salt
```

After keys are set, restart Django. Checkout should stop using simulate (unless the secret key is still blank).

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

Frontend (`web/.env`) does **not** need R2, WhatsApp, or Rapid Gateway secrets. Images load from the URL the API already stored.

---

## 5. Quick “am I done?” checks

| Area | How to verify |
| --- | --- |
| R2 | Admin → Settings shows R2 connected. Upload a product image; URL starts with `CF_MEDIA_BASE_URL`. |
| WhatsApp | Admin → Settings shows Cloud API detected. Resend on an order; phone receives the template (or Meta error in the toast). |
| Rapid Gateway | Secret key set → checkout creates a payment and redirects to Rapid `checkout_url`. Webhook marks the order paid. |

If something fails, the admin toast / Django logs usually include Meta HTTP errors, R2 `AccessDenied`, or Rapid Gateway 401 (bad secret key).
