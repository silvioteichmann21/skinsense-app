import { create } from 'zustand';

import {
  buildRoutineAfterSignIn,
  resolveRoutineForDevice,
} from '@/core/storage/routineSync';
import { loadStoredRoutine, saveStoredRoutine, type StoredRoutine } from '@/core/storage/routineStorage';
import { generatePersonalizedRoutine } from '@/services/routine/routineGenerator';
import { isSupabaseConfigured } from '@/config/env';
import { getSupabase } from '@/lib/supabase';
import { upsertUserRoutine } from '@/services/routine/userRoutineService';
import type { PersonalizedRoutine } from '@/types/routine';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';

async function getSignedInUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabase().auth.getSession();
  return data.session?.user?.id ?? null;
}

type RoutineStore = {
  routine: PersonalizedRoutine | null;
  scanId: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  syncAfterSignIn: (userId: string) => Promise<void>;
  setFromScan: (
    result: SkinAnalysisResult,
    quiz: QuizAnswers | null,
  ) => Promise<PersonalizedRoutine>;
  getRoutineForResult: (
    result: SkinAnalysisResult,
    quiz?: QuizAnswers | null,
  ) => PersonalizedRoutine;
};

function applyResolved(
  resolved: { routine: PersonalizedRoutine; scanId: string | null } | null,
): Partial<RoutineStore> {
  if (!resolved) return { hydrated: true };
  return {
    routine: resolved.routine,
    scanId: resolved.scanId,
    hydrated: true,
  };
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routine: null,
  scanId: null,
  hydrated: false,

  hydrate: async () => {
    const userId = await getSignedInUserId();
    const resolved = await resolveRoutineForDevice(userId);
    if (resolved) {
      await saveStoredRoutine(resolved.routine, resolved.scanId);
      set(applyResolved(resolved));
      return;
    }
    set({ hydrated: true });
  },

  syncAfterSignIn: async (userId) => {
    const resolved = await buildRoutineAfterSignIn(userId);
    set(applyResolved(resolved));
  },

  getRoutineForResult: (result, quiz = null) => {
    const { routine, scanId } = get();
    if (routine && scanId === result.id) return routine;
    return generatePersonalizedRoutine(result, quiz);
  },

  setFromScan: async (result, quiz) => {
    const generated = generatePersonalizedRoutine(result, quiz);
    await saveStoredRoutine(generated, result.id);
    set({ routine: generated, scanId: result.id, hydrated: true });

    const userId = await getSignedInUserId();
    if (userId) {
      void upsertUserRoutine(userId, generated, result.id);
    }

    return generated;
  },
}));

export type { StoredRoutine };
