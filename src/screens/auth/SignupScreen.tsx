import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
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

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { GenderSelectField } from '@/components/auth/GenderSelectField';
import { AuthDecorBackground } from '@/components/auth/AuthDecorBackground';
import { AuthFormCard } from '@/components/auth/AuthFormCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Divider } from '@/components/ui/Divider';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import { TextField } from '@/components/ui/TextField';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthStore } from '@/store/authStore';
import type { GenderValue } from '@/types/profile';
import { colors, radius, spacing, touchTarget, typography } from '@/theme';

type SignupNav = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export function SignupScreen() {
  const navigation = useNavigation<SignupNav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<GenderValue | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const signUp = useAuthStore((s) => s.signUp);
  const isLoading = useAuthStore((s) => s.isLoading);

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const genderRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [termsError, setTermsError] = useState<string | undefined>();
  const [genderError, setGenderError] = useState<string | undefined>();

  const validate = (): boolean => {
    let ok = true;
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmError(undefined);
    setTermsError(undefined);
    setGenderError(undefined);

    if (firstName.trim().length < 2) {
      setFirstNameError(t('auth.nameMin'));
      ok = false;
    }
    if (lastName.trim().length < 2) {
      setLastNameError(t('auth.nameMin'));
      ok = false;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError(t('auth.emailInvalid'));
      ok = false;
    }
    if (!PASSWORD_RE.test(password)) {
      setPasswordError(t('auth.passwordComplex'));
      ok = false;
    }
    if (password !== confirmPassword) {
      setConfirmError(t('auth.passwordsMismatch'));
      ok = false;
    }
    if (!gender) {
      setGenderError(t('auth.genderRequired'));
      ok = false;
    }
    if (!termsAccepted) {
      setTermsError(t('auth.termsRequired'));
      ok = false;
    }
    return ok;
  };

  const handleCreateAccount = async () => {
    if (!validate()) return;

    setFormError(null);
    const { errorKey, needsEmailConfirmation } = await signUp({
      email,
      password,
      firstName,
      lastName,
      gender: gender!,
    });

    if (errorKey) {
      setFormError(t(errorKey));
      return;
    }

    const message = needsEmailConfirmation
      ? t('auth.emailConfirmationSent')
      : t('auth.accountCreatedMessage');

    Alert.alert(t('auth.accountCreatedTitle'), message, [
      {
        text: t('common.ok'),
        onPress: () =>
          navigation.replace('Login', {
            email: email.trim(),
            accountCreated: true,
          }),
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <AuthDecorBackground />
      <StatusBar style="dark" />

      <ScreenHeader topInset={insets.top} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: spacing.sm, paddingBottom: insets.bottom + spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthFormCard>
            <AuthHeader
              title={t('auth.createAccount')}
              subtitle={t('auth.createSubtitle')}
              titleSize="h2"
            />

            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <TextField
                    ref={firstNameRef}
                    label={t('auth.firstName')}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Jane"
                    autoCapitalize="words"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                    error={firstNameError}
                  />
                </View>
                <View style={styles.nameField}>
                  <TextField
                    ref={lastNameRef}
                    label={t('auth.lastName')}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Doe"
                    autoCapitalize="words"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => genderRef.current?.focus()}
                    error={lastNameError}
                  />
                </View>
              </View>

              <GenderSelectField
                ref={genderRef}
                value={gender}
                onChange={(value) => {
                  setGender(value);
                  setGenderError(undefined);
                }}
                onSelected={() => emailRef.current?.focus()}
                onSubmitEditing={() => emailRef.current?.focus()}
                error={genderError}
              />

              <TextField
                ref={emailRef}
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                placeholder="jane.doe@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
                error={emailError}
              />

              <TextField
                ref={passwordRef}
                label={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureToggle
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                error={passwordError}
              />

              <TextField
                ref={confirmPasswordRef}
                label={t('auth.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureToggle
                returnKeyType="done"
                onSubmitEditing={handleCreateAccount}
                error={confirmError}
              />

              <TermsRow
                checked={termsAccepted}
                onToggle={() => {
                  setTermsAccepted((v) => !v);
                  setTermsError(undefined);
                }}
                error={termsError}
              />

              {formError ? <Text style={styles.formError}>{formError}</Text> : null}

              <Pressable
                onPress={handleCreateAccount}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.createBtn,
                  pressed && styles.createPressed,
                  isLoading && styles.createDisabled,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.textInverse} />
                ) : (
                  <View style={styles.createContent}>
                    <Text style={styles.createLabel}>{t('auth.createAccountBtn')}</Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={20}
                      color={colors.textInverse}
                    />
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.dividerWrap}>
              <Divider label={t('auth.orContinue')} />
            </View>

            <View style={styles.socialGap}>
              <SocialAuthButton provider="apple" variant="outlined" onPress={() => {}} />
              <SocialAuthButton provider="google" variant="outlined" onPress={() => {}} />
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>
                {t('auth.hasAccount')}{' '}
                <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
                  {t('auth.logIn')}
                </Text>
              </Text>
            </View>
          </AuthFormCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function TermsRow({
  checked,
  onToggle,
  error,
}: {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.termsWrap}>
      <Pressable onPress={onToggle} style={styles.termsRow} accessibilityRole="checkbox">
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? (
            <MaterialCommunityIcons name="check" size={14} color={colors.textInverse} />
          ) : null}
        </View>
        <Text style={styles.termsText}>
          {t('auth.termsPrefix')}{' '}
          <Text style={styles.termsLink}>{t('auth.termsLink')}</Text> {t('auth.and')}{' '}
          <Text style={styles.termsLink}>{t('auth.privacyLink')}</Text>
        </Text>
      </Pressable>
      {error ? <Text style={styles.termsError}>{error}</Text> : null}
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
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    justifyContent: 'center',
  },
  form: {
    gap: spacing.base,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  nameField: {
    flex: 1,
  },
  termsWrap: {
    gap: 6,
    paddingVertical: spacing.sm,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  termsError: {
    ...typography.caption,
    color: colors.error,
  },
  formError: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  createBtn: {
    height: touchTarget,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  createPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  createDisabled: {
    opacity: 0.7,
  },
  createContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
  dividerWrap: {
    marginVertical: spacing.lg,
  },
  socialGap: {
    gap: spacing.md,
  },
  cardFooter: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
});
