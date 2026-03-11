# Mediva Designs — Handcrafted Mandala Paintings

An e-commerce platform for handcrafted mandala paintings built with Next.js, Prisma (SQLite), NextAuth, and Stripe.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL` — SQLite file path (default: `file:./prisma/dev.db`)
- `NEXTAUTH_SECRET` — Random secret for JWT signing (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Your app URL (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — For Google OAuth (optional)
- `STRIPE_SECRET_KEY` — From [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- `STRIPE_PUBLISHABLE_KEY` — From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` — From Stripe CLI or Stripe Dashboard webhook settings
- `NEXT_PUBLIC_APP_URL` — Your app's public URL

### 3. Set Up the Database

Create the database and seed initial data:

```bash
npm run db:setup
```

This runs `prisma db push` (creates the SQLite database) and seeds it with sample products and an admin user.

**Admin credentials:** `admin@medivadesigns.shop` / `admin123`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:setup` | Create DB + seed data (first-time setup) |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:migrate` | Apply pending migrations |
| `npm run lint` | Run ESLint |

## Payment Gateway (Stripe)

This app uses [Stripe](https://stripe.com) for payments. To test locally:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` to forward webhooks
3. Copy the webhook signing secret and set `STRIPE_WEBHOOK_SECRET` in `.env`
4. Use test card `4242 4242 4242 4242` with any future expiry and CVC

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite via Prisma ORM
- **Authentication:** NextAuth.js (Credentials + Google OAuth)
- **Payments:** Stripe Checkout
- **Styling:** CSS Modules + CSS Variables
- **Animations:** Framer Motion
