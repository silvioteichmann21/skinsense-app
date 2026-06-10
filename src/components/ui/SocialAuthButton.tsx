import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { TranslationKey } from '@/i18n/useTranslation';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, touchTarget, typography, useAppTheme, useThemedStyles } from '@/theme';

type Provider = 'apple' | 'google';

type Props = {
  provider: Provider;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined';
};

const LABEL_KEYS: Record<Provider, TranslationKey> = {
  apple: 'auth.continueApple',
  google: 'auth.continueGoogle',
};

function createStyles(colors: AppColors, isDark: boolean) {
  return StyleSheet.create({
    base: {
      height: touchTarget,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    appleFilled: {
      backgroundColor: isDark ? colors.surfaceAlt : '#000000',
      borderColor: isDark ? colors.border : '#000000',
    },
    googleFilled: {
      backgroundColor: isDark ? colors.surfaceAlt : colors.white,
    },
    outlined: {
      backgroundColor: isDark ? colors.surfaceAlt : colors.white,
    },
    pressed: {
      opacity: 0.9,
    },
    disabled: {
      opacity: 0.6,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    label: {
      ...typography.body,
      fontFamily: typography.h3.fontFamily,
      color: colors.textPrimary,
    },
    labelOnDarkApple: {
      color: colors.textInverse,
    },
  });
}

export function SocialAuthButton({
  provider,
  onPress,
  disabled,
  loading,
  variant = 'filled',
}: Props) {
  const { t } = useTranslation();
  const { colors, resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === 'dark';
  const styles = useThemedStyles((palette) => createStyles(palette, isDark));
  const isApple = provider === 'apple';
  const outlined = variant === 'outlined';
  const appleFilledOnLight = isApple && !outlined && !isDark;

  const iconColor = isApple
    ? appleFilledOnLight
      ? colors.textInverse
      : colors.textPrimary
    : '#4285F4';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        outlined
          ? styles.outlined
          : isApple
            ? styles.appleFilled
            : styles.googleFilled,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <View style={styles.content}>
          <MaterialCommunityIcons name={isApple ? 'apple' : 'google'} size={20} color={iconColor} />
          <Text style={[styles.label, appleFilledOnLight && styles.labelOnDarkApple]}>
            {t(LABEL_KEYS[provider])}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
