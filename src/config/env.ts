import Constants from 'expo-constants';

type ExtraRecord = Record<string, unknown>;

function getExtra(): ExtraRecord {
  const c = Constants as {
    expoConfig?: { extra?: ExtraRecord };
    manifest?: { extra?: ExtraRecord };
    manifest2?: { extra?: ExtraRecord };
  };
  return c.expoConfig?.extra ?? c.manifest2?.extra ?? c.manifest?.extra ?? {};
}

function readExtra(key: string): string | null {
  const raw = getExtra()[key];
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** API base URL without trailing slash; unset = fully local pipeline. */
export function getApiBaseUrl(): string | null {
  const url = readExtra('API_BASE_URL');
  return url?.replace(/\/$/, '') ?? null;
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}

export function getSupabaseUrl(): string | null {
  return readExtra('SUPABASE_URL');
}

export function getSupabaseAnonKey(): string | null {
  return readExtra('SUPABASE_ANON_KEY');
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
