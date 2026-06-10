import { Platform } from 'react-native';

import { isSupabaseConfigured } from '@/config/env';
import { getSupabase } from '@/lib/supabase';
import { getAppVersionLabel } from '@/utils/appVersion';
import type { TranslationKey } from '@/i18n/useTranslation';

export type SubmitFeedbackParams = {
  stars: number;
  comment: string;
  locale: string;
  userId?: string | null;
  authorDisplayName?: string | null;
  authorAvatarUrl?: string | null;
};

export type SubmitFeedbackResult = {
  ok: boolean;
  errorKey?: TranslationKey;
};

export async function submitAppFeedback(
  params: SubmitFeedbackParams,
): Promise<SubmitFeedbackResult> {
  const { stars, comment, locale, userId, authorDisplayName, authorAvatarUrl } = params;

  if (stars < 1 || stars > 5) {
    return { ok: false, errorKey: 'feedback.ratingRequired' };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, errorKey: 'feedback.submitUnavailable' };
  }

  try {
    const { error } = await getSupabase().from('app_feedback').insert({
      user_id: userId ?? null,
      stars,
      comment: comment.trim() || null,
      locale,
      platform: Platform.OS,
      app_version: getAppVersionLabel(),
      author_display_name: authorDisplayName?.trim() || null,
      author_avatar_url: authorAvatarUrl?.trim() || null,
    });

    if (error) {
      if (error.code === '42P01') {
        return { ok: false, errorKey: 'feedback.tableMissing' };
      }
      return { ok: false, errorKey: 'feedback.submitFailed' };
    }

    return { ok: true };
  } catch {
    return { ok: false, errorKey: 'feedback.submitFailed' };
  }
}
