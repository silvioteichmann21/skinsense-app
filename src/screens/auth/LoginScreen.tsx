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

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AuthDecorBackground } from '@/components/auth/AuthDecorBackground';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Divider } from '@/components/ui/Divider';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import { TextField } from '@/components/ui/TextField';
import { resolvePostAuthRoute } from '@/core/navigation/authRouting';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginRoute = RouteProp<RootStackParamList, 'Login'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen() {
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
    const { errorKey } = await signIn(email, password);
    if (errorKey) {
      setFormError(t(errorKey));
      return;
    }

    const postAuth = await resolvePostAuthRoute();
    navigation.replace(postAuth.name);
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
          <AuthHeader
            title={t('auth.welcomeBack')}
            subtitle={t('auth.signInSubtitle')}
          />

          {accountCreatedBanner ? (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>{t('auth.accountCreatedBanner')}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
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

            <Pressable
              onPress={handleSignIn}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.signInBtn,
                pressed && styles.signInPressed,
                isLoading && styles.signInDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={styles.signInLabel}>{t('auth.signIn')}</Text>
              )}
            </Pressable>

            <View style={styles.dividerWrap}>
              <Divider />
            </View>

            <View style={styles.socialGap}>
              <SocialAuthButton provider="apple" onPress={() => {}} />
              <SocialAuthButton provider="google" onPress={() => {}} />
            </View>
          </View>

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
  successBanner: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryPale,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  successBannerText: {
    ...typography.body,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadows.sm,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  forgot: {
    ...typography.body,
    color: colors.primaryDark,
    fontFamily: typography.h3.fontFamily,
  },
  formError: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  signInBtn: {
    height: touchTarget,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  signInPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  signInDisabled: {
    opacity: 0.7,
  },
  signInLabel: {
    ...typography.bodyLg,
    color: colors.textInverse,
    fontFamily: typography.h3.fontFamily,
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
