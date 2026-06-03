import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileSectionTitle } from '@/components/profile/ProfileSectionTitle';
import { SkinGoalChips } from '@/components/profile/SkinGoalChips';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  EDIT_PROFILE_DEFAULTS,
  GENDER_OPTIONS,
  type GenderValue,
} from '@/screens/profile/editProfileData';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

const GENDER_LABEL_KEYS: Record<GenderValue, TranslationKey> = {
  male: 'editProfile.genderMale',
  female: 'editProfile.genderFemale',
  'non-binary': 'editProfile.genderNonBinary',
  'prefer-not-to-say': 'editProfile.genderPreferNot',
};

export function EditProfileScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState(EDIT_PROFILE_DEFAULTS.firstName);
  const [lastName, setLastName] = useState(EDIT_PROFILE_DEFAULTS.lastName);
  const [email, setEmail] = useState(EDIT_PROFILE_DEFAULTS.email);
  const [dateOfBirth, setDateOfBirth] = useState(EDIT_PROFILE_DEFAULTS.dateOfBirth);
  const [gender, setGender] = useState<GenderValue>(EDIT_PROFILE_DEFAULTS.gender);
  const [skinGoals, setSkinGoals] = useState<string[]>(EDIT_PROFILE_DEFAULTS.skinGoals);
  const [avatarUri] = useState(EDIT_PROFILE_DEFAULTS.avatarUri);
  const [saving, setSaving] = useState(false);

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();

  const toggleGoal = (id: string) => {
    setSkinGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const pickGender = () => {
    Alert.alert(t('editProfile.gender'), undefined, [
      ...GENDER_OPTIONS.map((opt) => ({
        text: t(GENDER_LABEL_KEYS[opt.value]),
        onPress: () => setGender(opt.value),
      })),
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const validate = (): boolean => {
    let ok = true;
    setFirstNameError(undefined);
    setLastNameError(undefined);
    if (firstName.trim().length < 1) {
      setFirstNameError(t('common.required'));
      ok = false;
    }
    if (lastName.trim().length < 1) {
      setLastNameError(t('common.required'));
      ok = false;
    }
    return ok;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    // TODO: PATCH /users/me
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    Alert.alert(t('editProfile.saved'), t('editProfile.savedMessage'), [
      { text: t('common.ok'), onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader topInset={insets.top} title={t('editProfile.title')} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.photoSection}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
              <Pressable
                style={styles.cameraBtn}
                onPress={() => Alert.alert(t('editProfile.changePhoto'), t('profile.photoPickerSoon'))}
              >
                <MaterialCommunityIcons name="camera" size={18} color={colors.white} />
              </Pressable>
            </View>
            <Pressable onPress={() => Alert.alert(t('editProfile.changePhoto'), t('profile.photoPickerSoon'))}>
              <Text style={styles.changePhoto}>{t('editProfile.changePhoto')}</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <ProfileSectionTitle title={t('editProfile.personalInfo')} />
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <TextField
                  label={t('editProfile.firstName')}
                  value={firstName}
                  onChangeText={setFirstName}
                  error={firstNameError}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.nameField}>
                <TextField
                  label={t('editProfile.lastName')}
                  value={lastName}
                  onChangeText={setLastName}
                  error={lastNameError}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>{t('editProfile.email')}</Text>
              <View style={styles.emailWrap}>
                <TextInput
                  style={styles.emailInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textTertiary}
                />
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={14} color={colors.primaryDark} />
                  <Text style={styles.verifiedText}>{t('editProfile.verified')}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ProfileSectionTitle title={t('editProfile.demographics')} />
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <TextField
                  label={t('editProfile.dateOfBirth')}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder={t('editProfile.dobPlaceholder')}
                />
              </View>
              <View style={styles.nameField}>
                <Text style={styles.fieldLabel}>{t('editProfile.gender')}</Text>
                <Pressable style={styles.selectField} onPress={pickGender}>
                  <Text style={styles.selectValue}>{t(GENDER_LABEL_KEYS[gender])}</Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={22}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ProfileSectionTitle
              title={t('editProfile.skinGoals')}
              subtitle={t('editProfile.skinGoalsSub')}
            />
            <SkinGoalChips
              selected={skinGoals}
              maxSelect={3}
              onToggle={toggleGoal}
              onLimitReached={() =>
                Alert.alert(t('editProfile.skinGoals'), t('editProfile.goalLimit'))
              }
            />
          </View>
        </ScrollView>

        <BlurView
          intensity={72}
          tint="light"
          style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}
        >
          <Pressable
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveLabel}>{t('editProfile.saveChanges')}</Text>
            )}
          </Pressable>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
  },
  photoSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: radius.full,
    borderWidth: 4,
    borderColor: colors.white,
    ...shadows.sm,
  },
  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  changePhoto: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.primary,
  },
  section: {
    gap: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  nameField: {
    flex: 1,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  emailWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
  },
  emailInput: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(183, 228, 199, 0.35)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: typography.label.fontFamily,
    color: colors.primaryDark,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: touchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  selectValue: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    overflow: 'hidden',
  },
  saveBtn: {
    height: touchTarget,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveLabel: {
    ...typography.h3,
    color: colors.white,
  },
});
