import AsyncStorage from '@react-native-async-storage/async-storage';

import { isSupabaseConfigured } from '@/config/env';
import { getSupabase } from '@/lib/supabase';
import {
  fetchSkinOnboarding,
  upsertSkinOnboarding,
} from '@/services/onboarding/skinOnboardingService';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';

const QUIZ_ANSWERS_KEY = '@skinsense/quiz_answers';

async function getSignedInUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabase().auth.getSession();
  return data.session?.user?.id ?? null;
}

/** Local cache + Supabase when signed in. */
export async function saveQuizAnswers(answers: QuizAnswers): Promise<void> {
  await AsyncStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(answers));

  const userId = await getSignedInUserId();
  if (userId) {
    await upsertSkinOnboarding(userId, answers);
  }
}

/** Prefer cloud copy for signed-in users; fall back to device cache. */
export async function loadQuizAnswers(): Promise<QuizAnswers | null> {
  const userId = await getSignedInUserId();
  if (userId) {
    const remote = await fetchSkinOnboarding(userId);
    if (remote) {
      await AsyncStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(remote));
      return remote;
    }
  }

  const raw = await AsyncStorage.getItem(QUIZ_ANSWERS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizAnswers;
  } catch {
    return null;
  }
}

export async function clearQuizAnswers(): Promise<void> {
  await AsyncStorage.removeItem(QUIZ_ANSWERS_KEY);
}

/** Push device-cached quiz to Supabase if the user has no cloud row yet. */
export async function syncLocalQuizToCloud(userId: string): Promise<void> {
  const remote = await fetchSkinOnboarding(userId);
  if (remote) return;

  const raw = await AsyncStorage.getItem(QUIZ_ANSWERS_KEY);
  if (!raw) return;
  try {
    const local = JSON.parse(raw) as QuizAnswers;
    if (local.concerns.length > 0 || local.skinType) {
      await upsertSkinOnboarding(userId, local);
    }
  } catch {
    /* ignore invalid cache */
  }
}
