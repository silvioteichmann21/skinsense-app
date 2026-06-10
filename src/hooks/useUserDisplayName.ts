import { useMemo } from 'react';

import { useAuthStore } from '@/store/authStore';

/**
 * Preferred greeting name from Supabase `profiles.display_name`,
 * with sensible fallbacks when display name is empty.
 */
export function useUserDisplayName(): string {
  const profile = useAuthStore((s) => s.profile);

  return useMemo(() => {
    const display = profile?.displayName?.trim();
    if (display) return display;

    const fullName = [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (fullName) return fullName;

    const first = profile?.firstName?.trim();
    if (first) return first;

    return '';
  }, [profile]);
}
