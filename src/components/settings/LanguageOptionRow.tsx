import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage } from '@/screens/settings/languages';
import { colors, spacing, typography } from '@/theme';

type Props = {
  language: AppLanguage;
  selected: boolean;
  onPress: () => void;
  isLast?: boolean;
};

export function LanguageOptionRow({ language, selected, onPress, isLast }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, !isLast && styles.border]}
    >
      <View style={styles.copy}>
        <Text style={styles.native}>{language.nativeLabel}</Text>
        <Text style={styles.label}>{language.label}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? (
          <MaterialCommunityIcons name="check" size={16} color={colors.textInverse} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  native: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
