import type { UserProfile } from '@/types/auth';

/** Display name saved on feedback — matches community review card format. */
export function resolveFeedbackAuthorName(profile: UserProfile | null | undefined): string | null {
  if (!profile) return null;

  const display = profile.displayName?.trim();
  if (display) return display;

  const first = profile.firstName?.trim() ?? '';
  const last = profile.lastName?.trim() ?? '';
  if (first && last) return `${first} ${last.charAt(0).toUpperCase()}.`;
  if (first) return first;
  if (last) return last;

  return null;
}

export function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
