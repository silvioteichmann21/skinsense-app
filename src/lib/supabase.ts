import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '@/config/env';

let client: SupabaseClient | null = null;

/** React Native fetch can fail silently on some networks; normalize headers for Supabase. */
async function supabaseFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  // Keep the caller's AbortSignal — do not replace it (breaks Supabase auth on mobile).
  return fetch(input, { ...init, headers });
}

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in app.json extra.');
  }
  if (!client) {
    client = createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        fetch: supabaseFetch,
      },
    });
  }
  return client;
}

/** Quick connectivity probe — useful before sign-in on device. */
export async function pingSupabase(): Promise<boolean> {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return false;
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      method: 'GET',
      headers: { apikey: key, 'Content-Type': 'application/json' },
    });
    if (res.status === 503) {
      const body = await res.text();
      if (body.includes('"code":"offline"') || body.includes('Offline')) {
        return false;
      }
    }
    return res.ok || res.status === 401;
  } catch {
    return false;
  }
}

/** Safe accessor for auth listener setup when keys may be missing in dev. */
export function getSupabaseOrNull(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return getSupabase();
}
