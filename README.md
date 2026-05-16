# Mediva Designs — Handcrafted Mandala Paintings

An e-commerce application for selling handcrafted mandala paintings, built with Next.js, Prisma, Supabase Auth, and Stripe.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Supabase Auth (Email + Google OAuth)
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
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | Public app URL for Stripe redirects |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### 3. Set up the database

```bash
npx prisma db push
```

### 4. Seed the database (optional)

```bash
npm run db:seed
```

This creates sample products.
To enable admin access, set the `role` in the Supabase user's `app_metadata` to `ADMIN`.

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
