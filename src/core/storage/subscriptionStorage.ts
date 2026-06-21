import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = '@skinsense/premium';
const PLAN_KEY = '@skinsense/premium_plan';

export type StoredPlanId = 'weekly' | 'monthly' | 'quarterly';

export async function loadPremiumStatus(): Promise<{
  isPremium: boolean;
  planId: StoredPlanId | null;
}> {
  try {
    const [premiumRaw, planRaw] = await Promise.all([
      AsyncStorage.getItem(PREMIUM_KEY),
      AsyncStorage.getItem(PLAN_KEY),
    ]);
    const planId =
      planRaw === 'weekly' || planRaw === 'monthly' || planRaw === 'quarterly'
        ? planRaw
        : null;
    return { isPremium: premiumRaw === 'true', planId };
  } catch {
    return { isPremium: false, planId: null };
  }
}

export async function savePremiumStatus(
  isPremium: boolean,
  planId: StoredPlanId | null,
): Promise<void> {
  await AsyncStorage.multiSet([
    [PREMIUM_KEY, isPremium ? 'true' : 'false'],
    [PLAN_KEY, planId ?? ''],
  ]);
}
