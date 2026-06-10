import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { resolvePostAuthRoute } from '@/core/navigation/authRouting';
import type { RootStackParamList } from '@/core/navigation/types';
import type { UserProfile } from '@/types/auth';

type AuthNav = NativeStackNavigationProp<RootStackParamList>;

export async function navigateAfterSignIn(
  navigation: AuthNav,
  profile?: UserProfile | null,
): Promise<void> {
  const route = await resolvePostAuthRoute(profile);
  if (route.name === 'SkinQuiz') {
    navigation.replace('SkinQuiz', route.params);
    return;
  }
  navigation.replace('Main');
}
