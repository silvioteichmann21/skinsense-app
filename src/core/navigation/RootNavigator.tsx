import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/core/navigation/types';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { QuizResultsScreen } from '@/screens/onboarding/QuizResultsScreen';
import { SkinQuizScreen } from '@/screens/onboarding/SkinQuizScreen';
import { ReviewPromptHost } from '@/components/feedback/ReviewPromptHost';
import { MainTabNavigator } from '@/core/navigation/MainTabNavigator';
import { ReportDetailScreen } from '@/screens/report/ReportDetailScreen';
import { SkinReportScreen } from '@/screens/report/SkinReportScreen';
import { RoutineRevealScreen } from '@/screens/routine/RoutineRevealScreen';
import { AIChatScreen } from '@/screens/learn/AIChatScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { AppFeedbackScreen } from '@/screens/profile/AppFeedbackScreen';
import { CommunityReviewsScreen } from '@/screens/profile/CommunityReviewsScreen';
import { HelpSupportScreen } from '@/screens/profile/HelpSupportScreen';
import { PrivacyScreen } from '@/screens/profile/PrivacyScreen';
import { TermsPrivacyScreen } from '@/screens/profile/TermsPrivacyScreen';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';
import { SkinProfileScreen } from '@/screens/profile/SkinProfileScreen';
import { CompareScreen } from '@/screens/progress/CompareScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { LanguageScreen } from '@/screens/settings/LanguageScreen';
import { ArticleReaderScreen } from '@/screens/education/ArticleReaderScreen';
import { IngredientDetailScreen } from '@/screens/education/IngredientDetailScreen';
import { ScienceLibraryScreen } from '@/screens/education/ScienceLibraryScreen';
import { EditRoutineScreen } from '@/screens/routine/EditRoutineScreen';
import { RoutineStepScreen } from '@/screens/routine/RoutineStepScreen';
import { AnalyzingScreen } from '@/screens/scan/AnalyzingScreen';
import { CameraScreen } from '@/screens/scan/CameraScreen';
import { ScanGuideScreen } from '@/screens/scan/ScanGuideScreen';
import { SplashScreen } from '@/screens/onboarding/SplashScreen';
import { WelcomeScreen } from '@/screens/onboarding/WelcomeScreen';
import { useAppTheme } from '@/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useAppTheme();
  const screenBg = { backgroundColor: colors.background };

  return (
    <>
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
        options={{ contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ animation: 'fade', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="SkinQuiz"
        component={SkinQuizScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="QuizResults"
        component={QuizResultsScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="ScanGuide"
        component={ScanGuideScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ animation: 'slide_from_bottom', contentStyle: { backgroundColor: colors.background } }}
      />
      <Stack.Screen
        name="Analyzing"
        component={AnalyzingScreen}
        options={{ animation: 'fade', contentStyle: { backgroundColor: colors.background }, gestureEnabled: false }}
      />
      <Stack.Screen
        name="SkinReport"
        component={SkinReportScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="RoutineReveal"
        component={RoutineRevealScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="RoutineStep"
        component={RoutineStepScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="EditRoutine"
        component={EditRoutineScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="ScienceLibrary"
        component={ScienceLibraryScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="IngredientDetail"
        component={IngredientDetailScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="ArticleReader"
        component={ArticleReaderScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="SkinProfile"
        component={SkinProfileScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Compare"
        component={CompareScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="TermsPrivacy"
        component={TermsPrivacyScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="AppFeedback"
        component={AppFeedbackScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="CommunityReviews"
        component={CommunityReviewsScreen}
        options={{ animation: 'slide_from_right', contentStyle: screenBg }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ animation: 'fade', contentStyle: screenBg }}
      />
    </Stack.Navigator>
    <ReviewPromptHost />
    </>
  );
}
