import type { User } from '@supabase/supabase-js';

import { getSupabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/auth';
import type { GenderValue } from '@/types/profile';
import { GENDER_VALUES } from '@/types/profile';

type ProfileRow = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  gender?: GenderValue | null;
};

const PROFILE_COLUMNS = 'id, email, first_name, last_name, display_name, gender';
const PROFILE_COLUMNS_LEGACY = 'id, email, first_name, last_name, display_name';

function rowToProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    displayName: row.display_name,
    gender: row.gender ?? null,
  };
}

function parseGender(value: unknown): GenderValue {
  if (typeof value === 'string' && (GENDER_VALUES as string[]).includes(value)) {
    return value as GenderValue;
  }
  return 'prefer-not-to-say';
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  let { data, error } = await getSupabase()
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error?.message?.includes('gender') || error?.code === '42703') {
    const legacy = await getSupabase()
      .from('profiles')
      .select(PROFILE_COLUMNS_LEGACY)
      .eq('id', userId)
      .maybeSingle();
    if (!legacy.error && legacy.data) {
      return rowToProfile(legacy.data as ProfileRow);
    }
    return null;
  }

  if (error || !data) return null;
  return rowToProfile(data as ProfileRow);
}

export async function upsertProfile(params: {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: GenderValue;
}): Promise<UserProfile | null> {
  const displayName = [params.firstName, params.lastName].filter(Boolean).join(' ').trim() || null;
  const row = {
    id: params.userId,
    email: params.email,
    first_name: params.firstName,
    last_name: params.lastName,
    display_name: displayName,
    gender: params.gender,
    updated_at: new Date().toISOString(),
  };

  let { data, error } = await getSupabase()
    .from('profiles')
    .upsert(row, { onConflict: 'id' })
    .select(PROFILE_COLUMNS)
    .single();

  if (error?.message?.includes('gender') || error?.code === '42703') {
    const { id, email, first_name, last_name, display_name, updated_at } = row;
    const legacy = await getSupabase()
      .from('profiles')
      .upsert(
        { id, email, first_name, last_name, display_name, updated_at },
        { onConflict: 'id' },
      )
      .select(PROFILE_COLUMNS_LEGACY)
      .single();
    if (!legacy.error && legacy.data) {
      return rowToProfile(legacy.data as ProfileRow);
    }
    return null;
  }

  if (error || !data) return null;
  return rowToProfile(data as ProfileRow);
}

/** Create or refresh profile row after sign-in (e.g. trigger missed or RLS race). */
export async function ensureProfileForUser(user: User): Promise<UserProfile | null> {
  const existing = await fetchProfile(user.id);
  if (existing) return existing;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const email = user.email ?? '';
  const firstName = String(meta.first_name ?? meta.firstName ?? '').trim();
  const lastName = String(meta.last_name ?? meta.lastName ?? '').trim();
  const gender = parseGender(meta.gender);

  if (!email) return null;

  return upsertProfile({
    userId: user.id,
    email,
    firstName: firstName || 'User',
    lastName: lastName || '',
    gender,
  });
}
