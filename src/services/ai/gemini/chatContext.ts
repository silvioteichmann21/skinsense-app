import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { PersonalizedRoutine } from '@/types/routine';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';

export type GeminiChatContext = {
  userName?: string;
  skinScore?: number;
  skinType?: string;
  fitzpatrick?: string;
  concerns?: { id: string; severity: string; barPercent: number }[];
  positives?: string[];
  routineMorning?: string[];
  routineEvening?: string[];
  quiz?: QuizAnswers | null;
};

export function buildChatContext(params: {
  userName?: string;
  latestAnalysis: SkinAnalysisResult | null;
  routine: PersonalizedRoutine | null;
  quiz: QuizAnswers | null;
}): GeminiChatContext {
  const { latestAnalysis, routine, quiz, userName } = params;

  return {
    userName,
    skinScore: latestAnalysis?.skinScore,
    skinType: latestAnalysis?.skinTypeId ?? latestAnalysis?.skinType,
    fitzpatrick: latestAnalysis?.fitzpatrickId ?? latestAnalysis?.fitzpatrick,
    concerns: latestAnalysis?.concerns.map((c) => ({
      id: c.id,
      severity: c.severity,
      barPercent: c.barPercent,
    })),
    positives: latestAnalysis?.positiveIds ?? latestAnalysis?.positives,
    routineMorning: routine?.morning.map((s) => s.name),
    routineEvening: routine?.evening.map((s) => s.name),
    quiz,
  };
}
