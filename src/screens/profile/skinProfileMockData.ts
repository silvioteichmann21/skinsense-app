export type ConcernTrend = 'up' | 'down' | 'stable' | 'none';

export type SkinProfileConcernSource = {
  id: string;
  severity: 'medium' | 'low' | 'none';
  barPercent: number;
  trend: ConcernTrend;
};

export type FitzpatrickTone = {
  type: number;
  color: string;
  labelColor: string;
};

export type ScanHistorySource = {
  id: string;
  score: number;
  scannedAt: string;
  scanTypeId: string;
};

/** Language-neutral IDs — labels come from i18n at render time. */
export const SKIN_PROFILE_SOURCE = {
  skinTypeId: 'combination' as const,
  chipIds: ['tZoneOily', 'cheeksNormal', 'seasonalDryness'] as const,
  fitzpatrickType: 3,
  fitzpatrickId: 'typeIII' as const,
  concerns: [
    { id: 'hydration', severity: 'medium', barPercent: 66, trend: 'up' },
    { id: 'acne', severity: 'low', barPercent: 25, trend: 'down' },
    { id: 'texture', severity: 'low', barPercent: 25, trend: 'stable' },
    { id: 'redness', severity: 'none', barPercent: 0, trend: 'none' },
    { id: 'dark-spots', severity: 'none', barPercent: 0, trend: 'none' },
  ] satisfies SkinProfileConcernSource[],
  sensitivityIds: ['fragrance', 'alcohol', 'essentialOils'] as const,
  preferenceIds: ['vegan', 'fragranceFree'] as const,
  scanHistory: [
    {
      id: 'h1',
      score: 74,
      scannedAt: '2026-06-03T12:00:00.000Z',
      scanTypeId: 'fullFace',
    },
    {
      id: 'h2',
      score: 71,
      scannedAt: '2026-05-20T12:00:00.000Z',
      scanTypeId: 'morningQuick',
    },
    {
      id: 'h3',
      score: 68,
      scannedAt: '2026-05-05T12:00:00.000Z',
      scanTypeId: 'initial',
    },
  ] satisfies ScanHistorySource[],
};

export const FITZPATRICK_TONES: FitzpatrickTone[] = [
  { type: 1, color: '#F9EAD3', labelColor: '#9CA3AF' },
  { type: 2, color: '#F3D9B5', labelColor: '#9CA3AF' },
  { type: 3, color: '#D9A384', labelColor: '#FFFFFF' },
  { type: 4, color: '#C18E69', labelColor: '#F3F4F6' },
  { type: 5, color: '#8D5524', labelColor: '#F3F4F6' },
  { type: 6, color: '#4B2C20', labelColor: '#F3F4F6' },
];

/** @deprecated Use SKIN_PROFILE_SOURCE + useLocalizedSkinProfile */
export const SKIN_PROFILE = {
  skinType: 'Combination Skin',
  skinTypeDescription:
    'Your skin exhibits varying levels of sebum production. Typically, you experience oiliness in the T-zone while the cheeks remain balanced or slightly dry.',
  skinTypeChips: ['T-zone oily', 'Cheeks normal', 'Seasonal dryness'],
  fitzpatrickType: SKIN_PROFILE_SOURCE.fitzpatrickType,
  fitzpatrickLabel: 'Type III',
  fitzpatrickDescription:
    'Sometimes burns, tans gradually. Creamy white to olive skin tone.',
  concerns: [],
  sensitivities: ['Fragrance', 'Alcohol', 'Essential oils'],
  preferences: ['Vegan', 'Fragrance-free'],
  scanHistory: [],
};
