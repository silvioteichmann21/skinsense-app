export type CompareScanOption = {
  id: string;
  dateLabel: string;
  score: number;
  imageUri: string;
  badge: string;
};

export type CompareDeltaRow = {
  id: string;
  concern: string;
  before: string;
  after: string;
  change: string;
  changePositive?: boolean;
};

export const COMPARE_SCAN_OPTIONS: CompareScanOption[] = [
  {
    id: 'may-5',
    dateLabel: 'May 5, 2026',
    score: 68,
    badge: 'Initial',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD19-3oWZ-EosA0F3XHyAnxQdZ3WycSEP31KmAg9F1FD-ZQEOQT3aJs_bGXtu-RWINUkN1VFzHMswJMdWg9d12uS2_ziYlhzs0OZ0BVm-i-5an5YU2Swp4qfiQlOu-7JS4m30-YvRB0eRwGcLVhGw7vX2M9ZOOCurFE31xJBHzlzCbe4tvVc6kdtFw0VENIX_sx9qErAG0cHUHug7pK1ecEesHMrIhFxiZLW5Lz7KhSzV6OA8y06Au3FUuSU2iKJ1XmqsEd__mCSH8',
  },
  {
    id: 'may-20',
    dateLabel: 'May 20, 2026',
    score: 71,
    badge: 'Initial',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnTJpRsgbKLCAG2rnvpESIQmC_cSuGzM8vkPwlssv0h60JgNtGqkCTQlG7aiI-n1pVWkaBFPizmdD1tOzBu_az-ulP980EwE6SGp_O7hd1HEPzFbSw8rxdd_KRkmBCBjoex-mrdJJDqImPncsqWYAIXvCARK6yKCIMuZc79IyvpEW6sygw9Rg6M4ygkt37_3Wvi_IAIGFxUnsdyZUvhVoPtOWOqcaYTdEXoPsnPTs_XJd9DThnazZ-F2LD37eWqzwgtCR2wj4nIvc',
  },
  {
    id: 'jun-3',
    dateLabel: 'Jun 3, 2026',
    score: 74,
    badge: 'Current',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChjiPAtZWC05MHJW8OK9gnLa8qjRxHTyPuPKc_P6N6N4Rsxe2ylTsbcz5qpLgOjJVu1740JA-sQ1SHzJIspBr7NMuzHVPNw0iWZ15khqvntmnWL2WPhobUz20SqCeezn45amlKhO9zrmb29Nv3Amfuw-IUxAigy0pUS8wq5cX7f2lm4KdA0KJI32EcO8gqCL-HKx0s6MAEzY6N3_LMUCoPHjA-iLoBJyTEf0EWOu-KlQkfZxhVqP2xDuLWsYBUc-Azo8bOI4lToaI',
  },
];

export const COMPARE_DELTAS: CompareDeltaRow[] = [
  {
    id: 'd1',
    concern: 'Hydration',
    before: '54%',
    after: '72%',
    change: '+18%',
    changePositive: true,
  },
  {
    id: 'd2',
    concern: 'Acne',
    before: '12 pts',
    after: '4 pts',
    change: '-66%',
    changePositive: true,
  },
  {
    id: 'd3',
    concern: 'Redness',
    before: 'Mod.',
    after: 'Low',
    change: 'Impr.',
    changePositive: true,
  },
];

export const DEFAULT_COMPARE_BEFORE_ID = 'may-5';
export const DEFAULT_COMPARE_AFTER_ID = 'jun-3';
