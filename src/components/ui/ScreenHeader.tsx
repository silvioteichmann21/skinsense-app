import type { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { ScreenBackButton, ScreenHeaderSpacer } from '@/components/ui/ScreenBackButton';
import type { AppColors } from '@/theme/palettes';
import { layout } from '@/theme/layout';
import { spacing, touchTarget, typography, useAppTheme, useThemedStyles } from '@/theme';

type Variant = 'default' | 'muted' | 'inverse';

type Props = {
  topInset: number;
  title?: string;
  titleColor?: string;
  variant?: Variant;
  right?: ReactNode;
  style?: ViewStyle;
  onBackPress?: () => void;
};

function createStyles(_colors: AppColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: layout.screenPaddingX,
      minHeight: touchTarget,
    },
    title: {
      ...typography.h2,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: spacing.xs,
    },
    titleFlex: {
      flex: 1,
    },
  });
}

export function ScreenHeader({
  topInset,
  title,
  titleColor,
  variant = 'default',
  right,
  style,
  onBackPress,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const resolvedTitleColor =
    titleColor ?? (variant === 'inverse' ? colors.textInverse : colors.primary);

  return (
    <View style={[styles.bar, { paddingTop: topInset }, style]}>
      <ScreenBackButton variant={variant} onPress={onBackPress} />
      {title ? (
        <Text style={[styles.title, { color: resolvedTitleColor }]} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={styles.titleFlex} />
      )}
      {right ?? <ScreenHeaderSpacer />}
    </View>
  );
}
