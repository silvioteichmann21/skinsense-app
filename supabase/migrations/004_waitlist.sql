-- Waitlist signups from the marketing site (Vercel API uses service role).
-- Run in Supabase SQL Editor after 001_profiles.sql.

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  source text not null default 'landing',
  locale text,
  user_agent text,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_lower_idx
  on public.waitlist_signups (lower(trim(email)));

create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

alter table public.waitlist_signups enable row level security;

-- No anon/authenticated policies: inserts only via service role on the server API.
