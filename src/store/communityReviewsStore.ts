import { create } from 'zustand';

import {
  averageStars,
  fetchCommunityReviews,
  type CommunityReview,
} from '@/services/feedback/communityReviewsService';
import { pingSupabase } from '@/lib/supabase';

const CACHE_MS = 45_000;

type CommunityReviewsStore = {
  reviews: CommunityReview[];
  loading: boolean;
  offline: boolean;
  lastFetchedAt: number | null;
  refresh: (fallbackName: string, options?: { force?: boolean }) => Promise<void>;
};

let inflight: Promise<void> | null = null;

export const useCommunityReviewsStore = create<CommunityReviewsStore>((set, get) => ({
  reviews: [],
  loading: false,
  offline: false,
  lastFetchedAt: null,

  refresh: async (fallbackName, options) => {
    const { force } = options ?? {};
    const state = get();

    if (
      !force &&
      state.lastFetchedAt != null &&
      Date.now() - state.lastFetchedAt < CACHE_MS
    ) {
      return;
    }

    if (inflight) {
      await inflight;
      return;
    }

    inflight = (async () => {
      set({ loading: true });

      const reachable = await pingSupabase();
      if (!reachable) {
        set({ loading: false, offline: true });
        return;
      }

      try {
        const data = await fetchCommunityReviews(24, fallbackName);
        set({
          reviews: data,
          loading: false,
          offline: false,
          lastFetchedAt: Date.now(),
        });
      } catch {
        set({ loading: false, offline: true });
      } finally {
        inflight = null;
      }
    })();

    await inflight;
  },
}));

export function selectCommunityReviewsFeatured(reviews: CommunityReview[]): CommunityReview[] {
  const featured = reviews.filter(
    (r) => (r.comment && r.comment.length >= 12) || r.stars >= 4,
  );
  return featured.length > 0 ? featured : reviews;
}

export function selectCommunityReviewsAverage(reviews: CommunityReview[]): number | null {
  return averageStars(reviews);
}
