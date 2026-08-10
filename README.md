# Vaapi Store (Attus) — Premium Streetwear & Fashion

Modern e-commerce store built with Next.js 16, Prisma 7, PostgreSQL, and NextAuth.

## Repository Layout

```
.
├── frontend/         → Next.js 16 app (main project — this is what Vercel deploys)
│   ├── src/          → App Router pages, components, API routes
│   ├── prisma/       → Schema + seed
│   ├── public/       → Static assets
│   └── package.json  → Next.js dependencies (Prisma, NextAuth, Razorpay, etc.)
├── backend/          → FastAPI reverse-proxy (only used inside the Emergent dev container)
│   ├── server.py
│   └── requirements.txt
├── package.json      → Root shim so Vercel detects Next.js
├── vercel.json       → Vercel build config (install + build inside frontend/)
└── README.md
```

## Deployment (Vercel)

The `vercel.json` at the repo root configures Vercel to `cd frontend/ && yarn install && yarn build`, so **you do not need to change the Root Directory in Vercel settings** — leave it as `./` and everything will work.

If you prefer to point Vercel directly at `frontend/`:

1. Vercel Dashboard → Your Project → **Settings → General → Root Directory**
2. Change from `./` to `frontend`
3. Save and redeploy (in this case you can delete `/vercel.json` from the repo)

### Required Vercel Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Required | Example / Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string. Get free from [Neon](https://neon.tech) or [Supabase](https://supabase.com) |
| `NEXTAUTH_URL` | ✅ | `https://your-domain.vercel.app` |
| `NEXTAUTH_SECRET` | ✅ | Any long random string (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Same as `NEXTAUTH_URL` |
| `NEXT_PUBLIC_APP_NAME` | ⭕ | e.g. `Vaapi Store` |
| `PAYMENT_MOCK_MODE` | ⭕ | `true` to run without real Razorpay keys |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ⭕ | Real Razorpay keys (leave empty in mock mode) |
| `CLOUDINARY_*`, `RESEND_API_KEY`, `SHIPROCKET_*`, `MEILISEARCH_*`, `REDIS_URL` | ⭕ | Optional integrations |

After adding env vars, click **Redeploy** in Vercel.

### First Deploy — Database Setup

On first deploy (or when schema changes):

```bash
# Locally, pointing at your production DB
cd frontend
DATABASE_URL="<your-vercel-DATABASE_URL>" npx prisma db push
DATABASE_URL="<your-vercel-DATABASE_URL>" npx tsx prisma/seed.ts
```

## Local Development

```bash
# 1. Clone and install
git clone https://github.com/Rohityd25/Vaapi_Store.git
cd Vaapi_Store/frontend
cp .env.example .env
# → fill in DATABASE_URL and NEXTAUTH_SECRET

# 2. Start PostgreSQL locally (or use a hosted DB)
# 3. Push schema + seed
yarn install
yarn prisma db push
yarn db:seed

# 4. Run dev server
yarn dev
```

Open http://localhost:3000

### Seeded test users

| Role | Email | Password |
|---|---|---|
| SUPER_ADMIN | `admin@vaapi.com` | `admin123` |
| VENDOR | `vendor@vaapi.com` | `vendor123` |
| CUSTOMER | `customer@vaapi.com` | `customer123` |

⚠️ **Change these before going live!**

### Seeded coupons

- `WELCOME10` — 10% off (min ₹499)
- `VAAPI500` — ₹500 flat off (min ₹2499)

## Features

- ✅ Product catalog with variants (size, color), stock tracking, categories, vendors
- ✅ Cart (localStorage/Zustand), coupon codes, guest + authenticated checkout
- ✅ **Server-side price and stock validation** (client-tampering safe)
- ✅ Razorpay payments (real signature verification + mock mode)
- ✅ Cash on Delivery
- ✅ Admin panel scaffolding (products, orders, inventory, coupons, vendors, content, customers)
- ✅ NextAuth (credentials + Google — Google needs `GOOGLE_CLIENT_ID`/`_SECRET`)
- ✅ Middleware protection on `/admin` and `/account`
- ✅ SEO-friendly product pages, blog posts, banners

## Payment Modes

- **Mock mode** (default, `PAYMENT_MOCK_MODE=true`): orders complete instantly without hitting Razorpay. Great for demoing/dev.
- **Live mode**: set `PAYMENT_MOCK_MODE=false` and provide `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`.

## License

Private. All rights reserved.
