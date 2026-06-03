# SkinSense marketing site

Next.js landing page + waitlist API for Vercel.

## Local development

```bash
cd web
cp .env.example .env.local
```

Edit `.env.local`:

1. **SUPABASE_URL** — same as `app.json` → `expo.extra.SUPABASE_URL` (already set in `.env.example` for this project).
2. **SUPABASE_SERVICE_ROLE_KEY** — Supabase Dashboard → **Project Settings → API** → **service_role** (click Reveal). This is **not** the anon/public key.

Restart the dev server after saving:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase

Run in the SQL Editor (once):

```text
supabase/migrations/004_waitlist.sql
```

Waitlist rows are inserted **only** via the server API using the **service role** key (never expose it to the browser).

## Vercel deployment

1. Import the repo in Vercel.
2. Set **Root Directory** to `web`.
3. Add environment variables (Production + Preview):

   | Variable | Value |
   |----------|--------|
   | `SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | service role secret (Settings → API) |
   | `WAITLIST_ALLOWED_ORIGINS` | optional, e.g. `https://yourdomain.com` |

4. Deploy.

## API

`POST /api/waitlist`

```json
{ "email": "you@example.com", "name": "Alex" }
```

Returns `{ "ok": true }` on success (including duplicate emails, to avoid enumeration).
