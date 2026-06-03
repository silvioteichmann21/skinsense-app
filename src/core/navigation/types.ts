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
  Products: undefined;
  ProductDetail: { productId: string };
  IngredientScanner: undefined;
  IngredientScanResult: undefined;
  AIChat: undefined;
  EditProfile: undefined;
  SkinProfile: undefined;
  Privacy: undefined;
  Settings: undefined;
  Compare: undefined;
  Language: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Routine: undefined;
  Progress: undefined;
  More: undefined;
};
