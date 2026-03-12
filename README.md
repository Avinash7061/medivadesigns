# Mediva Designs — Handcrafted Mandala Paintings

An e-commerce application for selling handcrafted mandala paintings, built with Next.js, Prisma, NextAuth.js, and Stripe.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (Credentials + Google OAuth)
- **Payments:** Stripe Checkout
- **Styling:** CSS Modules
- **Language:** TypeScript

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Session encryption key (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (same as `NEXTAUTH_URL`) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |

### 3. Set up the database

```bash
npx prisma db push
```

### 4. Seed the database (optional)

```bash
npm run db:seed
```

This creates an admin user (`admin@medivadesigns.shop` / `admin123`) and sample products.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploy on Vercel

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.example` in the Vercel project settings
4. Deploy — Vercel will auto-detect Next.js and run the build
5. After the first deploy, run `npx prisma db push` against your production database to create tables
6. Optionally seed your production database with `npm run db:seed`
