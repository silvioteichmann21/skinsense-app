import { readFileSync } from 'fs';
import { join } from 'path';

import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from '@/lib/supabase/public-config';

/** Dev-only: reuse mobile app Supabase URL when web/.env.local omits SUPABASE_URL */
function devSupabaseUrlFromAppJson(): string | undefined {
  if (process.env.NODE_ENV === 'production') return undefined;
  try {
    const appJsonPath = join(process.cwd(), '..', 'app.json');
    const raw = readFileSync(appJsonPath, 'utf8');
    const extra = JSON.parse(raw)?.expo?.extra as { SUPABASE_URL?: string } | undefined;
    return extra?.SUPABASE_URL?.trim();
  } catch {
    return undefined;
  }
}

export function readSupabaseUrl(): string {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    devSupabaseUrlFromAppJson() ||
    PUBLIC_SUPABASE_URL
  );
}

export function readSupabaseAnonKey(): string {
  return (
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    PUBLIC_SUPABASE_ANON_KEY
  );
}

export function readServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

export function getSupabaseUrl(): string {
  return readSupabaseUrl();
}

export function getSupabaseServiceRoleKey(): string {
  const key = readServiceRoleKey();
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }
  return key;
}

/** Env vars still missing after built-in public fallbacks. */
export function getMissingWaitlistEnv(): string[] {
  const missing: string[] = [];
  if (!readSupabaseUrl()) missing.push('SUPABASE_URL');
  if (!readServiceRoleKey() && !readSupabaseAnonKey()) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  }
  return missing;
}

export function getWaitlistConfigError(): string | null {
  const missing = getMissingWaitlistEnv();
  if (missing.length === 0) return null;
  return `Missing: ${missing.join(', ')}`;
}

export function getAllowedOrigins(): string[] {
  const raw = process.env.WAITLIST_ALLOWED_ORIGINS?.trim();
  if (!raw) return [];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}
