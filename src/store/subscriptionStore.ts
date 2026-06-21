import { create } from 'zustand';

import type { SubscriptionPlanId } from '@/config/subscriptionPlans';
import { isRevenueCatConfigured } from '@/config/env';
import {
  loadPremiumStatus,
  savePremiumStatus,
  type StoredPlanId,
} from '@/core/storage/subscriptionStorage';
import {
  configureRevenueCat,
  fetchRevenueCatOfferings,
  getRevenueCatCustomerInfo,
  isRevenueCatReady,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  syncPremiumFromCustomerInfo,
  type PlanPackages,
  type PlanPriceLabels,
} from '@/services/subscription/revenueCat';

export class SubscriptionPurchaseError extends Error {
  readonly userCancelled: boolean;

  constructor(message: string, userCancelled = false) {
    super(message);
    this.name = 'SubscriptionPurchaseError';
    this.userCancelled = userCancelled;
  }
}

type SubscriptionStore = {
  isPremium: boolean;
  activePlanId: SubscriptionPlanId | null;
  hydrated: boolean;
  revenueCatEnabled: boolean;
  packages: PlanPackages;
  priceLabels: PlanPriceLabels;
  offeringsLoaded: boolean;
  initialize: (appUserId?: string | null) => Promise<void>;
  hydrate: () => Promise<void>;
  loadOfferings: () => Promise<void>;
  purchasePlan: (planId: SubscriptionPlanId) => Promise<void>;
  restorePurchases: () => Promise<boolean>;
};

async function applyPremiumState(
  isPremium: boolean,
  planId: SubscriptionPlanId | null,
): Promise<void> {
  await savePremiumStatus(isPremium, planId as StoredPlanId | null);
  useSubscriptionStore.setState({
    isPremium,
    activePlanId: planId,
    hydrated: true,
  });
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  isPremium: false,
  activePlanId: null,
  hydrated: false,
  revenueCatEnabled: isRevenueCatConfigured(),
  packages: {},
  priceLabels: {},
  offeringsLoaded: false,

  initialize: async (appUserId) => {
    const rcConfigured = await configureRevenueCat(appUserId);
    set({ revenueCatEnabled: rcConfigured });

    if (rcConfigured) {
      try {
        const customerInfo = await getRevenueCatCustomerInfo();
        if (customerInfo) {
          const synced = syncPremiumFromCustomerInfo(customerInfo);
          await applyPremiumState(synced.isPremium, synced.planId);
        } else {
          await get().hydrate();
        }
        await get().loadOfferings();
      } catch (e) {
        if (__DEV__) console.warn('[subscription] RevenueCat init failed:', e);
        await get().hydrate();
      }
      return;
    }

    await get().hydrate();
  },

  hydrate: async () => {
    const stored = await loadPremiumStatus();
    set({
      isPremium: stored.isPremium,
      activePlanId: stored.planId,
      hydrated: true,
    });
  },

  loadOfferings: async () => {
    if (!isRevenueCatReady()) {
      set({ offeringsLoaded: true });
      return;
    }

    try {
      const { packages, priceLabels } = await fetchRevenueCatOfferings();
      set({ packages, priceLabels, offeringsLoaded: true });
    } catch (e) {
      if (__DEV__) console.warn('[subscription] Failed to load offerings:', e);
      set({ offeringsLoaded: true });
    }
  },

  purchasePlan: async (planId) => {
    if (isRevenueCatReady()) {
      const pkg = get().packages[planId];
      if (!pkg) {
        throw new SubscriptionPurchaseError('Subscription plan is not available right now.');
      }

      try {
        const { planId: purchasedPlanId } = await purchaseRevenueCatPackage(pkg);
        await applyPremiumState(true, purchasedPlanId ?? planId);
        return;
      } catch (e: unknown) {
        const err = e as { userCancelled?: boolean; message?: string };
        if (err?.userCancelled) {
          throw new SubscriptionPurchaseError('Purchase cancelled.', true);
        }
        throw new SubscriptionPurchaseError(
          err?.message ?? 'Purchase failed. Please try again.',
        );
      }
    }

    await applyPremiumState(true, planId);
  },

  restorePurchases: async () => {
    if (isRevenueCatReady()) {
      const restored = await restoreRevenueCatPurchases();
      await applyPremiumState(restored.isPremium, restored.planId);
      return restored.isPremium;
    }

    const stored = await loadPremiumStatus();
    if (stored.isPremium) {
      set({
        isPremium: true,
        activePlanId: stored.planId,
        hydrated: true,
      });
      return true;
    }
    return false;
  },
}));
