import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
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
import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import {
  SUBSCRIPTION_PLANS,
  formatPlanPrice,
  type SubscriptionPlan,
  type SubscriptionPlanId,
} from '@/config/subscriptionPlans';
import { allowMockSubscriptions, isRevenueCatConfigured } from '@/config/env';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  getRevenueCatCustomerInfo,
  getRevenueCatPlatformLabel,
  getSubscriptionManagementUrl,
} from '@/services/subscription/revenueCat';
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
      paddingBottom: spacing.md,
    },
    headerTitle: {
      ...typography.h2,
      flex: 1,
      marginLeft: spacing.sm,
      color: colors.textPrimary,
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      gap: spacing.lg,
    },
    hero: {
      gap: spacing.sm,
    },
    title: {
      ...typography.h1,
      fontSize: 26,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      ...typography.bodyLg,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    storeHint: {
      ...typography.body,
      fontSize: 12,
      color: colors.textTertiary,
    },
    plans: {
      gap: spacing.md,
    },
    planCard: {
      ...flatCard(colors),
      borderWidth: 1.5,
      borderColor: colors.borderMuted,
      padding: spacing.lg,
      gap: spacing.xs,
    },
    planCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
    },
    planCardActive: {
      borderColor: colors.primaryPale,
    },
    planRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    planLeft: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    planPeriod: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    planPrice: {
      ...typography.body,
      color: colors.textSecondary,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      marginTop: spacing.xs,
    },
    badgeActive: {
      backgroundColor: colors.primaryLight,
    },
    badgeText: {
      ...typography.label,
      fontSize: 10,
      color: colors.textInverse,
      textTransform: 'uppercase',
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
    },
    cta: {
      width: '100%',
    },
    ctaLabel: {
      ...typography.h3,
      color: colors.textInverse,
    },
    restoreBtn: {
      alignSelf: 'center',
      paddingVertical: spacing.sm,
    },
    restoreLabel: {
      ...typography.body,
      color: colors.primary,
    },
    legal: {
      ...typography.body,
      fontSize: 11,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 16,
    },
    legalLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    legalLink: {
      ...typography.body,
      fontSize: 12,
      color: colors.primary,
    },
    mockHint: {
      ...typography.body,
      fontSize: 12,
      color: colors.warning,
      textAlign: 'center',
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
  });
}

function PlanCard({
  plan,
  selected,
  active,
  priceLabel,
  onSelect,
}: {
  plan: SubscriptionPlan;
  selected: boolean;
  active?: boolean;
  priceLabel: string;
  onSelect: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const badgeLabel = active
    ? t('paywall.activePlan')
    : plan.badgeKey === 'paywall.savePercent' && plan.savePercent
      ? t('paywall.savePercent', { percent: plan.savePercent })
      : plan.badgeKey
        ? t(plan.badgeKey as TranslationKey)
        : null;

  return (
    <Pressable
      style={[
        styles.planCard,
        selected && styles.planCardSelected,
        active && !selected && styles.planCardActive,
      ]}
      onPress={onSelect}
    >
      <View style={styles.planRow}>
        <View style={styles.planLeft}>
          <Text style={styles.planPeriod}>{t(plan.periodKey)}</Text>
          <Text style={styles.planPrice}>{priceLabel}</Text>
          {badgeLabel ? (
            <View style={[styles.badge, active && styles.badgeActive]}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <View style={styles.radioDot} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

export function PaywallScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const purchasePlan = useSubscriptionStore((s) => s.purchasePlan);
  const restorePurchases = useSubscriptionStore((s) => s.restorePurchases);
  const loadOfferings = useSubscriptionStore((s) => s.loadOfferings);
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const activePlanId = useSubscriptionStore((s) => s.activePlanId);
  const priceLabels = useSubscriptionStore((s) => s.priceLabels);
  const packages = useSubscriptionStore((s) => s.packages);
  const offeringsLoaded = useSubscriptionStore((s) => s.offeringsLoaded);

  const result = route.params?.result;
  const isManageMode = route.params?.mode === 'manage' || (isPremium && !result);
  const showTeaser = Boolean(result) && !isPremium;
  const usesStore = isRevenueCatConfigured();
  const mockMode = allowMockSubscriptions();
  const showBack = isManageMode || !result;
  const storeLabel = getRevenueCatPlatformLabel();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>(
    activePlanId ?? 'monthly',
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void loadOfferings();
  }, [loadOfferings]);

  useEffect(() => {
    if (activePlanId) {
      setSelectedPlan(activePlanId);
    }
  }, [activePlanId]);

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

  const onContinue = useCallback(async () => {
    if (isManageMode && selectedPlan === activePlanId) {
      navigation.goBack();
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
      finishSuccess();
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
    finishSuccess,
    isManageMode,
    offeringsLoaded,
    packages,
    purchasePlan,
    selectedPlan,
    t,
    usesStore,
    navigation,
  ]);

  const onRestore = useCallback(async () => {
    setLoading(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        finishSuccess();
        return;
      }
      Alert.alert(t('paywall.restoreTitle'), t('paywall.restoreEmpty'));
    } catch {
      Alert.alert(t('paywall.restoreTitle'), t('paywall.purchaseFailed'));
    } finally {
      setLoading(false);
    }
  }, [finishSuccess, restorePurchases, t]);

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

  const includeKeys: TranslationKey[] = [
    'paywall.includeScore',
    'paywall.includeRoutine',
    'paywall.includeChat',
    'paywall.includeProgress',
  ];

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        {showBack ? (
          <ScreenBackButton onPress={() => navigation.goBack()} />
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={styles.headerTitle}>{t('paywall.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>
            {isManageMode ? t('paywall.manageHeadline') : t('paywall.headline')}
          </Text>
          <Text style={styles.subtitle}>
            {isManageMode ? t('paywall.manageSubheadline') : t('paywall.subheadline')}
          </Text>
          {usesStore ? (
            <Text style={styles.storeHint}>{t('paywall.storePrices', { store: storeLabel })}</Text>
          ) : null}
          {mockMode ? <Text style={styles.mockHint}>{t('paywall.mockModeHint')}</Text> : null}
        </View>

        {showTeaser && result ? <TeaserReportPreview result={result} /> : null}

        <View style={styles.includes}>
          {includeKeys.map((key) => (
            <View key={key} style={styles.includeRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} />
              <Text style={styles.includeText}>{t(key)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              active={isManageMode && activePlanId === plan.id}
              priceLabel={
                priceLabels[plan.id] ??
                `${formatPlanPrice(plan.priceUsd)} ${t('paywall.perPeriod')}`
              }
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>

        <GradientButton
          style={styles.cta}
          onPress={() => void onContinue()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.ctaLabel}>
              {isManageMode
                ? selectedPlan === activePlanId
                  ? t('paywall.done')
                  : t('paywall.updatePlan')
                : t('paywall.continue')}
            </Text>
          )}
        </GradientButton>

        <Pressable style={styles.restoreBtn} onPress={() => void onRestore()} disabled={loading}>
          <Text style={styles.restoreLabel}>{t('paywall.restore')}</Text>
        </Pressable>

        {isManageMode && usesStore ? (
          <Pressable
            style={styles.restoreBtn}
            onPress={() => void onManageInStore()}
            disabled={loading}
          >
            <Text style={styles.restoreLabel}>
              {t('paywall.manageInStore', { store: storeLabel })}
            </Text>
          </Pressable>
        ) : null}

        <Text style={styles.legal}>{t('paywall.legal')}</Text>
        <View style={styles.legalLinks}>
          <Pressable onPress={openTerms}>
            <Text style={styles.legalLink}>{t('paywall.termsLink')}</Text>
          </Pressable>
          <Pressable onPress={openPrivacy}>
            <Text style={styles.legalLink}>{t('paywall.privacyLink')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
