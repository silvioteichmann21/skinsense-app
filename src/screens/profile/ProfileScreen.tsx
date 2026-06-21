import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileMenuRow } from '@/components/profile/ProfileMenuRow';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TabScreenHeader } from '@/components/ui/TabScreenHeader';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useProfileMenu } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { useActivityStats } from '@/hooks/useActivityStats';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSkinStore } from '@/store/skinStore';
import type { AppColors } from '@/theme/palettes';
import {
  flatCard,
  layout,
  radius,
  spacing,
  typography,
  useAppTheme,
  useThemedStyles,
} from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'More'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function createProfileStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
    },
    hero: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    avatarWrap: {
      marginBottom: spacing.lg,
      borderRadius: radius.full,
    },
    name: {
      ...typography.h3,
      fontSize: 20,
      color: colors.textPrimary,
      textAlign: 'center',
      maxWidth: '100%',
    },
    email: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
      maxWidth: '100%',
    },
    badges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceMuted,
    },
    badgeText: {
      ...typography.label,
      color: colors.primary,
      textTransform: 'none',
      fontSize: 12,
    },
    stats: {
      ...flatCard(colors, false),
      flexDirection: 'row',
      paddingVertical: spacing.lg,
      marginBottom: spacing.xl,
    },
    statCell: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      paddingHorizontal: spacing.xs,
    },
    statBorder: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.borderMuted,
    },
    statValue: {
      ...typography.score,
      fontSize: 28,
      lineHeight: 32,
      color: colors.primary,
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    statLabel: {
      ...typography.label,
      fontSize: 10,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      letterSpacing: 0.8,
    },
    menuCard: {
      ...flatCard(colors, false),
      overflow: 'hidden',
      marginBottom: spacing.xl,
    },
    deleteBtn: {
      alignSelf: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.xl,
    },
    deleteText: {
      ...typography.label,
      color: colors.error,
      textTransform: 'none',
      letterSpacing: 0.5,
    },
  });
}

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const styles = useThemedStyles(createProfileStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const menu = useProfileMenu();
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const displayName = useUserDisplayName() || t('profile.guestName');
  const { totalScans, streakDays, adherencePercent } = useActivityStats();
  const latestScan = useSkinStore((s) => s.latestAnalysis);
  const isPremium = useSubscriptionStore((s) => s.isPremium);

  const displayMenu = menu.map((item) =>
    item.action === 'upgrade'
      ? {
          ...item,
          label: isPremium ? t('profile.menu.manageSubscription') : t('profile.menu.upgrade'),
        }
      : item,
  );

  const onMenuPress = (item: (typeof menu)[number]) => {
    if (item.action === 'upgrade') {
      navigation.navigate('Paywall', {
        result: isPremium ? undefined : latestScan ?? undefined,
        mode: isPremium ? 'manage' : 'checkout',
      });
      return;
    }
    if (item.action === 'editProfile') {
      navigation.navigate('EditProfile');
      return;
    }
    if (item.action === 'skinProfile') {
      navigation.navigate('SkinProfile');
      return;
    }
    if (item.action === 'science') {
      navigation.navigate('ScienceLibrary');
      return;
    }
    if (item.action === 'privacy') {
      navigation.navigate('Privacy');
      return;
    }
    if (item.action === 'settings') {
      navigation.navigate('Settings');
      return;
    }
    if (item.action === 'notifications') {
      navigation.navigate('Notifications');
      return;
    }
    if (item.action === 'helpSupport') {
      navigation.navigate('HelpSupport');
      return;
    }
    if (item.action === 'communityReviews') {
      navigation.navigate('CommunityReviews');
      return;
    }
    if (item.action === 'termsPrivacy') {
      navigation.navigate('TermsPrivacy');
      return;
    }
    if (item.action === 'signOut') {
      Alert.alert(t('profile.signOutTitle'), t('profile.signOutMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.signOut'),
          style: 'destructive',
          onPress: () => {
            void signOut().then(() => {
              const root = navigation.getParent();
              if (root) {
                root.reset({ index: 0, routes: [{ name: 'Welcome' }] });
              }
            });
          },
        },
      ]);
      return;
    }
  };

  const onDeleteAccount = () => {
    Alert.alert(t('profile.deleteTitle'), t('profile.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () =>
          Alert.alert(t('profile.deleteQueued'), t('profile.deleteQueuedMessage')),
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <TabScreenHeader
        topInset={insets.top + spacing.sm}
        title={t('tabs.more')}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.notifications')}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textSecondary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <ProfileAvatar size="lg" style={styles.avatarWrap} />
          <Text style={styles.name} numberOfLines={2}>
            {displayName}
          </Text>
          {profile?.email ? (
            <Text style={styles.email} numberOfLines={1}>
              {profile.email}
            </Text>
          ) : null}
        </View>

        {latestScan ? (
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {latestScan.skinTypeId
                  ? t(`reportData.skinTypes.${latestScan.skinTypeId}` as TranslationKey)
                  : latestScan.skinType}
              </Text>
            </View>
            {latestScan.fitzpatrickId ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {t(`reportData.fitzpatrick.${latestScan.fitzpatrickId}` as TranslationKey)}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.stats}>
          <View style={styles.statCell}>
            <AnimatedCounter value={totalScans} style={styles.statValue} />
            <Text style={styles.statLabel}>{t('profile.statsTotalScans')}</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <View style={styles.streakRow}>
              <AnimatedCounter value={streakDays} style={styles.statValue} />
              <MaterialCommunityIcons name="fire" size={22} color={colors.accent} />
            </View>
            <Text style={styles.statLabel}>{t('profile.statsStreak')}</Text>
          </View>
          <View style={styles.statCell}>
            <AnimatedCounter value={adherencePercent} suffix="%" style={styles.statValue} />
            <Text style={styles.statLabel}>{t('profile.statsAdherence')}</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {displayMenu.map((item, index) => (
            <ProfileMenuRow
              key={item.id}
              item={item}
              isLast={index === menu.length - 1}
              onPress={() => onMenuPress(item)}
            />
          ))}
        </View>

        <Pressable style={styles.deleteBtn} onPress={onDeleteAccount}>
          <Text style={styles.deleteText}>{t('profile.deleteAccount')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

