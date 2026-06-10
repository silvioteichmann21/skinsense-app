import { getOnboardingComplete } from '@/core/storage/onboardingPreferences';
import type { UserProfile } from '@/types/auth';

export type PostAuthRoute =
  | { name: 'Main' }
  | { name: 'SkinQuiz'; params?: { displayName?: string } };

export type SplashRoute = 'Welcome' | 'Main';

function displayNameFromProfile(profile?: UserProfile | null): string | undefined {
  return profile?.firstName?.trim() || profile?.displayName?.trim() || undefined;
}

/** After sign-in: home for returning users, skin quiz onboarding for new users. */
export async function resolvePostAuthRoute(
  profile?: UserProfile | null,
): Promise<PostAuthRoute> {
  const onboardingComplete = await getOnboardingComplete();
  if (onboardingComplete) return { name: 'Main' };

  const displayName = displayNameFromProfile(profile);
  return displayName
    ? { name: 'SkinQuiz', params: { displayName } }
    : { name: 'SkinQuiz' };
}

/** Splash: signed-out users always see Welcome; signed-in users follow onboarding state. */
export async function resolveSplashRoute(hasSession: boolean): Promise<SplashRoute> {
  if (!hasSession) return 'Welcome';
  const onboardingComplete = await getOnboardingComplete();
  return onboardingComplete ? 'Main' : 'Welcome';
}
