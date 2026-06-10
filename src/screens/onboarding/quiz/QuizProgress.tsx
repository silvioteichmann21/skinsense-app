import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  step: number;
  totalSteps: number;
  progress: number;
  leftLabel?: string;
  rightLabel?: string;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  left: {
    ...typography.label,
    color: colors.ctaGradientStart,
  },
  right: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  track: {
    height: 6,
    backgroundColor: colors.ctaTint,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
}

export function QuizProgress({
 step, totalSteps, progress, leftLabel, rightLabel }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const defaultLeft = t('common.stepOf', { current: step, total: totalSteps }).toUpperCase();
  const defaultRight = t('common.percent', { percent: progress });

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.left}>{leftLabel ?? defaultLeft}</Text>
        <Text style={styles.right}>{rightLabel ?? defaultRight}</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
          locations={[0, 0.48, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.fill, { width: `${progress}%` }]}
        />
      </View>
    </View>
  );
}
