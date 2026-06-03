import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

import { getCompletedStepIds } from '@/core/storage/routinePreferences';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { MORNING_ROUTINE_PREVIEW } from '@/screens/home/homeMockData';
import { useRoutineStore } from '@/store/routineStore';
import { MORNING_STEPS } from '@/types/routine';

function stepKey(stepId: string): string {
  return stepId.replace(/-/g, '');
}

export type HomeRoutineStep = {
  id: string;
  name: string;
};

export function useHomeMorningRoutine() {
  const { t } = useTranslation();
  const stored = useRoutineStore((s) => s.routine);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const reloadCompleted = useCallback(() => {
    void getCompletedStepIds('morning').then(setCompleted);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloadCompleted();
    }, [reloadCompleted]),
  );

  const steps = useMemo((): HomeRoutineStep[] => {
    const source =
      stored?.morning?.length ? stored.morning : MORNING_STEPS.length ? MORNING_STEPS : MORNING_ROUTINE_PREVIEW;
    const preview = source.slice(0, 4);
    return preview.map((step) => {
      const key = stepKey(step.id);
      const nameKey = `routine.steps.${key}.name` as TranslationKey;
      const translated = t(nameKey);
      return {
        id: step.id,
        name: translated === nameKey ? step.name : translated,
      };
    });
  }, [stored, t]);

  const doneCount = steps.filter((s) => completed.has(s.id)).length;
  const totalSteps = steps.length;

  const isDone = useCallback((stepId: string) => completed.has(stepId), [completed]);

  return {
    steps,
    doneCount,
    totalSteps,
    progressPct: totalSteps ? Math.round((doneCount / totalSteps) * 100) : 0,
    isDone,
    toggleStep: async (stepId: string) => {
      const { toggleStepCompleted } = await import('@/core/storage/routinePreferences');
      await toggleStepCompleted('morning', stepId);
      const ids = await getCompletedStepIds('morning');
      setCompleted(ids);
    },
  };
}
