export const ANALYZING_STAGES = [
  { label: 'Detecting skin regions…', min: 0, max: 20 },
  { label: 'Analyzing skin type…', min: 20, max: 45 },
  { label: 'Checking for concerns…', min: 45, max: 70 },
  { label: 'Building your profile…', min: 70, max: 90 },
  { label: 'Almost ready…', min: 90, max: 100 },
] as const;

export const SKIN_FACTS = [
  'Your skin renews itself roughly every 28 days.',
  'SPF is the single most effective anti-aging product you can use.',
  'Combination skin often needs different care on the T-zone vs. cheeks.',
  'Hydration helps your skin barrier recover faster after active treatments.',
  'Sleep quality directly affects how quickly your skin repairs overnight.',
] as const;


export const MIN_ANALYZING_MS = 3000;
export const MOCK_ANALYSIS_MS = 4500;

/** Fallback when navigating without a capture URI (dev / edge cases). */
export const ANALYZING_PLACEHOLDER_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
