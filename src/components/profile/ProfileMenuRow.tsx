import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ProfileMenuItem } from '@/screens/profile/profileMockData';
import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  item: ProfileMenuItem;
  onPress: () => void;
  isLast?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      minWidth: 0,
      marginRight: spacing.sm,
    },
    label: {
      ...typography.bodyLg,
      color: colors.textPrimary,
      flex: 1,
      minWidth: 0,
    },
  });
}

export function ProfileMenuRow({ item, onPress, isLast }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, !isLast && styles.border]}
    >
      <View style={styles.left}>
        <MaterialCommunityIcons name={item.icon} size={22} color={colors.textSecondary} />
        <Text style={styles.label} numberOfLines={2}>
          {item.label}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
    </Pressable>
  );
}
