import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';

const ROOT_FALLBACK: Partial<Record<keyof RootStackParamList, keyof RootStackParamList>> = {
  Welcome: 'Splash',
  Login: 'Welcome',
  Signup: 'Welcome',
  SkinQuiz: 'Welcome',
  QuizResults: 'SkinQuiz',
  ScanGuide: 'QuizResults',
  Camera: 'ScanGuide',
  Analyzing: 'Camera',
  Paywall: 'Camera',
  SkinReport: 'ScanGuide',
  ReportDetail: 'SkinReport',
  RoutineReveal: 'SkinReport',
  RoutineStep: 'Main',
  ScienceLibrary: 'Main',
  IngredientDetail: 'ScienceLibrary',
  ArticleReader: 'ScienceLibrary',
  AIChat: 'Main',
  EditProfile: 'Main',
  SkinProfile: 'Main',
  Privacy: 'Main',
  Settings: 'Main',
  Compare: 'Main',
  Notifications: 'Main',
  Language: 'Settings',
  HelpSupport: 'Main',
  TermsPrivacy: 'Main',
  AppFeedback: 'Main',
  CommunityReviews: 'Main',
};

const TAB_ROOT_ACTION: Partial<
  Record<keyof MainTabParamList, keyof RootStackParamList | 'Home'>
> = {
  Home: 'ScanGuide',
  Routine: 'Home',
  Progress: 'Home',
  More: 'Home',
};

const TAB_NAMES = new Set<string>(['Home', 'Routine', 'Progress', 'More']);

function isTabRoute(name: string): name is keyof MainTabParamList {
  return TAB_NAMES.has(name);
}

export function useAppBack() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  const routeName = route.name;
  const isTabRoot = isTabRoute(routeName);
  const showBack = routeName !== 'Splash' && !isTabRoot;

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    const parent = navigation.getParent();
    if (parent?.canGoBack()) {
      parent.goBack();
      return;
    }

    const rootFallback = ROOT_FALLBACK[routeName as keyof RootStackParamList];
    if (rootFallback) {
      if (parent) {
        parent.navigate(rootFallback as never);
      } else {
        navigation.navigate(rootFallback as never);
      }
      return;
    }

    if (isTabRoute(routeName)) {
      const tabAction = TAB_ROOT_ACTION[routeName];
      if (tabAction === 'Home') {
        navigation.navigate('Home' as never);
        return;
      }
      if (tabAction && parent) {
        parent.navigate(tabAction as never);
      }
    }
  };

  return { goBack, showBack };
}
