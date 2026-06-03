import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import { colors, spacing, typography } from '@/theme';

type Props = {
  step: number;
  totalSteps: number;
  progress: number;
  leftLabel?: string;
  rightLabel?: string;
};

export function QuizProgress({ step, totalSteps, progress, leftLabel, rightLabel }: Props) {
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
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: colors.primary,
  },
  right: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  track: {
    height: 6,
    backgroundColor: `${colors.primaryPale}4D`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});
