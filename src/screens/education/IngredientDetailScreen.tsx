import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useLocalizedIngredient } from '@/i18n/content/useLocalizedIngredient';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Route = RouteProp<RootStackParamList, 'IngredientDetail'>;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
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
      alignItems: 'center',
      paddingVertical: spacing.xl,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryPale,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    heroIcon: {
      width: 72,
      height: 72,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    category: {
      ...typography.caption,
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: spacing.xs,
    },
    name: {
      ...typography.h1,
      fontSize: 24,
      color: colors.primaryDark,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    summary: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.lg,
      lineHeight: 22,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    card: {
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    body: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    bulletRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginTop: 9,
    },
    bulletText: {
      ...typography.body,
      color: colors.textSecondary,
      flex: 1,
      lineHeight: 22,
    },
    scienceCard: {
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    evidenceCard: {
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryPale,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    scienceLabel: {
      ...typography.label,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    timeline: {
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryPale,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    timelineText: {
      ...typography.body,
      color: colors.primaryDark,
      lineHeight: 24,
    },
  });
}

export function IngredientDetailScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const ingredient = useLocalizedIngredient(route.params.ingredientId);

  if (!ingredient) {
    return (
      <View style={styles.root}>
        <ScreenHeader topInset={insets.top} title={t('science.title')} />
        <Text style={styles.missing}>{t('science.notFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={ingredient.name} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, spacing.xxl) + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name={ingredient.icon} size={36} color={colors.primary} />
          </View>
          <Text style={styles.category}>{ingredient.category}</Text>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.summary}>{ingredient.summary}</Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>{t('science.whyItWorks')}</Text>
          <View style={styles.card}>
            <Text style={styles.body}>{ingredient.whyItWorks}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>{t('science.howItHelps')}</Text>
          <View style={styles.card}>
            {ingredient.howItHelps.map((line) => (
              <View key={line} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>{t('science.routineRole')}</Text>
          <View style={styles.card}>
            <Text style={styles.body}>{ingredient.routineRole}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>{t('science.whatToExpect')}</Text>
          <View style={styles.timeline}>
            <Text style={styles.timelineText}>{ingredient.consistencyNote}</Text>
          </View>
        </View>

        <View style={styles.scienceCard}>
          <Text style={styles.scienceLabel}>{t('science.scienceNote')}</Text>
          <Text style={styles.body}>{ingredient.scienceNote}</Text>
        </View>

        <View style={styles.evidenceCard}>
          <Text style={styles.scienceLabel}>{t('science.evidenceTitle')}</Text>
          <Text style={styles.body}>{ingredient.evidenceNote}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
