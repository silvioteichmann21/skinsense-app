import { getSupabaseFunctionHeaders } from '@/services/api/supabaseFunctionAuth';
import { encodeScanImagesForGemini } from '@/services/ai/gemini/encodeScanImages';
import {
  mapGeminiToScanResult,
  type GeminiAnalyzeApiResponse,
  type GeminiScanResult,
} from '@/services/ai/gemini/mapGeminiResponse';
import {
  getGeminiAnalyzeUrl,
  isGeminiAnalysisEnabled,
  isSupabaseConfigured,
} from '@/config/env';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { AngleImageUris } from '@/types/scanPipeline';

export class GeminiAnalyzeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiAnalyzeError';
  }
}

export function isGeminiAnalyzeAvailable(): boolean {
  return isGeminiAnalysisEnabled() && isSupabaseConfigured() && Boolean(getGeminiAnalyzeUrl());
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  return getSupabaseFunctionHeaders();
}

export async function analyzeSkinWithGemini(params: {
  frontImageUri: string;
  angleImageUris?: AngleImageUris;
  quiz: QuizAnswers | null;
  locale: string;
}): Promise<GeminiScanResult> {
  const url = getGeminiAnalyzeUrl();
  if (!url) {
    throw new GeminiAnalyzeError('Gemini analysis is not configured');
  }

  const images = await encodeScanImagesForGemini(
    params.angleImageUris ?? { front: params.frontImageUri },
    params.frontImageUri,
  );

  if (!images.front) {
    throw new GeminiAnalyzeError('Could not encode front photo');
  }

  const headers = await getAuthHeaders();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        locale: params.locale,
        quizContext: params.quiz,
        images,
      }),
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new GeminiAnalyzeError('Gemini analyze timed out');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = text || `Gemini analyze failed (${res.status})`;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) message = parsed.error;
    } catch {
      // keep raw text
    }
    throw new GeminiAnalyzeError(message);
  }

  const payload = (await res.json()) as GeminiAnalyzeApiResponse & { error?: string };
  if (payload.error || !payload.analysis) {
    throw new GeminiAnalyzeError(payload.error ?? 'Invalid Gemini response');
  }

  return mapGeminiToScanResult(payload.analysis, {
    frontImageUri: params.frontImageUri,
    modelVersion: payload.modelVersion,
    confidence: payload.confidence,
    quiz: params.quiz,
  });
}
