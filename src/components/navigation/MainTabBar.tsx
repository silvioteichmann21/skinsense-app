import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/PressableScale';
import type { MainTabParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { ctaGlow, radius, shadows, spacing, touchTarget, typography, useAppTheme, useThemedStyles } from '@/theme';

type TabKey = keyof MainTabParamList;

const TAB_CONFIG: {
  name: TabKey;
  labelKey: 'tabs.home' | 'tabs.routine' | 'tabs.progress' | 'tabs.more';
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconActive?: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { name: 'Home', labelKey: 'tabs.home', icon: 'home-outline', iconActive: 'home' },
  { name: 'Routine', labelKey: 'tabs.routine', icon: 'calendar-check-outline' },
  { name: 'Progress', labelKey: 'tabs.progress', icon: 'chart-line' },
  { name: 'More', labelKey: 'tabs.more', icon: 'dots-horizontal' },
];

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.hairline,
      paddingTop: spacing.sm,
      minHeight: touchTarget + spacing.sm,
      ...shadows.lg,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
    },
    iconPill: {
      width: 44,
      height: 30,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPillActive: {
      backgroundColor: colors.ctaTint,
    },
    tabLabel: {
      ...typography.label,
      color: colors.textTertiary,
      marginTop: 3,
      fontSize: 10,
    },
    tabLabelActive: {
      color: colors.ctaGradientStart,
      fontFamily: typography.h3.fontFamily,
    },
    fabSlot: {
      width: 72,
      alignItems: 'center',
      marginTop: -spacing.xl,
    },
    fabShell: {
      width: 64,
      height: 64,
      borderRadius: radius.full,
      borderWidth: 4,
      borderColor: colors.surface,
      overflow: 'hidden',
      ...ctaGlow(colors.ctaGlow, 'lg'),
    },
    fabGradient: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export function MainTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  const openScan = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('ScanGuide' as never);
    }
  };

  const renderTab = (tab: (typeof TAB_CONFIG)[number]) => {
    const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
    const route = state.routes[routeIndex];
    if (!route) return null;
    const focused = state.index === routeIndex;
    const { options } = descriptors[route.key];

    return (
      <Pressable
        key={tab.name}
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel ?? t(tab.labelKey)}
        onPress={() => navigation.navigate(tab.name)}
        style={styles.tab}
      >
        <View style={[styles.iconPill, focused && styles.iconPillActive]}>
          <MaterialCommunityIcons
            name={focused && tab.iconActive ? tab.iconActive : tab.icon}
            size={24}
            color={focused ? colors.ctaGradientStart : colors.textTertiary}
          />
        </View>
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
          {t(tab.labelKey)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TAB_CONFIG.slice(0, 2).map(renderTab)}

      <View style={styles.fabSlot}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t('tabs.scan')}
          onPress={openScan}
          haptic="medium"
          pressedScale={0.92}
          style={styles.fabShell}
        >
          <LinearGradient
            colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
            locations={[0, 0.48, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fabGradient}
          >
            <MaterialCommunityIcons
              name="image-filter-center-focus"
              size={32}
              color={colors.textInverse}
            />
          </LinearGradient>
        </PressableScale>
      </View>

      {TAB_CONFIG.slice(2).map(renderTab)}
    </View>
  );
}
