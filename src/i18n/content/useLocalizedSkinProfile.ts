import { useEffect, useMemo, useState } from 'react';

import { loadQuizAnswers } from '@/core/storage/quizStorage';
import { useI18n } from '@/i18n/I18nProvider';
import { formatAppDate } from '@/i18n/useFormattedDate';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  type ConcernTrend,
  type ScanHistorySource,
  type SkinProfileConcernSource,
} from '@/screens/profile/skinProfileMockData';
import { useSkinStore } from '@/store/skinStore';
import type { ReportConcern } from '@/types/skinAnalysis';

export type LocalizedSkinProfileConcern = {
  id: string;
  name: string;
  severityLabel: string;
  severity: SkinProfileConcernSource['severity'];
  barPercent: number;
  trend: ConcernTrend;
};

export type LocalizedScanHistoryEntry = {
  id: string;
  score: number;
  scannedAt: string;
  scanType: string;
  dateLabel: string;
};

export type LocalizedSkinProfile = {
  skinType: string;
  skinTypeDescription: string;
  skinTypeChips: string[];
  fitzpatrickType: number | null;
  fitzpatrickLabel: string | null;
  fitzpatrickDescription: string | null;
  concerns: LocalizedSkinProfileConcern[];
  sensitivities: string[];
  preferences: string[];
  scanHistory: LocalizedScanHistoryEntry[];
  hasData: boolean;
};

function reportText(
  t: (key: TranslationKey) => string,
  key: TranslationKey,
  fallback: string,
): string {
  const value = t(key);
  return value === key ? fallback : value;
}

function mapSeverity(severity: ReportConcern['severity']): SkinProfileConcernSource['severity'] {
  if (severity === 'healthy') return 'none';
  if (severity === 'low') return 'low';
  return 'medium';
}

function concernTrend(
  current: ReportConcern,
  previous: ReportConcern | undefined,
): ConcernTrend {
  if (!previous) return 'none';
  const delta = current.barPercent - previous.barPercent;
  if (delta > 5) return 'up';
  if (delta < -5) return 'down';
  return 'stable';
}

const GOAL_KEYS: Record<string, TranslationKey> = {
  'clearing-acne': 'onboarding.quizOptions.clearingAcne',
  'anti-aging': 'onboarding.quizOptions.antiAging',
  brightening: 'onboarding.quizOptions.brightening',
  hydration: 'onboarding.quizOptions.hydration',
  'minimizing-pores': 'onboarding.quizOptions.minimizingPores',
  'calming-redness': 'onboarding.quizOptions.calmingRedness',
  'natural-clean': 'onboarding.quizOptions.naturalClean',
  'keeping-simple': 'onboarding.quizOptions.keepingSimple',
};

function fitzpatrickTypeFromId(id: string): number | null {
  const match = id.match(/type([IVX]+)/i);
  if (!match) return null;
  const roman: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };
  return roman[match[1].toUpperCase()] ?? null;
}

function localizeHistoryEntry(
  entry: ScanHistorySource,
  t: (key: TranslationKey) => string,
  dateLabel: string,
): LocalizedScanHistoryEntry {
  return {
    id: entry.id,
    score: entry.score,
    scannedAt: entry.scannedAt,
    dateLabel,
    scanType: reportText(
      t,
      `skinProfileData.scanTypes.${entry.scanTypeId}` as TranslationKey,
      entry.scanTypeId,
    ),
  };
}

export function useLocalizedSkinProfile(): LocalizedSkinProfile {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const latest = useSkinStore((s) => s.latestAnalysis);
  const history = useSkinStore((s) => s.analysisHistory);
  const [quizGoals, setQuizGoals] = useState<string[]>([]);

  useEffect(() => {
    void loadQuizAnswers().then((answers) => setQuizGoals(answers?.goals ?? []));
  }, []);

  return useMemo(() => {
    const scanHistorySource: ScanHistorySource[] = history.map((scan, index) => ({
      id: scan.id,
      score: scan.skinScore,
      scannedAt: scan.scannedAt,
      scanTypeId:
        index === history.length - 1 ? 'initial' : index === 0 ? 'fullFace' : 'morningQuick',
    }));
    const hasData = Boolean(latest);
    const skinTypeId = latest?.skinTypeId ?? 'combination';
    const fitzpatrickId = latest?.fitzpatrickId;
    const chipIds = latest?.chipIds ?? [];
    const previous = history[1];

    const concerns: LocalizedSkinProfileConcern[] = hasData
      ? latest!.concerns.map((c) => ({
          id: c.id,
          name: reportText(t, `reportData.concerns.${c.id}.name` as TranslationKey, c.name),
          severity: mapSeverity(c.severity),
          severityLabel: t(`skinProfileData.severity.${mapSeverity(c.severity)}` as TranslationKey),
          barPercent: c.barPercent,
          trend: concernTrend(c, previous?.concerns.find((p) => p.id === c.id)),
        }))
      : [];

    const preferences = quizGoals.map((goal) =>
      reportText(t, GOAL_KEYS[goal] ?? 'onboarding.quizOptions.hydration', goal),
    );

    return {
      hasData,
      skinType: hasData
        ? reportText(
            t,
            `reportData.skinTypes.${skinTypeId}` as TranslationKey,
            latest?.skinType ?? '',
          )
        : t('skinProfile.noScanYet'),
      skinTypeDescription: hasData
        ? reportText(
            t,
            `reportData.skinTypeDescriptions.${skinTypeId}` as TranslationKey,
            latest?.skinTypeDescription ?? '',
          )
        : t('skinProfile.noScanDescription'),
      skinTypeChips: hasData
        ? chipIds.map((chipId) =>
            reportText(t, `reportData.chips.${chipId}` as TranslationKey, chipId),
          )
        : [],
      fitzpatrickType: fitzpatrickId ? fitzpatrickTypeFromId(fitzpatrickId) : null,
      fitzpatrickLabel: fitzpatrickId
        ? reportText(
            t,
            `reportData.fitzpatrick.${fitzpatrickId}` as TranslationKey,
            latest?.fitzpatrick ?? '',
          )
        : null,
      fitzpatrickDescription: fitzpatrickId
        ? reportText(
            t,
            `skinProfileData.fitzpatrickDescriptions.${fitzpatrickId}` as TranslationKey,
            '',
          )
        : null,
      concerns,
      sensitivities: [],
      preferences,
      scanHistory: scanHistorySource.map((entry) =>
        localizeHistoryEntry(
          entry,
          t,
          formatAppDate(new Date(entry.scannedAt), locale, { month: 'short', day: 'numeric' }),
        ),
      ),
    };
  }, [latest, history, quizGoals, locale, t]);
}
