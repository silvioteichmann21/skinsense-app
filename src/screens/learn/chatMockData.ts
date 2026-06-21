import type { ChatMessage } from '@/types/chat';
import type { useTranslation } from '@/i18n/useTranslation';

export type { ChatMessage };

export const SUGGESTED_PROMPTS = [
  "What's causing my acne?",
  'Is SPF important every day?',
  'Help with my routine',
] as const;

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'ai-1',
    role: 'assistant',
    text: 'Hi Alex! Based on your recent scan showing mild dehydration on your cheeks, how can I help you refine your routine today?',
  },
  {
    id: 'user-1',
    role: 'user',
    text: 'Can I mix retinol and vitamin C?',
  },
  {
    id: 'ai-2',
    role: 'assistant',
    text: "Great question. It's best to separate them: Vitamin C in the morning for antioxidant protection, and Retinol at night. Using them together can sometimes cause irritation, especially for your combination skin type.",
    showInsight: true,
  },
];

export function getLocalizedChatReply(
  userText: string,
  t: ReturnType<typeof useTranslation>['t'],
): Pick<ChatMessage, 'text' | 'showInsight'> {
  const lower = userText.toLowerCase();

  if (lower.includes('acne') || lower.includes('breakout')) {
    return { text: t('chat.replyAcne'), showInsight: true };
  }
  if (lower.includes('spf') || lower.includes('sun') || lower.includes('uv')) {
    return { text: t('chat.replySpf'), showInsight: true };
  }
  if (lower.includes('routine') || lower.includes('morning') || lower.includes('evening')) {
    return { text: t('chat.replyRoutine') };
  }
  if (
    (lower.includes('retinol') && lower.includes('vitamin')) ||
    lower.includes('mix') ||
    lower.includes('together')
  ) {
    return {
      text: t('chat.replyRetinolVitaminC'),
      showInsight: true,
    };
  }

  return { text: t('chat.replyFallback') };
}
