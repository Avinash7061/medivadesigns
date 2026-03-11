
# Mediva Designs — Handcrafted Mandala Paintings

A full-stack e-commerce platform for handcrafted mandala paintings, built with **Next.js 15**, **Prisma**, **NextAuth**, and **Stripe**.

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Framework  | Next.js 15 (App Router)            |
| Database   | PostgreSQL via Prisma ORM          |
| Auth       | NextAuth v4 (Credentials + Google) |
| Payments   | Stripe Checkout                    |
| Styling    | CSS Modules + global variables     |
| Deployment | Vercel                             |

---

## Getting Started (Local Development)

### 1. Clone & install

```bash
git clone https://github.com/Avinash7061/medivadesigns.git
cd medivadesigns
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local`. See the section below for details.

### 3. Set up the database

```bash
# Push the schema to your database
npm run db:push

# (Optional) Seed with sample products
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable                | Required | Description |
|-------------------------|----------|-------------|
| `DATABASE_URL`          | ✅       | PostgreSQL connection string |
| `NEXTAUTH_SECRET`       | ✅       | Long random string for JWT signing (`openssl rand -base64 32`) |
| `NEXTAUTH_URL`          | ✅       | Canonical URL of your site (e.g. `https://medivadesigns.shop`) |
| `NEXT_PUBLIC_APP_URL`   | ✅       | Same value as `NEXTAUTH_URL` |
| `STRIPE_SECRET_KEY`     | ✅       | Stripe secret key (`sk_live_…` or `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | ✅       | Stripe webhook signing secret (`whsec_…`) |
| `GOOGLE_CLIENT_ID`      | ☑️       | Google OAuth client ID (enables Google sign-in) |
| `GOOGLE_CLIENT_SECRET`  | ☑️       | Google OAuth client secret |

---

## Deployment (Vercel — Recommended)

### Prerequisites

1. **PostgreSQL database** — Create a free managed instance on one of:
   - [Neon](https://neon.tech) *(recommended for Vercel)*
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

2. **Stripe account** — [dashboard.stripe.com](https://dashboard.stripe.com)

3. **Vercel account** — [vercel.com](https://vercel.com)

### Option A — One-click via Vercel dashboard

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Add all environment variables from the table above in the **Environment Variables** section.
3. Click **Deploy**.
4. After the first deploy, run the database migration:
   ```bash
   npx prisma db push
   ```
   or set up [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate) for production.

### Option B — Automated via GitHub Actions

The repository ships with two workflows in `.github/workflows/`:

| Workflow     | File           | Trigger              | What it does |
|--------------|----------------|----------------------|--------------|
| **CI**       | `ci.yml`       | Every push / PR      | Lint + build |
| **Deploy**   | `deploy.yml`   | Push to `main`       | Deploy to Vercel |

#### Steps to enable automated deployment

1. **Link the project to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   ```

2. **Add the following secrets** to your GitHub repository  
   (*Settings → Secrets and variables → Actions → New repository secret*):

   | Secret name      | How to get it |
   |------------------|---------------|
   | `VERCEL_TOKEN`   | Vercel dashboard → Settings → Tokens |

   All application environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.)  
   should be configured directly inside **Vercel** (project → Settings → Environment Variables).  
   The deploy workflow calls `vercel pull` to retrieve them automatically.

3. Push to `main` — the deploy workflow runs automatically.

### Stripe Webhook

After deploying, register a Stripe webhook endpoint:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**.
2. Set the URL to:  
   `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select the event **`checkout.session.completed`**.
4. Copy the **signing secret** and set it as `STRIPE_WEBHOOK_SECRET` in Vercel.

---

## Available Scripts

| Command          | Description |
|------------------|-------------|
| `npm run dev`    | Start development server |
| `npm run build`  | Build for production |
| `npm run start`  | Start production server |
| `npm run lint`   | Run ESLint |
| `npm run db:push`| Push Prisma schema to database |
| `npm run db:seed`| Seed the database with sample data |

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Stripe Documentation](https://stripe.com/docs)

