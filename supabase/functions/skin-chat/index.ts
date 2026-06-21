import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

import {
  GEMINI_MODEL,
  SYSTEM_PROMPT,
  buildContextBlock,
  type ChatTurn,
  type SkinChatRequest,
} from './schema.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MAX_HISTORY = 24;

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

function toGeminiContents(messages: ChatTurn[]): { role: string; parts: { text: string }[] }[] {
  return messages
    .filter((m) => m.text.trim().length > 0)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text.trim() }],
    }));
}

async function callGemini(body: SkinChatRequest): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const messages = body.messages?.slice(-MAX_HISTORY) ?? [];
  if (messages.length === 0 || messages[messages.length - 1]?.role !== 'user') {
    throw new Error('messages must end with a user turn');
  }

  const locale = body.locale ?? 'en';
  const contextBlock = buildContextBlock(body.context, locale);
  const systemText = `${SYSTEM_PROMPT}\n\n--- User profile ---\n${contextBlock}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 400)}`);
  }

  const payload = await res.json();
  const text =
    payload?.candidates?.[0]?.content?.parts?.[0]?.text ??
    payload?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text)
      .filter(Boolean)
      .join('\n');

  if (!text?.trim()) {
    throw new Error('Empty Gemini response');
  }

  return text.trim();
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
    const body = (await req.json()) as SkinChatRequest;

    if (!Array.isArray(body?.messages) || body.messages.length === 0) {
      return jsonResponse({ error: 'messages array is required' }, 400, origin);
    }

    const reply = await callGemini(body);

    return jsonResponse(
      {
        reply,
        modelVersion: GEMINI_MODEL,
      },
      200,
      origin,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Chat failed';
    console.error('[skin-chat]', message);
    return jsonResponse({ error: message }, 500, origin);
  }
});
