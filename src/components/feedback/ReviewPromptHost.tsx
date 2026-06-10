import { ReviewPromptSheet } from '@/components/feedback/ReviewPromptSheet';

/** Mount once inside the main app shell to show contextual review prompts. */
export function ReviewPromptHost() {
  return <ReviewPromptSheet />;
}
