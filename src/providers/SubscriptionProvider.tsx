import { useEffect, type ReactNode } from 'react';

import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

type Props = {
  children: ReactNode;
};

/** Configures RevenueCat once auth is ready and re-syncs on user change. */
export function SubscriptionProvider({ children }: Props) {
  const isAuthReady = useAuthStore((s) => s.isInitialized);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const initialize = useSubscriptionStore((s) => s.initialize);

  useEffect(() => {
    if (!isAuthReady) return;
    void initialize(userId);
  }, [isAuthReady, initialize, userId]);

  return children;
}
