import { useEffect, type ReactNode } from 'react';

import {
  addRevenueCatCustomerInfoListener,
  isRevenueCatReady,
} from '@/services/subscription/revenueCat';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

type Props = {
  children: ReactNode;
};

/** Configures RevenueCat when auth is ready, syncs entitlement updates live. */
export function SubscriptionProvider({ children }: Props) {
  const isAuthReady = useAuthStore((s) => s.isInitialized);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const initialize = useSubscriptionStore((s) => s.initialize);
  const syncFromCustomerInfo = useSubscriptionStore((s) => s.syncFromCustomerInfo);
  const revenueCatEnabled = useSubscriptionStore((s) => s.revenueCatEnabled);

  useEffect(() => {
    if (!isAuthReady) return;
    void initialize(userId);
  }, [isAuthReady, initialize, userId]);

  useEffect(() => {
    if (!revenueCatEnabled || !isRevenueCatReady()) return;

    const remove = addRevenueCatCustomerInfoListener((info) => {
      void syncFromCustomerInfo(info);
    });

    return remove;
  }, [revenueCatEnabled, syncFromCustomerInfo]);

  return children;
}
