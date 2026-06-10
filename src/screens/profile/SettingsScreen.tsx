import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
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

import { SettingsToggleRow } from '@/components/settings/SettingsToggleRow';
import { ThemeSelector, type ThemeMode } from '@/components/settings/ThemeSelector';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { getAppLanguage } from '@/core/storage/languagePreferences';
import { getAppVersionLabel } from '@/utils/appVersion';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  loadNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '@/core/storage/notificationPreferences';
import { rescheduleNotifications } from '@/services/notifications/notificationService';
import { useTranslation } from '@/i18n/useTranslation';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';
import { useSkinStore } from '@/store/skinStore';
import type { TranslationKey } from '@/i18n/useTranslation';
import { languageSettingsLabel } from '@/screens/settings/languages';
import type { AppColors } from '@/theme/palettes';
import {
  radius,
  shadows,
  spacing,
  touchTarget,
  typography,
  useAppTheme,
  useThemedStyles,
} from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'More'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function SectionTitle({
  children,
  styles,
}: {
  children: string;
  styles: ReturnType<typeof createSettingsStyles>;
}) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function createSettingsStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    helpBtn: {
      width: touchTarget,
      height: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      gap: spacing.lg,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.hairline,
      ...shadows.md,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.primaryPale,
    },
    avatarPlaceholder: {
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileText: {
      flex: 1,
      gap: 2,
    },
    profileName: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    profileSub: {
      ...typography.body,
      color: colors.textSecondary,
    },
    editBtn: {
      padding: spacing.sm,
      borderRadius: radius.full,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      marginLeft: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.hairline,
      overflow: 'hidden',
      ...shadows.md,
    },
    cardTint: {
      backgroundColor: colors.surfaceAlt,
      borderColor: colors.border,
    },
    border: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
    },
    label: {
      ...typography.bodyLg,
      fontFamily: typography.h3.fontFamily,
      color: colors.textPrimary,
    },
    langSub: {
      fontFamily: typography.score.fontFamily,
      fontSize: 13,
      color: colors.textTertiary,
      marginTop: 2,
    },
    chevronRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
    },
    subtitlePrimary: {
      fontFamily: typography.score.fontFamily,
      fontSize: 13,
      color: colors.primary,
      marginTop: 2,
    },
    healthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
    },
    healthLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    cacheBlock: {
      padding: spacing.lg,
    },
    cacheBtn: {
      ...typography.bodyLg,
      fontFamily: typography.h3.fontFamily,
      color: colors.error,
    },
    cacheHint: {
      ...typography.label,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textTransform: 'none',
      letterSpacing: 0.2,
    },
    version: {
      ...typography.label,
      color: colors.textTertiary,
      textAlign: 'center',
      paddingVertical: spacing.xl,
      textTransform: 'none',
    },
  });
}

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const styles = useThemedStyles(createSettingsStyles);
  const { colors, statusBarStyle, themeMode, setThemeMode } = useAppTheme();
  const displayName = useUserDisplayName() || t('profile.guestName');
  const { displayUri: profilePhotoUri } = useProfilePhoto();
  const latestScan = useSkinStore((s) => s.latestAnalysis);
  const skinTypeLabel = latestScan?.skinTypeId
    ? t(`reportData.skinTypes.${latestScan.skinTypeId}` as TranslationKey)
    : t('skinProfile.noScanYet');

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );
  const [haptics, setHaptics] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [healthSync, setHealthSync] = useState(true);
  const [backupHistory, setBackupHistory] = useState(true);
  const [languageLabel, setLanguageLabel] = useState('English (United States)');

  const setNotificationPref = useCallback(
    async (patch: Partial<NotificationPreferences>) => {
      const next = await updateNotificationPreferences(patch);
      setNotificationPrefs(next);
      await rescheduleNotifications(next);
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      getAppLanguage().then((code) => setLanguageLabel(languageSettingsLabel(code)));
      loadNotificationPreferences().then(setNotificationPrefs);
    }, []),
  );

  const onClearCache = () => {
    Alert.alert(t('settings.clearCacheTitle'), t('settings.clearCacheMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.clear'),
        style: 'destructive',
        onPress: () => Alert.alert(t('settings.clearCache'), t('settings.cacheCleared')),
      },
    ]);
  };

  const onThemeChange = (mode: ThemeMode) => {
    void setThemeMode(mode);
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader
        topInset={insets.top}
        title={t('settings.title')}
        right={
          <Pressable
            style={styles.helpBtn}
            onPress={() => Alert.alert(t('settings.helpTitle'), t('settings.helpMessage'))}
          >
            <MaterialCommunityIcons name="help-circle-outline" size={24} color={colors.textSecondary} />
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
        <View style={styles.profileCard}>
          {profilePhotoUri ? (
            <Image source={{ uri: profilePhotoUri }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialCommunityIcons name="account" size={28} color={colors.textTertiary} />
            </View>
          )}
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileSub}>{skinTypeLabel}</Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <MaterialCommunityIcons name="pencil" size={22} color={colors.primary} />
          </Pressable>
        </View>

        <SectionTitle styles={styles}>{t('settings.notifications')}</SectionTitle>
        <View style={[styles.card, styles.cardTint]}>
          <SettingsToggleRow
            label={t('settings.morningReminder')}
            subtitle={t('settings.morningTime')}
            value={notificationPrefs.morningReminder}
            onValueChange={(value) => void setNotificationPref({ morningReminder: value })}
          />
          <SettingsToggleRow
            label={t('settings.eveningReminder')}
            subtitle={t('settings.eveningTime')}
            value={notificationPrefs.eveningReminder}
            onValueChange={(value) => void setNotificationPref({ eveningReminder: value })}
          />
          <SettingsToggleRow
            label={t('settings.weeklyScan')}
            subtitle={t('settings.weeklyDay')}
            value={notificationPrefs.weeklyScan}
            onValueChange={(value) => void setNotificationPref({ weeklyScan: value })}
          />
          <SettingsToggleRow
            label={t('settings.skinTips')}
            value={notificationPrefs.skinTips}
            onValueChange={(value) => void setNotificationPref({ skinTips: value })}
            isLast
          />
        </View>

        <SectionTitle styles={styles}>{t('settings.app')}</SectionTitle>
        <View style={styles.card}>
          <ThemeSelector value={themeMode} onChange={onThemeChange} />
          <SettingsToggleRow
            label={t('settings.haptics')}
            value={haptics}
            onValueChange={setHaptics}
          />
          <SettingsToggleRow
            label={t('settings.faceId')}
            value={faceId}
            onValueChange={setFaceId}
          />
          <Pressable
            style={[styles.chevronRow, styles.border]}
            onPress={() => navigation.navigate('Language')}
          >
            <View>
              <Text style={styles.label}>{t('settings.language')}</Text>
              <Text style={styles.langSub}>{languageLabel}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
          </Pressable>
          <Pressable
            style={styles.chevronRow}
            onPress={() => navigation.navigate('AppFeedback')}
          >
            <View>
              <Text style={styles.label}>{t('settings.rateApp')}</Text>
              <Text style={styles.subtitlePrimary}>{t('settings.rateAppHint')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
          </Pressable>
        </View>

        <SectionTitle styles={styles}>{t('settings.routine')}</SectionTitle>
        <View style={styles.card}>
          <Pressable
            style={[styles.chevronRow, styles.border]}
            onPress={() =>
              Alert.alert(t('settings.defaultRoutineView'), t('settings.defaultRoutineAlert'))
            }
          >
            <View>
              <Text style={styles.label}>{t('settings.defaultRoutineView')}</Text>
              <Text style={styles.subtitlePrimary}>{t('settings.lastUsed')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
          </Pressable>
          <SettingsToggleRow
            label={t('settings.autoAdvance')}
            value={autoAdvance}
            onValueChange={setAutoAdvance}
            isLast
          />
        </View>

        <SectionTitle styles={styles}>{t('settings.dataSync')}</SectionTitle>
        <View style={styles.card}>
          <View style={[styles.healthRow, styles.border]}>
            <View style={styles.healthLeft}>
              <MaterialCommunityIcons name="heart" size={22} color={colors.error} />
              <Text style={styles.label}>{t('settings.healthIntegration')}</Text>
            </View>
            <Switch
              value={healthSync}
              onValueChange={setHealthSync}
              trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.switchTrackOff}
            />
          </View>
          <SettingsToggleRow
            label={t('settings.backupHistory')}
            value={backupHistory}
            onValueChange={setBackupHistory}
            isLast
          />
          <View style={styles.cacheBlock}>
            <Pressable onPress={onClearCache}>
              <Text style={styles.cacheBtn}>{t('settings.clearCache')}</Text>
            </Pressable>
            <Text style={styles.cacheHint}>{t('settings.cacheHint')}</Text>
          </View>
        </View>

        <Text style={styles.version}>
          {t('settings.version', { version: getAppVersionLabel() })}
        </Text>
      </ScrollView>
    </View>
  );
}

