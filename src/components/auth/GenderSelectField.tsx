import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useCallback } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInput as TextInputType,
  View,
} from 'react-native';

import type { GenderValue } from '@/types/profile';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { colors, radius, spacing, touchTarget, typography } from '@/theme';

const GENDER_LABEL_KEYS: Record<GenderValue, TranslationKey> = {
  male: 'editProfile.genderMale',
  female: 'editProfile.genderFemale',
  'non-binary': 'editProfile.genderNonBinary',
  'prefer-not-to-say': 'editProfile.genderPreferNot',
};

type Props = {
  value: GenderValue | null;
  onChange: (value: GenderValue) => void;
  labelKey?: TranslationKey;
  error?: string;
  returnKeyType?: 'next' | 'done' | 'go';
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
  /** Called after user picks a gender (e.g. focus next field). */
  onSelected?: () => void;
};

export const GenderSelectField = forwardRef<TextInputType, Props>(function GenderSelectField(
  {
    value,
    onChange,
    labelKey = 'auth.gender',
    error,
    returnKeyType = 'next',
    blurOnSubmit = false,
    onSubmitEditing,
    onSelected,
  },
  ref,
) {
  const { t } = useTranslation();

  const displayValue = value ? t(GENDER_LABEL_KEYS[value]) : '';

  const pickGender = useCallback(() => {
    Alert.alert(t(labelKey), undefined, [
      ...(Object.keys(GENDER_LABEL_KEYS) as GenderValue[]).map((opt) => ({
        text: t(GENDER_LABEL_KEYS[opt]),
        onPress: () => {
          onChange(opt);
          onSelected?.();
        },
      })),
      { text: t('common.cancel'), style: 'cancel' as const },
    ]);
  }, [labelKey, onChange, onSelected, t]);

  const handleSubmit = () => {
    if (!value) {
      pickGender();
      return;
    }
    onSubmitEditing?.();
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t(labelKey)}</Text>
      <View style={[styles.fieldWrap, error && styles.fieldError]}>
        <TextInput
          ref={ref}
          value={displayValue}
          placeholder={t('auth.genderPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          showSoftInputOnFocus={false}
          caretHidden
          editable
          onChangeText={() => {}}
          onFocus={pickGender}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          onSubmitEditing={handleSubmit}
          style={styles.input}
          accessibilityLabel={t(labelKey)}
          accessibilityRole="button"
        />
        <Pressable
          onPress={pickGender}
          style={styles.chevronBtn}
          hitSlop={8}
          accessibilityLabel={t(labelKey)}
        >
          <MaterialCommunityIcons name="chevron-down" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  fieldError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: colors.textPrimary,
  },
  chevronBtn: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    minHeight: touchTarget,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
});
