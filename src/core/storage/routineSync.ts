import { loadQuizAnswers } from '@/core/storage/quizStorage';
import { loadStoredRoutine, saveStoredRoutine } from '@/core/storage/routineStorage';
import { generatePersonalizedRoutine } from '@/services/routine/routineGenerator';
import {
  fetchUserRoutine,
  upsertUserRoutine,
  type FetchedUserRoutine,
} from '@/services/routine/userRoutineService';
import { useSkinStore } from '@/store/skinStore';
import type { PersonalizedRoutine } from '@/types/routine';

export type ResolvedRoutine = {
  routine: PersonalizedRoutine;
  scanId: string | null;
};

function pickNewer(
  local: Awaited<ReturnType<typeof loadStoredRoutine>>,
  remote: FetchedUserRoutine | null,
): ResolvedRoutine | null {
  if (remote && local) {
    const remoteTime = new Date(remote.updatedAt).getTime();
    const localTime = new Date(local.updatedAt).getTime();
    if (remoteTime >= localTime) {
      return { routine: remote.routine, scanId: remote.scanId };
    }
    return {
      routine: {
        subtitle: local.subtitle,
        morning: local.morning,
        evening: local.evening,
      },
      scanId: local.scanId,
    };
  }
  if (remote) {
    return { routine: remote.routine, scanId: remote.scanId };
  }
  if (local?.morning?.length) {
    return {
      routine: {
        subtitle: local.subtitle,
        morning: local.morning,
        evening: local.evening,
      },
      scanId: local.scanId,
    };
  }
  return null;
}

/** Merge local + cloud routine; prefer the newest copy. */
export async function resolveRoutineForDevice(
  userId: string | null,
): Promise<ResolvedRoutine | null> {
  const local = await loadStoredRoutine();
  const remote = userId ? await fetchUserRoutine(userId) : null;
  return pickNewer(local, remote);
}

/** Push device routine to Supabase when the user has no cloud row yet. */
export async function syncLocalRoutineToCloud(userId: string): Promise<void> {
  const remote = await fetchUserRoutine(userId);
  if (remote) return;

  const local = await loadStoredRoutine();
  if (!local?.morning?.length) return;

  await upsertUserRoutine(
    userId,
    {
      subtitle: local.subtitle,
      morning: local.morning,
      evening: local.evening,
    },
    local.scanId,
  );
}

/** After sign-in: sync cloud/local, or rebuild from latest scan + quiz. */
export async function buildRoutineAfterSignIn(
  userId: string,
): Promise<ResolvedRoutine | null> {
  await syncLocalRoutineToCloud(userId);

  const resolved = await resolveRoutineForDevice(userId);
  if (resolved) {
    await saveStoredRoutine(resolved.routine, resolved.scanId);
    return resolved;
  }

  const latest = useSkinStore.getState().latestAnalysis;
  const quiz = await loadQuizAnswers();
  if (!latest) return null;

  const generated = generatePersonalizedRoutine(latest, quiz);
  await saveStoredRoutine(generated, latest.id);
  await upsertUserRoutine(userId, generated, latest.id);
  return { routine: generated, scanId: latest.id };
}
