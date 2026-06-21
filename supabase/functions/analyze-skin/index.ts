import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

import {
  GEMINI_MODEL,
  RESPONSE_SCHEMA,
  SYSTEM_PROMPT,
  type AnalyzeSkinRequest,
  type GeminiAnalysisRaw,
} from './schema.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const ALLOWED_STEP_IDS = new Set([
  'am-1',
  'am-2',
  'am-3',
  'am-3b',
  'am-4',
  'am-5',
  'am-6',
  'pm-1',
  'pm-2',
  'pm-3',
  'pm-4',
  'pm-5',
]);

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

function sanitizeRoutine(raw: GeminiAnalysisRaw['routine']): GeminiAnalysisRaw['routine'] {
  const filterSteps = (ids: string[]) =>
    ids.filter((id) => ALLOWED_STEP_IDS.has(id));

  let morning = filterSteps(raw.morningStepIds ?? []);
  let evening = filterSteps(raw.eveningStepIds ?? []);

  if (!morning.includes('am-1')) morning = ['am-1', ...morning];
  if (!morning.includes('am-5')) morning = [...morning, 'am-5'];
  if (!evening.includes('pm-2')) evening = ['pm-2', ...evening];
  if (!evening.includes('pm-4')) evening = [...evening, 'pm-4'];

  return {
    subtitle: String(raw.subtitle ?? 'Personalized for your skin profile.').slice(0, 280),
    morningStepIds: [...new Set(morning)],
    eveningStepIds: [...new Set(evening)],
  };
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function sanitizeAnalysis(raw: GeminiAnalysisRaw): GeminiAnalysisRaw {
  return {
    skinScore: clampScore(raw.skinScore),
    skinTypeId: raw.skinTypeId ?? 'combination',
    fitzpatrickId: raw.fitzpatrickId ?? 'typeIII',
    chipIds: Array.isArray(raw.chipIds) ? raw.chipIds.slice(0, 4) : [],
    positiveIds: Array.isArray(raw.positiveIds) ? raw.positiveIds.slice(0, 4) : [],
    concerns: Array.isArray(raw.concerns)
      ? raw.concerns.slice(0, 6).map((c) => ({
          id: c.id,
          severity: c.severity,
          barPercent: clampScore(c.barPercent),
          insightId: c.insightId,
        }))
      : [],
    routine: sanitizeRoutine(raw.routine),
  };
}

function buildUserPrompt(body: AnalyzeSkinRequest): string {
  const quiz = body.quizContext;
  const quizLines = quiz
    ? [
        `User quiz skin type: ${quiz.skinType ?? 'unknown'}`,
        `Quiz concerns: ${(quiz.concerns ?? []).join(', ') || 'none'}`,
        `Goals: ${(quiz.goals ?? []).join(', ') || 'none'}`,
        `Routine preference: ${quiz.routine ?? 'standard'}`,
      ].join('\n')
    : 'No quiz data.';

  const angles = [
    body.images.front ? 'front' : null,
    body.images.right ? 'right profile' : null,
    body.images.left ? 'left profile' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return `Locale: ${body.locale ?? 'en'}
Photos provided: ${angles}
${quizLines}

Analyze all provided images together. Return JSON only.`;
}

async function callGemini(body: AnalyzeSkinRequest): Promise<GeminiAnalysisRaw> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  if (!body.images.front) {
    throw new Error('Front image is required');
  }

  const parts: Record<string, unknown>[] = [];

  for (const key of ['front', 'right', 'left'] as const) {
    const b64 = body.images[key];
    if (!b64) continue;
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: b64.replace(/^data:image\/\w+;base64,/, ''),
      },
    });
    parts.push({ text: `Photo angle: ${key}` });
  }

  parts.push({ text: buildUserPrompt(body) });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
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
    payload?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('');

  if (!text) {
    throw new Error('Empty Gemini response');
  }

  const parsed = JSON.parse(text) as GeminiAnalysisRaw;
  return sanitizeAnalysis(parsed);
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
    const body = (await req.json()) as AnalyzeSkinRequest;

    if (!body?.images?.front) {
      return jsonResponse({ error: 'images.front is required' }, 400, origin);
    }

    const analysis = await callGemini(body);

    return jsonResponse(
      {
        analysis,
        modelVersion: GEMINI_MODEL,
        confidence: 0.88,
      },
      200,
      origin,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Analysis failed';
    console.error('[analyze-skin]', message);
    return jsonResponse({ error: message }, 500, origin);
  }
});
