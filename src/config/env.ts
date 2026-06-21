import Constants from 'expo-constants';
import { Platform } from 'react-native';

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

/** When true, scan pipeline uses Supabase Edge Function + Gemini instead of local heuristics. */
export function isGeminiAnalysisEnabled(): boolean {
  const flag = readExtra('GEMINI_ANALYSIS');
  return flag === 'true' || flag === '1';
}

export function getGeminiAnalyzeUrl(): string | null {
  const base = getSupabaseUrl();
  if (!base || !isGeminiAnalysisEnabled()) return null;
  return `${base.replace(/\/$/, '')}/functions/v1/analyze-skin`;
}

export function getGeminiChatUrl(): string | null {
  const base = getSupabaseUrl();
  if (!base || !isGeminiAnalysisEnabled()) return null;
  return `${base.replace(/\/$/, '')}/functions/v1/skin-chat`;
}

/** RevenueCat entitlement identifier (dashboard → Entitlements). */
export function getRevenueCatEntitlementId(): string {
  return readExtra('REVENUECAT_ENTITLEMENT_ID') ?? 'pro';
}

export function getRevenueCatIosApiKey(): string | null {
  return readExtra('REVENUECAT_IOS_API_KEY');
}

export function getRevenueCatAndroidApiKey(): string | null {
  return readExtra('REVENUECAT_ANDROID_API_KEY');
}

export function getRevenueCatApiKey(): string | null {
  if (Platform.OS === 'ios') return getRevenueCatIosApiKey();
  if (Platform.OS === 'android') return getRevenueCatAndroidApiKey();
  return getRevenueCatIosApiKey() ?? getRevenueCatAndroidApiKey();
}

export function isRevenueCatConfigured(): boolean {
  return Boolean(getRevenueCatApiKey());
}
