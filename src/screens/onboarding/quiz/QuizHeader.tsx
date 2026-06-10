import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenBackButton, ScreenHeaderSpacer } from '@/components/ui/ScreenBackButton';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, touchTarget, typography, useAppTheme, useThemedStyles } from '@/theme';

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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
    height: 5,
    backgroundColor: colors.ctaTint,
    borderRadius: radius.full,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  brand: {
    ...typography.h3,
    color: colors.ctaGradientStart,
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
    color: colors.ctaGradientStart,
    textTransform: 'none',
    letterSpacing: 0,
  },
});
}

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
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
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
            <LinearGradient
              colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
              locations={[0, 0.48, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.miniFill, { width: `${progress * 100}%` }]}
            />
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
