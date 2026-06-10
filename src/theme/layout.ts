import { radius, spacing } from '@/theme/spacing';

/** Shared screen rhythm — use across all pages for editorial consistency. */
export const layout = {
  screenPaddingX: spacing.lg,
  sectionGap: spacing.xl,
  cardPadding: spacing.xl,
  heroCardRadius: radius.xl,
  listCardRadius: radius.lg,
} as const;
