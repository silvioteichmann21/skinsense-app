import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import type { RootStackParamList } from '@/core/navigation/types';
import { saveQuizAnswers } from '@/core/storage/quizStorage';
import { useQuizContent } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import type { AppColors } from '@/theme/palettes';
import { fontFamilies, glow, layout, radius, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type ResultsNav = NativeStackNavigationProp<RootStackParamList, 'QuizResults'>;
type ResultsRoute = RouteProp<RootStackParamList, 'QuizResults'>;

function Chip({ label, variant = 'filled' }: { label: string; variant?: 'filled' | 'outline' }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.chip, variant === 'outline' && styles.chipOutline]}>
      <Text style={[styles.chipText, variant === 'outline' && styles.chipTextOutline]}>
        {label}
      </Text>
    </View>
  );
}

function labelForId(options: { id: string; label: string }[], id: string): string | undefined {
  return options.find((o) => o.id === id)?.label;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
      gap: layout.sectionGap,
    },
    hero: {
      gap: spacing.sm,
    },
    title: {
      ...typography.h1,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      ...typography.bodyLg,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    profileCard: {
      gap: spacing.xl,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    cardSubtitle: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: 2,
    },
    section: {
      gap: spacing.sm,
    },
    sectionLabel: {
      ...typography.label,
      color: colors.textTertiary,
      letterSpacing: 1,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
      borderRadius: radius.full,
      backgroundColor: colors.ctaGradientMid,
      ...glow(colors.ctaGlow, 'md'),
    },
    chipOutline: {
      backgroundColor: colors.chipNeutralBg,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    chipText: {
      ...typography.body,
      fontFamily: typography.h3.fontFamily,
      color: colors.onPrimary,
    },
    chipTextOutline: {
      color: colors.chipNeutralText,
      fontFamily: typography.body.fontFamily,
    },
    divider: {
      height: 1,
      backgroundColor: colors.hairline,
    },
    nextStep: {
      borderRadius: radius.lg,
      overflow: 'hidden',
      minHeight: 148,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    nextStepImage: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.35,
    },
    nextStepGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    nextStepContent: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: spacing.lg,
      gap: spacing.sm,
    },
    nextStepBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.full,
      backgroundColor: colors.glassFill,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    nextStepBadgeText: {
      fontSize: 10,
      fontFamily: fontFamilies.mono,
      color: colors.primaryLight,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    nextStepTitle: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    nextStepBody: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 21,
      maxWidth: 300,
    },
    editBtn: {
      alignSelf: 'center',
      paddingVertical: spacing.sm,
    },
    editLabel: {
      ...typography.body,
      color: colors.primaryLight,
      fontFamily: typography.h3.fontFamily,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.xl,
    },
    footerGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    scanBtn: {
      borderRadius: radius.lg,
    },
  });
}

export function QuizResultsScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<ResultsNav>();
  const route = useRoute<ResultsRoute>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { concerns, skinTypes, routines, ages, goals } = useQuizContent();
  const profileName = useUserDisplayName();

  const { answers, displayName } = route.params;
  const greetingName = displayName?.trim() || profileName.trim();

  useEffect(() => {
    void saveQuizAnswers(answers);
  }, [answers]);

  const concernLabels = useMemo(
    () =>
      answers.concerns
        .map((id) => labelForId(concerns, id))
        .filter((label): label is string => Boolean(label)),
    [answers.concerns, concerns],
  );
  const skinTypeLabel = answers.skinType
    ? labelForId(skinTypes, answers.skinType) ?? t('common.notSpecified')
    : t('common.notSpecified');
  const goalLabels = useMemo(
    () =>
      answers.goals
        .map((id) => labelForId(goals, id))
        .filter((label): label is string => Boolean(label)),
    [answers.goals, goals],
  );
  const routineLabel = answers.routine ? labelForId(routines, answers.routine) : null;
  const ageLabel = answers.ageRange ? labelForId(ages, answers.ageRange) : null;

  const footerBottom = Math.max(insets.bottom, spacing.base);
  const titleText = greetingName
    ? t('onboarding.resultsTitle', { name: greetingName })
    : t('onboarding.resultsTitleGeneric');

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader
        topInset={insets.top}
        title={t('common.brand')}
        titleColor={colors.textPrimary}
        variant="muted"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: touchTarget + footerBottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>{titleText}</Text>
          <Text style={styles.subtitle}>{t('onboarding.resultsSubtitle')}</Text>
        </View>

        <SurfaceCard variant="elevated" padding={layout.cardPadding}>
          <View style={styles.profileCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.cardTitle}>{t('onboarding.skinProfile')}</Text>
                <Text style={styles.cardSubtitle}>{t('onboarding.precisionReady')}</Text>
              </View>
            </View>

            {concernLabels.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{t('onboarding.mainConcerns')}</Text>
                <View style={styles.chipRow}>
                  {concernLabels.map((label) => (
                    <Chip key={label} label={label} />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('onboarding.skinType')}</Text>
              <View style={styles.chipRow}>
                <Chip label={skinTypeLabel} variant="outline" />
              </View>
            </View>

            {goalLabels.length > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>{t('onboarding.topGoals')}</Text>
                  <View style={styles.chipRow}>
                    {goalLabels.map((label) => (
                      <Chip key={label} label={label} />
                    ))}
                  </View>
                </View>
              </>
            )}

            {(routineLabel || ageLabel) && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>{t('onboarding.profileDetails')}</Text>
                  <View style={styles.chipRow}>
                    {routineLabel ? <Chip label={routineLabel} variant="outline" /> : null}
                    {ageLabel ? <Chip label={ageLabel} variant="outline" /> : null}
                  </View>
                </View>
              </>
            )}

            <View style={styles.nextStep}>
              <Image
                source={require('../../../assets/welcome/slide-1-v2.png')}
                style={styles.nextStepImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={[`${colors.background}10`, `${colors.background}CC`, colors.background]}
                style={styles.nextStepGradient}
              />
              <View style={styles.nextStepContent}>
                <View style={styles.nextStepBadge}>
                  <MaterialCommunityIcons name="flask-outline" size={12} color={colors.primaryLight} />
                  <Text style={styles.nextStepBadgeText}>{t('onboarding.precisionReady')}</Text>
                </View>
                <Text style={styles.nextStepTitle}>{t('onboarding.continueToScan')}</Text>
                <Text style={styles.nextStepBody}>{t('onboarding.resultsNextStepBody')}</Text>
              </View>
            </View>
          </View>
        </SurfaceCard>

        <Pressable
          onPress={() => navigation.replace('SkinQuiz', { displayName: greetingName || undefined })}
          style={styles.editBtn}
        >
          <Text style={styles.editLabel}>{t('onboarding.editAnswers')}</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerBottom }]} pointerEvents="box-none">
        <LinearGradient
          colors={[`${colors.background}00`, colors.background, colors.background]}
          style={styles.footerGradient}
          pointerEvents="none"
        />
        <PrimaryButton
          label={t('onboarding.continueToScan')}
          onPress={() => navigation.navigate('ScanGuide')}
          variant="green"
          style={styles.scanBtn}
        />
      </View>
    </View>
  );
}
