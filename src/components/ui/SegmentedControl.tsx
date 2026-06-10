import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Option<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: colors.periodTrack,
      borderRadius: radius.full,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.hairline,
      gap: 2,
    },
    segment: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      alignItems: 'center',
      overflow: 'hidden',
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.full,
    },
    label: {
      ...typography.label,
      color: colors.textSecondary,
      textTransform: 'none',
      letterSpacing: 0,
    },
    labelActive: {
      color: colors.textInverse,
      fontFamily: typography.h3.fontFamily,
    },
  });
}

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            style={styles.segment}
          >
            {active ? (
              <LinearGradient
                colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
                locations={[0, 0.48, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}
              />
            ) : null}
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
