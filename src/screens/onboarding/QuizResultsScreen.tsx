import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { saveQuizAnswers } from '@/core/storage/quizStorage';
import { useQuizContent } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, radius, spacing, touchTarget, typography } from '@/theme';

type ResultsNav = NativeStackNavigationProp<RootStackParamList, 'QuizResults'>;
type ResultsRoute = RouteProp<RootStackParamList, 'QuizResults'>;

function Chip({ label, variant = 'filled' }: { label: string; variant?: 'filled' | 'outline' }) {
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

export function QuizResultsScreen() {
  const navigation = useNavigation<ResultsNav>();
  const route = useRoute<ResultsRoute>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { concerns, skinTypes, routines, ages, goals } = useQuizContent();

  const { answers, displayName } = route.params;
  const greetingName = displayName?.trim() || 'there';

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

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader topInset={insets.top} title={t('common.brand')} style={styles.headerBar} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: touchTarget + footerBottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('onboarding.resultsTitle', { name: greetingName })}</Text>
        <Text style={styles.subtitle}>{t('onboarding.resultsSubtitle')}</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons name="shield-check-outline" size={22} color={colors.primaryDark} />
            </View>
            <Text style={styles.cardTitle}>{t('onboarding.skinProfile')}</Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('onboarding.skinType')}</Text>
            <View style={styles.chipRow}>
              <Chip label={skinTypeLabel} variant="outline" />
            </View>
          </View>

          {goalLabels.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('onboarding.topGoals')}</Text>
              <View style={styles.chipRow}>
                {goalLabels.map((label) => (
                  <Chip key={label} label={label} />
                ))}
              </View>
            </View>
          )}

          {(routineLabel || ageLabel) && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('onboarding.profileDetails')}</Text>
              <View style={styles.chipRow}>
                {routineLabel ? <Chip label={routineLabel} variant="outline" /> : null}
                {ageLabel ? <Chip label={ageLabel} variant="outline" /> : null}
              </View>
            </View>
          )}

          <View style={styles.accentBanner}>
            <LinearGradient
              colors={['transparent', colors.surface]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.accentInner}>
              <MaterialCommunityIcons name="flask-outline" size={16} color={colors.primary} />
              <Text style={styles.accentText}>{t('onboarding.precisionReady')}</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.replace('SkinQuiz', { displayName })}
          style={styles.editBtn}
        >
          <Text style={styles.editLabel}>{t('onboarding.editAnswers')}</Text>
        </Pressable>
      </ScrollView>

      <LinearGradient
        colors={[`${colors.background}00`, colors.background, colors.background]}
        style={[styles.footerGradient, { paddingBottom: footerBottom }]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => navigation.navigate('ScanGuide')}
          style={({ pressed }) => [styles.scanBtn, pressed && styles.scanBtnPressed]}
        >
          <Text style={styles.scanLabel}>{t('onboarding.continueToScan')}</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color={colors.textInverse} />
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    backgroundColor: `${colors.background}CC`,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.h3,
    color: colors.primaryDark,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.base,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
  },
  chipOutline: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primaryPale,
  },
  chipText: {
    ...typography.body,
    color: '#005235',
  },
  chipTextOutline: {
    color: colors.primaryDark,
  },
  accentBanner: {
    marginTop: spacing.lg,
    height: 128,
    borderRadius: radius.md,
    backgroundColor: colors.primaryPale,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  accentInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.base,
  },
  accentText: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    color: colors.primaryDark,
  },
  editBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  editLabel: {
    ...typography.body,
    color: colors.primary,
    fontFamily: typography.bodyLg.fontFamily,
  },
  footerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
  },
  scanBtn: {
    height: touchTarget,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  scanBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.97 }],
  },
  scanLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
});
