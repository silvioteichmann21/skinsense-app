import { isSupabaseConfigured } from '@/config/env';
import { getSupabase } from '@/lib/supabase';

export type CommunityReview = {
  id: string;
  stars: number;
  comment: string | null;
  locale: string | null;
  createdAt: string;
  authorDisplayName: string;
  authorAvatarUrl: string | null;
};

type FeedbackRpcRow = {
  id: string;
  stars: number;
  comment: string | null;
  locale: string | null;
  created_at: string;
  author_display_name: string | null;
  author_avatar_url: string | null;
};

type FeedbackRow = {
  id: string;
  stars: number;
  comment: string | null;
  locale: string | null;
  created_at: string;
  author_display_name?: string | null;
  author_avatar_url?: string | null;
};

function mapRow(row: FeedbackRow | FeedbackRpcRow, fallbackName: string): CommunityReview {
  return {
    id: row.id,
    stars: row.stars,
    comment: row.comment?.trim() || null,
    locale: row.locale,
    createdAt: row.created_at,
    authorDisplayName: row.author_display_name?.trim() || fallbackName,
    authorAvatarUrl: row.author_avatar_url?.trim() || null,
  };
}

async function fetchViaRpc(limit: number, fallbackName: string): Promise<CommunityReview[] | null> {
  const { data, error } = await getSupabase().rpc('list_app_feedback_public', {
    p_limit: limit,
  });

  if (error || !data) return null;

  return (data as FeedbackRpcRow[]).map((row) => mapRow(row, fallbackName));
}

async function fetchViaTable(limit: number, fallbackName: string): Promise<CommunityReview[]> {
  const { data, error } = await getSupabase()
    .from('app_feedback')
    .select('id, stars, comment, locale, created_at, author_display_name, author_avatar_url')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as FeedbackRow[])
    .filter((row) => row.stars >= 1)
    .map((row) => mapRow(row, fallbackName));
}

export async function fetchCommunityReviews(
  limit = 24,
  fallbackName = 'SkinSense member',
): Promise<CommunityReview[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const rpcRows = await fetchViaRpc(limit, fallbackName);
    if (rpcRows) return rpcRows;
    return fetchViaTable(limit, fallbackName);
  } catch {
    return [];
  }
}

export function averageStars(reviews: CommunityReview[]): number | null {
  if (!reviews.length) return null;
  const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
