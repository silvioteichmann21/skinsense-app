import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
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

import { AuthDecorBackground } from '@/components/auth/AuthDecorBackground';
import { AuthFeedbackBanner } from '@/components/auth/AuthFeedbackBanner';
import { AuthFormCard } from '@/components/auth/AuthFormCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Divider } from '@/components/ui/Divider';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import { TextField } from '@/components/ui/TextField';
import { navigateAfterSignIn } from '@/core/navigation/navigatePostAuth';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthStore } from '@/store/authStore';
import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginRoute = RouteProp<RootStackParamList, 'Login'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    justifyContent: 'center',
  },
  card: {
    gap: spacing.lg,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  forgot: {
    ...typography.body,
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  formError: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  signInWrap: {
    marginTop: spacing.sm,
  },
  dividerWrap: {
    marginVertical: spacing.sm,
  },
  socialGap: {
    gap: spacing.base,
  },
  footer: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footerLink: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
});
}

export function LoginScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<LoginNav>();
  const route = useRoute<LoginRoute>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [email, setEmail] = useState(route.params?.email ?? '');
  const [accountCreatedBanner, setAccountCreatedBanner] = useState(
    Boolean(route.params?.accountCreated),
  );
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const signIn = useAuthStore((s) => s.signIn);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [authFeedback, setAuthFeedback] = useState<{
    variant: 'success' | 'error';
    message: string;
  } | null>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
    if (route.params?.accountCreated) {
      setAccountCreatedBanner(true);
    }
  }, [route.params?.email, route.params?.accountCreated]);

  const validate = (): boolean => {
    let ok = true;
    setFormError(null);
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!EMAIL_RE.test(email.trim())) {
      setEmailError(t('auth.emailInvalid'));
      ok = false;
    }
    if (password.length < 8) {
      setPasswordError(t('auth.passwordMin'));
      ok = false;
    }
    return ok;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setFormError(null);
    setAuthFeedback(null);
    const { errorKey } = await signIn(email, password);
    if (errorKey) {
      const message =
        errorKey === 'auth.networkError'
          ? `${t('auth.networkError')}\n\n${t('auth.networkErrorDetail')}`
          : t(errorKey);
      setFormError(message);
      setAuthFeedback({ variant: 'error', message });
      Alert.alert(t('auth.signInFailedTitle'), message);
      return;
    }

    setAuthFeedback({ variant: 'success', message: t('auth.signInSuccessMessage') });
    void navigateAfterSignIn(navigation, useAuthStore.getState().profile);
  };

  const handleForgotPassword = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError(t('auth.emailInvalid'));
      Alert.alert(t('auth.resetPasswordTitle'), t('auth.resetPasswordEnterEmail'));
      return;
    }
    const { errorKey } = await resetPassword(email);
    if (errorKey) {
      Alert.alert(t('auth.resetPasswordTitle'), t(errorKey));
      return;
    }
    Alert.alert(t('auth.resetPasswordTitle'), t('auth.resetPasswordSent'));
  };

  return (
    <View style={styles.root}>
      <AuthDecorBackground />
      <StatusBar style={statusBarStyle} />

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
          <AuthHeader
            title={t('auth.welcomeBack')}
            subtitle={t('auth.signInSubtitle')}
          />

          {accountCreatedBanner ? (
            <AuthFeedbackBanner
              variant="success"
              message={t('auth.accountCreatedBanner')}
            />
          ) : null}

          {authFeedback ? (
            <AuthFeedbackBanner variant={authFeedback.variant} message={authFeedback.message} />
          ) : null}

          <AuthFormCard style={styles.card}>
            <TextField
              ref={emailRef}
              label={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
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
              placeholder={t('auth.password')}
              secureToggle
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
              error={passwordError}
            />

            <Pressable style={styles.forgotWrap} onPress={handleForgotPassword}>
              <Text style={styles.forgot}>{t('auth.forgotPassword')}</Text>
            </Pressable>

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            <View style={styles.signInWrap}>
              {isLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <PrimaryButton label={t('auth.signIn')} variant="green" onPress={handleSignIn} />
              )}
            </View>

            <View style={styles.dividerWrap}>
              <Divider />
            </View>

            <View style={styles.socialGap}>
              <SocialAuthButton provider="apple" variant="outlined" onPress={() => {}} />
              <SocialAuthButton provider="google" variant="outlined" onPress={() => {}} />
            </View>
          </AuthFormCard>

          <Text style={styles.footer}>
            {t('auth.noAccount')}{' '}
            <Text style={styles.footerLink} onPress={() => navigation.navigate('Signup')}>
              {t('auth.signUp')}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
