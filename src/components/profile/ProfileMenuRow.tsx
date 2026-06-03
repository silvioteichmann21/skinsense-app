import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ProfileMenuItem } from '@/screens/profile/profileMockData';
import { colors, spacing, typography } from '@/theme';

type Props = {
  item: ProfileMenuItem;
  onPress: () => void;
  isLast?: boolean;
};

export function ProfileMenuRow({ item, onPress, isLast }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, !isLast && styles.border]}
    >
      <View style={styles.left}>
        <MaterialCommunityIcons name={item.icon} size={22} color={colors.textSecondary} />
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.9,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  label: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
});
