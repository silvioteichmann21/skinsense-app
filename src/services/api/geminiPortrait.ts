import * as FileSystem from 'expo-file-system/legacy';

import {
  getGeminiPortraitUrl,
  isGeminiAnalysisEnabled,
  isSupabaseConfigured,
} from '@/config/env';
import { encodeScanImageForGemini } from '@/services/ai/gemini/encodeScanImages';
import { getSupabaseFunctionHeaders } from '@/services/api/supabaseFunctionAuth';

export class GeminiPortraitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiPortraitError';
  }
}

export function isGeminiPortraitAvailable(): boolean {
  return isGeminiAnalysisEnabled() && isSupabaseConfigured() && Boolean(getGeminiPortraitUrl());
}

export async function enhancePortraitWithGemini(params: {
  imageUri: string;
  skinScore?: number;
  skinType?: string;
  locale: string;
  styleSeed?: string;
}): Promise<{ base64: string; modelVersion: string }> {
  const url = getGeminiPortraitUrl();
  if (!url) {
    throw new GeminiPortraitError('Gemini portrait is not configured');
  }

  const image = await encodeScanImageForGemini(params.imageUri, 768);
  if (!image) {
    throw new GeminiPortraitError('Could not encode scan photo');
  }

  const headers = await getSupabaseFunctionHeaders();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        locale: params.locale,
        image,
        skinScore: params.skinScore,
        skinType: params.skinType,
        styleSeed: params.styleSeed,
      }),
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new GeminiPortraitError('Portrait enhancement timed out');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = text || `Portrait enhance failed (${res.status})`;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) message = parsed.error;
    } catch {
      // keep raw
    }
    throw new GeminiPortraitError(message);
  }

  const payload = (await res.json()) as {
    image?: string;
    modelVersion?: string;
    error?: string;
  };

  if (payload.error || !payload.image) {
    throw new GeminiPortraitError(payload.error ?? 'Invalid portrait response');
  }

  return {
    base64: payload.image,
    modelVersion: payload.modelVersion ?? 'gemini-portrait',
  };
}

export async function saveGeminiPortraitToFile(
  base64: string,
  cacheKey: string,
): Promise<string> {
  const { getActiveUserScope } = await import('@/core/storage/userScope');
  const scope = await getActiveUserScope();
  const dir = `${FileSystem.documentDirectory ?? ''}profile/${scope}/portraits/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  const safeKey = cacheKey.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dest = `${dir}gemini-${safeKey}.jpg`;
  await FileSystem.writeAsStringAsync(dest, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return dest;
}
