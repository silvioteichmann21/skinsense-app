import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveIngredientCard } from '@/components/education/ActiveIngredientCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useLocalizedScienceArticles } from '@/i18n/content/useLocalizedScienceArticle';
import { useLocalizedIngredients } from '@/i18n/content/useLocalizedIngredient';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import {
  CONCERN_INGREDIENT_IDS,
  type SkinConcern,
} from '@/types/activeIngredient';
import type { AppColors } from '@/theme/palettes';
import { layout, radius, shadows, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ScienceLibrary'>;

const CONCERNS: SkinConcern[] = ['hydration', 'acne', 'texture', 'barrier'];

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    intro: {
      marginHorizontal: layout.screenPaddingX,
      marginBottom: spacing.xl,
      padding: spacing.lg,
      borderRadius: layout.listCardRadius,
      backgroundColor: colors.primaryContainer,
      borderWidth: 1,
      borderColor: colors.hairline,
      ...shadows.sm,
    },
    introTitle: {
      ...typography.h3,
      color: colors.onPrimaryContainer,
      marginBottom: spacing.sm,
    },
    introBodyOnHero: {
      color: colors.onPrimaryContainerMuted,
    },
    introBody: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textTertiary,
      marginHorizontal: layout.screenPaddingX,
      marginBottom: spacing.md,
      letterSpacing: 1,
    },
    concernTitle: {
      ...typography.label,
      color: colors.textSecondary,
      marginHorizontal: layout.screenPaddingX,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
      letterSpacing: 0,
      textTransform: 'none',
      fontSize: 14,
    },
    ingredientScroll: {
      paddingHorizontal: layout.screenPaddingX,
      paddingBottom: spacing.sm,
    },
    articleCard: {
      marginHorizontal: layout.screenPaddingX,
      marginBottom: spacing.md,
      padding: spacing.lg,
      borderRadius: layout.listCardRadius,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'center',
      ...shadows.md,
    },
    articleIcon: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    articleBody: {
      flex: 1,
    },
    articleTag: {
      ...typography.caption,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    articleTitle: {
      ...typography.label,
      color: colors.textPrimary,
      lineHeight: 20,
      marginBottom: spacing.xs,
    },
    articleMeta: {
      ...typography.caption,
      color: colors.textTertiary,
    },
    trustCard: {
      marginHorizontal: layout.screenPaddingX,
      marginBottom: spacing.xxl,
      padding: spacing.lg,
      borderRadius: layout.listCardRadius,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
      ...shadows.sm,
    },
    trustTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    trustBody: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
}

function ConcernIngredientList({ concern }: { concern: SkinConcern }) {
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const ingredients = useLocalizedIngredients(CONCERN_INGREDIENT_IDS[concern], concern);

  return (
    <View>
      <Text style={styles.concernTitle}>{t(`science.concerns.${concern}`)}</Text>
      {ingredients.map((ingredient) => (
        <View key={`${concern}-${ingredient.id}`} style={{ paddingHorizontal: layout.screenPaddingX }}>
          <ActiveIngredientCard
            ingredient={ingredient}
            compact
            onPress={() => navigation.navigate('IngredientDetail', { ingredientId: ingredient.id })}
          />
        </View>
      ))}
    </View>
  );
}

export function ScienceLibraryScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const articles = useLocalizedScienceArticles();
  const featured = useLocalizedIngredients(CONCERN_INGREDIENT_IDS.hydration, 'hydration');

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('science.title')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.xxl) + spacing.xl }}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>{t('science.introTitle')}</Text>
          <Text style={[styles.introBody, styles.introBodyOnHero]}>{t('science.introBody')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('science.byConcern')}</Text>
          {CONCERNS.map((concern) => (
            <ConcernIngredientList key={concern} concern={concern} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('science.keyActives')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ingredientScroll}
          >
            {featured.map((ingredient) => (
              <ActiveIngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onPress={() => navigation.navigate('IngredientDetail', { ingredientId: ingredient.id })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('science.articles')}</Text>
          {articles.map((article) => (
            <PressableScale
              key={article.id}
              style={styles.articleCard}
              haptic="light"
              onPress={() => navigation.navigate('ArticleReader', { articleId: article.id })}
            >
              <View style={styles.articleIcon}>
                <MaterialCommunityIcons name={article.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.articleBody}>
                <Text style={styles.articleTag}>{article.tag}</Text>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleMeta}>{article.readTime}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
            </PressableScale>
          ))}
        </View>

        <View style={styles.trustCard}>
          <Text style={styles.trustTitle}>{t('science.trustTitle')}</Text>
          <Text style={styles.trustBody}>{t('science.trustBody')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
