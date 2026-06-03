import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import type { Product } from '@/types/product';
import { matchBadgeStyle } from '@/types/product';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  product: Product;
  onPress: () => void;
  onAddToRoutine?: () => void;
};

export function ProductGridCard({ product, onPress, onAddToRoutine }: Props) {
  const { t } = useTranslation();
  const badge = matchBadgeStyle(product.matchPercent);

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.imageUri }} style={styles.image} contentFit="cover" />
        <View style={[styles.matchBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.matchText, { color: badge.text }]}>
            {t('products.matchPercent', { percent: product.matchPercent })}
          </Text>
        </View>
      </View>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.ratingRow}>
        <MaterialCommunityIcons name="star" size={14} color={colors.accent} />
        <Text style={styles.rating}>{product.rating}</Text>
        <Text style={styles.reviews}>({product.reviewCount})</Text>
      </View>
      <Text style={styles.price}>{product.price}</Text>
      <Pressable
        style={styles.addBtn}
        onPress={(e) => {
          e.stopPropagation?.();
          onAddToRoutine?.();
        }}
      >
        <Text style={styles.addLabel}>{t('products.addToRoutine')}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: '#F1F3FF',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  matchText: {
    fontSize: 10,
    fontFamily: typography.score.fontFamily,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  brand: {
    ...typography.label,
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
    minHeight: 44,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  rating: {
    fontFamily: typography.score.fontFamily,
    fontSize: 12,
    color: colors.textPrimary,
  },
  reviews: {
    fontFamily: typography.score.fontFamily,
    fontSize: 12,
    color: colors.textTertiary,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  addBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  addLabel: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
    letterSpacing: 0,
    fontFamily: typography.h3.fontFamily,
  },
});
