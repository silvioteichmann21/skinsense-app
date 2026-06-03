import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileMenuRow } from '@/components/profile/ProfileMenuRow';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useProfileMenu } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import { PROFILE_USER } from '@/screens/profile/profileMockData';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'More'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const menu = useProfileMenu();
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const displayName =
    profile?.displayName?.trim() ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim() ||
    PROFILE_USER.displayName;

  const onMenuPress = (item: (typeof menu)[number]) => {
    if (item.action === 'editProfile') {
      navigation.navigate('EditProfile');
      return;
    }
    if (item.action === 'skinProfile') {
      navigation.navigate('SkinProfile');
      return;
    }
    if (item.action === 'products') {
      navigation.navigate('Products');
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
    Alert.alert(item.label, t('common.comingSoon', { feature: item.label }));
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
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <ScreenBackButton />
        <Text style={styles.headerTitle}>{t('common.brand')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.notifications')}
          style={styles.bellBtn}
          onPress={() =>
            Alert.alert(t('common.notifications'), t('common.notificationSettingsSoon'))
          }
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: PROFILE_USER.avatarUri }} style={styles.avatar} contentFit="cover" />
            <Pressable
              style={styles.editAvatar}
              onPress={() => Alert.alert(t('profile.editPhoto'), t('profile.photoPickerSoon'))}
            >
              <MaterialCommunityIcons name="pencil" size={18} color={colors.white} />
            </Pressable>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{PROFILE_USER.email}</Text>
          <Text style={styles.member}>{t('profile.memberSince')}</Text>
        </View>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('profile.skinTypeCombination')}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('profile.fitzpatrick')}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{PROFILE_USER.totalScans}</Text>
            <Text style={styles.statLabel}>{t('profile.statsTotalScans')}</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <View style={styles.streakRow}>
              <Text style={styles.statValue}>{PROFILE_USER.streakDays}</Text>
              <MaterialCommunityIcons name="fire" size={22} color={colors.accent} />
            </View>
            <Text style={styles.statLabel}>{t('profile.statsStreak')}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{PROFILE_USER.adherencePercent}%</Text>
            <Text style={styles.statLabel}>{t('profile.statsAdherence')}</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {menu.map((item, index) => (
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primary,
    letterSpacing: -0.3,
    flex: 1,
    textAlign: 'center',
  },
  bellBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primaryPale,
  },
  editAvatar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  member: {
    ...typography.label,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textTransform: 'none',
    letterSpacing: 0.2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: 'rgba(183, 228, 199, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(183, 228, 199, 0.35)',
  },
  badgeText: {
    ...typography.label,
    color: colors.primaryDark,
    textTransform: 'none',
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
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
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
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
