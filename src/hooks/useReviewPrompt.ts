import { useCallback } from 'react';

import {
  resolveNextReviewPrompt,
  resolveReviewPromptTrigger,
  type ReviewPromptContext,
  type ReviewPromptTrigger,
} from '@/services/feedback/reviewPromptLogic';
import { useReviewPromptStore } from '@/store/reviewPromptStore';

export function useReviewPrompt() {
  const show = useReviewPromptStore((s) => s.show);

  const tryShowPrompt = useCallback(
    async (preferred: ReviewPromptTrigger, context: ReviewPromptContext) => {
      if (useReviewPromptStore.getState().visible) return false;
      const trigger = await resolveReviewPromptTrigger(preferred, context);
      if (!trigger) return false;
      show(trigger);
      return true;
    },
    [show],
  );

  const tryShowAnyPrompt = useCallback(
    async (context: ReviewPromptContext) => {
      if (useReviewPromptStore.getState().visible) return false;
      const trigger = await resolveNextReviewPrompt(context);
      if (!trigger) return false;
      show(trigger);
      return true;
    },
    [show],
  );

  return { tryShowPrompt, tryShowAnyPrompt };
}
