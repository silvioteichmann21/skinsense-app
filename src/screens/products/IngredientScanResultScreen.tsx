import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MetricScoreRing } from '@/components/products/MetricScoreRing';
import { ScannedIngredientRow } from '@/components/products/ScannedIngredientRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { INGREDIENT_SCAN_RESULT } from '@/screens/products/ingredientScanMockData';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IngredientScanResult'>;

const RESULT = INGREDIENT_SCAN_RESULT;

export function IngredientScanResultScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader
        topInset={insets.top}
        title={t('products.scanResults')}
        right={
          <Pressable
            style={styles.shareBtn}
            onPress={() => Alert.alert(t('common.share'), t('products.shareResultsSoon'))}
          >
            <MaterialCommunityIcons name="share-variant" size={22} color={colors.primary} />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: RESULT.heroImageUri }} style={styles.hero} contentFit="cover" />
          <View style={styles.heroFade} />
        </View>

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.productHead}>
            <Text style={styles.category}>{RESULT.category}</Text>
            <Text style={styles.productName}>{RESULT.name}</Text>
            <Text style={styles.productSub}>{RESULT.subtitle}</Text>
          </View>

          <View style={styles.scoreGrid}>
            <View style={styles.scoreCard}>
              <MetricScoreRing score={RESULT.safetyScore} />
              <Text style={styles.scoreTitle}>Safety Score</Text>
              <Text style={styles.scoreCaption}>CLINICALLY VERIFIED</Text>
            </View>
            <View style={[styles.scoreCard, styles.scoreCardMatch]}>
              <MetricScoreRing
                score={RESULT.matchScore}
                progressColor="#005236"
                trackColor="rgba(183, 228, 199, 0.35)"
                textColor="#005236"
              />
              <Text style={[styles.scoreTitle, styles.scoreTitleMatch]}>Your Match</Text>
              <Text style={styles.scoreCaption}>PERSONALIZED TO YOU</Text>
            </View>
          </View>

          <View style={styles.warning}>
            <View style={styles.warningIcon}>
              <MaterialCommunityIcons name="alert" size={22} color="#93000A" />
            </View>
            <View style={styles.warningBody}>
              <Text style={styles.warningTitle}>{RESULT.watchOutTitle}</Text>
              <Text style={styles.warningText}>{RESULT.watchOutBody}</Text>
            </View>
          </View>

          <View style={styles.ingredientsSection}>
            <View style={styles.ingredientsHead}>
              <Text style={styles.ingredientsTitle}>Ingredients Analysis</Text>
              <Text style={styles.ingredientsCount}>{RESULT.totalIngredients} TOTAL</Text>
            </View>
            <View style={styles.ingredientList}>
              {RESULT.ingredients.map((ing) => (
                <ScannedIngredientRow key={ing.id} ingredient={ing} />
              ))}
            </View>
            <Pressable
              style={styles.viewAllBtn}
              onPress={() =>
                Alert.alert(
                  t('products.allIngredients'),
                  t('common.comingSoon', { feature: t('products.allIngredients') }),
                )
              }
            >
              <Text style={styles.viewAllText}>View all {RESULT.totalIngredients} ingredients</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <BlurView
        intensity={80}
        tint="light"
        style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <Pressable
          style={styles.saveBtn}
          onPress={() => Alert.alert(t('common.saved'), t('products.savedProduct', { name: RESULT.name }))}
        >
          <MaterialCommunityIcons name="bookmark" size={22} color={colors.white} />
          <Text style={styles.saveLabel}>{t('common.saved')}</Text>
        </Pressable>
        <Pressable
          style={styles.cartBtn}
          onPress={() => Alert.alert(t('common.shop'), t('common.shopSoon'))}
        >
          <MaterialCommunityIcons name="cart-outline" size={24} color={colors.primary} />
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
  shareBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrap: {
    height: 300,
    position: 'relative',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: colors.background,
    opacity: 0.85,
  },
  sheet: {
    marginTop: -96,
    marginHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingBottom: spacing.xxl,
    ...shadows.sm,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(112, 121, 115, 0.25)',
    alignSelf: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  productHead: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  category: {
    ...typography.label,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  productName: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  productSub: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scoreGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  scoreCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.surface,
  },
  scoreCardMatch: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primaryPale,
  },
  scoreTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  scoreTitleMatch: {
    color: '#005236',
  },
  scoreCaption: {
    ...typography.label,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textTransform: 'none',
    letterSpacing: 0.5,
  },
  warning: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255, 218, 214, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.2)',
  },
  warningIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: '#FFDAD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTitle: {
    ...typography.h3,
    color: '#93000A',
  },
  warningText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  warningBody: {
    flex: 1,
  },
  ingredientsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  ingredientsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  ingredientsTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  ingredientsCount: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
  },
  ingredientList: {
    gap: spacing.md,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  viewAllText: {
    ...typography.h3,
    color: colors.primary,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: touchTarget,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  saveLabel: {
    ...typography.h3,
    color: colors.white,
  },
  cartBtn: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
