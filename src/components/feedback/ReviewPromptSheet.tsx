import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { StarRating } from '@/components/feedback/StarRating';
import { GradientButton } from '@/components/ui/GradientButton';
import type { RootStackParamList } from '@/core/navigation/types';
import { recordPromptDismissed } from '@/core/storage/feedbackPromptStorage';
import type { ReviewPromptTrigger } from '@/services/feedback/reviewPromptLogic';
import { useReviewPromptStore } from '@/store/reviewPromptStore';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { glow, radius, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';
import { useState } from 'react';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TITLE_KEYS: Record<ReviewPromptTrigger, TranslationKey> = {
  first_scan: 'reviews.prompt.firstScanTitle',
  home_engaged: 'reviews.prompt.homeTitle',
  streak_3: 'reviews.prompt.streakTitle',
};

const BODY_KEYS: Record<ReviewPromptTrigger, TranslationKey> = {
  first_scan: 'reviews.prompt.firstScanBody',
  home_engaged: 'reviews.prompt.homeBody',
  streak_3: 'reviews.prompt.streakBody',
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.scrim,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.surfaceElevated,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: colors.hairline,
      padding: spacing.xl,
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
      ...glow(colors.primaryGlow, 'md'),
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.borderMuted,
      marginBottom: spacing.sm,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      backgroundColor: colors.ctaTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...typography.h2,
      color: colors.textPrimary,
    },
    body: {
      ...typography.bodyLg,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    starsWrap: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    trustNote: {
      ...typography.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 18,
    },
    primary: {
      width: '100%',
    },
    primaryDisabled: {
      opacity: 0.45,
    },
    primaryLabel: {
      ...typography.h3,
      color: colors.textInverse,
    },
    secondary: {
      height: touchTarget,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryLabel: {
      ...typography.bodyLg,
      color: colors.textPrimary,
      fontFamily: typography.h3.fontFamily,
    },
    cancel: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    cancelLabel: {
      ...typography.body,
      color: colors.textTertiary,
    },
  });
}

export function ReviewPromptSheet() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const visible = useReviewPromptStore((s) => s.visible);
  const trigger = useReviewPromptStore((s) => s.trigger);
  const hide = useReviewPromptStore((s) => s.hide);
  const [stars, setStars] = useState(0);

  const dismiss = async () => {
    if (trigger) await recordPromptDismissed(trigger);
    setStars(0);
    hide();
  };

  const onContinue = () => {
    if (stars < 1 || !trigger) return;
    hide();
    setStars(0);
    navigation.navigate('AppFeedback', { initialStars: stars });
  };

  const onReadReviews = () => {
    hide();
    setStars(0);
    navigation.navigate('CommunityReviews');
  };

  if (!trigger) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => void dismiss()}>
      <Pressable style={styles.backdrop} onPress={() => void dismiss()}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="star-shooting" size={28} color={colors.ctaGradientStart} />
          </View>
          <Text style={styles.title}>{t(TITLE_KEYS[trigger])}</Text>
          <Text style={styles.body}>{t(BODY_KEYS[trigger])}</Text>
          <View style={styles.starsWrap}>
            <StarRating value={stars} onChange={setStars} size={40} />
          </View>
          <Text style={styles.trustNote}>{t('reviews.prompt.trustNote')}</Text>
          <GradientButton
            onPress={onContinue}
            disabled={stars < 1}
            style={[styles.primary, stars < 1 && styles.primaryDisabled]}
          >
            <Text style={styles.primaryLabel}>{t('reviews.prompt.continue')}</Text>
          </GradientButton>
          <Pressable onPress={onReadReviews} style={styles.secondary}>
            <Text style={styles.secondaryLabel}>{t('reviews.prompt.readReviews')}</Text>
          </Pressable>
          <Pressable onPress={() => void dismiss()} style={styles.cancel}>
            <Text style={styles.cancelLabel}>{t('reviews.prompt.later')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
