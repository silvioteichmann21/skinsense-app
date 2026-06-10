import type { Session, User } from '@supabase/supabase-js';

import { isSupabaseConfigured } from '@/config/env';
import { getSupabase, pingSupabase } from '@/lib/supabase';
import { authErrorKey } from '@/services/auth/authErrors';
import {
  ensureProfileForUser,
  fetchProfile,
  upsertProfile,
} from '@/services/auth/profileService';
import type { SignUpParams, UserProfile } from '@/types/auth';
import type { TranslationKey } from '@/i18n/useTranslation';

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

function isNetworkFailure(error: unknown): boolean {
  const message = errorMessage(error).toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('failed to fetch') ||
    message.includes('timeout') ||
    message.includes('abort')
  );
}

export type AuthResult = {
  errorKey?: TranslationKey;
  needsEmailConfirmation?: boolean;
  session?: Session | null;
  user?: User | null;
  profile?: UserProfile | null;
};

export async function getCurrentSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabase().auth.getSession();
  return data.session;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { errorKey: 'auth.configMissing' };
  }

  try {
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { errorKey: authErrorKey(error.message) };
    }

    if (!data.user || !data.session) {
      return { errorKey: 'auth.genericError' };
    }

    let profile = await fetchProfile(data.user.id);
    if (!profile) {
      profile = await ensureProfileForUser(data.user);
    }

    return {
      session: data.session,
      user: data.user,
      profile,
    };
  } catch (e) {
    if (isNetworkFailure(e)) {
      return { errorKey: 'auth.networkError' };
    }
    return { errorKey: 'auth.genericError' };
  }
}

export async function signUpWithEmail(params: SignUpParams): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { errorKey: 'auth.configMissing' };
  }

  const email = params.email.trim();

  try {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password: params.password,
      options: {
        data: {
          first_name: params.firstName.trim(),
          last_name: params.lastName.trim(),
          full_name: `${params.firstName.trim()} ${params.lastName.trim()}`.trim(),
          gender: params.gender,
        },
      },
    });

    if (error) {
      return { errorKey: authErrorKey(error.message) };
    }

    const user = data.user;
    const session = data.session;
    const needsEmailConfirmation = Boolean(user && !session);

    if (user && session) {
      let profile = await upsertProfile({
        userId: user.id,
        email,
        firstName: params.firstName.trim(),
        lastName: params.lastName.trim(),
        gender: params.gender,
      });
      if (!profile) {
        profile = await ensureProfileForUser(user);
      }
      return { session, user, profile, needsEmailConfirmation: false };
    }

    return { user, session, needsEmailConfirmation };
  } catch (e) {
    if (isNetworkFailure(e)) {
      return { errorKey: 'auth.networkError' };
    }
    return { errorKey: 'auth.genericError' };
  }
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await getSupabase().auth.signOut();
  } catch {
    /* ignore — already signed out */
  }
}

export async function resetPasswordForEmail(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { errorKey: 'auth.configMissing' };
  }

  try {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'skinsense://reset-password',
    });

    if (error) {
      return { errorKey: authErrorKey(error.message) };
    }
    return {};
  } catch {
    return { errorKey: 'auth.networkError' };
  }
}

export async function loadAuthState(): Promise<{
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
}> {
  if (!isSupabaseConfigured()) {
    return { session: null, user: null, profile: null };
  }

  try {
    const { data, error } = await getSupabase().auth.getSession();
    if (error) {
      return { session: null, user: null, profile: null };
    }

    const session = data.session;
    const user = session?.user ?? null;

    const reachable = await pingSupabase();
    if (!reachable) {
      return { session, user, profile: null };
    }

    let profile = user ? await fetchProfile(user.id) : null;
    if (user && !profile) {
      profile = await ensureProfileForUser(user);
    }
    return { session, user, profile };
  } catch {
    return { session: null, user: null, profile: null };
  }
}
