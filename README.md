# SkinSense

AI-powered skin analysis mobile app (React Native / Expo).

## Run locally

```bash
cd /Volumes/Data/SkinSense
npm install
npm start
```

### npm audit — important

**Do not run `npm audit fix --force` on this project.** It will downgrade `expo` (e.g. to v46) and break React Native compatibility.

Most reported vulnerabilities are in **Expo CLI / dev tooling** (`@expo/cli`, `xcode`, `uuid`), not in your shipped app. Expo’s team resolves these in SDK releases — stay on the pinned `expo@^54.x` versions in `package.json`. **Do not** use `npm audit fix --force` (it can downgrade Expo).

If dependencies get corrupted:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo install expo-asset expo-constants expo-file-system
```

App entry lives in `src/core/` (not `src/app/`) so Expo does not treat the project as Expo Router.

Press `i` for iOS simulator or scan the QR code with **Expo Go**.

`npm start` uses **Expo Go** (auth, scan, vision analysis). If Metro says “development build” and `i` fails, press **`s`** in the terminal to switch to Expo Go, or restart with `npm start`.

For **TFLite** (native model), install a dev build once, then use `npm run start:dev`:

```bash
npx expo run:ios    # installs com.skinsense.app on the simulator
npm run start:dev   # then press i
```

## Implementation status

| Screen | Status |
|--------|--------|
| **Splash** | ✅ Done |
| **Welcome** (3 slides) | ✅ Done |
| **Login** | ✅ Done |
| **Signup** | ✅ Done — review this next |
| Skin Quiz (5 steps + result) | ✅ Done |
| Scan Guide + Camera | ✅ Done |
| Analyzing (on-device vision + quiz + optional cloud refine) | ✅ Done |
| Personalized routine (scan + quiz driven steps) | ✅ Done |
| Skin Report + Concern Detail | ✅ Done |
| Routine Reveal | ✅ Done (Stitch design) |
| Home dashboard + tab bar | ✅ Done |
| Report Detail | ✅ Done |
| Camera (CAMERA-Ready) | ✅ Done |
| Routine tab + Step Detail | ✅ Done |
| Products + Product Detail | ✅ Done |
| Progress tab | ✅ Done |
| Profile (More tab) | ✅ Done |
| AI Chat | ✅ Done |
| Edit Profile | ✅ Done |
| My Skin Profile | ✅ Done |
| Ingredient Scan (camera + results) | ✅ Done |
| Privacy & Data | ✅ Done |
| Settings | ✅ Done |
| Compare Scans | ✅ Done |
| Language selection (full app i18n, 10 locales) | ✅ Done |
| Learn hub | Per `plan.md` (P1) |
| Other pages | Per `plan.md` |

Design source: `design/` (Stitch HTML + Botanical Precision tokens).

### Supabase auth (sign up / sign in)

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the project URL and **anon** public key.
3. Paste them into `app.json` → `expo.extra`:

   ```json
   "SUPABASE_URL": "https://xxxx.supabase.co",
   "SUPABASE_ANON_KEY": "eyJ..."
   ```

4. Run these in the Supabase **SQL Editor** (in order):
   - `supabase/migrations/001_profiles.sql` — account profile + signup trigger
   - `supabase/migrations/002_skin_onboarding.sql` — skin quiz answers from onboarding
   - `supabase/migrations/003_user_routines.sql` — personalized morning/evening step lists
5. In **Authentication → Providers**, enable **Email** (disable “Confirm email” for faster local testing, or keep it on and use the confirmation message in the app).
6. Restart Expo: `npm start --clear`.

Email/password auth is wired on **Login** and **Signup**. Splash routes signed-in users to **Main** or **Skin Quiz**; **Sign out** on Profile returns to **Welcome**.

### Scan pipeline

Photos stay on the device. Flow: **Camera** → crop face → **TFLite** (`skinsense-tflite-v1`, dev build) or **vision** fallback (`skinsense-vision-v1`, Expo Go) + quiz → report + routine.

### TFLite (more accurate scans)

Expo Go cannot load native TFLite — use a **development build**:

```bash
npx expo prebuild
npx expo run:ios   # or run:android
```

Model: `assets/models/skin_analysis_v1.tflite` (regenerate with `npm run generate:skin-model`). Swap in a clinically trained model before medical claims.

### Auth (sign up / sign in)

1. `app.config.js` must expose `SUPABASE_URL` and `SUPABASE_ANON_KEY` (from `app.json` extra).
2. Run SQL migrations `001` → `002` → `003` in Supabase.
3. For local testing: **Authentication → Providers → Email** → turn off **Confirm email**, or confirm via inbox before sign-in.
4. Password on sign-up: min 8 chars, **1 uppercase, 1 number**.

Set `expo.extra.API_BASE_URL` in `app.json` for optional cloud refine.

### Marketing site (Vercel)

Landing page + waitlist API live in `web/`. Deploy on Vercel with **Root Directory** = `web`.

1. Run `supabase/migrations/004_waitlist.sql` and `005_waitlist_anon_insert.sql` in the SQL Editor.
2. Set Vercel env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server-only; never `NEXT_PUBLIC_`).
3. See `web/README.md` for local dev and API details.
