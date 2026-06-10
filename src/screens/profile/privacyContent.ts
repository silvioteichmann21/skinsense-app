export const PRIVACY_COLLECT_ITEMS = [
  {
    id: 'account',
    title: 'Account Information',
    body: 'Name, email, and authentication details.',
  },
  {
    id: 'profile',
    title: 'Skin Profile',
    body: 'Your answers to initial skin type and sensitivity quizzes.',
  },
  {
    id: 'scores',
    title: 'Skin Scores',
    body: 'Historical analysis data and algorithm-generated health metrics.',
  },
  {
    id: 'routine',
    title: 'Routine Tracking',
    body: 'Logs of products used and morning/evening application history.',
  },
] as const;

export const PRIVACY_CLOUD_ITEMS = ['Metric Trends', 'Routine History'] as const;

export const PRIVACY_FOOTER_LINKS = [
  { id: 'policy', label: 'Privacy Policy' },
  { id: 'gdpr', label: 'GDPR Rights' },
  { id: 'ccpa', label: 'CCPA Rights' },
] as const;
