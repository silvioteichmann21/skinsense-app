const AVATAR_COLORS = [
  '#2D6A4F',
  '#40916C',
  '#52B788',
  '#1B4332',
  '#74C69D',
  '#95D5B2',
  '#344E41',
  '#52796F',
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 9973;
  }
  return hash;
}

/** Fallback avatar tint when no uploaded photo is stored on the review. */
export function getReviewMemberAvatarColor(id: string): string {
  return AVATAR_COLORS[hashId(id) % AVATAR_COLORS.length];
}
