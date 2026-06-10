import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { ARTICLE_ICONS, ARTICLE_IDS, ARTICLE_TAG_BG } from '@/content/articles';
import { MORNING_ROUTINE_PREVIEW } from '@/screens/home/homeMockData';
import {
  concernOptions,
  goalOptions,
  ageRangeOptions,
  routineOptions,
  skinTypeOptions,
  type GridOption,
  type ListOption,
  type BentoOption,
} from '@/screens/onboarding/quiz/quizSteps';
import type { WelcomeSlide } from '@/screens/onboarding/welcomeSlides';
import { PROFILE_MENU, type ProfileMenuItem } from '@/screens/profile/profileMockData';
import type { ScanTip } from '@/screens/scan/scanGuideContent';

const MENU_KEYS: Record<string, TranslationKey> = {
  edit: 'profile.menu.editProfile',
  skin: 'profile.menu.skinProfile',
  notif: 'profile.menu.notificationSettings',
  privacy: 'profile.menu.privacyData',
  science: 'profile.menu.scienceGuide',
  settings: 'profile.menu.appSettings',
  help: 'profile.menu.helpSupport',
  reviews: 'profile.menu.reviewsRatings',
  terms: 'profile.menu.termsPrivacy',
  signout: 'profile.menu.signOut',
};

const GOAL_KEYS: Record<string, TranslationKey> = {
  'clearing-acne': 'onboarding.quizOptions.clearingAcne',
  'anti-aging': 'onboarding.quizOptions.antiAging',
  brightening: 'onboarding.quizOptions.brightening',
  hydration: 'onboarding.quizOptions.hydration',
  'minimizing-pores': 'onboarding.quizOptions.minimizingPores',
  'calming-redness': 'onboarding.quizOptions.calmingRedness',
  'natural-clean': 'onboarding.quizOptions.naturalClean',
  'keeping-simple': 'onboarding.quizOptions.keepingSimple',
};

const CONCERN_KEYS: Record<string, TranslationKey> = {
  acne: 'onboarding.quizOptions.acne',
  oiliness: 'onboarding.quizOptions.oiliness',
  dryness: 'onboarding.quizOptions.dryness',
  'uneven-tone': 'onboarding.quizOptions.unevenTone',
  'dark-spots': 'onboarding.quizOptions.darkSpots',
  wrinkles: 'onboarding.quizOptions.wrinkles',
  redness: 'onboarding.quizOptions.redness',
  sensitivity: 'onboarding.quizOptions.sensitivity',
  'large-pores': 'onboarding.quizOptions.largePores',
};

export function useProfileMenu(): ProfileMenuItem[] {
  const { t } = useTranslation();
  return useMemo(
    () =>
      PROFILE_MENU.map((item) => ({
        ...item,
        label: t(MENU_KEYS[item.id] ?? 'profile.menu.editProfile'),
      })),
    [t],
  );
}

export function useWelcomeSlides(): WelcomeSlide[] {
  const { t } = useTranslation();
  return useMemo(
    () => [
      {
        id: '1',
        title: t('onboarding.slideKnowSkin'),
        subtitle: t('onboarding.slideKnowSkinSub'),
        image: require('../../../assets/welcome/slide-1-v2.png'),
        imageFit: 'contain' as const,
        frameStyle: 'glass' as const,
        showAiBadge: true,
      },
      {
        id: '2',
        title: t('onboarding.slideRoutines'),
        subtitle: t('onboarding.slideRoutinesSub'),
        image: require('../../../assets/welcome/slide-2-v2.png'),
        imageFit: 'contain' as const,
        frameStyle: 'solid' as const,
      },
      {
        id: '3',
        title: t('onboarding.slideProgress'),
        subtitle: t('onboarding.slideProgressSub'),
        image: require('../../../assets/welcome/slide-3-v2.png'),
        imageFit: 'contain' as const,
        frameStyle: 'glass' as const,
      },
    ],
    [t],
  );
}

export function useLocalizedGoalOptions(): BentoOption[] {
  const { t } = useTranslation();
  return useMemo(
    () =>
      goalOptions.map((o) => ({
        ...o,
        label: t(GOAL_KEYS[o.id] ?? 'onboarding.quizOptions.hydration'),
      })),
    [t],
  );
}

export function useScanTips(): ScanTip[] {
  const { t } = useTranslation();
  return useMemo(
    () => [
      { id: 'light', icon: 'white-balance-sunny' as const, text: t('scan.tipLight') },
      { id: 'makeup', icon: 'face-woman-shimmer' as const, text: t('scan.tipMakeup') },
      { id: 'expression', icon: 'emoticon-neutral-outline' as const, text: t('scan.tipExpression') },
      { id: 'distance', icon: 'cellphone' as const, text: t('scan.tipDistance') },
    ],
    [t],
  );
}

export function useQuizContent() {
  const { t } = useTranslation();

  return useMemo(() => {
    const concerns: GridOption[] = concernOptions.map((o) => ({
      ...o,
      label: t(CONCERN_KEYS[o.id] ?? 'onboarding.quizOptions.acne'),
    }));

    const skinTypes: ListOption[] = skinTypeOptions.map((o) => {
      const map: Record<string, { label: TranslationKey; desc: TranslationKey }> = {
        'very-oily': { label: 'onboarding.quizOptions.veryOily', desc: 'onboarding.quizOptions.veryOilyDesc' },
        oily: { label: 'onboarding.quizOptions.oily', desc: 'onboarding.quizOptions.oilyDesc' },
        combination: { label: 'onboarding.quizOptions.combination', desc: 'onboarding.quizOptions.combinationDesc' },
        normal: { label: 'onboarding.quizOptions.normal', desc: 'onboarding.quizOptions.normalDesc' },
        dry: { label: 'onboarding.quizOptions.dry', desc: 'onboarding.quizOptions.dryDesc' },
        'very-dry': { label: 'onboarding.quizOptions.veryDry', desc: 'onboarding.quizOptions.veryDryDesc' },
        'not-sure': { label: 'onboarding.quizOptions.notSure', desc: 'onboarding.quizOptions.notSureDesc' },
      };
      const keys = map[o.id] ?? map['not-sure'];
      return { ...o, label: t(keys.label), description: t(keys.desc) };
    });

    const routines: ListOption[] = routineOptions.map((o) => {
      const map: Record<string, { label: TranslationKey; desc: TranslationKey }> = {
        none: { label: 'onboarding.quizOptions.noRoutine', desc: 'onboarding.quizOptions.noRoutineDesc' },
        cleanser: { label: 'onboarding.quizOptions.cleanserOnly', desc: 'onboarding.quizOptions.cleanserOnlyDesc' },
        basic: { label: 'onboarding.quizOptions.basicRoutine', desc: 'onboarding.quizOptions.basicRoutineDesc' },
        full: { label: 'onboarding.quizOptions.fullRoutine', desc: 'onboarding.quizOptions.fullRoutineDesc' },
        beginner: { label: 'onboarding.quizOptions.beginner', desc: 'onboarding.quizOptions.beginnerDesc' },
      };
      const keys = map[o.id] ?? map.beginner;
      return { ...o, label: t(keys.label), description: t(keys.desc) };
    });

    const ages: ListOption[] = ageRangeOptions.map((o) => {
      const map: Record<string, TranslationKey> = {
        'under-18': 'onboarding.quizOptions.under18',
        '18-24': 'onboarding.quizOptions.age18_24',
        '25-34': 'onboarding.quizOptions.age25_34',
        '35-44': 'onboarding.quizOptions.age35_44',
        '45-54': 'onboarding.quizOptions.age45_54',
        '55-plus': 'onboarding.quizOptions.age55plus',
      };
      return { ...o, label: t(map[o.id] ?? 'onboarding.quizOptions.under18') };
    });

    const goals: BentoOption[] = goalOptions.map((o) => ({
      ...o,
      label: t(GOAL_KEYS[o.id] ?? 'onboarding.quizOptions.hydration'),
    }));

    const steps = [
      {
        title: t('onboarding.step1Title'),
        subtitle: t('onboarding.step1Subtitle'),
        footerCaption: t('onboarding.step1Caption'),
        progress: 20,
        percentLabel: '20%',
      },
      {
        title: t('onboarding.step2Title'),
        subtitle: t('onboarding.step2Subtitle'),
        progress: 40,
        percentLabel: `${t('common.percent', { percent: 40 })} Complete`,
      },
      {
        title: t('onboarding.step3Title'),
        subtitle: t('onboarding.step3Subtitle'),
        progress: 60,
        percentLabel: '60%',
      },
      {
        title: t('onboarding.step4Title'),
        subtitle: t('onboarding.step4Subtitle'),
        progress: 80,
        percentLabel: t('onboarding.step4Progress'),
      },
      {
        title: t('onboarding.step5Title'),
        subtitle: t('onboarding.step5Subtitle'),
        progress: 100,
        percentLabel: '100%',
      },
    ];

    return { concerns, skinTypes, routines, ages, goals, steps };
  }, [t]);
}

export function useHomeArticles() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      ARTICLE_IDS.map((id) => {
        const keyMap: Record<string, string> = {
          '1': 'hydration',
          '2': 'spf',
          '3': 'consistency',
        };
        const key = keyMap[id];
        return {
          id,
          icon: ARTICLE_ICONS[id],
          tagBg: ARTICLE_TAG_BG[id],
          title: t(`home.articles.${key}.title` as TranslationKey),
          tag: t(`home.articles.${key}.tag` as TranslationKey),
          readTime: t(`home.articles.${key}.readTime` as TranslationKey),
        };
      }),
    [t],
  );
}

export function useMorningRoutinePreview() {
  const { t } = useTranslation();
  return useMemo(
    () =>
      MORNING_ROUTINE_PREVIEW.map((step) => {
        const keyMap: Record<string, TranslationKey> = {
          'am-1': 'home.routineSteps.gentleCleanser',
          'am-2': 'home.routineSteps.hydratingToner',
          'am-3': 'home.routineSteps.vitaminCSerum',
        };
        const key = keyMap[step.id];
        return key ? { ...step, name: t(key) } : step;
      }),
    [t],
  );
}

export function usePrivacyContent() {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      collect: [
        { id: 'account', title: t('privacy.collectAccount'), body: t('privacy.collectAccountBody') },
        { id: 'profile', title: t('privacy.collectProfile'), body: t('privacy.collectProfileBody') },
        { id: 'scores', title: t('privacy.collectScores'), body: t('privacy.collectScoresBody') },
        { id: 'routine', title: t('privacy.collectRoutine'), body: t('privacy.collectRoutineBody') },
      ],
      cloud: [t('privacy.cloudMetricTrends'), t('privacy.cloudRoutineSync')],
      footer: [
        { id: 'policy', label: t('privacy.footerPrivacy') },
        { id: 'gdpr', label: t('privacy.footerGdpr') },
        { id: 'ccpa', label: t('privacy.footerCcpa') },
      ],
    }),
    [t],
  );
}
