import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import {
  SUBSCRIPTION_PLANS,
  formatPlanPrice,
  type SubscriptionPlanId,
} from '@/config/subscriptionPlans';
import { formatAppDate } from '@/i18n/useFormattedDate';
import { useI18n } from '@/i18n/I18nProvider';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { flatCard, radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  activePlanId: SubscriptionPlanId;
  priceLabel?: string;
  expirationDate?: string | null;
  willRenew?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      ...flatCard(colors),
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
      gap: spacing.sm,
      padding: spacing.lg,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    statusLabel: {
      ...typography.label,
      color: colors.onPrimaryContainerMuted,
      letterSpacing: 0.8,
    },
    planName: {
      ...typography.h2,
      fontSize: 22,
      color: colors.onPrimaryContainer,
    },
    planMeta: {
      ...typography.body,
      color: colors.onPrimaryContainerMuted,
    },
    renewal: {
      ...typography.body,
      fontSize: 13,
      color: colors.onPrimaryContainerMuted,
    },
  });
}

export function CurrentPlanCard({
  activePlanId,
  priceLabel,
  expirationDate,
  willRenew = true,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { locale } = useI18n();

  const plan = SUBSCRIPTION_PLANS.find((entry) => entry.id === activePlanId);
  const planLabel = plan ? t(plan.periodKey) : activePlanId;
  const displayPrice =
    priceLabel ?? (plan ? formatPlanPrice(plan.priceUsd) : null);

  const renewalLabel = (() => {
    if (!expirationDate) return null;
    const date = new Date(expirationDate);
    if (Number.isNaN(date.getTime())) return null;
    const formatted = formatAppDate(date, locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return willRenew
      ? t('paywall.renewsOn', { date: formatted })
      : t('paywall.expiresOn', { date: formatted });
  })();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <MaterialCommunityIcons name="check-decagram" size={20} color={colors.primaryLight} />
        <Text style={styles.statusLabel}>{t('paywall.proActive')}</Text>
      </View>
      <Text style={styles.planName}>
        {displayPrice ? `${planLabel} · ${displayPrice}` : planLabel}
      </Text>
      <Text style={styles.planMeta}>{t('paywall.currentPlanLabel')}</Text>
      {renewalLabel ? <Text style={styles.renewal}>{renewalLabel}</Text> : null}
    </View>
  );
}
