import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { radius, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  activeLabelStyle?: StyleProp<TextStyle>;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    segment: {
      flex: 1,
      paddingVertical: 6,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    label: {
      ...typography.label,
      color: colors.textSecondary,
      textTransform: 'none',
      fontSize: 12,
    },
    labelActive: {
      color: colors.textInverse,
      fontFamily: typography.h3.fontFamily,
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.full,
    },
  });
}

/** Pill segment with gradient fill when active */
export function CtaSegment({
  label,
  active,
  onPress,
  style,
  labelStyle,
  activeLabelStyle,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <Pressable onPress={onPress} style={[styles.segment, style]}>
      {active ? (
        <LinearGradient
          colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
          locations={[0, 0.48, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      ) : null}
      <Text style={[styles.label, labelStyle, active && [styles.labelActive, activeLabelStyle]]}>
        {label}
      </Text>
    </Pressable>
  );
}
