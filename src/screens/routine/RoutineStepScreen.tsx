import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
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

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import {
  getCompletedStepIds,
  setStepCompleted,
} from '@/core/storage/routinePreferences';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { getEnrichedStep } from '@/screens/routine/routineStepContent';
import { useRoutineStore } from '@/store/routineStore';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RoutineStep'>;
type Route = RouteProp<RootStackParamList, 'RoutineStep'>;

function WhyBody({ text, highlight }: { text: string; highlight: string }) {
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

export function RoutineStepScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { stepId, period, stepIndex } = route.params;

  const storedRoutine = useRoutineStore((s) => s.routine);
  const step = getEnrichedStep(stepId, storedRoutine);
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
      <StatusBar style="dark" />
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
          <Image source={{ uri: detail.heroImageUri }} style={styles.heroImage} contentFit="contain" />
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP {stepLabel}</Text>
          </View>
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
                  <MaterialCommunityIcons name="weather-sunny" size={14} color={colors.primaryDark} />
                  <Text style={styles.whenChipText}>AM</Text>
                </View>
              ) : null}
              {detail.when.pm ? (
                <View style={styles.whenChip}>
                  <MaterialCommunityIcons name="weather-night" size={14} color={colors.primaryDark} />
                  <Text style={styles.whenChipText}>PM</Text>
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
            <MaterialCommunityIcons name="lightbulb-outline" size={22} color={colors.primaryDark} />
          </View>
          <View style={styles.proTipBody}>
            <Text style={styles.proTipLabel}>{t('routine.proTip')}</Text>
            <Text style={styles.proTipText}>{detail.proTip}</Text>
          </View>
        </View>

        <View style={styles.productsHeader}>
          <Text style={styles.sectionTitlePlain}>{t('routine.recommended')}</Text>
          <Pressable onPress={() => navigation.navigate('Products')}>
            <Text style={styles.viewAll}>{t('routine.viewAll')}</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
          {detail.products.map((product) => (
            <Pressable
              key={product.id}
              style={styles.productCard}
              onPress={() => {
                const catalogId =
                  product.id === 'r1'
                    ? 'cerave-cleanser'
                    : product.id === 'r2'
                      ? 'laneige-cream'
                      : 'skinceuticals-ce';
                navigation.navigate('ProductDetail', { productId: catalogId });
              }}
            >
              <View style={styles.productImageWrap}>
                <Image source={{ uri: product.imageUri }} style={styles.productImage} contentFit="cover" />
              </View>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productMatch}>
                {t('products.matchPercent', { percent: product.matchPercent })}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      <BlurView intensity={80} tint="light" style={[styles.footer, { paddingBottom: footerBottom }]}>
        <Pressable
          style={[styles.markBtn, completed && styles.markBtnDone]}
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
        </Pressable>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#F1F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
    backgroundColor: colors.primary,
  },
  heroImage: {
    width: 128,
    height: 128,
    zIndex: 1,
  },
  stepBadge: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    zIndex: 2,
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
    color: colors.primaryDark,
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
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  viewAll: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
  },
  productsScroll: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  productCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  productImageWrap: {
    height: 128,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    ...typography.label,
    color: colors.textPrimary,
    textTransform: 'none',
  },
  productMatch: {
    fontFamily: typography.h3.fontFamily,
    fontSize: 13,
    color: colors.primaryContainer,
    marginTop: spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    height: touchTarget,
    borderRadius: radius.lg,
    ...shadows.md,
  },
  markBtnDone: {
    backgroundColor: '#006D48',
  },
  markBtnLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
});
