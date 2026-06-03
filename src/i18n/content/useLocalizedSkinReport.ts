import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { SkinAnalysisResult, SkinTypeChip } from '@/types/skinAnalysis';

const DEFAULT_SKIN_TYPE_ID = 'combination';
const DEFAULT_FITZPATRICK_ID = 'typeIII';
const DEFAULT_CHIP_IDS = ['tZoneOily', 'cheeksNormal', 'seasonalDryness'] as const;
const DEFAULT_POSITIVE_IDS = ['strongBarrier', 'goodElasticity'] as const;

const CHIP_VARIANTS: Record<string, SkinTypeChip['variant']> = {
  tZoneOily: 'primary',
  cheeksNormal: 'neutral',
  seasonalDryness: 'neutral',
};

const CONCERN_INSIGHT_KEYS: Partial<Record<string, TranslationKey>> = {
  hydration: 'reportData.concerns.hydration.insight',
  barrier: 'reportData.concerns.barrier.insight',
};

function concernNameKey(id: string): TranslationKey {
  return `reportData.concerns.${id}.name` as TranslationKey;
}

function severityBadgeKey(severity: string): TranslationKey {
  return `reportData.severityBadge.${severity}` as TranslationKey;
}

export function useLocalizedSkinReport(result: SkinAnalysisResult): SkinAnalysisResult {
  const { t } = useTranslation();

  return useMemo(() => {
    const skinTypeId = result.skinTypeId ?? DEFAULT_SKIN_TYPE_ID;
    const fitzpatrickId = result.fitzpatrickId ?? DEFAULT_FITZPATRICK_ID;
    const chipIds = result.chipIds ?? [...DEFAULT_CHIP_IDS];
    const positiveIds = result.positiveIds ?? [...DEFAULT_POSITIVE_IDS];

    return {
      ...result,
      skinType: t(`reportData.skinTypes.${skinTypeId}` as TranslationKey),
      fitzpatrick: t(`reportData.fitzpatrick.${fitzpatrickId}` as TranslationKey),
      skinTypeDescription: t(
        `reportData.skinTypeDescriptions.${skinTypeId}` as TranslationKey,
      ),
      skinTypeChips: chipIds.map((chipId) => ({
        label: t(`reportData.chips.${chipId}` as TranslationKey),
        variant: CHIP_VARIANTS[chipId] ?? 'neutral',
      })),
      concerns: result.concerns.map((concern) => {
        const insightKey = CONCERN_INSIGHT_KEYS[concern.id];
        return {
          ...concern,
          name: t(concernNameKey(concern.id)),
          severityLabel: t(severityBadgeKey(concern.severity)),
          insight: insightKey ? t(insightKey) : concern.insight,
        };
      }),
      positives: positiveIds.map((id) => t(`reportData.positives.${id}` as TranslationKey)),
    };
  }, [result, t]);
}
