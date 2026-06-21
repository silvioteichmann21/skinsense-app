import {
  buildChatContext,
  type GeminiChatContext,
} from '@/services/ai/gemini/chatContext';
import { getSupabaseFunctionHeaders } from '@/services/api/supabaseFunctionAuth';
import {
  getGeminiChatUrl,
  isGeminiAnalysisEnabled,
  isSupabaseConfigured,
} from '@/config/env';
import type { ChatTurn } from '@/types/chat';

export class GeminiChatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiChatError';
  }
}

export function isGeminiChatAvailable(): boolean {
  return isGeminiAnalysisEnabled() && isSupabaseConfigured() && Boolean(getGeminiChatUrl());
}

export type GeminiChatResponse = {
  reply: string;
  modelVersion: string;
};

export async function sendChatWithGemini(params: {
  messages: ChatTurn[];
  locale: string;
  context: GeminiChatContext;
}): Promise<GeminiChatResponse> {
  const url = getGeminiChatUrl();
  if (!url) {
    throw new GeminiChatError('Gemini chat is not configured');
  }

  const headers = await getSupabaseFunctionHeaders();

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
        messages: params.messages,
        context: params.context,
      }),
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new GeminiChatError('Chat request timed out');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = text || `Chat failed (${res.status})`;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) message = parsed.error;
    } catch {
      // keep raw text
    }
    throw new GeminiChatError(message);
  }

  const payload = (await res.json()) as GeminiChatResponse & { error?: string };
  if (payload.error || !payload.reply) {
    throw new GeminiChatError(payload.error ?? 'Invalid chat response');
  }

  return { reply: payload.reply, modelVersion: payload.modelVersion };
}

export { buildChatContext };
