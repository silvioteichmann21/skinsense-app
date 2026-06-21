import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FitzpatrickScale } from '@/components/profile/FitzpatrickScale';
import { ScanHistoryRow } from '@/components/profile/ScanHistoryRow';
import { SkinProfileConcernRow } from '@/components/profile/SkinProfileConcernRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import type { RootStackParamList } from '@/core/navigation/types';
import { useLocalizedSkinProfile } from '@/i18n/content/useLocalizedSkinProfile';
import { useTranslation } from '@/i18n/useTranslation';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { useSkinStore } from '@/store/skinStore';
import type { AppColors } from '@/theme/palettes';
import { glow, layout, radius, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SkinProfile'>;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    settingsBtn: {
      width: touchTarget,
      height: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
      gap: layout.sectionGap,
    },
    skinTypeHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    skinTypeIcon: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skinTypeTitle: {
      ...typography.h2,
      color: colors.textPrimary,
    },
    clinicalLabel: {
      ...typography.label,
      color: colors.ctaGradientStart,
      letterSpacing: 1.5,
      marginTop: 2,
    },
    skinTypeDesc: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.primaryPale,
    },
    chipText: {
      fontSize: 11,
      fontFamily: typography.label.fontFamily,
      color: colors.onPrimaryPale,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    disagreeLink: {
      ...typography.body,
      color: colors.ctaGradientStart,
      textDecorationLine: 'underline',
      textDecorationColor: colors.primaryPale,
    },
    cardTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.lg,
    },
    concernList: {
      gap: spacing.xl,
    },
    emptyConcerns: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    prefsCard: {
      gap: spacing.xl,
    },
    prefsBlock: {
      gap: spacing.md,
    },
    prefsHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    prefsTitle: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    preferenceTag: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radius.full,
      backgroundColor: colors.ctaGradientMid,
    },
    preferenceText: {
      fontSize: 11,
      fontFamily: typography.label.fontFamily,
      color: colors.white,
      textTransform: 'capitalize',
    },
    emptyPrefs: {
      ...typography.body,
      color: colors.textTertiary,
    },
    retakeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      height: touchTarget,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    retakeLabel: {
      ...typography.h3,
      color: colors.ctaGradientStart,
    },
    historySection: {
      gap: spacing.lg,
    },
    historyHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    viewAll: {
      ...typography.label,
      color: colors.ctaGradientStart,
      textTransform: 'none',
    },
    historyList: {
      gap: spacing.md,
    },
    scanCta: {
      marginTop: spacing.md,
      ...glow(colors.primaryGlow, 'md'),
    },
  });
}

export function SkinProfileScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const profile = useLocalizedSkinProfile();
  const displayName = useUserDisplayName();
  const getScanById = useSkinStore((s) => s.getScanById);
  const removeScanRecord = useSkinStore((s) => s.removeScanRecord);

  const retakeQuiz = () => {
    navigation.push('SkinQuiz', displayName ? { displayName } : undefined);
  };

  const openScan = () => {
    navigation.navigate('ScanGuide');
  };

  const openScanReport = (scanId: string) => {
    const record = getScanById(scanId);
    if (record) {
      navigation.navigate('SkinReport', { result: record });
      return;
    }
    Alert.alert(t('skinProfile.scanHistory'), t('skinProfile.scanNotFound'));
  };

  const confirmDeleteScan = (scanId: string, dateLabel: string) => {
    Alert.alert(t('skinProfile.deleteScanTitle'), t('skinProfile.deleteScanMessage', { date: dateLabel }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          void removeScanRecord(scanId);
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader
        topInset={insets.top}
        title={t('skinProfile.title')}
        right={
          <Pressable
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            accessibilityLabel={t('settings.title')}
          >
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.primary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SurfaceCard variant="elevated">
          <View style={styles.skinTypeHead}>
            <View style={styles.skinTypeIcon}>
              <MaterialCommunityIcons name="face-man" size={28} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.skinTypeTitle}>{profile.skinType}</Text>
              <Text style={styles.clinicalLabel}>
                {profile.hasData
                  ? t('skinProfile.clinicallyAnalyzed')
                  : t('skinProfile.noScanYet')}
              </Text>
            </View>
          </View>
          <Text style={styles.skinTypeDesc}>{profile.skinTypeDescription}</Text>
          {profile.skinTypeChips.length > 0 ? (
            <View style={styles.chips}>
              {profile.skinTypeChips.map((chip) => (
                <View key={chip} style={styles.chip}>
                  <Text style={styles.chipText}>{chip}</Text>
                </View>
              ))}
            </View>
          ) : null}
          {!profile.hasData ? (
            <PrimaryButton
              label={t('skinProfile.emptyCta')}
              variant="green"
              onPress={openScan}
              style={styles.scanCta}
            />
          ) : (
            <Pressable
              onPress={() =>
                Alert.alert(t('skinProfile.feedbackTitle'), t('skinProfile.feedbackMessage'))
              }
            >
              <Text style={styles.disagreeLink}>{t('skinProfile.disagree')}</Text>
            </Pressable>
          )}
        </SurfaceCard>

        <SurfaceCard variant="outlined">
          <Text style={styles.cardTitle}>{t('skinProfile.fitzpatrick')}</Text>
          <FitzpatrickScale
            activeType={profile.fitzpatrickType}
            label={profile.fitzpatrickLabel}
            description={profile.fitzpatrickDescription}
            unavailableLabel={t('skinProfile.fitzpatrickUnavailable')}
            unavailableDescription={t('skinProfile.fitzpatrickUnavailableDesc')}
          />
        </SurfaceCard>

        <SurfaceCard variant="outlined">
          <Text style={styles.cardTitle}>{t('skinProfile.topConcerns')}</Text>
          {profile.concerns.length > 0 ? (
            <View style={styles.concernList}>
              {profile.concerns.map((c) => (
                <SkinProfileConcernRow key={c.id} concern={c} />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyConcerns}>{t('skinProfile.noConcernsYet')}</Text>
          )}
        </SurfaceCard>

        <SurfaceCard variant="sunken" style={styles.prefsCard}>
          <View style={styles.prefsBlock}>
            <View style={styles.prefsHead}>
              <MaterialCommunityIcons name="leaf" size={20} color={colors.primary} />
              <Text style={styles.prefsTitle}>{t('skinProfile.preferences')}</Text>
            </View>
            {profile.preferences.length > 0 ? (
              <View style={styles.tagRow}>
                {profile.preferences.map((tag) => (
                  <View key={tag} style={styles.preferenceTag}>
                    <Text style={styles.preferenceText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyPrefs}>{t('skinProfile.noGoalsYet')}</Text>
            )}
          </View>
        </SurfaceCard>

        <Pressable style={styles.retakeBtn} onPress={retakeQuiz}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={22} color={colors.primary} />
          <Text style={styles.retakeLabel}>{t('skinProfile.retakeQuiz')}</Text>
        </Pressable>

        {profile.scanHistory.length > 0 ? (
          <View style={styles.historySection}>
            <View style={styles.historyHead}>
              <Text style={styles.cardTitle}>{t('skinProfile.scanHistory')}</Text>
              <Pressable onPress={() => navigation.navigate('Compare')}>
                <Text style={styles.viewAll}>{t('common.viewAll')}</Text>
              </Pressable>
            </View>
            <View style={styles.historyList}>
              {profile.scanHistory.map((entry) => (
                <ScanHistoryRow
                  key={entry.id}
                  entry={entry}
                  onPress={() => openScanReport(entry.id)}
                  onDelete={() => confirmDeleteScan(entry.id, entry.dateLabel)}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
