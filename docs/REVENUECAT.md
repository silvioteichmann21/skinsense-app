# RevenueCat subscriptions

SkinSense uses [RevenueCat](https://www.revenuecat.com/) with `react-native-purchases` for weekly, monthly, and 3‑month plans.

## Requirements

- **Development build** — purchases do not work in Expo Go. Use:
  ```bash
  npx expo run:ios
  npm run start:dev
  ```
- App Store Connect + Google Play subscription products
- RevenueCat project linked to both stores

## 1. App config (`app.json` → `expo.extra`)

```json
"REVENUECAT_ENTITLEMENT_ID": "pro",
"REVENUECAT_IOS_API_KEY": "appl_xxxxxxxx",
"REVENUECAT_ANDROID_API_KEY": "goog_xxxxxxxx"
```

Keys are in RevenueCat → **Project → API keys** (public app-specific keys).

If keys are empty, the paywall falls back to **local mock unlock** (for UI testing only).

## 2. Store product IDs

Must match `src/config/subscriptionPlans.ts`:

| Plan     | Product ID           |
|----------|----------------------|
| Weekly   | `skinsense_weekly`   |
| Monthly  | `skinsense_monthly`  |
| 3 months | `skinsense_quarterly`|

Create these in **App Store Connect** and **Google Play Console**, then attach them in RevenueCat.

## 3. RevenueCat dashboard

1. Create entitlement: **`pro`** (or match `REVENUECAT_ENTITLEMENT_ID`)
2. Create products using the IDs above
3. Create an **Offering** (e.g. `default`) marked as **Current**
4. Add packages to the offering:
   - **Weekly** → `skinsense_weekly`
   - **Monthly** → `skinsense_monthly`
   - **3 month** → `skinsense_quarterly`

RevenueCat maps package types (`WEEKLY`, `MONTHLY`, `THREE_MONTH`) to the app plans automatically.

## 4. Test

- iOS: Sandbox tester in App Store Connect
- Android: License testers in Play Console
- RevenueCat → **Customers** to verify purchases

## 5. Code map

| File | Role |
|------|------|
| `src/services/subscription/revenueCat.ts` | SDK configure, offerings, purchase, restore |
| `src/store/subscriptionStore.ts` | Premium state + `purchasePlan()` |
| `src/providers/SubscriptionProvider.tsx` | Init on login, sync with Supabase user ID |
| `src/screens/subscription/PaywallScreen.tsx` | Paywall UI + store prices |

Purchases are tied to the **Supabase user ID** when signed in (`Purchases.logIn`).

## 6. Production checklist

- [ ] Replace empty API keys in `app.json` (or use EAS secrets + `app.config.js`)
- [ ] Submit subscriptions for review in App Store / Play
- [ ] Test restore purchases on a second device
- [ ] Privacy policy mentions auto-renewing subscriptions
