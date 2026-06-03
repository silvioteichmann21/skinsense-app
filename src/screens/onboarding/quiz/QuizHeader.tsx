import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenBackButton, ScreenHeaderSpacer } from '@/components/ui/ScreenBackButton';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, spacing, touchTarget, typography } from '@/theme';

type Props = {
  step: number;
  totalSteps: number;
  topInset: number;
  onBack: () => void;
  onClose?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
  variant?: 'step1' | 'brand';
};

export function QuizHeader({
  step,
  totalSteps,
  topInset,
  onBack,
  onClose,
  showSkip,
  onSkip,
  variant = 'brand',
}: Props) {
  const { t } = useTranslation();
  const progress = step / totalSteps;

  if (variant === 'step1') {
    return (
      <View style={[styles.bar, { paddingTop: topInset }]}>
        <ScreenBackButton variant="muted" onPress={onBack} />
        <View style={styles.step1Center}>
          <Text style={styles.stepLabel}>
            {t('common.stepOf', { current: step, total: totalSteps })}
          </Text>
          <View style={styles.miniTrack}>
            <View style={[styles.miniFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
        <Pressable
          onPress={onClose}
          style={styles.sideBtn}
          accessibilityLabel={t('onboarding.closeQuiz')}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.bar, { paddingTop: topInset }]}>
      <ScreenBackButton onPress={onBack} />
      <Text style={styles.brand}>{t('common.brand')}</Text>
      {showSkip ? (
        <Pressable onPress={onSkip} style={styles.skipBtn} hitSlop={8}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </Pressable>
      ) : (
        <ScreenHeaderSpacer />
      )}
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
    backgroundColor: colors.background,
  },
  sideBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step1Center: {
    flex: 1,
    alignItems: 'center',
  },
  stepLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  miniTrack: {
    width: 96,
    height: 4,
    backgroundColor: colors.borderMuted,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  brand: {
    ...typography.h3,
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  skipBtn: {
    minWidth: touchTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: spacing.xs,
  },
  skipText: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
    letterSpacing: 0,
  },
});
