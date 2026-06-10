import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage } from '@/screens/settings/languages';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  language: AppLanguage;
  selected: boolean;
  onPress: () => void;
  isLast?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  radioGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.full,
  },
});
}

export function LanguageOptionRow({
 language, selected, onPress, isLast }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, !isLast && styles.border]}
    >
      <View style={styles.copy}>
        <Text style={styles.native}>{language.nativeLabel}</Text>
        <Text style={styles.label}>{language.label}</Text>
      </View>
      <View style={[styles.radio, selected && { borderColor: 'transparent' }]}>
        {selected ? (
          <LinearGradient
            colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
            locations={[0, 0.48, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.radioGradient}
          />
        ) : null}
        {selected ? (
          <MaterialCommunityIcons name="check" size={16} color={colors.textInverse} />
        ) : null}
      </View>
    </Pressable>
  );
}
