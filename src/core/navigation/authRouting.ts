import { getOnboardingComplete } from '@/core/storage/onboardingPreferences';

export type PostAuthRoute = { name: 'Main' } | { name: 'Welcome' };

export type SplashRoute = 'Welcome' | 'Main';

/** After sign-in: home for returning users, onboarding intro for new users. */
export async function resolvePostAuthRoute(): Promise<PostAuthRoute> {
  const onboardingComplete = await getOnboardingComplete();
  return onboardingComplete ? { name: 'Main' } : { name: 'Welcome' };
}

/** Splash: signed-out users always see Welcome; signed-in users follow onboarding state. */
export async function resolveSplashRoute(hasSession: boolean): Promise<SplashRoute> {
  if (!hasSession) return 'Welcome';
  const onboardingComplete = await getOnboardingComplete();
  return onboardingComplete ? 'Main' : 'Welcome';
}
