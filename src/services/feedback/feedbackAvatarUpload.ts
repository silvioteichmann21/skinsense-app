import { syncUserAvatarFromLocal } from '@/services/profile/userAvatarSync';

/** Upload the user's portrait for display on their review card. */
export async function uploadFeedbackAvatar(
  userId: string,
  localUri: string,
): Promise<string | null> {
  return syncUserAvatarFromLocal(userId, localUri, { force: true });
}
