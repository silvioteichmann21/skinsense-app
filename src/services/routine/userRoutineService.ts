import { isSupabaseConfigured } from '@/config/env';
import { getSupabase } from '@/lib/supabase';
import type { PersonalizedRoutine } from '@/types/routine';

type UserRoutineRow = {
  user_id: string;
  scan_id: string | null;
  morning_steps: PersonalizedRoutine['morning'];
  evening_steps: PersonalizedRoutine['evening'];
  subtitle: string;
  updated_at: string;
};

export type FetchedUserRoutine = {
  routine: PersonalizedRoutine;
  scanId: string | null;
  updatedAt: string;
};

export async function fetchUserRoutine(userId: string): Promise<FetchedUserRoutine | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await getSupabase()
    .from('user_routines')
    .select('scan_id, morning_steps, evening_steps, subtitle, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return null;
    }
    return null;
  }
  if (!data) return null;

  const row = data as Pick<
    UserRoutineRow,
    'scan_id' | 'morning_steps' | 'evening_steps' | 'subtitle' | 'updated_at'
  >;
  return {
    scanId: row.scan_id,
    updatedAt: row.updated_at,
    routine: {
      subtitle: row.subtitle,
      morning: row.morning_steps ?? [],
      evening: row.evening_steps ?? [],
    },
  };
}

export async function upsertUserRoutine(
  userId: string,
  routine: PersonalizedRoutine,
  scanId: string | null,
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const now = new Date().toISOString();
  const row: UserRoutineRow = {
    user_id: userId,
    scan_id: scanId,
    morning_steps: routine.morning,
    evening_steps: routine.evening,
    subtitle: routine.subtitle,
    updated_at: now,
  };

  await getSupabase().from('user_routines').upsert(row, { onConflict: 'user_id' });
}
