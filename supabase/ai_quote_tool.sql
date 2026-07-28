-- AI quote tool schema (applied to the `waterproofing` Supabase project as
-- migration `ai_quote_tool_schema`). Kept here for version control and to
-- reproduce the schema in another environment.
--
-- Tables: estimate_submissions, submission_photos, submission_estimates
-- Storage: private `submission-photos` bucket
-- RLS: only authenticated (owner dashboard) can read; writes go through server
--      routes using the service-role key, which bypasses RLS.

create extension if not exists moddatetime schema extensions;

-- 1. Customer intake submissions
create table if not exists public.estimate_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new','ai_analyzed','needs_review','approved','sent',
                      'more_photos_requested','site_visit','declined','outside_area')),

  full_name text not null,
  email text not null,
  phone text,
  preferred_contact text check (preferred_contact in ('phone','email','text')),

  address text,
  city text,
  postal_code text,
  property_type text check (property_type in ('residential','commercial','industrial','multi_unit')),
  ownership text check (ownership in ('own','rent')),
  structure text check (structure in ('detached','semi','townhouse','other')),
  year_built int,
  house_age_band text check (house_age_band in ('pre_1950','1950_1980','post_1980')),

  service_requested text check (service_requested in ('exterior','interior','unsure')),
  leak_location text check (leak_location in ('wall','floor','window','wall_floor_joint','unsure')),
  basement_depth_band text check (basement_depth_band in ('up_to_7','eight_ft','nine_plus','unknown')),
  linear_feet numeric,
  active_leak boolean,
  urgent boolean,
  financing_interest boolean,
  preferred_timeframe text,

  location_tier text check (location_tier in ('toronto_core','toronto_suburbs','belt_905','outer_gta')),
  rebate_city text check (rebate_city in ('toronto','mississauga','markham')),
  service_area_ok boolean,

  consent boolean not null default false,
  source text not null default 'website',
  extra jsonb not null default '{}'::jsonb
);

create trigger set_updated_at before update on public.estimate_submissions
  for each row execute function extensions.moddatetime(updated_at);

create index if not exists estimate_submissions_status_idx
  on public.estimate_submissions (status, created_at desc);

-- 2. Uploaded photos (files live in the storage bucket)
create table if not exists public.submission_photos (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.estimate_submissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  storage_path text not null,
  photo_type text check (photo_type in ('wall','access','obstruction','interior','surface','other')),
  ai_labels jsonb,
  ai_confidence numeric,
  bytes int,
  width int,
  height int
);

create index if not exists submission_photos_submission_idx
  on public.submission_photos (submission_id);

-- 3. AI estimate + owner review (1:1 with submission for Phase 1)
create table if not exists public.submission_estimates (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.estimate_submissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'draft'
    check (status in ('draft','owner_review','approved','sent')),

  ai_conditions jsonb,
  ai_confidence numeric,
  engine_input jsonb,
  engine_output jsonb,

  range_low numeric,
  range_high numeric,
  rebate_amount numeric,
  net_low numeric,
  net_high numeric,

  owner_adjustments jsonb,
  final_low numeric,
  final_high numeric
);

create trigger set_updated_at before update on public.submission_estimates
  for each row execute function extensions.moddatetime(updated_at);

-- RLS. NOTE: the "authenticated update" policies use `using (true)` because in
-- Phase 1 the only people who authenticate are the owner/admins (customers
-- submit anonymously via the server). Tighten these to an explicit admin check
-- when the auth/dashboard slice lands.
alter table public.estimate_submissions enable row level security;
alter table public.submission_photos enable row level security;
alter table public.submission_estimates enable row level security;

create policy "authenticated read submissions" on public.estimate_submissions
  for select to authenticated using (true);
create policy "authenticated update submissions" on public.estimate_submissions
  for update to authenticated using (true) with check (true);

create policy "authenticated read photos" on public.submission_photos
  for select to authenticated using (true);

create policy "authenticated read estimates" on public.submission_estimates
  for select to authenticated using (true);
create policy "authenticated update estimates" on public.submission_estimates
  for update to authenticated using (true) with check (true);

-- 4. Private storage bucket for customer photos (15 MB, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('submission-photos', 'submission-photos', false, 15728640,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "authenticated read submission photos" on storage.objects
  for select to authenticated using (bucket_id = 'submission-photos');
