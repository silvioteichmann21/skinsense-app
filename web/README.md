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

### Option A (recommended): Root Directory = `web`

1. Import the **SkinSense** GitHub repo in Vercel.
2. **Settings → General → Root Directory** → set to **`web`** → Save.
3. **Settings → General → Framework Preset** → **Next.js** (auto-detected).
4. **Do not** override **Output Directory** — leave it empty / default.
5. **Settings → Environment Variables** — add for **Production** and **Preview** (required for waitlist):

   | Variable | Value |
   |----------|--------|
   | `SUPABASE_URL` | `https://afixdzyeybxgcqpbynud.supabase.co` (your project URL) |
   | `SUPABASE_SERVICE_ROLE_KEY` | **service_role** secret from Supabase → Settings → API (not the anon key) |
   | `WAITLIST_ALLOWED_ORIGINS` | optional, e.g. `https://yourdomain.com` |

6. **Redeploy** after saving env vars (Deployments → ⋯ → Redeploy). New variables are not applied to old deployments.

7. **Verify:** open `https://YOUR-DEPLOYMENT.vercel.app/api/waitlist` in the browser. You should see:
   ```json
   { "ok": true, "missing": [] }
   ```
   If `missing` lists variable names, add them in Vercel and redeploy again.

### Option B: Repo root (no Root Directory change)

The repo includes a root `vercel.json` and `vercel-build` script so Vercel can build from the monorepo root. Still add the env vars above in the Vercel project.

### Fix “404: NOT_FOUND” on Vercel

That screen usually means the site was **not built as Next.js**:

- Set **Root Directory** to **`web`**, or use Option B after pulling the latest `vercel.json`.
- Remove any custom **Output Directory** (e.g. `public`, `dist`, `.next`) in project settings.
- **Framework Preset** must be **Next.js**, not “Other”.
- Redeploy after changing settings.

## API

`POST /api/waitlist`

```json
{ "email": "you@example.com", "name": "Alex" }
```

Returns `{ "ok": true }` on success (including duplicate emails, to avoid enumeration).
