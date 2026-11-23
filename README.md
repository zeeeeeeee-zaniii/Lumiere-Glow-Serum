# Lumière Glow Serum — Landing Page Demo

A one-page sales landing page for a fictional skincare serum, with a
Cash-on-Delivery order form that saves leads to Supabase and a passcode-gated
admin panel with a leads inbox and a 5-palette theme switcher.

Built with Next.js (App Router, TypeScript) and plain CSS. All artwork is
inline SVG, so the whole project is plain text files — easy to push to
GitHub and deploy on Vercel.

## 1. Create the Supabase tables

In the Supabase dashboard, open **SQL Editor → New query**, paste this and
run it:

```sql
-- Cash-on-Delivery order leads from the landing page form
create table if not exists public.land_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text not null,
  pack text not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

-- Key/value settings (holds the active theme)
create table if not exists public.land_settings (
  key text primary key,
  value text not null
);

-- Seed: default theme
insert into public.land_settings (key, value) values ('theme', 'rosewood')
on conflict (key) do nothing;
```

The site talks to Supabase from the server with the **Secret key**, which
bypasses Row Level Security, so no extra policies are needed for this setup.
Table names are prefixed (`land_`) because all of Zainab's demos share one
Supabase project.

## 2. Environment variables

Copy `.env.example` to `.env.local` for local development, and set the same
variables in Vercel (Project → Settings → Environment Variables) for
production:

| Variable              | Where to get it                                             |
| --------------------- | ----------------------------------------------------------- |
| `SUPABASE_URL`        | Supabase dashboard → Settings → API → Project URL           |
| `SUPABASE_SECRET_KEY` | Supabase dashboard → Settings → API Keys → Secret key       |
| `ADMIN_PASSCODE`      | Any passcode you choose — used to sign in at `/admin`       |

## 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the landing page and
http://localhost:3000/admin for the admin panel.

## 4. Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository
   (framework preset: Next.js — no extra settings needed).
3. Add the three environment variables from step 2.
4. Deploy. Every later push to the repository redeploys automatically.

## How it works

- **Order form** — posts to `/api/order`, which validates the details and
  inserts a row into `land_leads`. Nothing is saved if Supabase is not
  configured; the visitor sees a friendly message instead.
- **Admin panel** (`/admin`) — sign in with `ADMIN_PASSCODE`. The login API
  route sets an http-only cookie holding a SHA-256 token derived from the
  passcode; the passcode never reaches the browser.
- **Leads tab** — total leads, today's leads (counted on the admin's own
  clock), bottles ordered today, and the full inbox, newest first, with
  delete.
- **Theme tab** — five palettes (Rosewood, Teal Fresh, Royal Purple,
  Emerald, Midnight Gold). The choice is saved to `land_settings` and the
  root layout reads it on every request, so the whole page — hero included —
  re-skins for all visitors.
