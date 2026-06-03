import { NextRequest, NextResponse } from 'next/server';

import { getAllowedOrigins } from '@/lib/env';

function normalizeOrigin(origin: string): string {
  try {
    return new URL(origin).origin;
  } catch {
    return origin;
  }
}

/** Allow same-origin requests; optionally allow listed production origins. */
export function isAllowedWaitlistRequest(req: NextRequest): boolean {
  const allowed = getAllowedOrigins();
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  if (!origin) {
    return true;
  }

  const originNorm = normalizeOrigin(origin);

  if (host) {
    const proto = req.headers.get('x-forwarded-proto') ?? 'https';
    const self = normalizeOrigin(`${proto}://${host}`);
    if (originNorm === self) return true;
  }

  if (allowed.length === 0) {
    return true;
  }

  return allowed.some((o) => normalizeOrigin(o) === originNorm);
}

export function corsPreflightResponse(req: NextRequest): NextResponse {
  const origin = req.headers.get('origin');
  const headers = new Headers();

  if (origin && isAllowedWaitlistRequest(req)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Vary', 'Origin');
  }

  return new NextResponse(null, { status: 204, headers });
}
