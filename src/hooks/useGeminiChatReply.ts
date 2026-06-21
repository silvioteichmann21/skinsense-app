import { useCallback } from 'react';

import { loadQuizAnswers } from '@/core/storage/quizStorage';
import {
  buildChatContext,
  isGeminiChatAvailable,
  sendChatWithGemini,
} from '@/services/api/geminiChat';
import { getLocalizedChatReply } from '@/screens/learn/chatMockData';
import { useI18n } from '@/i18n/I18nProvider';
import { useTranslation } from '@/i18n/useTranslation';
import { useRoutineStore } from '@/store/routineStore';
import { useSkinStore } from '@/store/skinStore';
import type { ChatMessage, ChatTurn } from '@/types/chat';

export function useGeminiChatReply(userName: string) {
  const { locale } = useI18n();
  const { t } = useTranslation();
  const latestAnalysis = useSkinStore((s) => s.latestAnalysis);
  const routine = useRoutineStore((s) => s.routine);

  const getReply = useCallback(
    async (
      userText: string,
      priorMessages: ChatMessage[],
    ): Promise<Pick<ChatMessage, 'text' | 'showInsight'>> => {
      if (isGeminiChatAvailable()) {
        try {
          const quiz = await loadQuizAnswers();
          const context = buildChatContext({
            userName,
            latestAnalysis,
            routine,
            quiz,
          });

          const history: ChatTurn[] = priorMessages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role, text: m.text }));

          const { reply } = await sendChatWithGemini({
            locale,
            messages: [...history, { role: 'user', text: userText }],
            context,
          });

          return {
            text: reply,
            showInsight: Boolean(latestAnalysis),
          };
        } catch (e) {
          if (__DEV__) {
            console.warn('[useGeminiChatReply] Gemini unavailable, using fallback:', e);
          }
        }
      }

      return getLocalizedChatReply(userText, t);
    },
    [locale, latestAnalysis, routine, t, userName],
  );

  return { getReply };
}
