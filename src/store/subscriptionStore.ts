import { create } from 'zustand';

import type { SubscriptionPlanId } from '@/config/subscriptionPlans';
import { allowMockSubscriptions, isRevenueCatConfigured } from '@/config/env';
import {
  clearPremiumStatus,
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
import type { CustomerInfo } from 'react-native-purchases';

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
  syncFromCustomerInfo: (customerInfo: CustomerInfo) => Promise<void>;
  resetForUserSwitch: () => Promise<void>;
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
    if (!appUserId) {
      await get().resetForUserSwitch();
    }

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
        const { customerInfo, planId: purchasedPlanId, isPremium } =
          await purchaseRevenueCatPackage(pkg, planId);

        if (!isPremium) {
          throw new SubscriptionPurchaseError(
            'Purchase completed but SkinSense Pro is not active. Check entitlement mapping in RevenueCat.',
          );
        }

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

    if (allowMockSubscriptions()) {
      await applyPremiumState(true, planId);
      return;
    }

    throw new SubscriptionPurchaseError(
      'Subscriptions are not available on this build. Use a development build with RevenueCat configured.',
    );
  },

  restorePurchases: async () => {
    if (isRevenueCatReady()) {
      const restored = await restoreRevenueCatPurchases();
      await applyPremiumState(restored.isPremium, restored.planId);
      return restored.isPremium;
    }

    if (allowMockSubscriptions()) {
      const stored = await loadPremiumStatus();
      if (stored.isPremium) {
        set({
          isPremium: true,
          activePlanId: stored.planId,
          hydrated: true,
        });
        return true;
      }
    }

    return false;
  },

  syncFromCustomerInfo: async (customerInfo) => {
    const synced = syncPremiumFromCustomerInfo(customerInfo);
    await applyPremiumState(synced.isPremium, synced.planId);
  },

  resetForUserSwitch: async () => {
    await clearPremiumStatus();
    set({
      isPremium: false,
      activePlanId: null,
      hydrated: false,
      packages: {},
      priceLabels: {},
      offeringsLoaded: false,
    });
  },
}));
