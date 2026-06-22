import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

import {
  buildPortraitPrompt,
  GEMINI_IMAGE_MODEL,
  type EnhancePortraitRequest,
} from './schema.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

function corsHeaders(origin: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-app-version, x-platform',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function jsonResponse(body: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      'Content-Type': 'application/json',
    },
  });
}

function extractImageBase64(payload: unknown): string | null {
  const parts =
    (payload as { candidates?: { content?: { parts?: unknown[] } }[] })?.candidates?.[0]?.content
      ?.parts ?? [];

  for (const part of parts) {
    const p = part as {
      inlineData?: { data?: string; mimeType?: string };
      inline_data?: { data?: string; mime_type?: string };
    };
    const data = p.inlineData?.data ?? p.inline_data?.data;
    if (data) return data.replace(/^data:image\/\w+;base64,/, '');
  }
  return null;
}

function buildPrompt(body: EnhancePortraitRequest): string {
  return buildPortraitPrompt(body);
}

async function callGeminiPortrait(body: EnhancePortraitRequest): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const b64 = body.image.replace(/^data:image\/\w+;base64,/, '');
  if (!b64) {
    throw new Error('image is required');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: b64,
                },
              },
              { text: buildPrompt(body) },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 400)}`);
  }

  const payload = await res.json();
  const image = extractImageBase64(payload);
  if (!image) {
    throw new Error('Gemini did not return an enhanced image');
  }

  return image;
}

serve(async (req) => {
  const origin = req.headers.get('Origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, origin);
  }

  try {
    const body = (await req.json()) as EnhancePortraitRequest;

    if (!body?.image) {
      return jsonResponse({ error: 'image is required' }, 400, origin);
    }

    const image = await callGeminiPortrait(body);

    return jsonResponse(
      {
        image,
        modelVersion: GEMINI_IMAGE_MODEL,
      },
      200,
      origin,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Portrait enhancement failed';
    console.error('[enhance-portrait]', message);
    return jsonResponse({ error: message }, 500, origin);
  }
});
