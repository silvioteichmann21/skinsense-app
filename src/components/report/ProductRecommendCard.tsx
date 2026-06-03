import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecommendedProduct } from '@/screens/report/concernDetailData';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  product: RecommendedProduct;
  onPress?: () => void;
};

export function ProductRecommendCard({ product, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.imageUri }} style={styles.image} contentFit="cover" />
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{product.matchPercent}% MATCH</Text>
        </View>
      </View>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.price}>{product.price}</Text>
    </Pressable>
  );
}

const CARD_WIDTH = 176;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  imageWrap: {
    width: '100%',
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
    right: spacing.sm,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  matchText: {
    fontSize: 10,
    fontFamily: typography.h3.fontFamily,
    color: colors.primaryDark,
  },
  brand: {
    ...typography.label,
    fontSize: 10,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 40,
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.primary,
  },
});
