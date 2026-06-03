import type { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { ScreenBackButton, ScreenHeaderSpacer } from '@/components/ui/ScreenBackButton';
import { colors, spacing, touchTarget, typography } from '@/theme';

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

export function ScreenHeader({
  topInset,
  title,
  titleColor,
  variant = 'default',
  right,
  style,
  onBackPress,
}: Props) {
  const resolvedTitleColor =
    titleColor ??
    (variant === 'inverse' ? colors.textInverse : colors.primary);

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

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
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
