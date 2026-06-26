import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TeaserReportPreview } from '@/components/subscription/TeaserReportPreview';
import { CurrentPlanCard } from '@/components/subscription/CurrentPlanCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import {
  SUBSCRIPTION_PLANS,
  formatPlanPrice,
  type SubscriptionPlan,
  type SubscriptionPlanId,
} from '@/config/subscriptionPlans';
import { allowMockSubscriptions, isRevenueCatConfigured } from '@/config/env';
import type { RootStackParamList } from '@/core/navigation/types';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  getActiveSubscriptionDetails,
  getRevenueCatCustomerInfo,
  getRevenueCatPlatformLabel,
  getSubscriptionManagementUrl,
  type ActiveSubscriptionDetails,
} from '@/services/subscription/revenueCat';
import { presentRevenueCatCustomerCenter } from '@/services/subscription/revenueCatUI';
import {
  SubscriptionPurchaseError,
  useSubscriptionStore,
} from '@/store/subscriptionStore';
import type { AppColors } from '@/theme/palettes';
import {
  flatCard,
  layout,
  radius,
  spacing,
  typography,
  useAppTheme,
  useThemedStyles,
} from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Paywall'>;
type Route = RouteProp<RootStackParamList, 'Paywall'>;

const BENEFIT_KEYS: TranslationKey[] = [
  'paywall.includeScore',
  'paywall.includeRoutine',
  'paywall.includeChat',
  'paywall.includeProgress',
];

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.screenPaddingX,
      paddingBottom: spacing.sm,
      gap: spacing.sm,
    },
    headerTitleWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerTitle: {
      ...typography.h2,
      color: colors.textPrimary,
    },
    proBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radius.full,
      backgroundColor: colors.primaryContainer,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
    },
    proBadgeText: {
      ...typography.label,
      fontSize: 10,
      color: colors.primary,
      letterSpacing: 0.6,
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      gap: spacing.lg,
    },
    scrollCompact: {
      gap: spacing.md,
    },
    hero: {
      gap: spacing.xs,
    },
    title: {
      ...typography.h1,
      fontSize: 24,
      color: colors.textPrimary,
      letterSpacing: -0.4,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    storeHint: {
      ...typography.body,
      fontSize: 12,
      color: colors.textTertiary,
    },
    sectionLabel: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: -spacing.xs,
    },
    benefitRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    benefitPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.hairline,
    },
    benefitPillText: {
      ...typography.body,
      fontSize: 12,
      color: colors.textPrimary,
    },
    plans: {
      gap: spacing.sm,
    },
    planCard: {
      ...flatCard(colors),
      borderWidth: 1.5,
      borderColor: colors.borderMuted,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    planCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
    },
    planCardActive: {
      borderColor: colors.primary,
    },
    planCardCurrent: {
      borderColor: colors.primaryLight,
      backgroundColor: colors.surfaceMuted,
    },
    planRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    planRadio: {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    planRadioSelected: {
      borderColor: colors.primaryLight,
      backgroundColor: colors.primaryLight,
    },
    planBody: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    planPeriod: {
      ...typography.h3,
      fontSize: 16,
      color: colors.textPrimary,
    },
    planPeriodSelected: {
      color: colors.onPrimaryContainer,
    },
    planMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    planPrice: {
      ...typography.h3,
      fontSize: 17,
      color: colors.textPrimary,
    },
    planPriceSelected: {
      color: colors.onPrimaryContainer,
    },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
    },
    badgeSelected: {
      backgroundColor: 'rgba(255,255,255,0.22)',
    },
    badgeActive: {
      backgroundColor: colors.primaryLight,
    },
    badgeText: {
      ...typography.label,
      fontSize: 9,
      color: colors.textInverse,
      textTransform: 'uppercase',
    },
    badgeTextSelected: {
      color: colors.onPrimaryContainer,
    },
    includes: {
      ...flatCard(colors, false),
      gap: spacing.sm,
      padding: spacing.lg,
    },
    includeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    includeText: {
      ...typography.body,
      flex: 1,
      color: colors.textPrimary,
    },
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.hairline,
      backgroundColor: colors.background,
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.md,
      gap: spacing.sm,
    },
    cta: {
      width: '100%',
    },
    ctaLabel: {
      ...typography.h3,
      color: colors.textInverse,
    },
    footerLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.lg,
    },
    footerLink: {
      ...typography.body,
      fontSize: 13,
      color: colors.primary,
    },
    legal: {
      ...typography.body,
      fontSize: 10,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 14,
    },
    mockHint: {
      ...typography.body,
      fontSize: 12,
      color: colors.warning,
      textAlign: 'center',
    },
    plansLoading: {
      paddingVertical: spacing.xl,
      alignItems: 'center',
    },
    paywallFlex: {
      flex: 1,
    },
    accentLine: {
      height: 3,
      borderRadius: radius.full,
      marginHorizontal: layout.screenPaddingX,
      marginBottom: spacing.sm,
      opacity: 0.85,
    },
  });
}

function PlanCard({
  plan,
  selected,
  isCurrentPlan,
  priceLabel,
  onSelect,
}: {
  plan: SubscriptionPlan;
  selected: boolean;
  isCurrentPlan?: boolean;
  priceLabel: string;
  onSelect: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const badgeLabel = isCurrentPlan
    ? t('paywall.activePlan')
    : plan.badgeKey === 'paywall.savePercent' && plan.savePercent
      ? t('paywall.savePercent', { percent: plan.savePercent })
      : plan.badgeKey
        ? t(plan.badgeKey as TranslationKey)
        : null;

  return (
    <PressableScale onPress={onSelect} pressedScale={0.98} haptic="selection">
      <View
        style={[
          styles.planCard,
          selected && styles.planCardSelected,
          isCurrentPlan && !selected && styles.planCardCurrent,
          isCurrentPlan && selected && styles.planCardActive,
        ]}
      >
        <View style={styles.planRow}>
          <View style={[styles.planRadio, selected && styles.planRadioSelected]}>
            {selected ? (
              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            ) : null}
          </View>

          <View style={styles.planBody}>
            <View style={styles.planMeta}>
              <Text style={[styles.planPeriod, selected && styles.planPeriodSelected]}>
                {t(plan.periodKey)}
              </Text>
              {badgeLabel ? (
                <View style={[styles.badge, selected && styles.badgeSelected, isCurrentPlan && styles.badgeActive]}>
                  <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>
                    {badgeLabel}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={[styles.planPrice, selected && styles.planPriceSelected]}>{priceLabel}</Text>
        </View>
      </View>
    </PressableScale>
  );
}

function PaywallCheckoutScreen({
  result,
  isManageMode,
  showTeaser,
  showBack,
  onFinish,
  onBack,
}: {
  result?: SkinAnalysisResult;
  isManageMode: boolean;
  showTeaser: boolean;
  showBack: boolean;
  onFinish: () => void;
  onBack: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const purchasePlan = useSubscriptionStore((s) => s.purchasePlan);
  const restorePurchases = useSubscriptionStore((s) => s.restorePurchases);
  const loadOfferings = useSubscriptionStore((s) => s.loadOfferings);
  const syncFromCustomerInfo = useSubscriptionStore((s) => s.syncFromCustomerInfo);
  const activePlanId = useSubscriptionStore((s) => s.activePlanId);
  const priceLabels = useSubscriptionStore((s) => s.priceLabels);
  const packages = useSubscriptionStore((s) => s.packages);
  const offeringsLoaded = useSubscriptionStore((s) => s.offeringsLoaded);

  const usesStore = isRevenueCatConfigured();
  const mockMode = allowMockSubscriptions();
  const storeLabel = getRevenueCatPlatformLabel();
  const compact = showTeaser && !isManageMode;

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>(
    activePlanId ?? 'monthly',
  );
  const [loading, setLoading] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<ActiveSubscriptionDetails | null>(
    null,
  );

  useEffect(() => {
    void loadOfferings();
  }, [loadOfferings]);

  useEffect(() => {
    if (!isManageMode || !usesStore) return;
    void getRevenueCatCustomerInfo().then((info) => {
      if (!info) return;
      void syncFromCustomerInfo(info);
      setSubscriptionDetails(getActiveSubscriptionDetails(info));
    });
  }, [isManageMode, usesStore, syncFromCustomerInfo]);

  useEffect(() => {
    if (activePlanId) {
      setSelectedPlan(activePlanId);
    }
  }, [activePlanId]);

  const onContinue = useCallback(async () => {
    if (isManageMode && selectedPlan === activePlanId) {
      onBack();
      return;
    }

    if (usesStore && offeringsLoaded && !packages[selectedPlan]) {
      Alert.alert(t('paywall.title'), t('paywall.planUnavailable'));
      return;
    }

    setLoading(true);
    try {
      await purchasePlan(selectedPlan);
      if (isManageMode && selectedPlan !== activePlanId) {
        Alert.alert(t('paywall.title'), t('paywall.planUpdated'));
      }
      onFinish();
    } catch (e) {
      if (e instanceof SubscriptionPurchaseError && e.userCancelled) return;
      Alert.alert(
        t('paywall.title'),
        e instanceof SubscriptionPurchaseError ? e.message : t('paywall.purchaseFailed'),
      );
    } finally {
      setLoading(false);
    }
  }, [
    activePlanId,
    isManageMode,
    offeringsLoaded,
    onBack,
    onFinish,
    packages,
    purchasePlan,
    selectedPlan,
    t,
    usesStore,
  ]);

  const onRestore = useCallback(async () => {
    setLoading(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        onFinish();
        return;
      }
      Alert.alert(t('paywall.restoreTitle'), t('paywall.restoreEmpty'));
    } catch {
      Alert.alert(t('paywall.restoreTitle'), t('paywall.purchaseFailed'));
    } finally {
      setLoading(false);
    }
  }, [onFinish, restorePurchases, t]);

  const onOpenCustomerCenter = useCallback(async () => {
    try {
      await presentRevenueCatCustomerCenter({
        callbacks: {
          onRestoreCompleted: ({ customerInfo }) => {
            void syncFromCustomerInfo(customerInfo);
            setSubscriptionDetails(getActiveSubscriptionDetails(customerInfo));
          },
        },
      });
    } catch {
      Alert.alert(t('paywall.title'), t('paywall.manageUnavailable'));
    }
  }, [syncFromCustomerInfo, t]);

  const onManageInStore = useCallback(async () => {
    try {
      const info = await getRevenueCatCustomerInfo();
      const url = info ? getSubscriptionManagementUrl(info) : null;
      if (!url) {
        Alert.alert(t('paywall.title'), t('paywall.manageUnavailable'));
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('paywall.title'), t('paywall.manageUnavailable'));
    }
  }, [t]);

  const openTerms = useCallback(() => {
    void Linking.openURL('https://skinsense.app/terms');
  }, []);

  const openPrivacy = useCallback(() => {
    void Linking.openURL('https://skinsense.app/privacy');
  }, []);

  const ctaLabel = isManageMode
    ? selectedPlan === activePlanId
      ? t('paywall.done')
      : t('paywall.updatePlan')
    : compact
      ? t('paywall.unlockReport')
      : t('paywall.continue');

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        {showBack ? (
          <ScreenBackButton onPress={onBack} />
        ) : (
          <View style={{ width: 40 }} />
        )}
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{t('paywall.title')}</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
      </View>

      {compact ? (
        <LinearGradient
          colors={[colors.heroGradientStart, colors.heroGradientEnd]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.accentLine}
        />
      ) : null}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          compact && styles.scrollCompact,
          { paddingBottom: spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {showTeaser && result ? <TeaserReportPreview result={result} /> : null}

        {isManageMode && activePlanId ? (
          <CurrentPlanCard
            activePlanId={activePlanId}
            priceLabel={priceLabels[activePlanId]}
            expirationDate={subscriptionDetails?.expirationDate}
            willRenew={subscriptionDetails?.willRenew}
          />
        ) : null}

        {isManageMode ? (
          <View style={styles.hero}>
            <Text style={styles.subtitle}>{t('paywall.manageSubheadline')}</Text>
          </View>
        ) : compact ? (
          <View style={styles.hero}>
            <Text style={styles.title}>{t('paywall.headline')}</Text>
            <Text style={styles.subtitle}>{t('paywall.subheadline')}</Text>
          </View>
        ) : (
          <View style={styles.hero}>
            <Text style={styles.title}>{t('paywall.headline')}</Text>
            <Text style={styles.subtitle}>{t('paywall.subheadline')}</Text>
            {usesStore ? (
              <Text style={styles.storeHint}>{t('paywall.storePrices', { store: storeLabel })}</Text>
            ) : null}
            {mockMode ? <Text style={styles.mockHint}>{t('paywall.mockModeHint')}</Text> : null}
          </View>
        )}

        {compact && !isManageMode ? (
          <View style={styles.benefitRow}>
            {BENEFIT_KEYS.map((key) => (
              <View key={key} style={styles.benefitPill}>
                <MaterialCommunityIcons name="check-circle" size={13} color={colors.primary} />
                <Text style={styles.benefitPillText}>{t(key)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {!compact && !isManageMode ? (
          <View style={styles.includes}>
            {BENEFIT_KEYS.map((key) => (
              <View key={key} style={styles.includeRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} />
                <Text style={styles.includeText}>{t(key)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>
          {isManageMode ? t('paywall.changePlan') : t('paywall.choosePlan')}
        </Text>

        {!offeringsLoaded && usesStore ? (
          <View style={styles.plansLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View style={styles.plans}>
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                isCurrentPlan={isManageMode && activePlanId === plan.id}
                priceLabel={
                  priceLabels[plan.id] ??
                  formatPlanPrice(plan.priceUsd)
                }
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </View>
        )}

        {isManageMode && usesStore ? (
          <>
            <Pressable onPress={() => void onOpenCustomerCenter()} disabled={loading}>
              <Text style={[styles.footerLink, { textAlign: 'center' }]}>
                {t('paywall.customerCenter')}
              </Text>
            </Pressable>
            <Pressable onPress={() => void onManageInStore()} disabled={loading}>
              <Text style={[styles.footerLink, { textAlign: 'center' }]}>
                {t('paywall.manageInStore', { store: storeLabel })}
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <GradientButton style={styles.cta} onPress={() => void onContinue()} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.ctaLabel}>{ctaLabel}</Text>
          )}
        </GradientButton>

        <View style={styles.footerLinks}>
          <Pressable onPress={() => void onRestore()} disabled={loading}>
            <Text style={styles.footerLink}>{t('paywall.restore')}</Text>
          </Pressable>
          <Pressable onPress={openTerms}>
            <Text style={styles.footerLink}>{t('paywall.termsLink')}</Text>
          </Pressable>
          <Pressable onPress={openPrivacy}>
            <Text style={styles.footerLink}>{t('paywall.privacyLink')}</Text>
          </Pressable>
        </View>

        <Text style={styles.legal}>{t('paywall.legal')}</Text>
      </View>
    </View>
  );
}

export function PaywallScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const isPremium = useSubscriptionStore((s) => s.isPremium);

  const result = route.params?.result;
  const isManageMode = route.params?.mode === 'manage' || (isPremium && !result);
  const showTeaser = Boolean(result) && !isPremium;
  const showBack = isManageMode || !result;

  const finishSuccess = useCallback(() => {
    if (isManageMode) {
      navigation.goBack();
      return;
    }
    if (result) {
      navigation.replace('SkinReport', { result });
    } else {
      navigation.replace('Main');
    }
  }, [isManageMode, navigation, result]);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <PaywallCheckoutScreen
      result={result}
      isManageMode={isManageMode}
      showTeaser={showTeaser}
      showBack={showBack}
      onFinish={finishSuccess}
      onBack={onBack}
    />
  );
}
