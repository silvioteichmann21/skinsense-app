import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import {
  selectCommunityReviewsAverage,
  selectCommunityReviewsFeatured,
  useCommunityReviewsStore,
} from '@/store/communityReviewsStore';

export function useCommunityReviews() {
  const { t } = useTranslation();
  const reviews = useCommunityReviewsStore((s) => s.reviews);
  const loading = useCommunityReviewsStore((s) => s.loading);
  const offline = useCommunityReviewsStore((s) => s.offline);
  const refresh = useCommunityReviewsStore((s) => s.refresh);

  const fallbackName = t('reviews.anonymousMember');

  const doRefresh = useCallback(
    (force?: boolean) => refresh(fallbackName, { force }),
    [fallbackName, refresh],
  );

  useEffect(() => {
    void doRefresh();
  }, [doRefresh]);

  useFocusEffect(
    useCallback(() => {
      void doRefresh();
    }, [doRefresh]),
  );

  const featured = selectCommunityReviewsFeatured(reviews);

  return {
    reviews,
    featured,
    average: selectCommunityReviewsAverage(reviews),
    loading,
    offline,
    refresh: () => doRefresh(true),
    hasReviews: reviews.length > 0,
  };
}
