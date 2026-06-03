-- Skin onboarding quiz (5-step profile) — one row per user, upserted on quiz complete.
-- Run in Supabase SQL Editor after 001_profiles.sql.

create table if not exists public.skin_onboarding (
  user_id uuid primary key references auth.users (id) on delete cascade,
  concerns text[] not null default '{}',
  skin_type text,
  routine text,
  age_range text,
  goals text[] not null default '{}',
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skin_onboarding_updated_at_idx
  on public.skin_onboarding (updated_at desc);

alter table public.skin_onboarding enable row level security;

create policy "skin_onboarding: select own"
  on public.skin_onboarding for select
  using (auth.uid() = user_id);

create policy "skin_onboarding: insert own"
  on public.skin_onboarding for insert
  with check (auth.uid() = user_id);

create policy "skin_onboarding: update own"
  on public.skin_onboarding for update
  using (auth.uid() = user_id);

create policy "skin_onboarding: delete own"
  on public.skin_onboarding for delete
  using (auth.uid() = user_id);
