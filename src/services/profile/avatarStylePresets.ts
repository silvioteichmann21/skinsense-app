export type AvatarStylePreset = {
  id: string;
  label: string;
};

/** Mirrors server presets — used only for optional UI labels. */
export const AVATAR_STYLE_PRESETS: AvatarStylePreset[] = [
  { id: 'radiant-pro', label: 'Radiant professional' },
  { id: 'fresh-daylight', label: 'Fresh daylight' },
  { id: 'soft-glam', label: 'Soft glam' },
  { id: 'clean-minimal', label: 'Clean minimal' },
];

export function pickAvatarStyleId(seed: string | undefined): string {
  const key = seed?.trim() || 'default';
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return AVATAR_STYLE_PRESETS[Math.abs(hash) % AVATAR_STYLE_PRESETS.length]!.id;
}
