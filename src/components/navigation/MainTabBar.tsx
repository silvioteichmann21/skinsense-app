import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainTabParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

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

export function MainTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const openScan = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('ScanGuide' as never);
    }
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TAB_CONFIG.slice(0, 2).map((tab) => {
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
            <MaterialCommunityIcons
              name={focused && tab.iconActive ? tab.iconActive : tab.icon}
              size={24}
              color={focused ? colors.primary : colors.textTertiary}
            />
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}

      <View style={styles.fabSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('tabs.scan')}
          onPress={openScan}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <MaterialCommunityIcons name="image-filter-center-focus" size={32} color={colors.textInverse} />
        </Pressable>
      </View>

      {TAB_CONFIG.slice(2).map((tab) => {
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
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={focused ? colors.primary : colors.textTertiary}
            />
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    paddingTop: spacing.sm,
    minHeight: touchTarget + spacing.sm,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    ...typography.label,
    color: colors.textTertiary,
    marginTop: 2,
    fontSize: 10,
  },
  tabLabelActive: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  fabSlot: {
    width: 72,
    alignItems: 'center',
    marginTop: -spacing.xl,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background,
    ...shadows.md,
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
  },
});
