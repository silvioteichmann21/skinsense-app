import { useEffect, useMemo, useState } from 'react';

import { loadQuizAnswers } from '@/core/storage/quizStorage';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  getEnrichedStep,
  getRoutineSteps,
  type EnrichedRoutineStep,
  type StepDetailContent,
} from '@/screens/routine/routineStepContent';
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

function reportText(
  t: (key: TranslationKey) => string,
  key: TranslationKey,
  fallback: string,
): string {
  const value = t(key);
  return value === key ? fallback : value;
}

function ingredientFocusLabel(
  step: EnrichedRoutineStep,
  t: (key: TranslationKey, params?: Record<string, string | number | undefined>) => string,
): string {
  const key = stepKey(step.id);
  return reportText(
    t,
    `routine.listMeta.${key}.ingredientFocus` as TranslationKey,
    step.ingredientFocus,
  );
}

function localizedApplySteps(
  t: (key: TranslationKey) => string,
  key: string,
  fallback: string[],
): string[] {
  const steps: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const path = `routine.stepDetails.${key}.apply${i}` as TranslationKey;
    const value = t(path);
    if (value === path) break;
    steps.push(value);
  }
  return steps.length ? steps : fallback;
}

function localizeDetail(
  detail: StepDetailContent,
  key: string,
  t: (key: TranslationKey, params?: Record<string, string | number | undefined>) => string,
): StepDetailContent {
  const base = `routine.stepDetails.${key}`;
  const frequency = reportText(
    t,
    `${base}.frequency` as TranslationKey,
    detail.when.frequency,
  );

  return {
    ...detail,
    why: reportText(t, `${base}.why` as TranslationKey, detail.why),
    whyHighlight: reportText(t, `${base}.whyHighlight` as TranslationKey, detail.whyHighlight),
    dosage: {
      ...detail.dosage,
      unit: reportText(t, `${base}.dosageUnit` as TranslationKey, detail.dosage.unit),
    },
    when: {
      ...detail.when,
      frequency,
    },
    applySteps: localizedApplySteps(t, key, detail.applySteps),
    proTip: reportText(t, `${base}.proTip` as TranslationKey, detail.proTip),
  };
}

function localizeEnrichedStep(
  step: EnrichedRoutineStep,
  t: (key: TranslationKey, params?: Record<string, string | number | undefined>) => string,
): EnrichedRoutineStep {
  const key = stepKey(step.id);
  const localized = localizeStep(step, t);
  return {
    ...step,
    ...localized,
    ingredientFocus: ingredientFocusLabel(step, t),
    whyHint: reportText(t, `routine.listMeta.${key}.whyHint` as TranslationKey, step.whyHint),
    detail: localizeDetail(step.detail, key, t),
  };
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
    const skinTypeKey = `reportData.skinTypes.${skinTypeId}` as TranslationKey;
    const skinTypeRaw = t(skinTypeKey);
    const skinType = skinTypeRaw === skinTypeKey ? (result.skinType ?? 'Combination Skin') : skinTypeRaw;

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

export function useLocalizedRoutineSteps(
  period: 'morning' | 'evening',
  routine?: PersonalizedRoutine | null,
): EnrichedRoutineStep[] {
  const { t } = useTranslation();

  return useMemo(
    () => getRoutineSteps(period, routine).map((step) => localizeEnrichedStep(step, t)),
    [period, routine, t],
  );
}

export function useLocalizedEnrichedStep(
  stepId: string,
  routine?: PersonalizedRoutine | null,
): EnrichedRoutineStep | undefined {
  const { t } = useTranslation();

  return useMemo(() => {
    const step = getEnrichedStep(stepId, routine);
    return step ? localizeEnrichedStep(step, t) : undefined;
  }, [stepId, routine, t]);
}
