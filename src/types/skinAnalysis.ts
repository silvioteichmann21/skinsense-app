import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ConcernSeverity = 'low' | 'medium' | 'high' | 'healthy';

export type ReportConcern = {
  id: string;
  name: string;
  icon: IconName;
  severity: ConcernSeverity;
  severityLabel: string;
  barPercent: number;
  insight?: string;
};

export type SkinTypeChip = {
  label: string;
  variant: 'primary' | 'neutral';
};

export type SkinAnalysisResult = {
  id: string;
  skinScore: number;
  /** Display fallback; prefer skinTypeId + i18n */
  skinType: string;
  fitzpatrick: string;
  scannedAt: string;
  imageUri: string;
  skinTypeDescription: string;
  skinTypeChips: SkinTypeChip[];
  concerns: ReportConcern[];
  positives: string[];
  /** Keys for localized labels via reportData.* */
  skinTypeId?: string;
  fitzpatrickId?: string;
  chipIds?: string[];
  positiveIds?: string[];
};

export function createMockAnalysisResult(imageUri: string): SkinAnalysisResult {
  return {
    id: `scan-${Date.now()}`,
    skinScore: 74,
    skinType: 'Combination Skin',
    skinTypeId: 'combination',
    fitzpatrick: 'Fitzpatrick Type III',
    fitzpatrickId: 'typeIII',
    scannedAt: new Date().toISOString(),
    imageUri,
    skinTypeDescription:
      'Your skin exhibits varying lipid levels across different zones. The central T-zone shows heightened sebaceous activity while lateral areas remain balanced or dry.',
    chipIds: ['tZoneOily', 'cheeksNormal', 'seasonalDryness'],
    skinTypeChips: [
      { label: 'T-zone oily', variant: 'primary' },
      { label: 'Cheeks normal', variant: 'neutral' },
      { label: 'Seasonal dryness', variant: 'neutral' },
    ],
    positiveIds: ['strongBarrier', 'goodElasticity'],
    concerns: [
      {
        id: 'hydration',
        name: 'Hydration',
        icon: 'water-outline',
        severity: 'medium',
        severityLabel: 'MEDIUM SEVERITY',
        barPercent: 60,
        insight: 'Mild dehydration detected around cheeks.',
      },
      {
        id: 'acne',
        name: 'Acne',
        icon: 'alert-circle-outline',
        severity: 'low',
        severityLabel: 'LOW SEVERITY',
        barPercent: 20,
      },
      {
        id: 'texture',
        name: 'Texture',
        icon: 'blur',
        severity: 'low',
        severityLabel: 'LOW SEVERITY',
        barPercent: 25,
      },
      {
        id: 'barrier',
        name: 'Barrier health',
        icon: 'shield-check-outline',
        severity: 'healthy',
        severityLabel: 'HEALTHY',
        barPercent: 92,
        insight: 'Your moisture barrier is performing well.',
      },
    ],
    positives: ['Strong skin barrier', 'Good elasticity'],
  };
}
