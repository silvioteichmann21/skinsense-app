-- Allow waitlist inserts via anon key when the Vercel API uses the public anon fallback
-- (still only reachable through POST /api/waitlist, not direct browser spam if you keep RLS tight).
-- Run after 004_waitlist.sql.

create policy waitlist_signups_anon_insert
  on public.waitlist_signups
  for insert
  to anon
  with check (true);
