import { useEffect, type ReactNode } from 'react';

import { useAuthStore } from '@/store/authStore';

type Props = {
  children: ReactNode;
};

/** Restores Supabase session and subscribes to auth state changes. */
export function AuthProvider({ children }: Props) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return children;
}
