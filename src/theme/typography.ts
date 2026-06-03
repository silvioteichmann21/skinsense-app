import { TextStyle } from 'react-native';

export const fontFamilies = {
  heading: 'DMSans_700Bold',
  subhead: 'DMSans_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMed: 'DMSans_500Medium',
  mono: 'SpaceMono_400Regular',
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    lineHeight: 30,
  },
  h3: {
    fontFamily: fontFamilies.subhead,
    fontSize: 18,
    lineHeight: 26,
  },
  bodyLg: {
    fontFamily: fontFamilies.bodyMed,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    fontFamily: fontFamilies.bodyMed,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  score: {
    fontFamily: fontFamilies.mono,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
} satisfies Record<string, TextStyle>;
