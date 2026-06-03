import type { TranslationKey } from '@/i18n/useTranslation';

/** Map Supabase Auth API errors to i18n keys. */
export function authErrorKey(message: string): TranslationKey {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'auth.invalidCredentials';
  }
  if (lower.includes('email not confirmed')) {
    return 'auth.emailNotConfirmed';
  }
  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return 'auth.emailTaken';
  }
  if (lower.includes('password') && lower.includes('least')) {
    return 'auth.passwordMin';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'auth.rateLimited';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'auth.networkError';
  }
  return 'auth.genericError';
}
