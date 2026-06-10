import { create } from 'zustand';

import { recordTriggerFired } from '@/core/storage/feedbackPromptStorage';
import type { ReviewPromptTrigger } from '@/services/feedback/reviewPromptLogic';

type ReviewPromptStore = {
  visible: boolean;
  trigger: ReviewPromptTrigger | null;
  show: (trigger: ReviewPromptTrigger) => void;
  hide: () => void;
};

export const useReviewPromptStore = create<ReviewPromptStore>((set) => ({
  visible: false,
  trigger: null,
  show: (trigger) => {
    void recordTriggerFired(trigger);
    set({ visible: true, trigger });
  },
  hide: () => set({ visible: false, trigger: null }),
}));
