import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

import type { RootStackParamList } from '@/core/navigation/types';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export type PaywallParams = {
  result?: SkinAnalysisResult;
  mode?: 'checkout' | 'manage';
};

export function usePremiumAccess() {
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const hydrated = useSubscriptionStore((s) => s.hydrated);
  const activePlanId = useSubscriptionStore((s) => s.activePlanId);

  return {
    isPremium,
    hydrated,
    activePlanId,
    hasAccess: isPremium,
  };
}

/** Navigate to paywall or run action when the user has Pro access. */
export function useRequirePremium() {
  const navigation = useNavigation<Nav>();
  const { isPremium, hydrated } = usePremiumAccess();

  const openPaywall = useCallback(
    (params?: PaywallParams) => {
      navigation.navigate('Paywall', params ?? { mode: 'checkout' });
    },
    [navigation],
  );

  const guardPremium = useCallback(
    (onAllowed: () => void, params?: PaywallParams) => {
      if (!hydrated) return;
      if (isPremium) {
        onAllowed();
        return;
      }
      openPaywall(params);
    },
    [hydrated, isPremium, openPaywall],
  );

  return { isPremium, hydrated, guardPremium, openPaywall };
}
