import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import type { TimelinePhoto } from '@/screens/progress/progressMockData';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles } from '@/theme';

type Props = {
  photo: TimelinePhoto;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: spacing.sm,
    alignItems: 'center',
  },
  cardDimmed: {
    opacity: 0.85,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#DCE2F7',
    marginBottom: spacing.sm,
  },
  imageDimmed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  date: {
    ...typography.label,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  scorePill: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
  },
  scorePillMuted: {
    backgroundColor: '#DCE2F7',
  },
  scoreText: {
    fontFamily: typography.score.fontFamily,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  scoreTextMuted: {
    color: colors.textSecondary,
  },
});
}

export function PhotoTimelineCard({
 photo }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.card, photo.dimmed && styles.cardDimmed]}>
      <View style={[styles.imageWrap, photo.dimmed && styles.imageDimmed]}>
        <Image source={{ uri: photo.imageUri }} style={styles.image} contentFit="cover" />
      </View>
      <Text style={styles.date}>{photo.dateLabel}</Text>
      <View style={[styles.scorePill, photo.dimmed && styles.scorePillMuted]}>
        <Text style={[styles.scoreText, photo.dimmed && styles.scoreTextMuted]}>{photo.score}</Text>
      </View>
    </View>
  );
}
