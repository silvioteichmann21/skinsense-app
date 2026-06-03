import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ReportConcern } from '@/types/skinAnalysis';
import { colors } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type CauseChip = {
  icon: IconName;
  label: string;
};

export type ImprovementStep = {
  title: string;
  body: string;
};

export type RecommendedProduct = {
  id: string;
  brand: string;
  name: string;
  price: string;
  matchPercent: number;
  imageUri: string;
};

export type ConcernDetailContent = {
  displayTitle: string;
  whatIs: string;
  causes: CauseChip[];
  yourResult: string;
  highlightPhrase?: string;
  improvements: ImprovementStep[];
  products: RecommendedProduct[];
  libraryTopic: string;
};

const HYDRATION_PRODUCTS: RecommendedProduct[] = [
  {
    id: 'cerave-cleanser',
    brand: 'CERAVE',
    name: 'Hydrating Facial Cleanser',
    price: '$18.99',
    matchPercent: 92,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMZomJMG0gunZ6pMCAPvfc152X5niUV6wPrixWvFP8QJVVS5gz_ucucvjkgsU18fKbg7WiUL2aKnkrXG_Da9mt2-l3f2I-AQ2ZxZaZgYSmo52ISiht9ejZ6yWau3V4DZK05FZNFFABtnGsUyyxbcI58IRNgSYXbFjFmxC7wlpWqXqdlTJ7MnhsOi5K6QCavSUFEmV3lnjjP1b3Z0xBnUd6bFak1jAnExoQvOCWN2Yc3YYktC2lDF_HE_hzAULOUhhXF9jTcAY5jlE',
  },
  {
    id: 'laneige-cream',
    brand: 'LANEIGE',
    name: 'Water Bank Blue Cream',
    price: '$38.00',
    matchPercent: 88,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQCVCLsEeLXAWbU7cD3xYwRNSZlyo7N7C3FOHJxva506QJnMpfLidF24u09vdyeFu2DBQVI34bMePpvZhWcKus8CavgoyD8nIHZGA-9Np1nyjQeMgAVSTG9on-H3ro77dM372rAIdmEqJqHMsZNvA5v99JACablvs4zx_i6nRkkpz-8xCe1xTdYqdu81hEHDZhBaBM-_MvohpwEi1CGNvU3tJjBtRXzqtKETGQfRnhB7LzRfRaODC6q_ZpF4_9CF_6tMNqA-eALrk',
  },
  {
    id: 'skinceuticals-ce',
    brand: 'THE ORDINARY',
    name: 'Hyaluronic Acid 2% + B5',
    price: '$8.90',
    matchPercent: 95,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBmgO_tlS1JW36VMsoF-hsa-WC1IeJNyok5GUW6rxmLkgkHSGyoYpwRcMshL5NzeU8e85DVEK2n3gTwbsbq3S7vJ17VoG58OYi97DOx7F2laY-5hOc7MizyZuSocaYAORKykBfQSWQwck1ynrg0WDZRx7B9g8-wGdWyobk3fw9UxDZCMKsowutqwPiTkGs2ddag7H_DzMHidu_jXVwXOfAVYoTVh_QV3dQEQnFPXFOWu8Uh_g41Prx4kFk2vC9BMI1flBhLPQizbmQ',
  },
];

const DETAIL_BY_ID: Record<string, ConcernDetailContent> = {
  hydration: {
    displayTitle: 'Dehydration',
    whatIs:
      'Skin dehydration is a condition where your skin lacks water. Unlike dry skin, which lacks natural oils, dehydration can affect any skin type and often results in a dull complexion and fine lines.',
    causes: [
      { icon: 'weather-cloudy', label: 'Environment' },
      { icon: 'food-apple-outline', label: 'Diet & Intake' },
      { icon: 'flask-outline', label: 'Wrong Products' },
      { icon: 'dna', label: 'Genetics' },
    ],
    yourResult:
      'Based on your latest high-precision scan, mild dehydration was detected around your cheeks and orbital bone. Your skin\'s moisture retention levels are slightly below the optimal clinical range for your age group.',
    highlightPhrase: 'cheeks and orbital bone',
    improvements: [
      {
        title: 'Increase cellular hydration',
        body: 'Drink at least 2 liters of water daily and include water-rich foods like cucumber or watermelon in your diet.',
      },
      {
        title: 'Use powerful humectants',
        body: 'Apply serums containing Hyaluronic Acid or Glycerin to damp skin to trap moisture effectively.',
      },
      {
        title: 'Seal with an occlusive',
        body: 'Finish your routine with a cream or oil to create a physical barrier that prevents trans-epidermal water loss.',
      },
    ],
    products: HYDRATION_PRODUCTS,
    libraryTopic: 'dehydration',
  },
  acne: {
    displayTitle: 'Acne',
    whatIs:
      'Acne develops when pores become clogged with oil and dead skin cells. Mild breakouts often respond to consistent cleansing and targeted actives without aggressive scrubbing.',
    causes: [
      { icon: 'hospital-box-outline', label: 'Hormones' },
      { icon: 'bottle-tonic-outline', label: 'Comedogenic products' },
      { icon: 'lightning-bolt-outline', label: 'Stress' },
      { icon: 'bed-outline', label: 'Poor sleep' },
    ],
    yourResult:
      'Your scan shows low-grade congestion primarily along the chin and jawline. Inflammation levels are mild, suggesting early intervention with a balanced routine should be effective.',
    highlightPhrase: 'chin and jawline',
    improvements: [
      {
        title: 'Cleanse gently twice daily',
        body: 'Use a non-stripping cleanser morning and night to remove buildup without damaging your barrier.',
      },
      {
        title: 'Introduce salicylic acid gradually',
        body: 'Start with a 0.5–2% BHA treatment 2–3 nights per week and increase only if your skin tolerates it.',
      },
      {
        title: 'Avoid picking and over-exfoliating',
        body: 'Physical irritation can worsen post-inflammatory marks and prolong healing time.',
      },
    ],
    products: [
      {
        id: 'a1',
        brand: 'LA ROCHE-POSAY',
        name: 'Effaclar Duo Acne Treatment',
        price: '$29.99',
        matchPercent: 90,
        imageUri: HYDRATION_PRODUCTS[0].imageUri,
      },
      {
        id: 'a2',
        brand: 'PAULA\'S CHOICE',
        name: '2% BHA Liquid Exfoliant',
        price: '$35.00',
        matchPercent: 87,
        imageUri: HYDRATION_PRODUCTS[2].imageUri,
      },
    ],
    libraryTopic: 'acne',
  },
  texture: {
    displayTitle: 'Texture',
    whatIs:
      'Skin texture describes how smooth and even the surface appears. Uneven texture often reflects a mix of dead-cell buildup, sun exposure, and inconsistent hydration.',
    causes: [
      { icon: 'white-balance-sunny', label: 'Sun exposure' },
      { icon: 'water-outline', label: 'Dehydration' },
      { icon: 'layers-outline', label: 'Cell buildup' },
      { icon: 'clock-outline', label: 'Aging' },
    ],
    yourResult:
      'Fine textural irregularities were noted on the forehead and nose. Overall smoothness is good, with room to improve through gentle exfoliation and daily SPF.',
    highlightPhrase: 'forehead and nose',
    improvements: [
      {
        title: 'Exfoliate mildly 1–2× weekly',
        body: 'Choose a low-strength AHA or PHA to refine surface texture without compromising your barrier.',
      },
      {
        title: 'Keep SPF in your morning routine',
        body: 'UV protection prevents further unevenness and supports long-term clarity.',
      },
      {
        title: 'Moisturize on damp skin',
        body: 'Layering hydration immediately after cleansing helps plump the surface and soften the look of pores.',
      },
    ],
    products: [
      {
        id: 't1',
        brand: 'THE ORDINARY',
        name: 'Lactic Acid 5% + HA',
        price: '$8.50',
        matchPercent: 91,
        imageUri: HYDRATION_PRODUCTS[2].imageUri,
      },
      {
        id: 't2',
        brand: 'ELTA MD',
        name: 'UV Clear Broad-Spectrum SPF 46',
        price: '$43.00',
        matchPercent: 85,
        imageUri: HYDRATION_PRODUCTS[1].imageUri,
      },
    ],
    libraryTopic: 'skin texture',
  },
  barrier: {
    displayTitle: 'Barrier health',
    whatIs:
      'Your skin barrier is the outer layer that locks in moisture and shields against irritants. A resilient barrier keeps skin comfortable, balanced, and less reactive.',
    causes: [
      { icon: 'alert-circle-outline', label: 'Harsh actives' },
      { icon: 'weather-windy', label: 'Climate stress' },
      { icon: 'hand-wash', label: 'Over-cleansing' },
      { icon: 'flask-empty-outline', label: 'Product overload' },
    ],
    yourResult:
      'Your barrier indices are strong across all facial zones. Continue your current gentle approach to maintain stability and support long-term resilience.',
    improvements: [
      {
        title: 'Maintain a gentle core routine',
        body: 'Stick with mild cleansers and avoid stacking multiple strong actives on the same night.',
      },
      {
        title: 'Prioritize barrier lipids',
        body: 'Look for ceramides, cholesterol, and fatty acids in your moisturizer to reinforce the lipid matrix.',
      },
      {
        title: 'Patch-test new products',
        body: 'Introduce one new item at a time so you can spot irritation before it affects your whole routine.',
      },
    ],
    products: [
      {
        id: 'b1',
        brand: 'CERAVE',
        name: 'Moisturizing Cream',
        price: '$19.99',
        matchPercent: 94,
        imageUri: HYDRATION_PRODUCTS[0].imageUri,
      },
      {
        id: 'b2',
        brand: 'DR. JART+',
        name: 'Ceramidin Cream',
        price: '$48.00',
        matchPercent: 89,
        imageUri: HYDRATION_PRODUCTS[1].imageUri,
      },
    ],
    libraryTopic: 'skin barrier',
  },
};

export function getConcernDetail(concernId: string): ConcernDetailContent {
  return DETAIL_BY_ID[concernId] ?? DETAIL_BY_ID.hydration;
}

export function severityShortLabel(severity: ReportConcern['severity']): string {
  switch (severity) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'healthy':
      return 'Healthy';
    default:
      return 'Low';
  }
}

export function severityBadgeColors(severity: ReportConcern['severity']) {
  switch (severity) {
    case 'medium':
      return { bg: 'rgba(255, 171, 105, 0.2)', text: '#783D01', icon: '#8E4E14' };
    case 'high':
      return { bg: 'rgba(186, 26, 26, 0.12)', text: colors.error, icon: colors.error };
    case 'healthy':
      return { bg: colors.primaryPale, text: colors.primaryDark, icon: colors.primary };
    default:
      return { bg: colors.primaryPale, text: colors.primaryDark, icon: colors.primary };
  }
}
