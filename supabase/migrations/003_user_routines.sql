-- Personalized skincare routines (step lists only — no photos).
-- Run after 001_profiles.sql.

create table if not exists public.user_routines (
  user_id uuid primary key references auth.users (id) on delete cascade,
  scan_id text,
  morning_steps jsonb not null default '[]',
  evening_steps jsonb not null default '[]',
  subtitle text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists user_routines_updated_at_idx
  on public.user_routines (updated_at desc);

alter table public.user_routines enable row level security;

create policy "user_routines: select own"
  on public.user_routines for select
  using (auth.uid() = user_id);

create policy "user_routines: insert own"
  on public.user_routines for insert
  with check (auth.uid() = user_id);

create policy "user_routines: update own"
  on public.user_routines for update
  using (auth.uid() = user_id);

create policy "user_routines: delete own"
  on public.user_routines for delete
  using (auth.uid() = user_id);
