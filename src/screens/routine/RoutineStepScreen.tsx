import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveIngredientCard } from '@/components/education/ActiveIngredientCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useLocalizedIngredients } from '@/i18n/content/useLocalizedIngredient';
import { STEP_INGREDIENT_IDS } from '@/types/activeIngredient';
import {
  getCompletedStepIds,
  setStepCompleted,
} from '@/core/storage/routinePreferences';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useLocalizedEnrichedStep } from '@/i18n/content/useLocalizedRoutine';
import { useRoutineStore } from '@/store/routineStore';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RoutineStep'>;
type Route = RouteProp<RootStackParamList, 'RoutineStep'>;

function WhyBody({ text, highlight }: { text: string; highlight: string }) {
  const styles = useThemedStyles(createStyles);

  if (!text.includes(highlight)) {
    return <Text style={styles.whyText}>{text}</Text>;
  }
  const [before, after] = text.split(highlight);
  return (
    <Text style={styles.whyText}>
      {before}
      <Text style={styles.whyBold}>{highlight}</Text>
      {after}
    </Text>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  moreBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  missing: {
    ...typography.body,
    padding: spacing.xl,
    color: colors.textSecondary,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  hero: {
    height: 192,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
    backgroundColor: colors.ctaTint,
  },
  heroIconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepBadge: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    zIndex: 2,
    overflow: 'hidden',
  },
  stepBadgeText: {
    ...typography.label,
    color: colors.textInverse,
    fontSize: 10,
    letterSpacing: 1,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionTitlePlain: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  whyText: {
    ...typography.body,
    color: '#404943',
    lineHeight: 22,
  },
  whyBold: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  specGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  specCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  specLabel: {
    ...typography.label,
    color: colors.textTertiary,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dosageValue: {
    ...typography.score,
    fontSize: 36,
    color: colors.textPrimary,
  },
  specSub: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  whenRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  whenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  whenChipText: {
    ...typography.label,
    color: colors.onPrimaryPale,
    fontSize: 10,
    textTransform: 'none',
  },
  whenFreq: {
    ...typography.body,
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  applyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
    ...shadows.sm,
  },
  applyRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  applyRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  applyNum: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyNumText: {
    ...typography.h3,
    color: colors.primaryContainer,
    fontSize: 16,
  },
  applyLine: {
    ...typography.body,
    color: '#404943',
    flex: 1,
  },
  proTip: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  proTipIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proTipBody: {
    flex: 1,
  },
  proTipLabel: {
    ...typography.label,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  proTipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  viewAll: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
  },
  ingredientsScroll: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  ingredientsHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    overflow: 'hidden',
  },
  markBtn: {
    width: '100%',
  },
  markBtnContent: {
    gap: spacing.sm,
  },
  markBtnLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
});
}

export function RoutineStepScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle, blurTint } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { stepId, period, stepIndex } = route.params;

  const storedRoutine = useRoutineStore((s) => s.routine);
  const step = useLocalizedEnrichedStep(stepId, storedRoutine);
  const ingredientIds = STEP_INGREDIENT_IDS[stepId] ?? [];
  const keyIngredients = useLocalizedIngredients(ingredientIds);
  const [completed, setCompleted] = useState(false);

  const loadDone = useCallback(async () => {
    const ids = await getCompletedStepIds(period);
    setCompleted(ids.has(stepId));
  }, [period, stepId]);

  useEffect(() => {
    loadDone();
  }, [loadDone]);

  if (!step) {
    return (
      <View style={styles.root}>
        <ScreenHeader topInset={insets.top} title="Step" />
        <Text style={styles.missing}>{t('routine.stepNotFound')}</Text>
      </View>
    );
  }

  const { detail } = step;
  const stepLabel = String(stepIndex + 1).padStart(2, '0');
  const footerBottom = Math.max(insets.bottom, spacing.base);

  const handleMarkDone = async () => {
    const next = !completed;
    await setStepCompleted(period, stepId, next);
    setCompleted(next);
    if (next) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader
        topInset={insets.top}
        title={step.name}
        style={styles.headerBar}
        right={
          <Pressable
            accessibilityLabel="More options"
            onPress={() =>
              Alert.alert(step.name, t('routine.stepOptionsSoon'))
            }
            style={styles.moreBtn}
          >
            <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.textPrimary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: touchTarget + footerBottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroGrid} />
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons name={detail.heroIcon} size={40} color={colors.primary} />
          </View>
          <LinearGradient
            colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
            locations={[0, 0.48, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.stepBadge}
          >
            <Text style={styles.stepBadgeText}>
              {t('routine.stepBadge', { label: stepLabel })}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="auto-fix" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('routine.whyTitle')}</Text>
          </View>
          <View style={styles.card}>
            <WhyBody text={detail.why} highlight={detail.whyHighlight} />
          </View>
        </View>

        <View style={styles.specGrid}>
          <View style={styles.specCard}>
            <Text style={styles.specLabel}>{t('routine.dosage')}</Text>
            <View style={styles.dosageRow}>
              <MaterialCommunityIcons name="water" size={20} color={colors.accent} />
              <Text style={styles.dosageValue}>{detail.dosage.value}</Text>
            </View>
            <Text style={styles.specSub}>{detail.dosage.unit}</Text>
          </View>
          <View style={styles.specCard}>
            <Text style={styles.specLabel}>{t('routine.when')}</Text>
            <View style={styles.whenRow}>
              {detail.when.am ? (
                <View style={styles.whenChip}>
                  <MaterialCommunityIcons name="weather-sunny" size={14} color={colors.onPrimaryPale} />
                  <Text style={styles.whenChipText}>{t('routine.whenAm')}</Text>
                </View>
              ) : null}
              {detail.when.pm ? (
                <View style={styles.whenChip}>
                  <MaterialCommunityIcons name="weather-night" size={14} color={colors.onPrimaryPale} />
                  <Text style={styles.whenChipText}>{t('routine.whenPm')}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.whenFreq}>{detail.when.frequency}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitlePlain}>{t('routine.howToApply')}</Text>
          <View style={styles.applyCard}>
            {detail.applySteps.map((line, i) => (
              <View key={line} style={[styles.applyRow, i > 0 && styles.applyRowBorder]}>
                <View style={styles.applyNum}>
                  <Text style={styles.applyNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.applyLine}>{line}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.proTip}>
          <View style={styles.proTipIcon}>
            <MaterialCommunityIcons name="lightbulb-outline" size={22} color={colors.onPrimaryPale} />
          </View>
          <View style={styles.proTipBody}>
            <Text style={styles.proTipLabel}>{t('routine.proTip')}</Text>
            <Text style={styles.proTipText}>{detail.proTip}</Text>
          </View>
        </View>

        <View style={styles.ingredientsHeader}>
          <Text style={styles.sectionTitlePlain}>{t('routine.keyIngredients')}</Text>
          <Pressable onPress={() => navigation.navigate('ScienceLibrary')}>
            <Text style={styles.viewAll}>{t('routine.viewAll')}</Text>
          </Pressable>
        </View>
        <Text style={styles.ingredientsHint}>{t('routine.keyIngredientsHint')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ingredientsScroll}>
          {keyIngredients.map((ingredient) => (
            <ActiveIngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onPress={() => navigation.navigate('IngredientDetail', { ingredientId: ingredient.id })}
            />
          ))}
        </ScrollView>
      </ScrollView>

      <BlurView intensity={80} tint={blurTint} style={[styles.footer, { paddingBottom: footerBottom }]}>
        <GradientButton
          style={styles.markBtn}
          contentStyle={styles.markBtnContent}
          onPress={handleMarkDone}
        >
          <MaterialCommunityIcons
            name={completed ? 'check-decagram' : 'check-circle-outline'}
            size={22}
            color={colors.textInverse}
          />
          <Text style={styles.markBtnLabel}>
            {completed ? t('routine.completed') : t('routine.markDone')}
          </Text>
        </GradientButton>
      </BlurView>
    </View>
  );
}
