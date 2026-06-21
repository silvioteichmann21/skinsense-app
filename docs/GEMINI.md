# Gemini skin analysis setup

SkinSense can analyze scans with **Google Gemini** via a Supabase Edge Function. Photos are sent to your backend only (not embedded in the app).

## 1. Get a Gemini API key

1. Open [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key for your project

## 2. Deploy the Edge Function

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then from the repo root:

```bash
supabase login
supabase link --project-ref afixdzyeybxgcqpbynud
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
supabase functions deploy analyze-skin
```

The function reads `GEMINI_API_KEY` from Supabase secrets. **Never** put this key in `app.json`.

## 3. Enable in the app

In `app.json` → `expo.extra`:

```json
"GEMINI_ANALYSIS": "true",
"SUPABASE_URL": "https://YOUR_PROJECT.supabase.co",
"SUPABASE_ANON_KEY": "your_anon_key"
```

When `GEMINI_ANALYSIS` is `"true"` and Supabase is configured, the scan pipeline:

1. Encodes **front + right + left** photos (768px JPEG)
2. Calls `POST {SUPABASE_URL}/functions/v1/analyze-skin`
3. Maps JSON → skin report + personalized routine
4. Falls back to on-device heuristics if the request fails

## 4. Test locally

```bash
supabase functions serve analyze-skin --env-file supabase/.env.local
```

Create `supabase/.env.local`:

```
GEMINI_API_KEY=your_key
SUPABASE_ANON_KEY=your_anon_key
```

Point the app at local functions only for dev (optional): temporarily set `SUPABASE_URL` to your machine URL — normally use deployed functions.

## 5. AI chat advisor

The **AI Advisor** chat (`Home → Chat` or **Help & Support → Ask AI**) uses the same Gemini key via a second Edge Function:

```bash
supabase functions deploy skin-chat
```

When `GEMINI_ANALYSIS` is `"true"`, chat sends conversation history plus scan/quiz/routine context to `POST {SUPABASE_URL}/functions/v1/skin-chat`. If Gemini is unavailable, the app falls back to built-in tips.

## 6. Privacy

- Add consent copy in Privacy settings before production (face photos processed by Google Gemini).
- Images are not stored by the Edge Function after analysis.
- This is **wellness guidance**, not medical diagnosis.

## Model

Default: `gemini-2.5-flash` (see `supabase/functions/analyze-skin/schema.ts`).

To change model, update `GEMINI_MODEL` in the Edge Function and redeploy.
