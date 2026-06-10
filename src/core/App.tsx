import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { I18nProvider } from '@/i18n/I18nProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { RootNavigator } from '@/core/navigation/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { useRoutineStore } from '@/store/routineStore';
import { useSkinStore } from '@/store/skinStore';
import { useAppTheme } from '@/theme';

function AppShell() {
  const { colors, statusBarStyle } = useAppTheme();
  const isAuthReady = useAuthStore((s) => s.isInitialized);
  const userId = useAuthStore((s) => s.user?.id);
  const loadHistory = useSkinStore((s) => s.loadHistory);
  const hydrateRoutine = useRoutineStore((s) => s.hydrate);

  useEffect(() => {
    if (!isAuthReady) return;
    void loadHistory();
    void hydrateRoutine();
  }, [isAuthReady, userId, loadHistory, hydrateRoutine]);

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    SpaceMono_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.primaryContainer }]}>
        <ActivityIndicator color={colors.textInverse} size="large" />
        <StatusBar style={statusBarStyle} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <I18nProvider>
          <AuthProvider>
            <NotificationProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </NotificationProvider>
          </AuthProvider>
        </I18nProvider>
        <StatusBar style={statusBarStyle} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
