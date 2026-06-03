import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/core/navigation/types';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { QuizResultsScreen } from '@/screens/onboarding/QuizResultsScreen';
import { SkinQuizScreen } from '@/screens/onboarding/SkinQuizScreen';
import { MainTabNavigator } from '@/core/navigation/MainTabNavigator';
import { ReportDetailScreen } from '@/screens/report/ReportDetailScreen';
import { SkinReportScreen } from '@/screens/report/SkinReportScreen';
import { RoutineRevealScreen } from '@/screens/routine/RoutineRevealScreen';
import { AIChatScreen } from '@/screens/learn/AIChatScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { PrivacyScreen } from '@/screens/profile/PrivacyScreen';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';
import { SkinProfileScreen } from '@/screens/profile/SkinProfileScreen';
import { CompareScreen } from '@/screens/progress/CompareScreen';
import { LanguageScreen } from '@/screens/settings/LanguageScreen';
import { IngredientScanResultScreen } from '@/screens/products/IngredientScanResultScreen';
import { IngredientScannerScreen } from '@/screens/products/IngredientScannerScreen';
import { ProductDetailScreen } from '@/screens/products/ProductDetailScreen';
import { ProductsScreen } from '@/screens/products/ProductsScreen';
import { RoutineStepScreen } from '@/screens/routine/RoutineStepScreen';
import { AnalyzingScreen } from '@/screens/scan/AnalyzingScreen';
import { CameraScreen } from '@/screens/scan/CameraScreen';
import { ScanGuideScreen } from '@/screens/scan/ScanGuideScreen';
import { SplashScreen } from '@/screens/onboarding/SplashScreen';
import { WelcomeScreen } from '@/screens/onboarding/WelcomeScreen';
import { colors } from '@/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ contentStyle: { backgroundColor: colors.primaryContainer } }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ animation: 'fade', contentStyle: { backgroundColor: colors.primaryDark } }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="SkinQuiz"
        component={SkinQuizScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="QuizResults"
        component={QuizResultsScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="ScanGuide"
        component={ScanGuideScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ animation: 'slide_from_bottom', contentStyle: { backgroundColor: '#000' } }}
      />
      <Stack.Screen
        name="Analyzing"
        component={AnalyzingScreen}
        options={{ animation: 'fade', contentStyle: { backgroundColor: '#000' }, gestureEnabled: false }}
      />
      <Stack.Screen
        name="SkinReport"
        component={SkinReportScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="RoutineReveal"
        component={RoutineRevealScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="RoutineStep"
        component={RoutineStepScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="IngredientScanner"
        component={IngredientScannerScreen}
        options={{ animation: 'slide_from_bottom', contentStyle: { backgroundColor: '#000' } }}
      />
      <Stack.Screen
        name="IngredientScanResult"
        component={IngredientScanResultScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="SkinProfile"
        component={SkinProfileScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Compare"
        component={CompareScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ animation: 'fade', contentStyle: { backgroundColor: colors.background } }}
      />
    </Stack.Navigator>
  );
}
