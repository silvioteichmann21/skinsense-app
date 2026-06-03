import { readFileSync } from 'fs';
import { join } from 'path';

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

function readSupabaseUrl(): string | undefined {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    devSupabaseUrlFromAppJson()
  );
}

function readServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

/** Env vars missing on this deployment (for logs / health check). */
export function getMissingWaitlistEnv(): string[] {
  const missing: string[] = [];
  if (!readSupabaseUrl()) missing.push('SUPABASE_URL');
  if (!readServiceRoleKey()) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  return missing;
}

export function getSupabaseUrl(): string {
  const url = readSupabaseUrl();
  if (!url) {
    throw new Error(
      'SUPABASE_URL is not configured. Set it in Vercel → Project → Settings → Environment Variables (Production and Preview).',
    );
  }
  return url;
}

export function getSupabaseServiceRoleKey(): string {
  const key = readServiceRoleKey();
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. Set the service_role secret in Vercel env vars (not the anon key). Redeploy after saving.',
    );
  }
  return key;
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
