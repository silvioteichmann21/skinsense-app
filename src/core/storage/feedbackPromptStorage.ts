import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';

const PROMPT_BASE_KEY = '@skinsense/feedback_prompt';
const LEGACY_PROMPT_KEY = PROMPT_BASE_KEY;

export type FeedbackPromptState = {
  submitted: boolean;
  submittedAt: string | null;
  dismissCount: number;
  lastDismissedAt: string | null;
  firedTriggers: string[];
  homeVisitCount: number;
};

const EMPTY_STATE: FeedbackPromptState = {
  submitted: false,
  submittedAt: null,
  dismissCount: 0,
  lastDismissedAt: null,
  firedTriggers: [],
  homeVisitCount: 0,
};

const MAX_DISMISSALS = 3;
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

async function promptKey(): Promise<string> {
  return storageKeyForUser(PROMPT_BASE_KEY, await getActiveUserScope());
}

async function readState(): Promise<FeedbackPromptState> {
  const raw = await AsyncStorage.getItem(await promptKey());
  if (!raw) return { ...EMPTY_STATE };
  try {
    const parsed = JSON.parse(raw) as Partial<FeedbackPromptState>;
    return {
      submitted: parsed.submitted === true,
      submittedAt: parsed.submittedAt ?? null,
      dismissCount: parsed.dismissCount ?? 0,
      lastDismissedAt: parsed.lastDismissedAt ?? null,
      firedTriggers: Array.isArray(parsed.firedTriggers) ? parsed.firedTriggers : [],
      homeVisitCount: parsed.homeVisitCount ?? 0,
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

async function writeState(state: FeedbackPromptState): Promise<void> {
  await AsyncStorage.setItem(await promptKey(), JSON.stringify(state));
  await AsyncStorage.removeItem(LEGACY_PROMPT_KEY);
}

export async function getFeedbackPromptState(): Promise<FeedbackPromptState> {
  return readState();
}

export async function markFeedbackSubmitted(): Promise<void> {
  const state = await readState();
  await writeState({
    ...state,
    submitted: true,
    submittedAt: new Date().toISOString(),
  });
}

export async function recordPromptDismissed(trigger: string): Promise<void> {
  const state = await readState();
  const firedTriggers = state.firedTriggers.includes(trigger)
    ? state.firedTriggers
    : [...state.firedTriggers, trigger];

  await writeState({
    ...state,
    dismissCount: state.dismissCount + 1,
    lastDismissedAt: new Date().toISOString(),
    firedTriggers,
  });
}

export async function recordTriggerFired(trigger: string): Promise<void> {
  const state = await readState();
  if (state.firedTriggers.includes(trigger)) return;
  await writeState({
    ...state,
    firedTriggers: [...state.firedTriggers, trigger],
  });
}

export async function incrementHomeVisitCount(): Promise<number> {
  const state = await readState();
  const homeVisitCount = state.homeVisitCount + 1;
  await writeState({ ...state, homeVisitCount });
  return homeVisitCount;
}

export async function canShowReviewPrompt(state: FeedbackPromptState): Promise<boolean> {
  if (state.submitted) return false;
  if (state.dismissCount >= MAX_DISMISSALS) return false;

  if (state.lastDismissedAt) {
    const elapsed = Date.now() - new Date(state.lastDismissedAt).getTime();
    if (elapsed < DISMISS_COOLDOWN_MS) return false;
  }

  return true;
}

export async function isTriggerEligible(
  trigger: string,
  state: FeedbackPromptState,
): Promise<boolean> {
  if (!(await canShowReviewPrompt(state))) return false;
  return !state.firedTriggers.includes(trigger);
}
