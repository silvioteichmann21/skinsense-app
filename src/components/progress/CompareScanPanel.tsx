import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CompareScanOption } from '@/screens/progress/compareMockData';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  scan: CompareScanOption;
  onPickDate: () => void;
  variant?: 'initial' | 'current';
};

export function CompareScanPanel({ scan, onPickDate, variant = 'initial' }: Props) {
  const isCurrent = variant === 'current';

  return (
    <View style={styles.wrap}>
      <View style={styles.photoWrap}>
        <Image source={{ uri: scan.imageUri }} style={styles.photo} contentFit="cover" />
        <View style={[styles.badge, isCurrent ? styles.badgeCurrent : styles.badgeInitial]}>
          <Text style={styles.badgeText}>{scan.badge}</Text>
        </View>
      </View>
      <Pressable style={styles.dateBtn} onPress={onPickDate}>
        <Text style={styles.dateText}>{scan.dateLabel}</Text>
        <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    gap: spacing.md,
  },
  photoWrap: {
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeInitial: {
    backgroundColor: 'rgba(45, 106, 79, 0.85)',
  },
  badgeCurrent: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: typography.h3.fontFamily,
    color: colors.white,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#F1F3FF',
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  dateText: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    fontSize: 12,
  },
});
