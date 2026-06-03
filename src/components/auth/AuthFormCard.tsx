import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

type Props = ViewProps & {
  children: React.ReactNode;
};

/** White auth card with in-card botanical accents (Signup layout) */
export function AuthFormCard({ children, style, ...rest }: Props) {
  return (
    <View style={[styles.card, style]} {...rest}>
      <View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobBottom} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  blobTop: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: colors.primaryPale,
    opacity: 0.12,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -96,
    left: -96,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: colors.surfaceAlt,
    opacity: 0.5,
  },
  content: {
    padding: spacing.xl,
    zIndex: 1,
  },
});
