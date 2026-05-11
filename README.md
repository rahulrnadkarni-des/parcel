# Parcel

A community-driven catalog of restaurant delivery packaging. Parcel lets anyone photograph and submit the packaging they receive from food deliveries, building a searchable, visual index of how restaurants across different areas present their orders.

## How it works

**Browsing** — The home page shows all restaurants that have at least one approved packaging submission. Filter by area using the pill tabs at the top. Each restaurant card links to a detail page with a photo grid of every approved submission.

**Submitting** — Anyone can submit a photo of packaging they received. They pick the restaurant (or add a new one), select their area, upload a photo, and optionally leave their email for follow-up. Submissions go into a pending queue.

**Review** — An admin reviews each pending submission and either approves or rejects it. Approved entries appear publicly on the restaurant's page. Admins can also edit entry details or delete entries entirely from the admin dashboard.

**Data model** — Each `PackagingEntry` belongs to a `Restaurant` and an `Area`. A Cloudinary-hosted photo URL and a status (`PENDING` / `APPROVED` / `REJECTED`).

## Tech stack

- **Next.js 16** (App Router) — pages, server components, and API routes
- **PostgreSQL + Prisma** — data storage and schema management
- **Cloudinary** — photo upload and hosting
- **Resend** — transactional email notifications
- **Tailwind CSS v4** — styling
- **Framer Motion** — page transitions

---

## Running it locally

### Prerequisites

- Node.js 20+
- A PostgreSQL database
- A [Cloudinary](https://cloudinary.com) account (free tier works)
- A [Resend](https://resend.com) account for email (optional for basic use)

### 1. Clone the repo

```bash
git clone <repo-url>
cd parcel
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with the following:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/parcel

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=admin@example.com

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
JWT_SECRET=a_long_random_secret_string
```

### 4. Set up the database

```bash
npm run db:generate   # generate the Prisma client
npm run db:migrate    # run migrations against your database
npm run db:seed       # (optional) seed initial area data
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Other useful commands

| Command | What it does |
|---|---|
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run db:studio` | Open Prisma Studio to browse the database |
| `npm run db:push` | Push schema changes without a migration file |
