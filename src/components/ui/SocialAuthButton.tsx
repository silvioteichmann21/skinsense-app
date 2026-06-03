import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { TranslationKey } from '@/i18n/useTranslation';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, radius, touchTarget, typography } from '@/theme';

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

export function SocialAuthButton({
  provider,
  onPress,
  disabled,
  loading,
  variant = 'filled',
}: Props) {
  const { t } = useTranslation();
  const isApple = provider === 'apple';
  const outlined = variant === 'outlined';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        outlined ? styles.outlined : isApple ? styles.apple : styles.google,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <View style={styles.content}>
          <MaterialCommunityIcons
            name={isApple ? 'apple' : 'google'}
            size={20}
            color={outlined ? colors.textPrimary : isApple ? colors.white : '#4285F4'}
          />
          <Text
            style={[
              styles.label,
              outlined || !isApple ? styles.labelDark : styles.labelApple,
            ]}
          >
            {t(LABEL_KEYS[provider])}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: touchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apple: {
    backgroundColor: '#000000',
  },
  google: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlined: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
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
  },
  labelApple: {
    color: colors.white,
  },
  labelGoogle: {
    color: colors.textPrimary,
  },
  labelDark: {
    color: colors.textPrimary,
  },
});
