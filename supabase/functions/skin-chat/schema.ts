export const GEMINI_MODEL = 'gemini-2.5-flash';

export type ChatTurn = {
  role: 'user' | 'assistant';
  text: string;
};

export type QuizContext = {
  skinType?: string;
  concerns?: string[];
  goals?: string[];
  routine?: string;
};

export type ChatContext = {
  userName?: string;
  skinScore?: number;
  skinType?: string;
  fitzpatrick?: string;
  concerns?: { id: string; severity: string; barPercent: number }[];
  positives?: string[];
  routineMorning?: string[];
  routineEvening?: string[];
  quiz?: QuizContext | null;
};

export type SkinChatRequest = {
  locale?: string;
  messages: ChatTurn[];
  context?: ChatContext;
};

export const SYSTEM_PROMPT = `You are the SkinSense AI skincare advisor — a friendly, concise cosmetic wellness coach.

Rules:
- Give practical skincare guidance about routines, ingredients, SPF, hydration, and common concerns.
- When user context includes scan results or quiz data, personalize answers and reference them naturally.
- Never diagnose medical conditions, prescribe medication, or claim to detect disease.
- If asked about serious symptoms (infection, bleeding, rapid changes, pain), recommend seeing a dermatologist.
- Keep replies focused: 2–4 short paragraphs or a brief bullet list. No markdown headers.
- Match the user's language using the locale hint when provided.
- Do not mention that you are an AI model unless asked.`;

export function buildContextBlock(context: ChatContext | undefined, locale: string): string {
  if (!context) {
    return `User locale: ${locale}\nNo scan or quiz data yet — give general guidance and encourage a face scan for personalization.`;
  }

  const lines: string[] = [`User locale: ${locale}`];

  if (context.userName) lines.push(`User name: ${context.userName}`);
  if (context.skinScore != null) lines.push(`Latest skin score: ${context.skinScore}/100`);
  if (context.skinType) lines.push(`Skin type: ${context.skinType}`);
  if (context.fitzpatrick) lines.push(`Fitzpatrick: ${context.fitzpatrick}`);

  if (context.concerns?.length) {
    lines.push(
      `Top concerns: ${context.concerns
        .map((c) => `${c.id} (${c.severity}, ${c.barPercent}%)`)
        .join('; ')}`,
    );
  }

  if (context.positives?.length) {
    lines.push(`Strengths: ${context.positives.join(', ')}`);
  }

  if (context.routineMorning?.length) {
    lines.push(`Morning routine: ${context.routineMorning.join(' → ')}`);
  }

  if (context.routineEvening?.length) {
    lines.push(`Evening routine: ${context.routineEvening.join(' → ')}`);
  }

  const quiz = context.quiz;
  if (quiz) {
    lines.push(`Quiz skin type: ${quiz.skinType ?? 'unknown'}`);
    lines.push(`Quiz concerns: ${(quiz.concerns ?? []).join(', ') || 'none'}`);
    lines.push(`Goals: ${(quiz.goals ?? []).join(', ') || 'none'}`);
  }

  return lines.join('\n');
}
