# Hexa Crochet Studio — Cash on Delivery Funnel

A production-oriented Next.js App Router funnel for the **Handmade Crochet Hexagon Unisex Shirt – Cream & Black**. It includes the landing page, `/checkout`, `/thank-you`, a secure `/api/order` route, Google Sheets storage, business email notification and an optional customer confirmation email.

## Recommended stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS 4 for the responsive interface
- Next/Image plus pre-optimized WebP product assets
- Zod for server-side validation
- Google Sheets REST API with a service account
- Resend's HTTPS API for Gmail-compatible HTML email
- Vercel for production

The email adapter sends **to** the business Gmail address. `EMAIL_FROM` must be on a domain verified by the email provider; a normal Gmail address generally cannot be used as an unverified `from` identity.

## Order flow

1. A visitor selects quantity and opens `/checkout`, or uses the order form on the landing page.
2. The browser sends customer information and quantity to `POST /api/order`.
3. The API validates every field, checks size against `lib/product.ts`, and recalculates prices server-side.
4. It generates an ID such as `HCS-20261013-A1B2C3`, timestamps it in `Asia/Kathmandu`, and appends it to Google Sheets.
5. After the sheet append succeeds, it sends the business notification and, if supplied, the customer confirmation email.
6. Success is returned only after every required action succeeds; then the browser opens `/thank-you`.
7. If the sheet succeeds but email fails, the response includes the saved order ID and warns the customer not to submit a duplicate.

The button locks during submission, and a hidden honeypot rejects simple bots.

## Product configuration

Edit `lib/product.ts` to change copy, prices, delivery, benefits, FAQs, images and sizes.

Current editable defaults:

- Regular price: NPR 2,999
- Launch price: NPR 2,399
- Delivery: NPR 150 across Nepal
- Notification address: `dikpalkc735@gmail.com`

No verified sizes were provided, so `sizes` is deliberately empty and ordering is disabled. Add real values before launch:

```ts
sizes: [/* add verified sizes here */],
```

Do not publish material, care, stock, size or delivery-time claims until verified. Testimonials remain hidden because no verified reviews were provided. The supplied product video is rendered as click-to-play media and never autoplays.

## Environment variables

Copy `.env.example` to `.env.local` and fill every required value. Never commit `.env.local`.

`SMTP_*` variables are retained for a future SMTP adapter. The current adapter uses `EMAIL_SERVICE_API_KEY` with Resend because HTTPS works reliably on Vercel and Cloudflare-based runtimes.

For `GOOGLE_PRIVATE_KEY`, keep escaped newlines in a single-line environment value:

```text
-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

## Google Spreadsheet setup

1. Create a Google Spreadsheet and copy its ID from `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.
2. Create a tab named `Crochet_Shirt_Orders`, or let the API create it.
3. If adding headers manually, row 1 must contain exactly:

   `Order ID`, `Date & Time`, `Customer Name`, `Phone Number`, `Email Address`, `Exact Location`, `Product Name`, `Quantity`, `Price Per Piece`, `Total Price`, `Payment Method`, `Order Status`, `Notes`

4. Select row 1 and use **Data → Create a filter**. Freeze it with **View → Freeze → 1 row**.
5. Select `L2:L`, use **Data → Data validation → Dropdown**, and add `New Order`, `Order Confirmed`, `Order Ongoing`, `Delivered`, `Cancelled`. The API also applies this validation automatically.
6. In Google Cloud Console, enable the Google Sheets API, create a service account and generate a JSON key.
7. Put its `client_email` into `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` into `GOOGLE_PRIVATE_KEY`.
8. Share the spreadsheet with the service-account email as **Editor**.

The API refuses to append to a mismatched header layout.

## Email setup

1. Create a Resend account and verify a sending domain.
2. Put an API key into `EMAIL_SERVICE_API_KEY`.
3. Set `EMAIL_FROM`, for example `Hexa Crochet Studio <orders@yourdomain.com>`.
4. Keep `BUSINESS_EMAIL=dikpalkc735@gmail.com` and set `BRAND_NAME`.

Both email templates use inline CSS and a table layout for Gmail. The customer email is sent only when an email address is provided.

## Local development

```bash
pnpm install
pnpm dev
```

Original PNGs are in `public/images/originals`; optimized WebP files are in `public/images`. The supplied MP4 is preserved in `public/videos/originals` and served from `public/videos`. Regenerate images after replacing a source:

```bash
node scripts/optimize-images.mjs
```

## Test a successful order

1. Add verified sizes to `lib/product.ts`.
2. Fill all required environment variables.
3. Start the app and submit a test order with your own email.
4. Confirm all four outcomes:
   - A row appears in Google Sheets.
   - `dikpalkc735@gmail.com` receives the business email.
   - The test customer receives the confirmation email.
   - The browser opens `/thank-you` with the same order ID, quantity and total.
5. Test invalid and missing fields. The page must show errors without redirecting.
6. Temporarily use a bad sheet ID or email key. The site must not show a false success.

Direct API test after adding a real size and credentials:

```bash
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test Customer","phone":"9800000000","email":"you@example.com","address":"Exact test address","city":"Kathmandu","postalCode":"44600","size":"A_CONFIGURED_SIZE","quantity":1,"notes":"Test order","website":""}'
```

## Deploy to Vercel

1. Push to a private Git repository and import it into Vercel.
2. Vercel detects Next.js; `vercel.json` explicitly runs `pnpm exec next build`.
3. Add all production variables under **Project Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the final HTTPS URL.
5. Deploy and repeat the four-outcome production test.
6. Never place service-account keys, Sheet IDs or email credentials in `NEXT_PUBLIC_*` variables.

## Security behavior

- The server calculates product price and total.
- Credentials never reach frontend code.
- Cash on Delivery is the only payment method.
- Missing backend configuration returns `503` and confirms nothing.
- The API creates the tab/header/dropdowns when permissions allow.

