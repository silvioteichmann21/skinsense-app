import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';

import { useI18n } from '@/i18n/I18nProvider';
import { formatAppDate } from '@/i18n/useFormattedDate';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type {
  ConcernTrend,
  Milestone,
  ScoreTrendPoint,
  TrendPeriod,
} from '@/screens/progress/progressMockData';
import { useActivityStats } from '@/hooks/useActivityStats';
import { useSkinStore } from '@/store/skinStore';
import type { ReportConcern } from '@/types/skinAnalysis';
import type { StoredScanRecord } from '@/types/scanPipeline';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const CONCERN_ICONS: Record<string, { icon: IconName; iconBg: string; iconColor: string }> = {
  hydration: { icon: 'water', iconBg: '#EFF6FF', iconColor: '#2563EB' },
  acne: { icon: 'virus', iconBg: '#FEF2F2', iconColor: '#DC2626' },
  texture: { icon: 'blur', iconBg: '#FFF7ED', iconColor: '#EA580C' },
  redness: { icon: 'heart-pulse', iconBg: '#FDF2F8', iconColor: '#DB2777' },
  barrier: { icon: 'shield-outline', iconBg: '#F0FFF4', iconColor: '#2D6A4F' },
};

const PERIOD_DAYS: Record<TrendPeriod, number> = {
  '30d': 30,
  '90d': 90,
  '180d': 180,
};

function concernLabel(t: (key: TranslationKey) => string, id: string, fallback: string): string {
  const reportKey = `reportData.concerns.${id}.name` as TranslationKey;
  const reportValue = t(reportKey);
  if (reportValue !== reportKey) return reportValue;

  const progressKey = `progress.concerns.${id}` as TranslationKey;
  const progressValue = t(progressKey);
  return progressValue !== progressKey ? progressValue : fallback;
}

function severityStatusLabel(
  t: (key: TranslationKey) => string,
  severity: ReportConcern['severity'],
): string {
  const key: TranslationKey =
    severity === 'healthy'
      ? 'progress.status.optimal'
      : severity === 'low'
        ? 'progress.status.calming'
        : severity === 'medium'
          ? 'progress.status.needsFocus'
          : 'progress.status.improving';
  return t(key);
}

function filterScansByPeriod(scans: StoredScanRecord[], period: TrendPeriod): StoredScanRecord[] {
  const cutoff = Date.now() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;
  return scans.filter((s) => new Date(s.scannedAt).getTime() >= cutoff);
}

function buildScoreTrend(
  scans: StoredScanRecord[],
  locale: import('@/screens/settings/languages').LanguageCode,
): {
  current: number;
  points: ScoreTrendPoint[];
} {
  if (!scans.length) {
    return { current: 0, points: [] };
  }

  const chronological = [...scans].reverse();
  const points: ScoreTrendPoint[] = chronological.map((scan, index) => {
    const isFirst = index === 0;
    const isLast = index === chronological.length - 1;
    const isMid = index === Math.floor(chronological.length / 2);
    const label =
      isFirst || isLast || isMid
        ? formatAppDate(new Date(scan.scannedAt), locale, { month: 'short', day: 'numeric' })
        : '';
    return { label, score: scan.skinScore };
  });

  return {
    current: scans[0].skinScore,
    points: points.length >= 2 ? points : [{ label: '', score: scans[0].skinScore }],
  };
}

function buildConcernTrends(
  scans: StoredScanRecord[],
  t: (key: TranslationKey) => string,
): ConcernTrend[] {
  if (!scans.length) return [];

  const latest = scans[0];
  const previous = scans[1];
  const concernIds = [...new Set(latest.concerns.map((c) => c.id))];

  return concernIds.slice(0, 4).map((id) => {
    const current = latest.concerns.find((c) => c.id === id);
    const prior = previous?.concerns.find((c) => c.id === id);
    const delta = prior && current ? current.barPercent - prior.barPercent : 0;
    const meta = CONCERN_ICONS[id] ?? CONCERN_ICONS.hydration;
    const sparkline = scans
      .slice(0, 5)
      .reverse()
      .map((s) => s.concerns.find((c) => c.id === id)?.barPercent ?? 0);

    return {
      id,
      name: concernLabel(t, id, current?.name ?? id),
      status: severityStatusLabel(t, current?.severity ?? 'low'),
      icon: meta.icon,
      iconBg: meta.iconBg,
      iconColor: meta.iconColor,
      change: `${delta >= 0 ? '+' : ''}${delta}%`,
      changePositive: delta >= 0,
      sparkline: sparkline.length ? sparkline : [current?.barPercent ?? 0],
      sparkStroke: delta < 0 ? '#8E4E14' : undefined,
    };
  });
}

function buildMilestones(
  scanCount: number,
  streakDays: number,
  latestScore: number | null,
): Milestone[] {
  return [
    { id: 'm1', label: '7-Day Streak', icon: 'medal-outline', unlocked: streakDays >= 7 },
    { id: 'm2', label: 'First Scan', icon: 'camera-timer', unlocked: scanCount >= 1 },
    { id: 'm3', label: '30-Day Ritual', icon: 'calendar-month-outline', unlocked: streakDays >= 30 },
    {
      id: 'm4',
      label: 'Score 75+',
      icon: 'trending-up',
      unlocked: latestScore !== null && latestScore >= 75,
    },
  ];
}

export type WeeklyDigest = {
  adherencePercent: number;
  deltaLabel: string;
  body: string;
};

export function useProgressMetrics(period: TrendPeriod) {
  const history = useSkinStore((s) => s.analysisHistory);
  const { locale } = useI18n();
  const { t } = useTranslation();
  const { streakDays, adherencePercent } = useActivityStats();

  return useMemo(() => {
    const periodScans = filterScansByPeriod(history, period);
    const scoreTrend = buildScoreTrend(periodScans.length ? periodScans : history, locale);
    const concernTrends = buildConcernTrends(history, t);
    const milestones = buildMilestones(history.length, streakDays, history[0]?.skinScore ?? null);

    const prevWeekAdherence = Math.max(0, adherencePercent - 5);
    const digestDelta =
      adherencePercent > prevWeekAdherence
        ? t('progress.digestDeltaUp', { delta: String(adherencePercent - prevWeekAdherence) })
        : adherencePercent < prevWeekAdherence
          ? t('progress.digestDeltaDown', { delta: String(adherencePercent - prevWeekAdherence) })
          : t('progress.digestDeltaSame');

    let digestBody: string;
    if (!history.length) {
      digestBody = t('progress.digestNoScans');
    } else if (history.length >= 2 && history[0].skinScore > history[1].skinScore) {
      digestBody = t('progress.digestImproving', { percent: String(adherencePercent) });
    } else {
      digestBody = t('progress.digestDefault', { percent: String(adherencePercent) });
    }

    const weeklyDigest: WeeklyDigest = {
      adherencePercent,
      deltaLabel: digestDelta,
      body: digestBody,
    };

    return {
      hasScans: history.length > 0,
      scoreTrend,
      concernTrends,
      milestones,
      weeklyDigest,
    };
  }, [history, period, locale, streakDays, adherencePercent, t]);
}
