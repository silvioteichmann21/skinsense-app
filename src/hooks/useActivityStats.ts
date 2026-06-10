import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import {
  calculateAdherence,
  calculateStreak,
  getActivityDayKeys,
  getRoutineAdherencePercent,
} from '@/core/storage/activityStorage';
import { useSkinStore } from '@/store/skinStore';

export type ActivityStats = {
  streakDays: number;
  adherencePercent: number;
  totalScans: number;
  hydrated: boolean;
  refresh: () => Promise<void>;
};

export function useActivityStats(): ActivityStats {
  const totalScans = useSkinStore((s) => s.analysisHistory.length);
  const skinHydrated = useSkinStore((s) => s.hydrated);
  const [streakDays, setStreakDays] = useState(0);
  const [adherencePercent, setAdherencePercent] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const dayKeys = await getActivityDayKeys();
    const routineAdherence = await getRoutineAdherencePercent(7);
    setStreakDays(calculateStreak(dayKeys));
    setAdherencePercent(
      routineAdherence > 0 ? routineAdherence : calculateAdherence(dayKeys, 7),
    );
    setHydrated(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, totalScans, skinHydrated]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { streakDays, adherencePercent, totalScans, hydrated, refresh };
}
