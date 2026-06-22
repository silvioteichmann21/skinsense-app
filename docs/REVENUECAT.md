# RevenueCat subscriptions

SkinSense Pro uses [RevenueCat](https://www.revenuecat.com/) with `react-native-purchases` for weekly, monthly, and 3‑month plans.

## Requirements

- **Development build** — purchases do **not** work in Expo Go. Use:
  ```bash
  npx expo run:ios
  # or
  npx expo run:android
  npm run start:dev
  ```
- App Store Connect + Google Play subscription products
- RevenueCat project linked to both stores

## 1. App config

### Local (`app.json` → `expo.extra`)

```json
"REVENUECAT_ENTITLEMENT_ID": "pro",
"REVENUECAT_IOS_API_KEY": "appl_xxxxxxxx",
"REVENUECAT_ANDROID_API_KEY": "goog_xxxxxxxx"
```

Keys are in RevenueCat → **Project → API keys** (public app-specific keys, not secret keys).

### EAS Build (recommended for production)

Set secrets in EAS — `app.config.js` reads:

- `REVENUECAT_IOS_API_KEY`
- `REVENUECAT_ANDROID_API_KEY`
- `REVENUECAT_ENTITLEMENT_ID` (optional, defaults to `pro`)

```bash
eas secret:create --name REVENUECAT_IOS_API_KEY --value appl_xxxx
eas secret:create --name REVENUECAT_ANDROID_API_KEY --value goog_xxxx
```

### Dev / Expo Go

If keys are **empty**, the app runs in **dev mock mode** (`__DEV__` only): paywall unlocks locally for UI testing. **Production builds without keys will show an error** instead of fake unlock.

## 2. Store product IDs

Must match `src/config/subscriptionPlans.ts`:

| Plan     | Product ID           | Fallback price |
|----------|----------------------|----------------|
| Weekly   | `skinsense_weekly`   | $3.99          |
| Monthly  | `skinsense_monthly`  | $8.99          |
| 3 months | `skinsense_quarterly`| $17.99         |

Create these in **App Store Connect** and **Google Play Console**, then attach them in RevenueCat.

## 3. RevenueCat dashboard

1. Create entitlement: **`pro`** (or match `REVENUECAT_ENTITLEMENT_ID`)
2. Create products using the IDs above
3. Create an **Offering** (e.g. `default`) marked as **Current**
4. Add packages to the offering:
   - **Weekly** → `skinsense_weekly`
   - **Monthly** → `skinsense_monthly`
   - **3 month** → `skinsense_quarterly`

RevenueCat maps package types (`WEEKLY`, `MONTHLY`, `THREE_MONTH`) to app plans automatically.

## 4. App flow

| Step | Behavior |
|------|----------|
| After scan | Free → **Paywall** (teaser) → purchase → **Full report** |
| Profile | **Upgrade to Pro** / **Subscription** → paywall |
| Scan history | Opens paywall if not Pro |
| AI Chat | Pro only |
| Restore | Paywall → **Restore purchases** |
| Manage | Profile → Subscription → change plan or **Manage in App Store / Play** |

Purchases are tied to the **Supabase user ID** when signed in (`Purchases.logIn`).

## 5. Code map

| File | Role |
|------|------|
| `src/services/subscription/revenueCat.ts` | SDK configure, offerings, purchase, restore, management URL |
| `src/store/subscriptionStore.ts` | Premium state, purchase/restore, user switch reset |
| `src/providers/SubscriptionProvider.tsx` | Init on login + live entitlement listener |
| `src/hooks/usePremiumAccess.ts` | `useRequirePremium()` gate helper |
| `src/screens/subscription/PaywallScreen.tsx` | Paywall UI, Terms/Privacy links |
| `src/screens/scan/AnalyzingScreen.tsx` | Routes to paywall after first scan |

## 6. Production checklist

- [ ] Add RevenueCat API keys (`app.json` or EAS secrets)
- [ ] Create store products + RevenueCat offering (Current)
- [ ] Build with `expo run:ios` / EAS — not Expo Go
- [ ] Test sandbox purchase (iOS) / license tester (Android)
- [ ] Test **Restore purchases** on a second device
- [ ] Test sign-out → sign-in (premium should not leak between users)
- [ ] Privacy policy mentions auto-renewing subscriptions (`https://skinsense.app/privacy`)

## 7. Test accounts

- **iOS:** Sandbox tester in App Store Connect
- **Android:** License testers in Play Console
- **RevenueCat:** **Customers** tab to verify transactions
