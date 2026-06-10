import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  loadNotificationPreferences,
  type NotificationPreferences,
} from '@/core/storage/notificationPreferences';
import type { InboxNotification } from '@/core/storage/notificationInbox';
import { useI18n } from '@/i18n/I18nProvider';
import { useTranslation } from '@/i18n/useTranslation';
import { useNotificationInbox } from '@/hooks/useNotificationInbox';
import {
  openSystemNotificationSettings,
} from '@/services/notifications/notificationService';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

function formatClockTime(hour: number, minute: number, locale: string): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}

function weekdayLabel(weekday: number, locale: string): string {
  const sunday = new Date(2024, 0, 7);
  const date = new Date(sunday);
  date.setDate(sunday.getDate() + (weekday - 1));
  return date.toLocaleDateString(locale, { weekday: 'short' });
}

function iconForKind(kind: InboxNotification['kind']): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (kind) {
    case 'routine_reminder_am':
      return 'weather-sunny';
    case 'routine_reminder_pm':
      return 'weather-night';
    case 'weekly_scan_reminder':
      return 'camera-timer';
    case 'scan_result_ready':
      return 'clipboard-pulse-outline';
    case 'streak_at_risk':
      return 'fire';
    case 'skin_tips':
      return 'lightbulb-outline';
    default:
      return 'bell-outline';
  }
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      gap: spacing.lg,
    },
    banner: {
      flexDirection: 'row',
      gap: spacing.md,
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.primaryPale,
      padding: spacing.lg,
    },
    bannerText: {
      flex: 1,
      gap: spacing.xs,
    },
    bannerTitle: {
      ...typography.h3,
      color: colors.primaryDark,
    },
    bannerBody: {
      ...typography.body,
      color: colors.textSecondary,
    },
    bannerBtn: {
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
    },
    bannerBtnText: {
      ...typography.body,
      color: colors.primary,
      fontFamily: typography.h3.fontFamily,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      overflow: 'hidden',
      ...shadows.sm,
    },
    scheduleRow: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderMuted,
    },
    scheduleRowLast: {
      borderBottomWidth: 0,
    },
    scheduleLabel: {
      ...typography.body,
      color: colors.textPrimary,
    },
    scheduleOff: {
      color: colors.textTertiary,
    },
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    markRead: {
      ...typography.body,
      color: colors.primary,
      fontFamily: typography.h3.fontFamily,
    },
    empty: {
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      gap: spacing.md,
    },
    emptyTitle: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    emptyBody: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderMuted,
    },
    rowUnread: {
      backgroundColor: colors.surfaceAlt,
    },
    rowIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowBody: {
      flex: 1,
      gap: 2,
    },
    rowTitle: {
      ...typography.body,
      fontFamily: typography.h3.fontFamily,
      color: colors.textPrimary,
    },
    rowMessage: {
      ...typography.body,
      color: colors.textSecondary,
    },
    rowTime: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: spacing.xs,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginTop: spacing.sm,
    },
    settingsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      height: touchTarget,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.primary,
      marginBottom: spacing.xl,
    },
    settingsLabel: {
      ...typography.h3,
      color: colors.primary,
    },
    loading: {
      paddingVertical: spacing.xxl,
      alignItems: 'center',
    },
  });
}

export function NotificationsScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const { items, unreadCount, loading, refresh, markRead, markAllRead } = useNotificationInbox();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const localeTag = locale === 'zh-Hans' ? 'zh-CN' : locale;

  const loadMeta = useCallback(async () => {
    const [nextPrefs, permission] = await Promise.all([
      loadNotificationPreferences(),
      Notifications.getPermissionsAsync(),
    ]);
    setPrefs(nextPrefs);
    setPermissionDenied(permission.status !== Notifications.PermissionStatus.GRANTED);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void loadMeta();
    }, [loadMeta, refresh]),
  );

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  const scheduleLines = useMemo(() => {
    const morningTime = formatClockTime(prefs.morningHour, prefs.morningMinute, localeTag);
    const eveningTime = formatClockTime(prefs.eveningHour, prefs.eveningMinute, localeTag);
    const weeklyTime = formatClockTime(
      prefs.weeklyScanHour,
      prefs.weeklyScanMinute,
      localeTag,
    );
    const tipsTime = formatClockTime(prefs.skinTipsHour, prefs.skinTipsMinute, localeTag);

    return [
      {
        key: 'morning',
        label: prefs.morningReminder
          ? t('notifications.scheduledMorning', { time: morningTime })
          : `${t('notifications.scheduledMorning', { time: morningTime })} · ${t('notifications.scheduledOff')}`,
        off: !prefs.morningReminder,
      },
      {
        key: 'evening',
        label: prefs.eveningReminder
          ? t('notifications.scheduledEvening', { time: eveningTime })
          : `${t('notifications.scheduledEvening', { time: eveningTime })} · ${t('notifications.scheduledOff')}`,
        off: !prefs.eveningReminder,
      },
      {
        key: 'weekly',
        label: prefs.weeklyScan
          ? t('notifications.scheduledWeekly', {
              day: weekdayLabel(prefs.weeklyScanWeekday, localeTag),
              time: weeklyTime,
            })
          : `${t('notifications.scheduledWeekly', { day: weekdayLabel(prefs.weeklyScanWeekday, localeTag), time: weeklyTime })} · ${t('notifications.scheduledOff')}`,
        off: !prefs.weeklyScan,
      },
      {
        key: 'tips',
        label: prefs.skinTips
          ? t('notifications.scheduledTips', {
              day: weekdayLabel(prefs.skinTipsWeekday, localeTag),
              time: tipsTime,
            })
          : `${t('notifications.scheduledTips', { day: weekdayLabel(prefs.skinTipsWeekday, localeTag), time: tipsTime })} · ${t('notifications.scheduledOff')}`,
        off: !prefs.skinTips,
      },
    ];
  }, [localeTag, prefs, t]);

  const onPressItem = async (item: InboxNotification) => {
    await markRead(item.id);
    if (item.targetScreen === 'Routine') {
      navigation.navigate('Main', { screen: 'Routine' } as never);
      return;
    }
    if (item.targetScreen === 'Home') {
      navigation.navigate('Main', { screen: 'Home' } as never);
      return;
    }
    if (item.targetScreen === 'ScanGuide') {
      navigation.navigate('ScanGuide');
      return;
    }
    if (item.targetScreen === 'SkinReport') {
      navigation.navigate('Main', { screen: 'Progress' } as never);
      return;
    }
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('notifications.title')} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {permissionDenied ? (
          <View style={styles.banner}>
            <MaterialCommunityIcons name="bell-off-outline" size={24} color={colors.primary} />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>{t('notifications.permissionTitle')}</Text>
              <Text style={styles.bannerBody}>{t('notifications.permissionBody')}</Text>
              <Pressable
                style={styles.bannerBtn}
                onPress={() => void openSystemNotificationSettings()}
              >
                <Text style={styles.bannerBtnText}>{t('notifications.openSystemSettings')}</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>{t('notifications.scheduledTitle')}</Text>
        <View style={styles.card}>
          {scheduleLines.map((line, index) => (
            <View
              key={line.key}
              style={[
                styles.scheduleRow,
                index === scheduleLines.length - 1 && styles.scheduleRowLast,
              ]}
            >
              <Text style={[styles.scheduleLabel, line.off && styles.scheduleOff]}>{line.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.sectionTitle}>{t('notifications.recentTitle')}</Text>
          {unreadCount > 0 ? (
            <Pressable onPress={() => void markAllRead()}>
              <Text style={styles.markRead}>{t('notifications.markAllRead')}</Text>
            </Pressable>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bell-sleep-outline" size={40} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>{t('notifications.emptyTitle')}</Text>
            <Text style={styles.emptyBody}>{t('notifications.emptyBody')}</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {items.map((item, index) => (
              <Pressable
                key={item.id}
                style={[
                  styles.row,
                  !item.read && styles.rowUnread,
                  index === items.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => void onPressItem(item)}
              >
                <View style={styles.rowIcon}>
                  <MaterialCommunityIcons
                    name={iconForKind(item.kind)}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowMessage}>{item.body}</Text>
                  <Text style={styles.rowTime}>
                    {new Date(item.createdAt).toLocaleString(localeTag, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {!item.read ? <View style={styles.unreadDot} /> : null}
              </Pressable>
            ))}
          </View>
        )}

        <Pressable style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <MaterialCommunityIcons name="cog-outline" size={20} color={colors.primary} />
          <Text style={styles.settingsLabel}>{t('notifications.manageSettings')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
