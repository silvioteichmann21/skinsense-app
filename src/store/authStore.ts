import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { setOnboardingComplete } from '@/core/storage/onboardingPreferences';
import { loadQuizAnswers, syncLocalQuizToCloud } from '@/core/storage/quizStorage';
import { getSupabaseOrNull } from '@/lib/supabase';
import {
  loadAuthState,
  resetPasswordForEmail,
  signInWithEmail,
  signOut as authSignOut,
  signUpWithEmail,
} from '@/services/auth/authService';
import { fetchProfile } from '@/services/auth/profileService';
import { useRoutineStore } from '@/store/routineStore';
import { useSkinStore } from '@/store/skinStore';
import {
  evaluateStreakAtRisk,
  rescheduleNotifications,
} from '@/services/notifications/notificationService';
import type { SignUpParams, UserProfile } from '@/types/auth';
import type { TranslationKey } from '@/i18n/useTranslation';

type AuthStore = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isInitialized: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ errorKey?: TranslationKey }>;
  signUp: (params: SignUpParams) => Promise<{
    errorKey?: TranslationKey;
    needsEmailConfirmation?: boolean;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ errorKey?: TranslationKey }>;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
};

async function reloadUserLocalData(): Promise<void> {
  useSkinStore.getState().resetForUserSwitch();
  await useSkinStore.getState().loadHistory();
  await useRoutineStore.getState().hydrate();
  await rescheduleNotifications();
  await evaluateStreakAtRisk();
}

async function runPostAuthSync(userId: string): Promise<void> {
  try {
    await syncLocalQuizToCloud(userId);
  } catch {
    /* optional tables / offline */
  }
  try {
    await loadQuizAnswers();
  } catch {
    /* ignore */
  }
  try {
    await useRoutineStore.getState().syncAfterSignIn(userId);
  } catch {
    /* user_routines may not exist yet */
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isInitialized: false,
  isLoading: false,

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
    });
  },

  setProfile: (profile) => {
    set({ profile });
  },

  initialize: async () => {
    try {
      const state = await loadAuthState();
      set({
        session: state.session,
        user: state.user,
        profile: state.profile,
        isInitialized: true,
      });

      await reloadUserLocalData();
      if (state.user?.id) {
        await runPostAuthSync(state.user.id);
      }

      const supabase = getSupabaseOrNull();
      if (!supabase) return;

      supabase.auth.onAuthStateChange(async (_event, session) => {
        const user = session?.user ?? null;
        const prevUserId = get().user?.id ?? null;
        const nextUserId = user?.id ?? null;
        let profile = get().profile;
        try {
          if (nextUserId !== prevUserId) {
            await reloadUserLocalData();
            if (user?.id) {
              await runPostAuthSync(user.id);
            }
          }
          if (user && (!profile || profile.id !== user.id)) {
            profile = (await fetchProfile(user.id)) ?? null;
          }
          if (!user) profile = null;
          set({ session, user, profile });
        } catch {
          set({ session, user, profile: user ? profile : null });
        }
      });
    } catch {
      set({ isInitialized: true });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await signInWithEmail(email, password);
      if (result.errorKey) return { errorKey: result.errorKey };
      set({
        session: result.session ?? null,
        user: result.user ?? null,
        profile: result.profile ?? null,
      });
      return {};
    } catch {
      return { errorKey: 'auth.networkError' };
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (params) => {
    set({ isLoading: true });
    try {
      const result = await signUpWithEmail(params);
      if (result.errorKey) return { errorKey: result.errorKey };

      await setOnboardingComplete(false);

      try {
        await authSignOut();
      } catch {
        /* no active session when email confirmation is required */
      }
      set({ session: null, user: null, profile: null });

      return { needsEmailConfirmation: result.needsEmailConfirmation };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authSignOut();
      set({ session: null, user: null, profile: null });
      await reloadUserLocalData();
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email) => {
    const result = await resetPasswordForEmail(email);
    return { errorKey: result.errorKey };
  },
}));
