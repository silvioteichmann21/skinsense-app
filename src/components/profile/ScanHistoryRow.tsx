import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { LocalizedScanHistoryEntry } from '@/i18n/content/useLocalizedSkinProfile';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  entry: LocalizedScanHistoryEntry;
  onPress?: () => void;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.primary,
  },
  date: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  scanType: {
    ...typography.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
}

export function ScanHistoryRow({
 entry, onPress }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <View style={styles.scoreCircle}>
          <Text style={styles.score}>{entry.score}</Text>
        </View>
        <View>
          <Text style={styles.date}>{entry.dateLabel}</Text>
          <Text style={styles.scanType}>{entry.scanType}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
    </Pressable>
  );
}
