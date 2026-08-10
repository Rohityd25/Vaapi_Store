# PROJECT OVERVIEW — Vaapi Store (Attus)

## System Architecture

```
                                 ┌──────────────────────────────────────────────┐
                                 │                CLIENT / BROWSER              │
                                 │  (Next.js 16 Storefront & Admin UI - React 19)│
                                 └──────────────────────┬───────────────────────┘
                                                        │
                                                        ▼
                                 ┌──────────────────────────────────────────────┐
                                 │             NEXT.JS 16 APP ROUTER            │
                                 │           (Server & API Handler)             │
                                 └──────────┬───────────┬───────────┬───────────┘
                                            │           │           │
                 ┌──────────────────────────┘           │           └──────────────────────────┐
                 ▼                                      ▼                                      ▼
    ┌──────────────────────────┐           ┌──────────────────────────┐           ┌──────────────────────────┐
    │    POSTGRESQL DATABASE   │           │     RAZORPAY GATEWAY     │           │    EXTERNAL INTEGRATIONS │
    │   (Prisma 7.9.0 ORM)     │           │  (Test / Mock / Live)    │           │ (Resend, Cloudinary,     │
    └──────────────────────────┘           └──────────────────────────┘           │  Shiprocket, Redis)      │
                                                                                  └──────────────────────────┘
```

---

## Technical Stack Summary

- **Frontend**: Next.js 16.2.10 (App Router), React 19.2.4, TypeScript, Zustand 5.0.14 (Cart & Wishlist state), Tailwind CSS v4 & custom CSS variables (`globals.css`).
- **Backend API**: Next.js API Routes (`frontend/src/app/api/*`). Additional FastAPI proxy (`backend/server.py`) for containerized dev routing.
- **Database & ORM**: PostgreSQL via Prisma ORM 7.9.0 with `@prisma/adapter-pg` driver.
- **Authentication**: NextAuth.js v4 with JWT strategy, Credentials (email/password hashed with `bcryptjs`), and Google OAuth provider.
- **Payment Gateway**: Razorpay (signature verification + `PAYMENT_MOCK_MODE` fallback) + Cash on Delivery (COD).
- **Storage & Media**: Cloudinary SDK configured for image uploads & optimizations.
- **Email & Shipping**: Resend API integration for order emails, Shiprocket API for courier logistics & tracking.
- **Search & Caching**: Meilisearch client helper, IORedis helper for session cart caching and rate limiting.

---

## Application Walkthrough (User & Admin Flow)

1. **Browsing Products**: User visits homepage → views hero banner, category grids, bestsellers, and new arrivals. User can navigate to collection pages (`/collections/[slug]`) and product detail pages (`/products/[slug]`).
2. **Cart Management**: User selects product size/color variant and clicks "Add to Bag". Item is saved to local storage via Zustand (`useCartStore`).
3. **Checkout & Order Creation**: User clicks "Checkout" → fills shipping address → picks payment method (Razorpay or COD) → optional coupon applied. POST request to `/api/checkout` calculates totals server-side, validates DB stock & prices, and creates a database `Order` (status `PENDING` for Razorpay, `CONFIRMED` for COD).
4. **Payment Processing**:
   - If COD: Stock is decremented immediately, user directed to `/checkout/success`.
   - If Razorpay (Mock Mode): Payment auto-verified via `/api/payments/razorpay/verify`, stock decremented, user directed to success page.
   - If Razorpay (Live Mode): Razorpay popup opens, user completes payment, signature verified server-side, stock decremented, order marked `PAID`.
5. **Customer Account**: Registered users can view their profile, past orders (`/account/orders`), and wishlist (`/account/wishlist`).
6. **Admin Panel**: Authorized roles (`SUPER_ADMIN`, `STAFF`, `VENDOR`) access `/admin/dashboard` to manage products, inventory, orders, vendors, customers, coupons, and site banners.

---

## Status Breakdown

### ✅ Fully Working
- Next.js 16 App Router setup with Server & Client components.
- Responsive store UI (Navbar, Cart Drawer, Product Cards, Filters, Footer).
- Local storage persisted Zustand Cart & Wishlist.
- Checkout flow with server-side stock & price verification.
- Cash on Delivery (COD) & Razorpay Mock/Live payment handling.
- NextAuth Authentication with role-based routing (Customer vs. Admin).
- Database Schema (Prisma 7.9.0) with relational models for Users, Products, Variants, Inventory, Orders, Banners, Coupons, and Reviews.
- Detailed DB Seeding script (`prisma/seed.ts`).

### ⚠️ Partially Working
- **Database Connectivity**: Uses mock state fallback in components when database is disconnected. Needs a live PostgreSQL instance for persistent storage.
- **Search**: UI search integrated with Prisma `contains` queries; Meilisearch helper exists but requires running Meilisearch server.
- **Email Notifications**: Resend integration helper implemented, but requires `RESEND_API_KEY`.
- **Shipping Logistics**: Shiprocket integration helper implemented, but requires API credentials.

### ❌ Missing / Stubbed
- Unit & E2E Test Suite for frontend storefront and checkout API.
- Live deployment configuration check (Environment variables verification for Vercel/Production).
- Environment variable placeholder template (`.env.example`) in the frontend directory.
