/**
 * Light and dark palettes — dark aligned with web landing (globals.css).
 */
export const lightColors = {
  primary: '#2D6A4F',
  primaryLight: '#52B788',
  primaryPale: '#B7E4C7',
  primaryDark: '#1B4332',
  primaryContainer: '#2D6A4F',

  accent: '#F4A261',
  accentLight: '#FDDCBC',

  white: '#FFFFFF',
  background: '#F8FAF9',
  surface: '#FFFFFF',
  surfaceAlt: '#F0FFF4',
  border: '#E5E7EB',
  borderMuted: '#E5E7EB',

  textPrimary: '#141B2B',
  textSecondary: '#4B5563',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  severityLow: '#10B981',
  severityMed: '#F59E0B',
  severityHigh: '#EF4444',

  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.2)',
  glassBorder: 'rgba(255,255,255,0.12)',
  glassFill: 'rgba(255,255,255,0.08)',

  switchTrackOff: '#BFC9C1',
  switchTrackOn: '#B7E4C7',
  onPrimaryPale: '#005235',
  onPrimary: '#FFFFFF',

  surfaceMuted: '#EEF3F1',
  segmentTrack: '#EEF3F1',
  periodTrack: '#E8F0EC',
  imagePlaceholder: '#EEF3F1',
  accentTagText: '#783D01',

  // --- Elevated luxury tokens ---
  surfaceElevated: '#FFFFFF',
  surfaceSunken: '#EEF3F1',
  hairline: 'rgba(20,27,43,0.07)',
  shadowColor: '#0F2A1E',
  primaryGlow: 'rgba(45,106,79,0.32)',

  chipNeutralBg: '#E8F0EC',
  chipNeutralText: '#3D5248',

  severityMedBg: '#FFEAD7',
  severityMedText: '#8E4E14',
  severityMedBorder: '#FFB780',
  severityHighBg: 'rgba(186,26,26,0.10)',
  severityHighText: '#BA1A1A',
  severityHighBorder: 'rgba(186,26,26,0.32)',

  glassStrong: 'rgba(255,255,255,0.72)',
  scrim: 'rgba(20,27,43,0.85)',

  heroGradientStart: '#2D6A4F',
  heroGradientEnd: '#1B4332',

  /** Primary CTA pill — magenta → violet → indigo */
  ctaGradientStart: '#E879F9',
  ctaGradientMid: '#C084FC',
  ctaGradientEnd: '#6366F1',
  ctaGlow: 'rgba(232, 121, 249, 0.42)',
  ctaTint: 'rgba(232, 121, 249, 0.14)',

  // Content placed on the green `primaryContainer` surface. This surface is
  // dark-green in BOTH themes, so these stay light in both for contrast.
  onPrimaryContainer: '#EAF7EF',
  onPrimaryContainerMuted: '#AED9C2',
  primaryContainerTrack: 'rgba(255,255,255,0.20)',
  primaryContainerFill: '#B1F0CE',
} as const;

export const darkColors = {
  primary: '#52B788',
  primaryLight: '#74D4A8',
  primaryPale: '#2A3D32',
  primaryDark: '#2D6A4F',
  primaryContainer: '#1B4332',

  accent: '#F5C842',
  accentLight: '#3D3520',

  white: '#FFFFFF',
  background: '#000000',
  surface: '#1C1C1E',
  surfaceAlt: '#161618',
  border: 'rgba(255,255,255,0.08)',
  borderMuted: 'rgba(255,255,255,0.08)',

  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1A6',
  textTertiary: '#8E8E93',
  textInverse: '#FFFFFF',

  success: '#52B788',
  warning: '#F5C842',
  error: '#FF6B6B',
  info: '#5B9BD5',

  severityLow: '#52B788',
  severityMed: '#F5C842',
  severityHigh: '#FF6B6B',

  overlay: 'rgba(0,0,0,0.65)',
  overlayLight: 'rgba(0,0,0,0.35)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassFill: 'rgba(255,255,255,0.06)',

  switchTrackOff: '#3A3A3C',
  switchTrackOn: '#52B788',

  onPrimaryPale: '#B7E4C7',
  onPrimary: '#FFFFFF',

  surfaceMuted: '#1E2420',
  segmentTrack: '#1E2420',
  periodTrack: '#1A201C',
  imagePlaceholder: '#1E2420',
  accentTagText: '#F5C842',

  // --- Elevated luxury tokens ---
  surfaceElevated: '#26262A',
  surfaceSunken: '#141416',
  hairline: 'rgba(255,255,255,0.08)',
  shadowColor: '#000000',
  primaryGlow: 'rgba(82,183,136,0.40)',

  chipNeutralBg: '#2A2A2E',
  chipNeutralText: '#C7CBD1',

  severityMedBg: 'rgba(245,200,66,0.16)',
  severityMedText: '#F5C842',
  severityMedBorder: 'rgba(245,200,66,0.40)',
  severityHighBg: 'rgba(255,107,107,0.16)',
  severityHighText: '#FF6B6B',
  severityHighBorder: 'rgba(255,107,107,0.38)',

  glassStrong: 'rgba(28,28,30,0.72)',
  scrim: 'rgba(0,0,0,0.85)',

  heroGradientStart: '#1B4332',
  heroGradientEnd: '#0B2018',

  ctaGradientStart: '#E879F9',
  ctaGradientMid: '#C084FC',
  ctaGradientEnd: '#6366F1',
  ctaGlow: 'rgba(232, 121, 249, 0.5)',
  ctaTint: 'rgba(232, 121, 249, 0.18)',

  // Content on the green `primaryContainer` surface — stays light (the
  // container is dark-green in both themes).
  onPrimaryContainer: '#EAF7EF',
  onPrimaryContainerMuted: '#AED9C2',
  primaryContainerTrack: 'rgba(255,255,255,0.18)',
  primaryContainerFill: '#B1F0CE',
} as const;

export type AppColors = {
  readonly [K in keyof typeof lightColors]: string;
};

export type ColorScheme = 'light' | 'dark';

/** Stable references — do not spread; new objects break Zustand selectors. */
export function paletteForScheme(scheme: ColorScheme): AppColors {
  return (scheme === 'dark' ? darkColors : lightColors) as AppColors;
}
