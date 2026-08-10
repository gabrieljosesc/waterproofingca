# DryFort Waterproofing

Marketing site for **DryFort Waterproofing** — Southern Ontario's 24/7 emergency
basement waterproofing company. Built with Next.js (App Router) + TypeScript,
with quote-form leads stored in Supabase.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- Plain CSS design system (`app/globals.css`) — dark navy theme, water-blue accent
- **Supabase** for quote-request leads (`/api/quote` → `quote_requests` table)
- Unsplash imagery via `next/image` remote patterns

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Supabase setup

1. Create a project at https://supabase.com.
2. Run `supabase/schema.sql` in the SQL editor to create the `quote_requests` table.
3. Copy `.env.example` to `.env.local` and fill in the project URL and keys.

Without env vars the quote form runs in demo mode (accepts submissions, logs a
warning, persists nothing).

## Features

- **Public pricing** is intentionally a "from" rate, not a range: exterior
  **from $275/ft** ($4,000 min job), interior **from $120/ft** ($2,800 min).
  Per client decision, the site does NOT advertise a range, since the real
  quote climbs with depth/access/location modifiers — the Phase 1 AI quote
  tool (separate build) produces the actual per-project range. An earlier
  slider calculator was removed for this reason.
- **Financing section** on `/pricing` — dedicated "Waterproof now, pay monthly"
  panel with an example-plan card ($11k over 10 yrs ≈ $90/mo), plus a short
  mention on the home pricing strip. **The financing terms ($0 down, up to 10
  years, on approved credit) and the example rate are PLACEHOLDERS** — confirm
  the real lender, rate, term and legal disclosure with the client before
  launch. Terms are centralized in `site.financing`.
- **Testimonials** on the home page — **sample content** in `lib/site.ts`;
  replace with the client's real reviews before launch.
- **Guarantee strip** (warranty / price match / licensed / 24-7) on the home
  page — the *price match guarantee* is a competitor-standard claim that **must
  be confirmed with the client** before going live.
- Quote form → Supabase, 24/7 emergency top bar, FAQ with schema markup.

## Content & SEO

- All copy, contact details, services, FAQs and pricing live in `lib/site.ts`.
  Phone, email and address are the client's real business details.
- Pricing: exterior waterproofing **from $275/linear ft** ($4,000 min job),
  interior **from $120/linear ft** ($2,800 min), residential & commercial
  quotes. Rates centralized in `site.pricing`.
- SEO: per-page metadata, `sitemap.ts`, `robots.ts`, and JSON-LD structured data
  (LocalBusiness + FAQPage) in `app/layout.tsx` — targeted at
  "basement waterproofing Southern Ontario" / "24/7 emergency waterproofing"
  queries for both search engines and AI assistants.
- Set the real domain in `lib/site.ts` (`site.url`) once purchased
  (suggested: `dryfortwaterproofing.ca`).

## Pages

| Route       | Purpose                                            |
| ----------- | -------------------------------------------------- |
| `/`         | Hero, services grid, pricing strip, FAQ, service area |
| `/services` | Six services in detail + process                   |
| `/pricing`  | From $275/linear ft breakdown, residential vs commercial |
| `/about`    | Story, stats, values                               |
| `/contact`  | Quote form (Supabase) + 24/7 emergency contact     |
