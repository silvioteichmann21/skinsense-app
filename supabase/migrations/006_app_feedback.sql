-- In-app star ratings, public review display, author info, and avatar storage.
-- Run after 001_profiles.sql.

-- ── Table ─────────────────────────────────────────────────────────────────────

create table if not exists public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  stars smallint not null check (stars >= 1 and stars <= 5),
  comment text,
  locale text,
  platform text,
  app_version text,
  author_display_name text,
  author_avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.app_feedback
  add column if not exists author_display_name text,
  add column if not exists author_avatar_url text;

create index if not exists app_feedback_created_at_idx
  on public.app_feedback (created_at desc);

alter table public.profiles
  add column if not exists avatar_url text;

-- ── Row-level security ────────────────────────────────────────────────────────

alter table public.app_feedback enable row level security;

create policy "app_feedback: insert authenticated"
  on public.app_feedback for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "app_feedback: insert anonymous"
  on public.app_feedback for insert
  to anon
  with check (user_id is null);

create policy "app_feedback: select own"
  on public.app_feedback for select
  to authenticated
  using (user_id = auth.uid());

create policy "app_feedback: read public reviews"
  on public.app_feedback for select
  to anon, authenticated
  using (true);

-- ── Public review list (name + avatar from feedback or profile) ─────────────

create or replace function public.list_app_feedback_public(p_limit int default 24)
returns table (
  id uuid,
  stars smallint,
  comment text,
  locale text,
  created_at timestamptz,
  author_display_name text,
  author_avatar_url text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    f.id,
    f.stars,
    f.comment,
    f.locale,
    f.created_at,
    coalesce(
      nullif(trim(f.author_display_name), ''),
      nullif(trim(p.display_name), ''),
      nullif(
        trim(
          concat_ws(
            ' ',
            nullif(trim(p.first_name), ''),
            case
              when nullif(trim(p.last_name), '') is not null
                then left(trim(p.last_name), 1) || '.'
              else null
            end
          )
        ),
        ''
      )
    ) as author_display_name,
    coalesce(
      nullif(trim(f.author_avatar_url), ''),
      nullif(trim(p.avatar_url), '')
    ) as author_avatar_url
  from public.app_feedback f
  left join public.profiles p on p.id = f.user_id
  where f.stars >= 1
  order by f.created_at desc
  limit greatest(1, least(p_limit, 100));
$$;

grant execute on function public.list_app_feedback_public(int) to anon, authenticated;

-- ── Avatar storage ──────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'feedback-avatars',
  'feedback-avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "feedback_avatars: public read"
  on storage.objects for select
  to public
  using (bucket_id = 'feedback-avatars');

create policy "feedback_avatars: upload own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'feedback-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "feedback_avatars: update own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'feedback-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
