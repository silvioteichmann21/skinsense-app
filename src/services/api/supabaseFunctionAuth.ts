import { getSupabaseAnonKey } from '@/config/env';
import { getSupabaseOrNull } from '@/lib/supabase';

export async function getSupabaseFunctionHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-App-Version': '1.0.0',
    'X-Platform': 'mobile',
  };

  const anonKey = getSupabaseAnonKey();
  if (anonKey) {
    headers.apikey = anonKey;
  }

  const client = getSupabaseOrNull();
  if (client) {
    const { data } = await client.auth.getSession();
    if (data.session?.access_token) {
      headers.Authorization = `Bearer ${data.session.access_token}`;
    } else if (anonKey) {
      headers.Authorization = `Bearer ${anonKey}`;
    }
  } else if (anonKey) {
    headers.Authorization = `Bearer ${anonKey}`;
  }

  return headers;
}
