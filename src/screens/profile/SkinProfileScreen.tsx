import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FitzpatrickScale } from '@/components/profile/FitzpatrickScale';
import { ScanHistoryRow } from '@/components/profile/ScanHistoryRow';
import { SkinProfileConcernRow } from '@/components/profile/SkinProfileConcernRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { SKIN_PROFILE } from '@/screens/profile/skinProfileMockData';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'More'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function SkinProfileScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const retakeQuiz = () => {
    const root = navigation.getParent();
    root?.navigate('SkinQuiz');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
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
        <View style={styles.skinTypeCard}>
          <MaterialCommunityIcons
            name="face-man-shimmer"
            size={120}
            color={colors.primaryPale}
            style={styles.watermark}
          />
          <View style={styles.skinTypeHead}>
            <View style={styles.skinTypeIcon}>
              <MaterialCommunityIcons name="face-man" size={28} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.skinTypeTitle}>{SKIN_PROFILE.skinType}</Text>
              <Text style={styles.clinicalLabel}>{t('skinProfile.clinicallyAnalyzed')}</Text>
            </View>
          </View>
          <Text style={styles.skinTypeDesc}>{SKIN_PROFILE.skinTypeDescription}</Text>
          <View style={styles.chips}>
            {SKIN_PROFILE.skinTypeChips.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
          <Pressable
            onPress={() =>
              Alert.alert(t('skinProfile.feedbackTitle'), t('skinProfile.feedbackMessage'))
            }
          >
            <Text style={styles.disagreeLink}>{t('skinProfile.disagree')}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('skinProfile.fitzpatrick')}</Text>
          <FitzpatrickScale
            activeType={SKIN_PROFILE.fitzpatrickType}
            label={SKIN_PROFILE.fitzpatrickLabel}
            description={SKIN_PROFILE.fitzpatrickDescription}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('skinProfile.topConcerns')}</Text>
          <View style={styles.concernList}>
            {SKIN_PROFILE.concerns.map((c) => (
              <SkinProfileConcernRow key={c.id} concern={c} />
            ))}
          </View>
        </View>

        <View style={styles.prefsCard}>
          <View style={styles.prefsBlock}>
            <View style={styles.prefsHead}>
              <MaterialCommunityIcons name="alert-outline" size={20} color={colors.primary} />
              <Text style={styles.prefsTitle}>{t('skinProfile.sensitivities')}</Text>
            </View>
            <View style={styles.tagRow}>
              {SKIN_PROFILE.sensitivities.map((tag) => (
                <View key={tag} style={styles.sensitivityTag}>
                  <Text style={styles.sensitivityText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.prefsBlock}>
            <View style={styles.prefsHead}>
              <MaterialCommunityIcons name="leaf" size={20} color={colors.primary} />
              <Text style={styles.prefsTitle}>{t('skinProfile.preferences')}</Text>
            </View>
            <View style={styles.tagRow}>
              {SKIN_PROFILE.preferences.map((tag) => (
                <View key={tag} style={styles.preferenceTag}>
                  <Text style={styles.preferenceText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Pressable style={styles.retakeBtn} onPress={retakeQuiz}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={22} color={colors.primary} />
          <Text style={styles.retakeLabel}>{t('skinProfile.retakeQuiz')}</Text>
        </Pressable>

        <View style={styles.historySection}>
          <View style={styles.historyHead}>
            <Text style={styles.cardTitle}>{t('skinProfile.scanHistory')}</Text>
            <Pressable
              onPress={() => navigation.navigate('Compare')}
            >
              <Text style={styles.viewAll}>{t('common.viewAll')}</Text>
            </Pressable>
          </View>
          <View style={styles.historyList}>
            {SKIN_PROFILE.scanHistory.map((entry) => (
              <ScanHistoryRow
                key={entry.id}
                entry={entry}
                onPress={() =>
                  Alert.alert(
                    entry.dateLabel,
                    t('skinProfile.scanDetail', { date: entry.dateLabel, score: entry.score }),
                  )
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  skinTypeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
    ...shadows.sm,
  },
  watermark: {
    position: 'absolute',
    right: -16,
    top: -16,
    opacity: 0.05,
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
    color: colors.primary,
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
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  disagreeLink: {
    ...typography.body,
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primaryPale,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  concernList: {
    gap: spacing.xl,
  },
  prefsCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primaryPale,
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
  sensitivityTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  sensitivityText: {
    fontSize: 11,
    fontFamily: typography.label.fontFamily,
    color: colors.error,
    textTransform: 'capitalize',
  },
  preferenceTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  preferenceText: {
    fontSize: 11,
    fontFamily: typography.label.fontFamily,
    color: colors.white,
    textTransform: 'capitalize',
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
    color: colors.primary,
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
    color: colors.primary,
    textTransform: 'none',
  },
  historyList: {
    gap: spacing.md,
  },
});
