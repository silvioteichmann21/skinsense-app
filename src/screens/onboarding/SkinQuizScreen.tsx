import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/core/navigation/types';
import { saveQuizAnswers } from '@/core/storage/quizStorage';
import { useQuizContent } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import {
  ConcernGrid,
  GoalBentoGrid,
  QuizHelpCard,
  QuizListOptions,
} from '@/screens/onboarding/quiz/QuizOptionCards';
import { QuizHeader } from '@/screens/onboarding/quiz/QuizHeader';
import { QuizProgress } from '@/screens/onboarding/quiz/QuizProgress';
import { QUIZ_TOTAL_STEPS } from '@/screens/onboarding/quiz/quizSteps';
import { emptyQuizAnswers, type QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import { colors, radius, spacing, touchTarget, typography } from '@/theme';

type QuizNav = NativeStackNavigationProp<RootStackParamList, 'SkinQuiz'>;
type QuizRoute = RouteProp<RootStackParamList, 'SkinQuiz'>;

function toggleInList(list: string[], id: string, max: number): string[] {
  if (list.includes(id)) return list.filter((x) => x !== id);
  if (list.length >= max) return list;
  return [...list, id];
}

export function SkinQuizScreen() {
  const navigation = useNavigation<QuizNav>();
  const route = useRoute<QuizRoute>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { concerns, skinTypes, routines, ages, goals, steps } = useQuizContent();

  const displayName = route.params?.displayName;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(emptyQuizAnswers);

  const meta = steps[step - 1];
  const footerBottom = Math.max(insets.bottom, spacing.base);

  const canContinue = useCallback((): boolean => {
    switch (step) {
      case 1:
        return answers.concerns.length > 0;
      case 2:
        return answers.skinType !== null;
      case 3:
        return answers.routine !== null;
      case 4:
        return answers.ageRange !== null;
      case 5:
        return answers.goals.length > 0;
      default:
        return false;
    }
  }, [step, answers]);

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Welcome');
    }
  };

  const handleClose = () => {
    navigation.navigate('Welcome');
  };

  const handleSkip = () => {
    if (step === 4) {
      setAnswers((a) => ({ ...a, ageRange: null }));
      setStep(5);
      return;
    }
    if (step === 5) {
      finishQuiz(answers);
    }
  };

  const finishQuiz = (final: QuizAnswers) => {
    void saveQuizAnswers(final);
    navigation.replace('QuizResults', {
      answers: final,
      displayName,
    });
  };

  const handleContinue = () => {
    if (!canContinue()) return;
    if (step < QUIZ_TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }
    finishQuiz(answers);
  };

  const headerVariant = step === 1 ? 'step1' : 'brand';
  const showProgress = step > 1;
  const showSkip = step === 4 || step === 5;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <QuizHeader
        step={step}
        totalSteps={QUIZ_TOTAL_STEPS}
        topInset={insets.top}
        onBack={handleBack}
        onClose={step === 1 ? handleClose : undefined}
        variant={headerVariant}
        showSkip={showSkip}
        onSkip={handleSkip}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: touchTarget + footerBottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {showProgress && (
          <QuizProgress
            step={step}
            totalSteps={QUIZ_TOTAL_STEPS}
            progress={meta.progress}
            leftLabel={step === 4 ? t('onboarding.assessmentProgress') : undefined}
            rightLabel={meta.percentLabel}
          />
        )}

        <Text style={styles.title}>{meta.title}</Text>
        <Text style={styles.subtitle}>{meta.subtitle}</Text>

        {step === 1 && (
          <>
            <ConcernGrid
              options={concerns}
              selected={answers.concerns}
              maxSelect={3}
              onToggle={(id) =>
                setAnswers((a) => ({
                  ...a,
                  concerns: toggleInList(a.concerns, id, 3),
                }))
              }
            />
            <QuizHelpCard />
          </>
        )}

        {step === 2 && (
          <QuizListOptions
            options={skinTypes}
            selected={answers.skinType}
            onSelect={(id) => setAnswers((a) => ({ ...a, skinType: id }))}
          />
        )}

        {step === 3 && (
          <QuizListOptions
            options={routines}
            selected={answers.routine}
            onSelect={(id) => setAnswers((a) => ({ ...a, routine: id }))}
            showIcon
          />
        )}

        {step === 4 && (
          <QuizListOptions
            options={ages}
            selected={answers.ageRange}
            onSelect={(id) => setAnswers((a) => ({ ...a, ageRange: id }))}
          />
        )}

        {step === 5 && (
          <GoalBentoGrid
            options={goals}
            selected={answers.goals}
            maxSelect={2}
            onToggle={(id) =>
              setAnswers((a) => ({
                ...a,
                goals: toggleInList(a.goals, id, 2),
              }))
            }
          />
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerBottom }]}>
        <Pressable
          onPress={handleContinue}
          disabled={!canContinue()}
          style={({ pressed }) => [
            styles.continueBtn,
            !canContinue() && styles.continueDisabled,
            pressed && canContinue() && styles.continuePressed,
          ]}
        >
          <Text style={styles.continueLabel}>{t('onboarding.continue')}</Text>
        </Pressable>
        {step === 1 ? (
          <Text style={styles.footerCaption}>{meta.footerCaption}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderMuted,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 8,
  },
  continueBtn: {
    height: touchTarget,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueDisabled: {
    opacity: 0.45,
  },
  continuePressed: {
    transform: [{ scale: 0.98 }],
  },
  continueLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
  footerCaption: {
    ...typography.label,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    textTransform: 'none',
    letterSpacing: 0,
  },
});
