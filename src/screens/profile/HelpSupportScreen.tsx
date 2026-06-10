import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityReviewsSection } from '@/components/feedback/CommunityReviewsSection';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { layout, radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HelpSupport'>;

const FAQ_KEYS = ['scan', 'account', 'routine', 'privacy', 'medical'] as const;

const SUPPORT_EMAIL = 'hello@skinsense.app';

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
    intro: {
      ...typography.bodyLg,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    contactIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactText: {
      flex: 1,
      gap: 2,
    },
    contactTitle: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    contactEmail: {
      ...typography.body,
      color: colors.primary,
    },
    contactHint: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: spacing.xs,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      letterSpacing: 1,
      marginBottom: spacing.sm,
    },
    faqList: {
      gap: spacing.md,
    },
    faqItem: {
      gap: spacing.xs,
    },
    faqQ: {
      ...typography.h3,
      color: colors.textPrimary,
      fontSize: 15,
    },
    faqA: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.hairline,
      marginTop: spacing.sm,
    },
    actionLabel: {
      ...typography.body,
      color: colors.primary,
      fontFamily: typography.h3.fontFamily,
    },
    disclaimer: {
      ...typography.caption,
      color: colors.textTertiary,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
}

export function HelpSupportScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const openEmail = () => {
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t('help.emailSubject'))}`);
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('help.title')} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{t('help.intro')}</Text>

        <CommunityReviewsSection variant="horizontal" maxItems={4} compact />

        <SurfaceCard variant="elevated">
          <Pressable
            style={styles.contactRow}
            onPress={() => navigation.navigate('AppFeedback')}
            accessibilityRole="button"
          >
            <View style={styles.contactIcon}>
              <MaterialCommunityIcons name="star-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>{t('help.rateTitle')}</Text>
              <Text style={styles.contactHint}>{t('help.rateHint')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
          </Pressable>
        </SurfaceCard>

        <SurfaceCard variant="outlined">
          <Pressable style={styles.contactRow} onPress={openEmail} accessibilityRole="link">
            <View style={styles.contactIcon}>
              <MaterialCommunityIcons name="email-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>{t('help.contactTitle')}</Text>
              <Text style={styles.contactEmail}>{SUPPORT_EMAIL}</Text>
              <Text style={styles.contactHint}>{t('help.contactHint')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
          </Pressable>
        </SurfaceCard>

        <View>
          <Text style={styles.sectionTitle}>{t('help.faqTitle')}</Text>
          <SurfaceCard variant="outlined">
            <View style={styles.faqList}>
              {FAQ_KEYS.map((key) => (
                <View key={key} style={styles.faqItem}>
                  <Text style={styles.faqQ}>
                    {t(`help.faq.${key}.q` as TranslationKey)}
                  </Text>
                  <Text style={styles.faqA}>
                    {t(`help.faq.${key}.a` as TranslationKey)}
                  </Text>
                </View>
              ))}
            </View>
          </SurfaceCard>
        </View>

        <SurfaceCard variant="sunken">
          <Pressable
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AIChat')}
          >
            <Text style={styles.actionLabel}>{t('help.askAi')}</Text>
            <MaterialCommunityIcons name="chat-outline" size={20} color={colors.primary} />
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { borderTopWidth: 0, marginTop: 0 }]}
            onPress={() => navigation.navigate('ScienceLibrary')}
          >
            <Text style={styles.actionLabel}>{t('help.scienceLibrary')}</Text>
            <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
          </Pressable>
        </SurfaceCard>

        <Text style={styles.disclaimer}>{t('help.disclaimer')}</Text>
      </ScrollView>
    </View>
  );
}
