export const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';

export type EnhancePortraitRequest = {
  locale?: string;
  image: string;
  skinScore?: number;
  skinType?: string;
  /** Stable id (scan id, user id) — picks a consistent avatar style per person. */
  styleSeed?: string;
};

export type AvatarStylePreset = {
  id: string;
  label: string;
  hairstyle: string;
  outfit: string;
  vibe: string;
  lighting: string;
};

export const AVATAR_STYLE_PRESETS: AvatarStylePreset[] = [
  {
    id: 'radiant-pro',
    label: 'Radiant professional',
    hairstyle:
      'polished salon-fresh hairstyle with soft volume — flattering, modern, and realistic for this person',
    outfit: 'premium neutral blouse or fine knit top in cream, soft white, or blush',
    vibe: 'confident, well-rested wellness glow',
    lighting: 'soft beauty studio light with gentle rim highlight',
  },
  {
    id: 'fresh-daylight',
    label: 'Fresh daylight',
    hairstyle:
      'clean, naturally styled hair — tidy with subtle movement, not a different person',
    outfit: 'simple elevated casual top in white, sage, or light blue — crisp and premium',
    vibe: 'bright, approachable, healthy skin energy',
    lighting: 'natural window daylight, airy and flattering',
  },
  {
    id: 'soft-glam',
    label: 'Soft glam',
    hairstyle:
      'refined hairstyle with elegant shape — glossy, controlled, photorealistic',
    outfit: 'minimal chic top or structured collar shirt in charcoal, ivory, or dusty rose',
    vibe: 'magazine cover polish without heavy makeup',
    lighting: 'cinematic soft key light with smooth falloff',
  },
  {
    id: 'clean-minimal',
    label: 'Clean minimal',
    hairstyle: 'neat low-maintenance hairstyle — sharp, fresh, believable',
    outfit: 'monochrome minimalist top — white, stone, or black — skincare-brand aesthetic',
    vibe: 'calm, premium, trustworthy',
    lighting: 'even diffused light, no harsh shadows',
  },
];

export function pickAvatarStyle(seed: string | undefined): AvatarStylePreset {
  const key = seed?.trim() || 'default';
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const index = Math.abs(hash) % AVATAR_STYLE_PRESETS.length;
  return AVATAR_STYLE_PRESETS[index]!;
}

export const ENHANCE_PORTRAIT_PROMPT = `Create a stunning AI profile avatar for a premium skincare app using the provided real photo.

Identity (critical — do not break these):
- Same person: preserve face shape, eyes, nose, lips, eyebrows, skin tone, ethnicity, age, and gender presentation.
- Recognizable likeness — this must still look like the same human, not a celebrity swap or different face.
- Photorealistic only — no cartoon, anime, illustration, or plastic beauty-filter look.

Creative upgrade (allowed and encouraged):
- Refresh hairstyle to look awesome, flattering, and premium while staying believable for this person.
- Upgrade outfit/clothing to a clean, stylish look appropriate for a wellness profile photo.
- Subtle skin refinement: even tone, natural glow, reduce harsh shadows — cosmetic wellness only, not medical.
- Confident, aspirational "best self" energy — polished head-and-shoulders portrait.

Composition:
- Square 1:1 crop centered on face and upper shoulders.
- Simple uncluttered background (soft gradient or neutral blur).
- No text, logos, watermarks, borders, props, or collage.

Return only the final avatar image.`;

export function buildPortraitPrompt(body: EnhancePortraitRequest): string {
  const style = pickAvatarStyle(body.styleSeed);
  const lines = [
    ENHANCE_PORTRAIT_PROMPT,
    '',
    'Style direction for this user:',
    `- Mood: ${style.vibe}`,
    `- Hairstyle: ${style.hairstyle}`,
    `- Outfit: ${style.outfit}`,
    `- Lighting: ${style.lighting}`,
  ];

  if (body.skinScore != null) {
    lines.push(`Skin wellness score context: ${body.skinScore}/100 (cosmetic wellness only).`);
  }
  if (body.skinType) {
    lines.push(`Skin type context: ${body.skinType}.`);
  }
  if (body.locale) {
    lines.push(`User locale: ${body.locale}.`);
  }

  return lines.join('\n');
}
