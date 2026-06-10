import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityReviewsSection } from '@/components/feedback/CommunityReviewsSection';
import { StarRating } from '@/components/feedback/StarRating';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import type { RootStackParamList } from '@/core/navigation/types';
import { useI18n } from '@/i18n/I18nProvider';
import { useTranslation } from '@/i18n/useTranslation';
import { loadProfilePhotoUri } from '@/core/storage/profilePhotoStorage';
import { markFeedbackSubmitted } from '@/core/storage/feedbackPromptStorage';
import { uploadFeedbackAvatar } from '@/services/feedback/feedbackAvatarUpload';
import { submitAppFeedback } from '@/services/feedback/appFeedbackService';
import { resolveFeedbackAuthorName } from '@/services/feedback/reviewAuthor';
import { useAuthStore } from '@/store/authStore';
import { useSkinStore } from '@/store/skinStore';
import type { AppColors } from '@/theme/palettes';
import { layout, radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AppFeedback'>;
type FeedbackRoute = RouteProp<RootStackParamList, 'AppFeedback'>;

const SUPPORT_EMAIL = 'hello@skinsense.app';

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
    intro: {
      ...typography.bodyLg,
      color: colors.textSecondary,
      lineHeight: 24,
      textAlign: 'center',
    },
    card: {
      alignItems: 'center',
      gap: spacing.xl,
    },
    commentLabel: {
      ...typography.label,
      color: colors.textSecondary,
      alignSelf: 'flex-start',
      letterSpacing: 0.8,
    },
    input: {
      width: '100%',
      minHeight: 120,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSunken,
      padding: spacing.lg,
      ...typography.body,
      color: colors.textPrimary,
      textAlignVertical: 'top',
    },
    charCount: {
      ...typography.caption,
      color: colors.textTertiary,
      alignSelf: 'flex-end',
    },
    successCard: {
      alignItems: 'center',
      gap: spacing.lg,
      paddingVertical: spacing.xl,
    },
    successIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTitle: {
      ...typography.h2,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    successBody: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    privacyNote: {
      ...typography.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
}

const MAX_COMMENT = 1000;

export function AppFeedbackScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<FeedbackRoute>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const userId = useAuthStore((s) => s.user?.id);
  const profile = useAuthStore((s) => s.profile);
  const latestScanUri = useSkinStore((s) => s.latestAnalysis?.imageUri);
  const initialStars = route.params?.initialStars ?? 0;

  const [stars, setStars] = useState(initialStars);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialStars >= 1) setStars(initialStars);
  }, [initialStars]);

  const openEmailFallback = () => {
    const subject = encodeURIComponent(t('feedback.emailSubject'));
    const body = encodeURIComponent(
      `${t('feedback.emailStars', { stars: String(stars) })}\n\n${comment.trim()}`,
    );
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
  };

  const handleSubmit = async () => {
    if (stars < 1) {
      Alert.alert(t('feedback.title'), t('feedback.ratingRequired'));
      return;
    }

    setSubmitting(true);

    let authorAvatarUrl: string | null = null;
    if (userId) {
      const photo = await loadProfilePhotoUri();
      const localUri = photo?.idealUri ?? photo?.rawUri ?? latestScanUri ?? null;
      if (localUri) {
        authorAvatarUrl = await uploadFeedbackAvatar(userId, localUri);
      }
    }

    const result = await submitAppFeedback({
      stars,
      comment,
      locale,
      userId,
      authorDisplayName: resolveFeedbackAuthorName(profile),
      authorAvatarUrl,
    });
    setSubmitting(false);

    if (result.ok) {
      await markFeedbackSubmitted();
      setSubmitted(true);
      return;
    }

    Alert.alert(t('feedback.title'), t(result.errorKey ?? 'feedback.submitFailed'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('feedback.sendEmail'), onPress: openEmailFallback },
    ]);
  };

  if (submitted) {
    return (
      <View style={styles.root}>
        <StatusBar style={statusBarStyle} />
        <ScreenHeader topInset={insets.top} title={t('feedback.title')} />
        <View style={[styles.scroll, { flex: 1, justifyContent: 'center' }]}>
          <SurfaceCard variant="elevated" style={styles.successCard}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check-circle" size={40} color={colors.primary} />
            </View>
            <Text style={styles.successTitle}>{t('feedback.thankYouTitle')}</Text>
            <Text style={styles.successBody}>{t('feedback.thankYouBody')}</Text>
            <PrimaryButton
              label={t('common.ok')}
              onPress={() => navigation.goBack()}
              style={{ width: '100%' }}
            />
          </SurfaceCard>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('feedback.title')} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.intro}>{t('feedback.intro')}</Text>

          <CommunityReviewsSection variant="vertical" maxItems={2} showSeeAll />

          <SurfaceCard variant="elevated" style={styles.card}>
            <StarRating value={stars} onChange={setStars} />
          </SurfaceCard>

          <SurfaceCard variant="outlined">
            <Text style={styles.commentLabel}>{t('feedback.commentLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('feedback.commentPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={comment}
              onChangeText={(text) => setComment(text.slice(0, MAX_COMMENT))}
              multiline
              maxLength={MAX_COMMENT}
              editable={!submitting}
            />
            <Text style={styles.charCount}>
              {comment.length}/{MAX_COMMENT}
            </Text>
          </SurfaceCard>

          <Text style={styles.privacyNote}>{t('feedback.privacyNote')}</Text>

          <PrimaryButton
            label={submitting ? t('feedback.submitting') : t('feedback.submit')}
            variant="green"
            onPress={() => void handleSubmit()}
            disabled={submitting || stars < 1}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
