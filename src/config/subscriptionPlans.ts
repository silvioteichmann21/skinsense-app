export type SubscriptionPlanId = 'weekly' | 'monthly' | 'quarterly';

/** App Store / Play Console product IDs — must match RevenueCat dashboard. */
export const REVENUECAT_PRODUCT_IDS: Record<SubscriptionPlanId, string> = {
  weekly: 'skinsense_weekly',
  monthly: 'skinsense_monthly',
  quarterly: 'skinsense_quarterly',
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
