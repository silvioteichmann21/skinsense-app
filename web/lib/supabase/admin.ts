import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { readServiceRoleKey, readSupabaseUrl } from '@/lib/env';

let admin: SupabaseClient | null = null;

/** Server-only Supabase client (service role). Never import in client components. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!admin) {
    const key = readServiceRoleKey();
    if (!key) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }
    admin = createClient(readSupabaseUrl(), key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return admin;
}
