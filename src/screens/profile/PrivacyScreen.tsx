import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { usePrivacyContent } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
  },
  intro: {
    gap: spacing.md,
  },
  introTitle: {
    ...typography.h1,
    color: colors.primary,
  },
  introBody: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.hairline,
    gap: spacing.lg,
    ...shadows.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  list: {
    gap: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  listIcon: {
    marginTop: 2,
  },
  listText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  listBold: {
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  highlight: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  highlightGlow: {
    position: 'absolute',
    right: -32,
    top: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(45, 106, 79, 0.35)',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    zIndex: 1,
  },
  highlightIcon: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(183, 228, 199, 0.2)',
  },
  highlightText: {
    flex: 1,
    gap: spacing.xs,
  },
  highlightTitle: {
    ...typography.h3,
    color: colors.white,
  },
  highlightBody: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  highlightEmphasis: {
    fontFamily: typography.h3.fontFamily,
    textDecorationLine: 'underline',
    textDecorationColor: colors.accentLight,
  },
  cloudSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  cloudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cloudChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(240, 255, 244, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(183, 228, 199, 0.35)',
    minWidth: '45%',
    flexGrow: 1,
  },
  cloudChipText: {
    ...typography.label,
    color: colors.primaryDark,
    textTransform: 'none',
    fontSize: 12,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.sm,
  },
  toggleCardActive: {
    borderColor: colors.primaryPale,
  },
  toggleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  toggleTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  toggleBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: touchTarget,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  exportLabel: {
    ...typography.h3,
    color: colors.primary,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: touchTarget,
    borderRadius: radius.lg,
    backgroundColor: colors.error,
  },
  deleteLabel: {
    ...typography.h3,
    color: colors.white,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  footerLink: {
    ...typography.label,
    color: colors.textTertiary,
    textTransform: 'none',
  },
});
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'Privacy'>;

export function PrivacyScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();

  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { collect, cloud, footer } = usePrivacyContent();
  const [researchEnabled, setResearchEnabled] = useState(true);

  const onExport = () => {
    Alert.alert(t('privacy.exportTitle'), t('privacy.exportMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('privacy.requestExport'),
        onPress: () => Alert.alert(t('common.requested'), t('privacy.exportStarted')),
      },
    ]);
  };

  const onDeleteAll = () => {
    Alert.alert(t('privacy.deleteTitle'), t('privacy.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('privacy.deleteEverything'),
        style: 'destructive',
        onPress: () =>
          Alert.alert(t('privacy.deleteQueued'), t('privacy.deleteQueuedMessage')),
      },
    ]);
  };

  const onFooterLink = () => {
    navigation.navigate('TermsPrivacy');
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('privacy.title')} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>{t('privacy.introTitle')}</Text>
          <Text style={styles.introBody}>{t('privacy.introBody')}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <MaterialCommunityIcons name="format-list-bulleted" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>{t('privacy.collectTitle')}</Text>
          </View>
          <View style={styles.list}>
            {collect.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={colors.primaryContainer}
                  style={styles.listIcon}
                />
                <Text style={styles.listText}>
                  <Text style={styles.listBold}>{item.title}: </Text>
                  {item.body}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.highlight}>
          <View style={styles.highlightGlow} />
          <View style={styles.highlightRow}>
            <View style={styles.highlightIcon}>
              <MaterialCommunityIcons name="shield-lock" size={40} color={colors.primaryPale} />
            </View>
            <View style={styles.highlightText}>
              <Text style={styles.highlightTitle}>{t('privacy.localTitle')}</Text>
              <Text style={styles.highlightBody}>{t('privacy.localBody')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cloudSection}>
          <Text style={styles.sectionTitle}>{t('privacy.cloudTitle')}</Text>
          <View style={styles.cloudGrid}>
            {cloud.map((label) => (
              <View key={label} style={styles.cloudChip}>
                <MaterialCommunityIcons name="cloud-check" size={20} color={colors.primary} />
                <Text style={styles.cloudChipText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.toggleCard, researchEnabled && styles.toggleCardActive]}>
          <View style={styles.toggleCopy}>
            <Text style={styles.toggleTitle}>{t('privacy.researchTitle')}</Text>
            <Text style={styles.toggleBody}>{t('privacy.researchBody')}</Text>
          </View>
          <Switch
            value={researchEnabled}
            onValueChange={setResearchEnabled}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.periodTrack}
          />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.exportBtn} onPress={onExport}>
            <MaterialCommunityIcons name="download" size={22} color={colors.primary} />
            <Text style={styles.exportLabel}>{t('privacy.exportData')}</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={onDeleteAll}>
            <MaterialCommunityIcons name="delete-forever" size={22} color={colors.white} />
            <Text style={styles.deleteLabel}>{t('privacy.deleteAll')}</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          {footer.map((link) => (
            <Pressable key={link.id} onPress={onFooterLink}>
              <Text style={styles.footerLink}>{link.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
