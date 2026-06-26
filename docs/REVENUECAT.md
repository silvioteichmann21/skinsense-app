# RevenueCat subscriptions (SkinSense Pro)

SkinSense uses [RevenueCat](https://www.revenuecat.com/) with:

- `react-native-purchases` — SDK (configure, offerings, purchases, entitlements)
- `react-native-purchases-ui` — dashboard-designed **Paywall** + **Customer Center**

## Requirements

- **Development build** — purchases do **not** work in Expo Go. Use:
  ```bash
  npm install
  npx expo run:ios
  # or
  npx expo run:android
  npm run start:dev
  ```
- App Store Connect + Google Play subscription products
- RevenueCat project linked to both stores
- A paywall designed in RevenueCat **Paywalls** (for hosted UI)
- Customer Center enabled in RevenueCat **Customer Center** settings (for manage flow)

## 1. Install (npm)

Already in this repo:

```bash
npm install --save react-native-purchases react-native-purchases-ui
```

After adding or upgrading native modules, rebuild the dev client (`npx expo run:ios` / `run:android`).

Docs: [React Native installation](https://www.revenuecat.com/docs/getting-started/installation/reactnative)

## 2. App config

### Local (`app.json` → `expo.extra`)

```json
"REVENUECAT_ENTITLEMENT_ID": "SkinSense Pro",
"REVENUECAT_API_KEY": "test_xxxxxxxx",
"REVENUECAT_IOS_API_KEY": "test_xxxxxxxx",
"REVENUECAT_ANDROID_API_KEY": "test_xxxxxxxx"
```

- **Entitlement:** must match RevenueCat dashboard → Entitlements (`SkinSense Pro`).
- **API keys:** RevenueCat → **Project → API keys**. Use platform-specific keys in production (`appl_…` / `goog_…`). A shared `REVENUECAT_API_KEY` works for quick testing.
- **Test Store key** (`test_…`) works in development builds without live store products.

### EAS Build (production)

`app.config.js` reads env overrides:

| Variable | Purpose |
|----------|---------|
| `REVENUECAT_API_KEY` | Shared fallback |
| `REVENUECAT_IOS_API_KEY` | iOS public key |
| `REVENUECAT_ANDROID_API_KEY` | Android public key |
| `REVENUECAT_ENTITLEMENT_ID` | Entitlement identifier |

```bash
eas secret:create --name REVENUECAT_IOS_API_KEY --value appl_xxxx
eas secret:create --name REVENUECAT_ANDROID_API_KEY --value goog_xxxx
```

### Dev / Expo Go

If keys are **empty**, the app uses **dev mock mode** (`__DEV__` only): custom paywall unlocks locally for UI testing. Production builds without keys **cannot** fake unlock.

## 3. Store product IDs

Must match `src/config/subscriptionPlans.ts`:

| Plan | Product ID | Package type |
|------|------------|--------------|
| Weekly | `weekly` | `$rc_weekly` / WEEKLY |
| Monthly | `monthly` | `$rc_monthly` / MONTHLY |
| 3 months | `3months` | `$rc_three_month` / THREE_MONTH |

Legacy IDs (`skinsense_weekly`, etc.) remain mapped for existing subscribers.

Create products in **App Store Connect** and **Google Play Console**, attach in RevenueCat, then add to your **Current** offering.

## 4. RevenueCat dashboard setup

1. **Entitlement:** create `SkinSense Pro` and attach all subscription products.
2. **Products:** `weekly`, `monthly`, `3months` (linked to store products).
3. **Offering:** e.g. `default` — mark as **Current**.
4. **Packages** in the offering:
   - Weekly → `weekly`
   - Monthly → `monthly`
   - 3 month → `3months`
5. **Paywall:** design in Paywall Builder and attach to the offering.
6. **Customer Center:** configure manage/cancel/restore options (used on Profile → Subscription).

## 5. How the app uses RevenueCat

### Initialization (`SubscriptionProvider`)

On auth ready:

1. `Purchases.configure({ apiKey, appUserID })` — ties purchases to Supabase user when signed in.
2. `getCustomerInfo()` — syncs **SkinSense Pro** entitlement into local state.
3. `getOfferings()` — loads packages for programmatic purchase fallback.
4. `addCustomerInfoUpdateListener` — live updates after purchase, restore, or renewal.

### Entitlement checking

Primary entitlement: **`SkinSense Pro`** (`REVENUECAT_ENTITLEMENT_ID`).

Code also checks aliases `pro` and `premium` for backward compatibility.

```typescript
import { syncPremiumFromCustomerInfo } from '@/services/subscription/revenueCat';

const { isPremium, planId } = syncPremiumFromCustomerInfo(customerInfo);
```

Hooks:

- `usePremiumAccess()` — `isPremium`, `hydrated`, `openPaywall()`, `guardPremium()`
- `useRequirePremium()` — redirects to paywall when not Pro

### Paywall (hosted UI)

When RevenueCat is configured (not mock mode):

- **Checkout** → `RevenueCatUI.Paywall` (dashboard design) + optional scan teaser above.
- **After scan** → close button hidden so users cannot bypass without subscribing.
- **Manage** → `RevenueCatUI.CustomerCenterView` (restore, change plan, cancel, refunds on iOS).

Programmatic modal helpers in `src/services/subscription/revenueCatUI.ts`:

```typescript
import {
  presentRevenueCatPaywall,
  presentRevenueCatPaywallIfNeeded,
  presentRevenueCatCustomerCenter,
} from '@/services/subscription/revenueCatUI';

// Show paywall modally
const result = await presentRevenueCatPaywall({ displayCloseButton: true });

// Only if SkinSense Pro is inactive
await presentRevenueCatPaywallIfNeeded({ displayCloseButton: true });

// Modal Customer Center
await presentRevenueCatCustomerCenter({
  callbacks: {
    onRestoreCompleted: ({ customerInfo }) => { /* sync state */ },
  },
});
```

### Customer info & purchases

| Action | API |
|--------|-----|
| Get customer | `Purchases.getCustomerInfo()` |
| Purchase package | `Purchases.purchasePackage(pkg)` |
| Restore | `Purchases.restorePurchases()` |
| Offerings | `Purchases.getOfferings()` |

Store wrapper: `src/store/subscriptionStore.ts` (`purchasePlan`, `restorePurchases`, `syncFromCustomerInfo`).

Errors: user cancel is silent; other errors show an alert via `formatPurchasesError()`.

## 6. App flow

| Step | Behavior |
|------|----------|
| After scan | Free → **RevenueCat Paywall** (teaser) → purchase → **Full report** |
| Profile | **Upgrade to Pro** / **Subscription** → paywall or Customer Center |
| Scan history | Paywall if not Pro |
| AI Chat | Pro only |
| Restore | Paywall or Customer Center |
| Sign out | Clears local premium cache; RevenueCat `logOut` on user switch |

## 7. Code map

| File | Role |
|------|------|
| `src/services/subscription/revenueCat.ts` | Configure SDK, offerings, purchase, restore, entitlement sync |
| `src/services/subscription/revenueCatUI.ts` | Hosted paywall + Customer Center helpers |
| `src/store/subscriptionStore.ts` | Premium state, purchase/restore, user switch reset |
| `src/providers/SubscriptionProvider.tsx` | Init on login + live entitlement listener |
| `src/hooks/usePremiumAccess.ts` | Premium gate helper |
| `src/screens/subscription/PaywallScreen.tsx` | RC Paywall / Customer Center / dev mock UI |
| `src/config/subscriptionPlans.ts` | Product IDs |
| `src/config/env.ts` | API keys + entitlement config |

## 8. Best practices

- **Never unlock premium without an active entitlement** in production builds.
- **Identify users** with your auth ID so subscriptions survive reinstall (`Purchases.logIn`).
- **Listen for CustomerInfo updates** — renewals, refunds, and family sharing can change access outside your app.
- **Use RevenueCat Paywalls** for pricing copy and A/B tests without app releases.
- **Use Customer Center** for self-serve manage/cancel instead of deep-linking to the store when possible.
- **Test restore** on a second device and after sign-out/sign-in.
- **Replace test API keys** with production `appl_` / `goog_` keys before App Store / Play release.

## 9. Production checklist

- [ ] Create store products + RevenueCat offering (Current)
- [ ] Entitlement `SkinSense Pro` attached to all products
- [ ] Paywall designed and linked to offering
- [ ] Customer Center configured
- [ ] Production API keys in EAS secrets
- [ ] Build with `expo run:ios` / EAS — not Expo Go
- [ ] Sandbox purchase (iOS) / license tester (Android)
- [ ] Restore purchases on second device
- [ ] Sign-out → sign-in (no premium leak between users)
- [ ] Privacy policy mentions auto-renewing subscriptions

## 10. Test accounts

- **iOS:** Sandbox tester in App Store Connect
- **Android:** License testers in Play Console
- **RevenueCat:** **Customers** tab to verify transactions and entitlements

## 11. Dashboard: Test Store / sandbox data

If purchases succeed in-app but **Overview shows 0 Customers / 0 Active Subscribers**:

1. **Enable “View sandbox data”** — toggle below Overview metrics (includes Test Store purchases).
2. **Search by App User ID** — Customer lists are cached (~1 hour). Search directly, e.g. your Supabase user UUID. This is real-time.
3. **Check Recent Transactions** — updates faster than the customer list.
4. **Confirm project** — API key in `app.json` must match the RevenueCat project you are viewing.

Dev logs (`__DEV__` only) use prefix `[RevenueCat]` for init, offerings, purchase result, and `entitlements.active["SkinSense Pro"]`.

Example successful purchase logs:

```
[RevenueCat] SDK initialization { configured: true, appUserId: "19f12028-...", apiKeyPrefix: "test_GqJLMiBCph…" }
[RevenueCat] Offerings { currentIdentifier: "default", packageCount: 3, packages: [...] }
[RevenueCat] Purchase started { planId: "weekly", productId: "weekly" }
[RevenueCat] Purchase result { skinSenseProActive: true, skinSenseProProductId: "weekly" }
[RevenueCat] CustomerInfo (listener) { entitlements.active["SkinSense Pro"]: { isActive: true, ... } }
```
