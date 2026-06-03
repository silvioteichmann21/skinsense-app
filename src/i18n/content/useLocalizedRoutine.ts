import { useEffect, useMemo, useState } from 'react';

import { loadQuizAnswers } from '@/core/storage/quizStorage';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { generatePersonalizedRoutine } from '@/services/routine/routineGenerator';
import { useRoutineStore } from '@/store/routineStore';
import type { PersonalizedRoutine, RoutineStep } from '@/types/routine';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';

function stepKey(stepId: string): string {
  return stepId.replace(/-/g, '');
}

function concernNameKey(id: string): TranslationKey {
  return `reportData.concerns.${id}.name` as TranslationKey;
}

function localizeStep(
  step: RoutineStep,
  t: (key: TranslationKey, params?: Record<string, string | number | undefined>) => string,
): RoutineStep {
  const key = stepKey(step.id);
  const minutesMatch = step.duration.match(/(\d+)/);
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 1;

  return {
    ...step,
    name: t(`routine.steps.${key}.name` as TranslationKey),
    category: t(`routine.steps.${key}.category` as TranslationKey),
    duration: t('routine.stepDuration', { minutes }),
  };
}

export function useLocalizedPersonalizedRoutine(
  result: SkinAnalysisResult,
): PersonalizedRoutine {
  const { t } = useTranslation();
  const stored = useRoutineStore((s) => s.routine);
  const scanId = useRoutineStore((s) => s.scanId);
  const [quiz, setQuiz] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    void loadQuizAnswers().then(setQuiz);
  }, [result.id]);

  return useMemo(() => {
    const base =
      stored && scanId === result.id
        ? stored
        : generatePersonalizedRoutine(result, quiz);

    const skinTypeId = result.skinTypeId ?? 'combination';
    const skinType = t(`reportData.skinTypes.${skinTypeId}` as TranslationKey);

    const topConcernIds = result.concerns
      .filter((c) => c.severity !== 'healthy')
      .slice(0, 2)
      .map((c) => c.id);

    let focus: string;
    if (topConcernIds.length >= 2) {
      focus = t('routine.revealFocusPair', {
        first: t(concernNameKey(topConcernIds[0])),
        second: t(concernNameKey(topConcernIds[1])),
      });
    } else if (topConcernIds.length === 1) {
      focus = t(concernNameKey(topConcernIds[0]));
    } else {
      focus = t('routine.revealFocusDefault');
    }

    return {
      subtitle: t('routine.revealSubtitle', { skinType, focus }),
      morning: base.morning.map((s) => localizeStep(s, t)),
      evening: base.evening.map((s) => localizeStep(s, t)),
    };
  }, [result, scanId, stored, quiz, t]);
}
