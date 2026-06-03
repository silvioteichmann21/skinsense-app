import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MainTabBar } from '@/components/navigation/MainTabBar';
import type { MainTabParamList } from '@/core/navigation/types';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { ProgressScreen } from '@/screens/progress/ProgressScreen';
import { RoutineScreen } from '@/screens/routine/RoutineScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MainTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Routine" component={RoutineScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="More" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
