import { ViewStyle } from 'react-native';

/**
 * Layered, soft elevation scale. Shadows use a deep green-black tint
 * (`#0F2A1E`) for a warmer, more premium feel than pure black on light
 * surfaces. On dark backgrounds these are largely invisible by design —
 * depth there comes from `surfaceElevated` + `hairline` borders.
 */
export const shadows = {
  xs: {
    shadowColor: '#0F2A1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F2A1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  md: {
    shadowColor: '#0F2A1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  lg: {
    shadowColor: '#0F2A1E',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 12,
  },
  xl: {
    shadowColor: '#0F2A1E',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.18,
    shadowRadius: 50,
    elevation: 20,
  },
} satisfies Record<string, ViewStyle>;

/**
 * Colored "glow" elevation for primary CTAs and the scan FAB.
 * Pass a brand color (e.g. `colors.primaryGlow`) for an on-brand halo.
 */
/** Magenta halo for gradient CTAs and the scan FAB */
export function ctaGlow(color: string, intensity: 'md' | 'lg' = 'lg'): ViewStyle {
  if (intensity === 'lg') {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.85,
      shadowRadius: 26,
      elevation: 16,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 16,
    elevation: 10,
  };
}

export function glow(color: string, intensity: 'md' | 'lg' = 'md'): ViewStyle {
  if (intensity === 'lg') {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 28,
      elevation: 14,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 10,
  };
}
