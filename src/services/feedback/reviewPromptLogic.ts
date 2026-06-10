import {
  getFeedbackPromptState,
  isTriggerEligible,
  type FeedbackPromptState,
} from '@/core/storage/feedbackPromptStorage';

export type ReviewPromptTrigger = 'first_scan' | 'home_engaged' | 'streak_3';

export type ReviewPromptContext = {
  totalScans: number;
  streakDays: number;
  homeVisitCount: number;
};

type TriggerRule = {
  trigger: ReviewPromptTrigger;
  matches: (ctx: ReviewPromptContext, state: FeedbackPromptState) => boolean;
};

const TRIGGER_RULES: TriggerRule[] = [
  {
    trigger: 'first_scan',
    matches: (ctx) => ctx.totalScans === 1,
  },
  {
    trigger: 'streak_3',
    matches: (ctx) => ctx.streakDays >= 3 && ctx.totalScans >= 1,
  },
  {
    trigger: 'home_engaged',
    matches: (ctx) => ctx.homeVisitCount >= 3 && ctx.totalScans >= 1,
  },
];

export async function resolveReviewPromptTrigger(
  preferred: ReviewPromptTrigger,
  context: ReviewPromptContext,
): Promise<ReviewPromptTrigger | null> {
  const state = await getFeedbackPromptState();
  const rule = TRIGGER_RULES.find((r) => r.trigger === preferred);
  if (!rule || !rule.matches(context, state)) return null;
  if (!(await isTriggerEligible(preferred, state))) return null;
  return preferred;
}

export async function resolveNextReviewPrompt(
  context: ReviewPromptContext,
): Promise<ReviewPromptTrigger | null> {
  const state = await getFeedbackPromptState();

  for (const rule of TRIGGER_RULES) {
    if (!rule.matches(context, state)) continue;
    if (!(await isTriggerEligible(rule.trigger, state))) continue;
    return rule.trigger;
  }

  return null;
}
