export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  showInsight?: boolean;
};

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

export function getMockAssistantReply(
  userText: string,
): Pick<ChatMessage, 'text' | 'showInsight'> {
  const lower = userText.toLowerCase();

  if (lower.includes('acne') || lower.includes('breakout')) {
    return {
      text: 'Your latest scan flagged mild congestion on the chin and forehead. Consistent evening cleansing, a BHA 2–3× weekly, and non-comedogenic moisturizer often help. If breakouts worsen or are painful, see a dermatologist.',
      showInsight: true,
    };
  }

  if (lower.includes('spf') || lower.includes('sun') || lower.includes('uv')) {
    return {
      text: 'Yes — daily SPF is essential, even on cloudy days. For combination skin, a lightweight mineral or hybrid SPF 30+ works well under makeup. Reapply every 2 hours if you are outdoors.',
      showInsight: true,
    };
  }

  if (lower.includes('routine') || lower.includes('morning') || lower.includes('evening')) {
    return {
      text: 'Your morning routine should focus on cleanse → antioxidant (vitamin C) → moisturizer → SPF. Evening: cleanse → treatment (retinol on alternate nights) → barrier-support moisturizer. I can walk through each step if you tell me what products you use.',
    };
  }

  if (
    (lower.includes('retinol') && lower.includes('vitamin')) ||
    lower.includes('mix') ||
    lower.includes('together')
  ) {
    return {
      text: "It's best to separate retinol and vitamin C: vitamin C in the morning, retinol at night. Layering both at once can increase irritation, especially on combination skin.",
      showInsight: true,
    };
  }

  return {
    text: 'Thanks for your question. Based on your scan and combination skin profile, I recommend keeping routines simple and consistent for 4–6 weeks before changing actives. What specific concern would you like to focus on?',
  };
}
