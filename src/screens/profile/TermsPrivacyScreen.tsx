import { StatusBar } from 'expo-status-bar';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { layout, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

const TERMS_SECTIONS = ['acceptance', 'service', 'health', 'account', 'ip', 'liability', 'changes'] as const;
const PRIVACY_SECTIONS = [
  'overview',
  'collect',
  'use',
  'storage',
  'sharing',
  'rights',
  'children',
  'contact',
] as const;

const SUPPORT_EMAIL = 'hello@skinsense.app';
const PRIVACY_URL = 'https://skinsense.app/privacy';
const TERMS_URL = 'https://skinsense.app/terms';

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
      gap: layout.sectionGap,
    },
    docTitle: {
      ...typography.h1,
      fontSize: 24,
      color: colors.primary,
    },
    updated: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    section: {
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    sectionBody: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    webLink: {
      ...typography.body,
      color: colors.primary,
      textDecorationLine: 'underline',
      marginTop: spacing.md,
    },
    footerNote: {
      ...typography.caption,
      color: colors.textTertiary,
      lineHeight: 20,
      textAlign: 'center',
      paddingBottom: spacing.xl,
    },
  });
}

function LegalSections({
  prefix,
  sectionIds,
  styles,
  t,
}: {
  prefix: 'legal.terms' | 'legal.privacy';
  sectionIds: readonly string[];
  styles: ReturnType<typeof createStyles>;
  t: (key: TranslationKey) => string;
}) {
  return (
    <>
      {sectionIds.map((id) => (
        <View key={id} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t(`${prefix}.sections.${id}.title` as TranslationKey)}
          </Text>
          <Text style={styles.sectionBody}>
            {t(`${prefix}.sections.${id}.body` as TranslationKey)}
          </Text>
        </View>
      ))}
    </>
  );
}

export function TermsPrivacyScreen() {
  const styles = useThemedStyles(createStyles);
  const { statusBarStyle } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const openUrl = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('legal.screenTitle')} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <SurfaceCard variant="elevated">
          <Text style={styles.docTitle}>{t('legal.terms.title')}</Text>
          <Text style={styles.updated}>{t('legal.terms.updated')}</Text>
          <LegalSections prefix="legal.terms" sectionIds={TERMS_SECTIONS} styles={styles} t={t} />
          <Pressable onPress={() => openUrl(TERMS_URL)}>
            <Text style={styles.webLink}>{t('legal.terms.webLink')}</Text>
          </Pressable>
        </SurfaceCard>

        <SurfaceCard variant="outlined">
          <Text style={styles.docTitle}>{t('legal.privacy.title')}</Text>
          <Text style={styles.updated}>{t('legal.privacy.updated')}</Text>
          <LegalSections prefix="legal.privacy" sectionIds={PRIVACY_SECTIONS} styles={styles} t={t} />
          <Pressable onPress={() => openUrl(PRIVACY_URL)}>
            <Text style={styles.webLink}>{t('legal.privacy.webLink')}</Text>
          </Pressable>
        </SurfaceCard>

        <Text style={styles.footerNote}>
          {t('legal.footer', { email: SUPPORT_EMAIL })}
        </Text>
      </ScrollView>
    </View>
  );
}
