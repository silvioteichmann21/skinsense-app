import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { SkinAnalysisResult, SkinTypeChip } from '@/types/skinAnalysis';

const DEFAULT_SKIN_TYPE_ID = 'combination';
const DEFAULT_CHIP_IDS = ['tZoneOily', 'cheeksNormal', 'seasonalDryness'] as const;
const DEFAULT_POSITIVE_IDS = ['strongBarrier', 'goodElasticity'] as const;

const CHIP_VARIANTS: Record<string, SkinTypeChip['variant']> = {
  tZoneOily: 'primary',
  cheeksNormal: 'neutral',
  seasonalDryness: 'neutral',
};

function concernInsightKey(concernId: string, insightId: string): TranslationKey {
  return `reportData.concerns.${concernId}.insights.${insightId}` as TranslationKey;
}

function concernNameKey(id: string): TranslationKey {
  return `reportData.concerns.${id}.name` as TranslationKey;
}

function severityBadgeKey(severity: string): TranslationKey {
  return `reportData.severityBadge.${severity}` as TranslationKey;
}

/** Avoid showing raw i18n keys when a translation is missing. */
function reportText(
  t: (key: TranslationKey) => string,
  key: TranslationKey,
  fallback: string,
): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function useLocalizedSkinReport(result: SkinAnalysisResult): SkinAnalysisResult {
  const { t } = useTranslation();

  return useMemo(() => {
    const skinTypeId = result.skinTypeId ?? DEFAULT_SKIN_TYPE_ID;
    const fitzpatrickId = result.fitzpatrickId;
    const chipIds = result.chipIds ?? [...DEFAULT_CHIP_IDS];
    const positiveIds = result.positiveIds ?? [...DEFAULT_POSITIVE_IDS];

    return {
      ...result,
      skinType: reportText(
        t,
        `reportData.skinTypes.${skinTypeId}` as TranslationKey,
        result.skinType ?? 'Combination Skin',
      ),
      fitzpatrick: fitzpatrickId
        ? reportText(
            t,
            `reportData.fitzpatrick.${fitzpatrickId}` as TranslationKey,
            result.fitzpatrick ?? '',
          )
        : '',
      skinTypeDescription: reportText(
        t,
        `reportData.skinTypeDescriptions.${skinTypeId}` as TranslationKey,
        result.skinTypeDescription ?? '',
      ),
      skinTypeChips: chipIds.map((chipId) => ({
        label: reportText(t, `reportData.chips.${chipId}` as TranslationKey, chipId),
        variant: CHIP_VARIANTS[chipId] ?? 'neutral',
      })),
      concerns: result.concerns.map((concern) => {
        const insightKey = concern.insightId
          ? concernInsightKey(concern.id, concern.insightId)
          : (`reportData.concerns.${concern.id}.insight` as TranslationKey);
        const localizedInsight = concern.insightId || concern.insight
          ? reportText(t, insightKey, concern.insight ?? '')
          : undefined;
        return {
          ...concern,
          name: t(concernNameKey(concern.id)),
          severityLabel: t(severityBadgeKey(concern.severity)),
          insight: localizedInsight,
        };
      }),
      positives: positiveIds.map((id) => t(`reportData.positives.${id}` as TranslationKey)),
    };
  }, [result, t]);
}
