import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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

import { GenderSelectField } from '@/components/auth/GenderSelectField';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { SkinGoalChips } from '@/components/profile/SkinGoalChips';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextField } from '@/components/ui/TextField';
import type { RootStackParamList } from '@/core/navigation/types';
import { loadQuizAnswers, saveQuizAnswers } from '@/core/storage/quizStorage';
import { useLocalizedGoalOptions } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import type { GenderValue } from '@/screens/profile/editProfileData';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import { emptyQuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import { upsertProfile } from '@/services/auth/profileService';
import { useAuthStore } from '@/store/authStore';
import type { AppColors } from '@/theme/palettes';
import { layout, radius, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
      gap: layout.sectionGap,
    },
    photoSection: {
      alignItems: 'center',
      gap: spacing.md,
      paddingBottom: spacing.xs,
    },
    cardBody: {
      gap: spacing.lg,
    },
    field: {
      gap: spacing.xs,
    },
    fieldLabel: {
      ...typography.label,
      color: colors.textSecondary,
    },
    emailWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: touchTarget,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSunken,
      paddingLeft: spacing.base,
      paddingRight: spacing.sm,
    },
    emailInput: {
      flex: 1,
      ...typography.body,
      color: colors.textSecondary,
      paddingVertical: spacing.sm,
    },
    verifiedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primaryPale,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: radius.full,
    },
    verifiedText: {
      fontSize: 10,
      fontFamily: typography.label.fontFamily,
      color: colors.onPrimaryPale,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    footer: {
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.hairline,
      overflow: 'hidden',
    },
    saveBtn: {
      borderRadius: radius.lg,
    },
    saveLoading: {
      height: touchTarget,
      borderRadius: radius.lg,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.85,
    },
  });
}

export function EditProfileScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle, blurTint } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const goalOptions = useLocalizedGoalOptions();

  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);

  const emailVerified = Boolean(user?.email_confirmed_at);

  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const email = profile?.email ?? user?.email ?? '';
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<GenderValue>(profile?.gender ?? 'prefer-not-to-say');
  const [skinGoals, setSkinGoals] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [saving, setSaving] = useState(false);

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();

  useEffect(() => {
    setFirstName(profile?.firstName ?? '');
    setLastName(profile?.lastName ?? '');
    setGender(profile?.gender ?? 'prefer-not-to-say');
  }, [profile]);

  useEffect(() => {
    let active = true;
    void loadQuizAnswers().then((answers) => {
      if (!active) return;
      setQuizAnswers(answers);
      setSkinGoals(answers?.goals ?? []);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleGoal = (id: string) => {
    setSkinGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
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
    try {
      if (user?.id) {
        const updated = await upsertProfile({
          userId: user.id,
          email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
        });
        if (updated) setProfile(updated);
      }

      const nextAnswers: QuizAnswers = {
        ...(quizAnswers ?? emptyQuizAnswers()),
        goals: skinGoals,
      };
      await saveQuizAnswers(nextAnswers);
      setQuizAnswers(nextAnswers);

      Alert.alert(t('editProfile.saved'), t('editProfile.savedMessage'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert(t('common.error'), t('editProfile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader
        topInset={insets.top}
        title={t('editProfile.title')}
        titleColor={colors.textPrimary}
        variant="muted"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 108 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.photoSection}>
            <ProfileAvatar size="lg" showEdit />
          </View>

          <SurfaceCard variant="elevated" padding={layout.cardPadding}>
            <SectionHeading title={t('editProfile.personalInfo')} uppercase={false} />
            <View style={styles.cardBody}>
              <TextField
                label={t('editProfile.firstName')}
                value={firstName}
                onChangeText={setFirstName}
                error={firstNameError}
                autoCapitalize="words"
              />
              <TextField
                label={t('editProfile.lastName')}
                value={lastName}
                onChangeText={setLastName}
                error={lastNameError}
                autoCapitalize="words"
              />
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>{t('editProfile.email')}</Text>
                <View style={styles.emailWrap}>
                  <TextInput
                    style={styles.emailInput}
                    value={email}
                    editable={false}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder={t('editProfile.email')}
                    placeholderTextColor={colors.textTertiary}
                  />
                  {emailVerified ? (
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={14}
                        color={colors.onPrimaryPale}
                      />
                      <Text style={styles.verifiedText}>{t('editProfile.verified')}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </SurfaceCard>

          <SurfaceCard variant="elevated" padding={layout.cardPadding}>
            <SectionHeading title={t('editProfile.demographics')} uppercase={false} />
            <View style={styles.cardBody}>
              <TextField
                label={t('editProfile.dateOfBirth')}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder={t('editProfile.dobPlaceholder')}
              />
              <GenderSelectField
                value={gender}
                onChange={setGender}
                labelKey="editProfile.gender"
              />
            </View>
          </SurfaceCard>

          <SurfaceCard variant="elevated" padding={layout.cardPadding}>
            <SectionHeading
              title={t('editProfile.skinGoals')}
              subtitle={t('editProfile.skinGoalsSub')}
              uppercase={false}
            />
            <SkinGoalChips
              options={goalOptions}
              selected={skinGoals}
              maxSelect={3}
              onToggle={toggleGoal}
              onLimitReached={() =>
                Alert.alert(t('editProfile.skinGoals'), t('editProfile.goalLimit'))
              }
            />
          </SurfaceCard>
        </ScrollView>

        <BlurView
          intensity={72}
          tint={blurTint}
          style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}
        >
          {saving ? (
            <View style={styles.saveLoading}>
              <ActivityIndicator color={colors.white} />
            </View>
          ) : (
            <PrimaryButton
              label={t('editProfile.saveChanges')}
              onPress={handleSave}
              variant="green"
              style={styles.saveBtn}
            />
          )}
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}
