# OrbitSynk

> The sync layer between payments and communities.

OrbitSynk automatically grants and revokes community access when subscription payments succeed or fail — connecting billing providers (Lemon Squeezy, Paddle) with community platforms (Circle, Skool).

---

## Stack

- **Next.js 15** (App Router)
- **Clerk** — Auth
- **Neon** — PostgreSQL database
- **Drizzle ORM** — Type-safe database queries
- **Tailwind CSS + Framer Motion** — UI
- **Vercel** — Hosting + Cron jobs

---

## Setup (3 steps)

### 1. Get your API keys

| Service | Where to get it | What you need |
|---------|----------------|---------------|
| [Clerk](https://clerk.com) | Dashboard → API Keys | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| [Neon](https://neon.tech) | Project → Connection String | `DATABASE_URL` |

### 2. Create `.env.local`

```bash
cp .env.example .env.local
# Fill in all values from the table above
```

Also generate an encryption key:
```bash
openssl rand -hex 16
# Paste the output as ENCRYPTION_KEY in .env.local
```

### 3. Push the database schema

```bash
npm run db:push
```

This creates all the tables in your Neon database automatically.

---

## Running Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all `.env.local` variables as **Environment Variables** in Vercel
4. Deploy

The cron job (`vercel.json`) runs automatically every hour to process expired grace periods.

---

## How It Works

```
Customer pays
    ↓
Lemon Squeezy / Paddle fires webhook
    ↓
POST /api/webhooks/lemon-squeezy
    ↓ (verifies HMAC signature)
Rules Engine matches event → automation rule
    ↓
Calls Circle / Skool API
    ↓
Grants or revokes community access
    ↓
Logs event to database
```

---

## Connecting Your First Integration

1. Sign up at `/sign-up`
2. Go to **Dashboard → Connections**
3. Add your Lemon Squeezy API key + webhook secret
4. Copy the webhook URL shown → paste it into Lemon Squeezy
5. Add your Circle API key + community ID
6. Go to **Dashboard → Rules** → Create rule:
   - When: `subscription.created` → Grant Access
   - When: `subscription.cancelled` → Revoke Access (3 day grace)
7. Done. Every payment now syncs automatically.

---

## Database Commands

```bash
npm run db:push     # Push schema changes to Neon
npm run db:studio   # Open Drizzle Studio (visual DB browser)
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Sign in / Sign up (Clerk)
│   ├── dashboard/           # Protected dashboard pages
│   │   ├── page.tsx         # Overview + live event feed
│   │   ├── connections/     # Connect billing & community
│   │   ├── rules/           # Automation rule builder
│   │   ├── logs/            # Full event log
│   │   └── members/         # Member sync state
│   └── api/
│       ├── webhooks/        # Lemon Squeezy + Paddle handlers
│       ├── connections/     # CRUD for connections
│       ├── rules/           # CRUD for rules
│       ├── logs/            # Event log query
│       ├── members/         # Member sync query
│       └── cron/            # Grace period processor
├── lib/
│   ├── db/                  # Drizzle schema + connection
│   ├── adapters/            # Circle + Skool API wrappers
│   ├── rules-engine.ts      # Core automation logic
│   └── encrypt.ts           # AES-256 key encryption
└── components/
    ├── (marketing)/         # Landing page sections
    └── dashboard/           # Dashboard UI components
```
