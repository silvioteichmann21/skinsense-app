export type ConcernTrend = 'up' | 'down' | 'stable' | 'none';

export type SkinProfileConcern = {
  id: string;
  name: string;
  severityLabel: 'MEDIUM' | 'LOW' | 'NONE';
  barPercent: number;
  trend: ConcernTrend;
};

export type FitzpatrickTone = {
  type: number;
  color: string;
  labelColor: string;
};

export type ScanHistoryEntry = {
  id: string;
  score: number;
  dateLabel: string;
  scanType: string;
};

export const FITZPATRICK_TONES: FitzpatrickTone[] = [
  { type: 1, color: '#F9EAD3', labelColor: '#9CA3AF' },
  { type: 2, color: '#F3D9B5', labelColor: '#9CA3AF' },
  { type: 3, color: '#D9A384', labelColor: '#FFFFFF' },
  { type: 4, color: '#C18E69', labelColor: '#F3F4F6' },
  { type: 5, color: '#8D5524', labelColor: '#F3F4F6' },
  { type: 6, color: '#4B2C20', labelColor: '#F3F4F6' },
];

export const SKIN_PROFILE = {
  skinType: 'Combination Skin',
  skinTypeDescription:
    'Your skin exhibits varying levels of sebum production. Typically, you experience oiliness in the T-zone while the cheeks remain balanced or slightly dry.',
  skinTypeChips: ['T-zone oily', 'Cheeks normal', 'Seasonal dryness'],
  fitzpatrickType: 3,
  fitzpatrickLabel: 'Type III',
  fitzpatrickDescription:
    'Sometimes burns, tans gradually. Creamy white to olive skin tone.',
  concerns: [
    {
      id: 'hydration',
      name: 'Hydration',
      severityLabel: 'MEDIUM',
      barPercent: 66,
      trend: 'up',
    },
    {
      id: 'acne',
      name: 'Acne',
      severityLabel: 'LOW',
      barPercent: 25,
      trend: 'down',
    },
    {
      id: 'texture',
      name: 'Texture',
      severityLabel: 'LOW',
      barPercent: 25,
      trend: 'stable',
    },
    {
      id: 'redness',
      name: 'Redness',
      severityLabel: 'NONE',
      barPercent: 0,
      trend: 'none',
    },
    {
      id: 'dark-spots',
      name: 'Dark Spots',
      severityLabel: 'NONE',
      barPercent: 0,
      trend: 'none',
    },
  ] satisfies SkinProfileConcern[],
  sensitivities: ['Fragrance', 'Alcohol', 'Essential oils'],
  preferences: ['Vegan', 'Fragrance-free'],
  scanHistory: [
    { id: 'h1', score: 74, dateLabel: 'Jun 3, 2026', scanType: 'Full Face Analysis' },
    { id: 'h2', score: 71, dateLabel: 'May 20, 2026', scanType: 'Morning Quick-Check' },
    { id: 'h3', score: 68, dateLabel: 'May 5, 2026', scanType: 'Initial Assessment' },
  ] satisfies ScanHistoryEntry[],
};
