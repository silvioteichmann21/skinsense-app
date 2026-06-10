import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useLocalizedScienceArticle } from '@/i18n/content/useLocalizedScienceArticle';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Route = RouteProp<RootStackParamList, 'ArticleReader'>;

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
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    tag: {
      ...typography.caption,
      color: colors.primary,
      backgroundColor: colors.primaryPale,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    readTime: {
      ...typography.caption,
      color: colors.textTertiary,
    },
    title: {
      ...typography.h1,
      fontSize: 26,
      lineHeight: 32,
      color: colors.textPrimary,
      marginBottom: spacing.lg,
    },
    section: {
      gap: spacing.sm,
    },
    heading: {
      ...typography.h3,
      color: colors.primaryDark,
    },
    body: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    takeaway: {
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryPale,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      gap: spacing.sm,
    },
    takeawayLabel: {
      ...typography.label,
      color: colors.primary,
    },
    takeawayText: {
      ...typography.body,
      color: colors.primaryDark,
      lineHeight: 24,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export function ArticleReaderScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const article = useLocalizedScienceArticle(route.params.articleId);

  if (!article) {
    return (
      <View style={styles.root}>
        <ScreenHeader topInset={insets.top} title={t('science.articles')} />
        <Text style={styles.missing}>{t('science.articleNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('science.articles')} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, spacing.xxl) + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={article.icon} size={24} color={colors.primary} />
          </View>
          <View>
            <View style={styles.meta}>
              <Text style={styles.tag}>{article.tag}</Text>
              <Text style={styles.readTime}>{article.readTime}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>{article.title}</Text>

        {article.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.takeaway}>
          <Text style={styles.takeawayLabel}>{t('science.takeaway')}</Text>
          <Text style={styles.takeawayText}>{article.takeaway}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
