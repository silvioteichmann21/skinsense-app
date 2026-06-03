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
import { useTranslation } from '@/i18n/useTranslation';
import { PROFILE_USER } from '@/screens/profile/profileMockData';
import { languageSettingsLabel } from '@/screens/settings/languages';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'More'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);
  const [weeklyScan, setWeeklyScan] = useState(true);
  const [skinTips, setSkinTips] = useState(false);
  const [restock, setRestock] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [haptics, setHaptics] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [healthSync, setHealthSync] = useState(true);
  const [backupHistory, setBackupHistory] = useState(true);
  const [languageLabel, setLanguageLabel] = useState('English (United States)');

  useFocusEffect(
    useCallback(() => {
      getAppLanguage().then((code) => setLanguageLabel(languageSettingsLabel(code)));
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

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
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
          <Image
            source={{ uri: PROFILE_USER.avatarUri }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{PROFILE_USER.displayName}</Text>
            <Text style={styles.profileSub}>{PROFILE_USER.skinType}</Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <MaterialCommunityIcons name="pencil" size={22} color={colors.primary} />
          </Pressable>
        </View>

        <SectionTitle>{t('settings.notifications')}</SectionTitle>
        <View style={[styles.card, styles.cardTint]}>
          <SettingsToggleRow
            label={t('settings.morningReminder')}
            subtitle={t('settings.morningTime')}
            value={morningReminder}
            onValueChange={setMorningReminder}
          />
          <SettingsToggleRow
            label={t('settings.eveningReminder')}
            subtitle={t('settings.eveningTime')}
            value={eveningReminder}
            onValueChange={setEveningReminder}
          />
          <SettingsToggleRow
            label={t('settings.weeklyScan')}
            subtitle={t('settings.weeklyDay')}
            value={weeklyScan}
            onValueChange={setWeeklyScan}
          />
          <SettingsToggleRow
            label={t('settings.skinTips')}
            value={skinTips}
            onValueChange={setSkinTips}
          />
          <SettingsToggleRow
            label={t('settings.restock')}
            value={restock}
            onValueChange={setRestock}
            isLast
          />
        </View>

        <SectionTitle>{t('settings.app')}</SectionTitle>
        <View style={styles.card}>
          <ThemeSelector value={theme} onChange={setTheme} />
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
        </View>

        <SectionTitle>{t('settings.routine')}</SectionTitle>
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

        <SectionTitle>{t('settings.dataSync')}</SectionTitle>
        <View style={styles.card}>
          <View style={[styles.healthRow, styles.border]}>
            <View style={styles.healthLeft}>
              <MaterialCommunityIcons name="heart" size={22} color={colors.error} />
              <Text style={styles.label}>{t('settings.healthIntegration')}</Text>
            </View>
            <Switch
              value={healthSync}
              onValueChange={setHealthSync}
              trackColor={{ false: '#BFC9C1', true: colors.primaryPale }}
              thumbColor={healthSync ? colors.primary : colors.white}
              ios_backgroundColor="#BFC9C1"
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

        <Text style={styles.version}>{t('settings.version')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primaryPale,
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardTint: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  rowDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    opacity: 0.55,
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
  badge: {
    backgroundColor: '#F1F3FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...typography.label,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'none',
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
