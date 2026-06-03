import { isSupabaseConfigured } from '@/config/env';
import { getSupabase } from '@/lib/supabase';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';

type SkinOnboardingRow = {
  user_id: string;
  concerns: string[];
  skin_type: string | null;
  routine: string | null;
  age_range: string | null;
  goals: string[];
  completed_at: string;
  updated_at: string;
};

function rowToQuizAnswers(row: SkinOnboardingRow): QuizAnswers {
  return {
    concerns: row.concerns ?? [],
    skinType: row.skin_type,
    routine: row.routine,
    ageRange: row.age_range,
    goals: row.goals ?? [],
  };
}

function quizToRow(userId: string, answers: QuizAnswers): Omit<SkinOnboardingRow, 'completed_at'> {
  const now = new Date().toISOString();
  return {
    user_id: userId,
    concerns: answers.concerns,
    skin_type: answers.skinType,
    routine: answers.routine,
    age_range: answers.ageRange,
    goals: answers.goals,
    updated_at: now,
  };
}

export async function fetchSkinOnboarding(userId: string): Promise<QuizAnswers | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await getSupabase()
    .from('skin_onboarding')
    .select('user_id, concerns, skin_type, routine, age_range, goals, completed_at, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return rowToQuizAnswers(data as SkinOnboardingRow);
}

/** Upsert quiz answers for the signed-in user. */
export async function upsertSkinOnboarding(
  userId: string,
  answers: QuizAnswers,
): Promise<QuizAnswers | null> {
  if (!isSupabaseConfigured()) return null;

  const now = new Date().toISOString();
  const row = {
    ...quizToRow(userId, answers),
    completed_at: now,
  };

  const { data, error } = await getSupabase()
    .from('skin_onboarding')
    .upsert(row, { onConflict: 'user_id' })
    .select('user_id, concerns, skin_type, routine, age_range, goals, completed_at, updated_at')
    .single();

  if (error || !data) return null;
  return rowToQuizAnswers(data as SkinOnboardingRow);
}

export async function hasSkinOnboarding(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { data, error } = await getSupabase()
    .from('skin_onboarding')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  return !error && Boolean(data);
}
