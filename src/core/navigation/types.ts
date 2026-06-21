import type { RoutinePeriod } from '@/core/storage/routinePreferences';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { ReportConcern, SkinAnalysisResult } from '@/types/skinAnalysis';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: { email?: string; accountCreated?: boolean } | undefined;
  Signup: undefined;
  SkinQuiz: { displayName?: string } | undefined;
  QuizResults: { answers: QuizAnswers; displayName?: string };
  ScanGuide: undefined;
  Camera: undefined;
  Analyzing: { imageUri: string };
  Paywall: { result?: SkinAnalysisResult; mode?: 'checkout' | 'manage' } | undefined;
  SkinReport: { result: SkinAnalysisResult };
  ReportDetail: {
    concernId: string;
    scanId: string;
    concern: ReportConcern;
    scannedAt: string;
  };
  RoutineReveal: { result: SkinAnalysisResult };
  RoutineStep: {
    stepId: string;
    period: RoutinePeriod;
    stepIndex: number;
  };
  EditRoutine: undefined;
  ScienceLibrary: undefined;
  IngredientDetail: { ingredientId: string };
  ArticleReader: { articleId: string };
  AIChat: undefined;
  EditProfile: undefined;
  SkinProfile: undefined;
  Privacy: undefined;
  Settings: undefined;
  Compare: undefined;
  Notifications: undefined;
  Language: undefined;
  HelpSupport: undefined;
  TermsPrivacy: undefined;
  AppFeedback: { initialStars?: number } | undefined;
  CommunityReviews: undefined;
  Main: { screen?: keyof MainTabParamList } | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Routine: undefined;
  Progress: undefined;
  More: undefined;
};
