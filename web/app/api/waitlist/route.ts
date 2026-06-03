import { NextRequest, NextResponse } from 'next/server';

import { corsPreflightResponse, isAllowedWaitlistRequest } from '@/lib/cors';
import { getWaitlistConfigError } from '@/lib/env';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { waitlistBodySchema } from '@/lib/validation/waitlist';

export const runtime = 'nodejs';

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
    const { error } = await getSupabaseAdmin().from('waitlist_signups').insert({
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
      console.error('[waitlist] insert failed', error.message);
      return json({ error: 'server_error' }, 500, req);
    }

    return json({ ok: true }, 200, req);
  } catch (e) {
    console.error('[waitlist] unexpected', e);
    return json({ error: 'server_error' }, 500, req);
  }
}
