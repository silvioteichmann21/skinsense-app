import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import {
  readServiceRoleKey,
  readSupabaseAnonKey,
  readSupabaseUrl,
} from '@/lib/env';

export type WaitlistClientMode = 'service_role' | 'anon';

let cached: { client: SupabaseClient; mode: WaitlistClientMode } | null = null;

/**
 * Prefer service role (Vercel env). Fall back to anon key + RLS insert policy (migration 005).
 */
export function getWaitlistSupabase(): {
  client: SupabaseClient;
  mode: WaitlistClientMode;
} {
  if (cached) return cached;

  const url = readSupabaseUrl();
  const serviceKey = readServiceRoleKey();

  if (serviceKey) {
    cached = {
      mode: 'service_role',
      client: createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      }),
    };
    return cached;
  }

  cached = {
    mode: 'anon',
    client: createClient(url, readSupabaseAnonKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    }),
  };
  return cached;
}
