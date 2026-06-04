import { NextRequest, NextResponse } from 'next/server';

import { corsPreflightResponse, isAllowedWaitlistRequest } from '@/lib/cors';
import { getMissingWaitlistEnv, getWaitlistConfigError } from '@/lib/env';
import { getWaitlistSupabase } from '@/lib/supabase/waitlist-client';
import { waitlistBodySchema } from '@/lib/validation/waitlist';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(
  body: Record<string, unknown>,
  status: number,
  req: NextRequest,
): NextResponse {
  const res = NextResponse.json(body, { status });
  const origin = req.headers.get('origin');
  if (origin && isAllowedWaitlistRequest(req)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Vary', 'Origin');
  }
  return res;
}

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req);
}

/** Open /api/waitlist in browser to verify env on Vercel. */
export async function GET() {
  const missing = getMissingWaitlistEnv();
  let mode: string | null = null;
  if (missing.length === 0) {
    mode = getWaitlistSupabase().mode;
  }
  return NextResponse.json({
    ok: missing.length === 0,
    missing,
    mode,
    hint:
      missing.length > 0
        ? 'Add SUPABASE_SERVICE_ROLE_KEY in Vercel, or run migration 005_waitlist_anon_insert.sql for anon fallback.'
        : mode === 'anon'
          ? 'Using anon fallback. For production, set SUPABASE_SERVICE_ROLE_KEY in Vercel.'
          : undefined,
  });
}

export async function POST(req: NextRequest) {
  if (!isAllowedWaitlistRequest(req)) {
    return json({ error: 'forbidden' }, 403, req);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400, req);
  }

  const parsed = waitlistBodySchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'invalid_email' }, 400, req);
  }

  if (parsed.data.website) {
    return json({ ok: true }, 200, req);
  }

  const configError = getWaitlistConfigError();
  if (configError) {
    console.error('[waitlist] config:', configError);
    return json({ error: 'server_not_configured' }, 503, req);
  }

  const email = parsed.data.email.toLowerCase();
  const name = parsed.data.name ?? null;

  try {
    const { client, mode } = getWaitlistSupabase();
    const { error } = await client.from('waitlist_signups').insert({
      email,
      name,
      source: 'landing',
      locale: req.headers.get('accept-language')?.split(',')[0]?.slice(0, 12) ?? null,
      user_agent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
    });

    if (error) {
      if (error.code === '23505') {
        return json({ ok: true, duplicate: true }, 200, req);
      }
      console.error('[waitlist] insert failed', { mode, message: error.message, code: error.code });
      if (error.code === '42501' || error.message?.includes('policy')) {
        return json({ error: 'database_policy' }, 503, req);
      }
      return json({ error: 'server_error' }, 500, req);
    }

    return json({ ok: true }, 200, req);
  } catch (e) {
    console.error('[waitlist] unexpected', e);
    return json({ error: 'server_error' }, 500, req);
  }
}
