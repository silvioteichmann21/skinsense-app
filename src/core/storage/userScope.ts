import { isSupabaseConfigured } from '@/config/env';
import { getSupabase } from '@/lib/supabase';

/** Local data for signed-out sessions (never merged with signed-in users). */
export const ANONYMOUS_USER_SCOPE = 'anonymous';

export async function getActiveUserScope(): Promise<string> {
  if (!isSupabaseConfigured()) return ANONYMOUS_USER_SCOPE;
  const { data } = await getSupabase().auth.getSession();
  return data.session?.user?.id ?? ANONYMOUS_USER_SCOPE;
}

export function storageKeyForUser(baseKey: string, userScope: string): string {
  return `${baseKey}:${userScope}`;
}
