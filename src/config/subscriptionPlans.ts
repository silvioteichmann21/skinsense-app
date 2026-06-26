export type SubscriptionPlanId = 'weekly' | 'monthly' | 'quarterly';

/**
 * RevenueCat / store product identifiers.
 * Configure matching products in App Store Connect, Google Play, and RevenueCat dashboard.
 */
export const REVENUECAT_PRODUCT_IDS: Record<SubscriptionPlanId, string> = {
  weekly: 'weekly',
  monthly: 'monthly',
  quarterly: '3months',
};

/** Legacy product IDs (keep mapping for existing subscribers). */
export const LEGACY_REVENUECAT_PRODUCT_IDS: Record<string, SubscriptionPlanId> = {
  skinsense_weekly: 'weekly',
  skinsense_monthly: 'monthly',
  skinsense_quarterly: 'quarterly',
};

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  priceUsd: number;
  periodKey: 'paywall.periodWeekly' | 'paywall.periodMonthly' | 'paywall.periodQuarterly';
  badgeKey?: 'paywall.bestValue' | 'paywall.savePercent';
  savePercent?: number;
};

/** Display prices when RevenueCat offerings are unavailable (fallback UI). */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'weekly',
    priceUsd: 3.99,
    periodKey: 'paywall.periodWeekly',
  },
  {
    id: 'monthly',
    priceUsd: 8.99,
    periodKey: 'paywall.periodMonthly',
    badgeKey: 'paywall.bestValue',
  },
  {
    id: 'quarterly',
    priceUsd: 17.99,
    periodKey: 'paywall.periodQuarterly',
    badgeKey: 'paywall.savePercent',
    savePercent: 33,
  },
];

export function formatPlanPrice(usd: number): string {
  return `$${usd.toFixed(2)}`;
}
