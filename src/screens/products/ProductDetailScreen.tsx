import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductMatchRing } from '@/components/products/ProductMatchRing';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { HOME_DISPLAY_NAME } from '@/screens/home/homeMockData';
import { getProductById } from '@/types/product';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Route = RouteProp<RootStackParamList, 'ProductDetail'>;
type TabId = 'overview' | 'ingredients' | 'reviews' | 'alternatives';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'ingredients', label: 'INGREDIENTS' },
  { id: 'reviews', label: 'REVIEWS' },
  { id: 'alternatives', label: 'ALTERNATIVES' },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons
          key={i}
          name={i <= Math.floor(rating) ? 'star' : 'star-outline'}
          size={18}
          color={colors.accent}
        />
      ))}
    </View>
  );
}

export function ProductDetailScreen() {
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabId>('overview');
  const [saved, setSaved] = useState(false);

  const product = getProductById(route.params.productId);
  const footerBottom = Math.max(insets.bottom, spacing.base);

  if (!product) {
    return (
      <View style={styles.root}>
        <ScreenHeader topInset={insets.top} title="Product" />
        <Text style={styles.missing}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader topInset={insets.top} title={t('common.brand')} style={styles.headerBar} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: touchTarget + footerBottom + spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />
          <View style={styles.heroImageWrap}>
            <Image source={{ uri: product.imageUri }} style={styles.heroImage} contentFit="contain" />
          </View>
        </View>

        <View style={styles.identityCard}>
          <View style={styles.identityTop}>
            <View style={styles.identityLeft}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.meta}>
                {product.category} · {product.skinType}
              </Text>
            </View>
            <View style={styles.identityRight}>
              <Text style={styles.price}>{product.price}</Text>
              <StarRow rating={product.rating} />
              <Text style={styles.reviewMeta}>
                {product.rating} ({product.reviewCount})
              </Text>
            </View>
          </View>

          <View style={styles.matchRow}>
            <ProductMatchRing matchPercent={product.matchPercent} />
            <View style={styles.matchCopy}>
              <Text style={styles.matchTitle}>Match for {HOME_DISPLAY_NAME}</Text>
              <Text style={styles.matchSub}>
                Specifically formulated for your combination skin type.
              </Text>
            </View>
          </View>

          <Text style={styles.whyTitle}>Why it matches your skin</Text>
          <Text style={styles.whyBody}>{product.whyMatch}</Text>
        </View>

        <View style={styles.retailersSection}>
          <Text style={styles.retailersLabel}>AVAILABLE AT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.retailers}>
            {product.retailers.map((name) => (
              <Pressable
                key={name}
                style={styles.retailerBtn}
                onPress={() => Alert.alert(name, t('common.shopSoon'))}
              >
                <Text style={styles.retailerName}>{name}</Text>
                <Text style={styles.affiliateTag}>AFFILIATE</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              style={[styles.tab, tab === t.id && styles.tabActive]}
              onPress={() => setTab(t.id)}
            >
              <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {tab === 'overview' && (
            <>
              <Text style={styles.contentTitle}>Detailed Description</Text>
              <Text style={styles.contentBody}>{product.description}</Text>
              <Text style={[styles.contentTitle, styles.contentSpaced]}>Key Benefits</Text>
              {product.benefits.map((b) => (
                <View key={b} style={styles.bulletRow}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              ))}
              <View style={styles.howCard}>
                <View style={styles.howTitleRow}>
                  <MaterialCommunityIcons name="spa" size={22} color={colors.primary} />
                  <Text style={styles.contentTitle}>How to use</Text>
                </View>
                {product.howToUse.map((step, i) => (
                  <View key={step} style={styles.howRow}>
                    <View style={styles.howNum}>
                      <Text style={styles.howNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.bulletText}>{step}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          {tab === 'ingredients' && (
            <>
              {product.ingredients.map((ing) => (
                <View key={ing.name} style={styles.ingredientRow}>
                  <Text style={styles.ingredientName}>{ing.name}</Text>
                  {ing.note ? <Text style={styles.ingredientNote}>{ing.note}</Text> : null}
                </View>
              ))}
            </>
          )}
          {tab === 'reviews' && (
            <Text style={styles.contentBody}>
              Reviews from users with similar skin types will appear here. Average rating:{' '}
              {product.rating} from {product.reviewCount} reviews.
            </Text>
          )}
          {tab === 'alternatives' && (
            <Text style={styles.contentBody}>
              Alternative products with similar ingredients and match scores are coming soon.
            </Text>
          )}
        </View>
      </ScrollView>

      <BlurView intensity={80} tint="light" style={[styles.footer, { paddingBottom: footerBottom }]}>
        <Pressable
          style={[styles.bookmarkBtn, saved && styles.bookmarkSaved]}
          onPress={() => setSaved((v) => !v)}
        >
          <MaterialCommunityIcons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={colors.primary}
          />
        </Pressable>
        <Pressable
          style={styles.addRoutineBtn}
          onPress={() =>
            Alert.alert(t('products.addToRoutine'), t('products.addSoon', { name: product.name }))
          }
        >
          <MaterialCommunityIcons name="plus" size={22} color={colors.textInverse} />
          <Text style={styles.addRoutineLabel}>{t('products.addToRoutine')}</Text>
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
    backgroundColor: colors.surface,
  },
  missing: {
    padding: spacing.xl,
    ...typography.body,
    color: colors.textSecondary,
  },
  hero: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(183, 228, 199, 0.2)',
  },
  heroBlob2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(255, 171, 105, 0.1)',
  },
  heroImageWrap: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: '#F1F3F2',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1,
  },
  heroImage: {
    width: '85%',
    height: '85%',
  },
  identityCard: {
    marginHorizontal: spacing.base,
    marginTop: -spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    zIndex: 2,
    ...shadows.sm,
  },
  identityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  identityLeft: {
    flex: 1,
  },
  brand: {
    ...typography.label,
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  productName: {
    ...typography.h1,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  meta: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  identityRight: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  stars: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  reviewMeta: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(183, 228, 199, 0.4)',
  },
  matchCopy: {
    flex: 1,
  },
  matchTitle: {
    ...typography.h3,
    color: colors.primaryDark,
  },
  matchSub: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  whyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  whyBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  retailersSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  retailersLabel: {
    ...typography.label,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  retailers: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  retailerBtn: {
    minWidth: 100,
    height: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retailerName: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  affiliateTag: {
    position: 'absolute',
    top: 4,
    right: 6,
    ...typography.label,
    fontSize: 8,
    color: colors.textTertiary,
    letterSpacing: 0,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    ...typography.label,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  tabContent: {
    padding: spacing.base,
    paddingTop: spacing.xl,
  },
  contentTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  contentSpaced: {
    marginTop: spacing.xl,
  },
  contentBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  bulletText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  howCard: {
    marginTop: spacing.xl,
    backgroundColor: '#F1F3FF',
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  howTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  howRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  howNum: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howNumText: {
    fontFamily: typography.score.fontFamily,
    color: colors.textInverse,
    fontWeight: '700',
  },
  ingredientRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  ingredientName: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  ingredientNote: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    overflow: 'hidden',
  },
  bookmarkBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkSaved: {
    backgroundColor: colors.primaryPale,
  },
  addRoutineBtn: {
    flex: 1,
    flexDirection: 'row',
    height: touchTarget,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.md,
  },
  addRoutineLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
});
