import { recordRoutineProgress } from '@/core/storage/activityStorage';
import { getCompletedStepIds } from '@/core/storage/routinePreferences';
import { useRoutineStore } from '@/store/routineStore';

/** Recompute today's routine % and update streak/adherence tracking. */
export async function syncRoutineActivity(): Promise<void> {
  const routine = useRoutineStore.getState().routine;
  if (!routine) return;

  const [morningDone, eveningDone] = await Promise.all([
    getCompletedStepIds('morning'),
    getCompletedStepIds('evening'),
  ]);

  await recordRoutineProgress(
    morningDone.size,
    routine.morning.length,
    eveningDone.size,
    routine.evening.length,
  );
}
