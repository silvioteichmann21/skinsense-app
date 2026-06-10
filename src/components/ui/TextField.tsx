import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInput as TextInputType,
  TextInputProps,
  View,
} from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { radius, touchTarget, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  secureToggle?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      gap: 8,
    },
    label: {
      ...typography.label,
      color: colors.textSecondary,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: touchTarget,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceAlt,
    },
    inputError: {
      borderColor: colors.error,
    },
    input: {
      flex: 1,
      paddingHorizontal: 16,
      ...typography.body,
      color: colors.textPrimary,
    },
    eyeBtn: {
      paddingHorizontal: 12,
      height: touchTarget,
      justifyContent: 'center',
    },
    error: {
      ...typography.caption,
      color: colors.error,
    },
  });
}

export const TextField = forwardRef<TextInputType, Props>(function TextField(
  { label, error, secureToggle, secureTextEntry, ...inputProps },
  ref,
) {
  const [masked, setMasked] = useState(
    secureToggle ? true : Boolean(secureTextEntry),
  );
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  const isSecure = secureToggle ? masked : secureTextEntry;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        <TextInput
          ref={ref}
          {...inputProps}
          secureTextEntry={isSecure}
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />
        {secureToggle ? (
          <Pressable
            onPress={() => setMasked((v) => !v)}
            style={styles.eyeBtn}
            hitSlop={8}
            accessibilityLabel={masked ? 'Show password' : 'Hide password'}
          >
            <MaterialCommunityIcons
              name={masked ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});
