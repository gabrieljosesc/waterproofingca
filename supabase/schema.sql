-- DryFort Waterproofing — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) to set up
-- the quote_requests table used by /api/quote.

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  service text,
  property_type text not null default 'residential'
    check (property_type in ('residential', 'commercial')),
  message text not null,
  source text not null default 'website',
  handled boolean not null default false
);

alter table public.quote_requests enable row level security;

-- The API route inserts with the service-role key, which bypasses RLS.
-- If you prefer client-side inserts with the anon key instead, uncomment:
-- create policy "Allow anonymous quote submissions"
--   on public.quote_requests for insert
--   to anon
--   with check (true);

-- Only authenticated dashboard users may read leads.
create policy "Authenticated users can read quote requests"
  on public.quote_requests for select
  to authenticated
  using (true);

create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);
