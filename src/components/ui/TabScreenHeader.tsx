import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { ScreenBackButton, ScreenHeaderSpacer } from '@/components/ui/ScreenBackButton';
import type { AppColors } from '@/theme/palettes';
import { layout } from '@/theme/layout';
import { spacing, touchTarget, typography, useThemedStyles } from '@/theme';

type Props = {
  topInset: number;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  style?: ViewStyle;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      paddingHorizontal: layout.screenPaddingX,
      paddingBottom: spacing.md,
      backgroundColor: colors.background,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: touchTarget,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing.xs,
    },
    title: {
      ...typography.h2,
      color: colors.textPrimary,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    side: {
      width: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideEnd: {
      alignItems: 'flex-end',
    },
  });
}

/** Tab root header — symmetrical layout, editorial title (no back on tab roots). */
export function TabScreenHeader({ topInset, title, subtitle, right, style }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.wrap, { paddingTop: topInset }, style]}>
      <View style={styles.row}>
        <ScreenBackButton preserveLayout />
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={[styles.side, styles.sideEnd]}>{right ?? <ScreenHeaderSpacer />}</View>
      </View>
    </View>
  );
}
