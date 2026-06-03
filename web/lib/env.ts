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

export function getSupabaseUrl(): string {
  const url =
    process.env.SUPABASE_URL?.trim() ?? devSupabaseUrlFromAppJson();
  if (!url) {
    throw new Error(
      'SUPABASE_URL is not configured. Add it to web/.env.local (see web/.env.example).',
    );
  }
  return url;
}

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. Add the service_role secret to web/.env.local (Supabase → Settings → API). Never use the anon key.',
    );
  }
  return key;
}

/** Returns a short reason when waitlist API cannot run, or null if configured. */
export function getWaitlistConfigError(): string | null {
  try {
    getSupabaseUrl();
    getSupabaseServiceRoleKey();
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : 'Waitlist is not configured';
  }
}

export function getAllowedOrigins(): string[] {
  const raw = process.env.WAITLIST_ALLOWED_ORIGINS?.trim();
  if (!raw) return [];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}
