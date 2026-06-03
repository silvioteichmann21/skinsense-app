import { colors } from '@/theme';

export type ProductIngredient = {
  name: string;
  note?: string;
};

export type Product = {
  id: string;
  brand: string;
  name: string;
  category: string;
  skinType: string;
  price: string;
  matchPercent: number;
  rating: number;
  reviewCount: string;
  imageUri: string;
  whyMatch: string;
  description: string;
  benefits: string[];
  howToUse: string[];
  ingredients: ProductIngredient[];
  retailers: string[];
  concerns: string[];
};

export const PRODUCT_CATALOG: Product[] = [
  {
    id: 'cerave-cleanser',
    brand: 'CERAVE',
    name: 'Hydrating Facial Cleanser',
    category: 'Cleanser',
    skinType: 'Normal to Dry Skin',
    price: '$18.99',
    matchPercent: 92,
    rating: 4.8,
    reviewCount: '1.2k',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDldYFYgXdUWmCRWQuSD5Ifl02NM0L5offyD4QRRjeWrfXleYVaY-skNIsXXGxdf0XOw5AdVlcTMRWzv7tE2OPUHioS8hkAykBj9wtJRExPYXYxyv9NwPPOmYEVmb1_EYiCUn0fXfx-b14RYARZaqrbw-8vS3-9wvffGkPBLtwF25o6xnipC-8BTzVi77xkXg23EBpDOV2UjhQlT7yggEaoiu3s5LjIzyLAjzDEU8ZG85EeJrHMF70FVxJCK2xCpOyovm9i9bdiWZo',
    whyMatch:
      'Formulated with ceramides and hyaluronic acid to restore your barrier and maintain hydration without stripping moisture — ideal for combination skin with dry zones.',
    description:
      'A unique formula with three essential ceramides (1, 3, 6-II) that cleanses and hydrates without disrupting the protective skin barrier. MVE Delivery Technology ensures steady hydration release.',
    benefits: [
      'Non-foaming, lotion-like consistency',
      'Fragrance-free and non-comedogenic',
      'Accepted by the National Eczema Association',
    ],
    howToUse: [
      'Wet skin with lukewarm water. Avoid hot water, which can strip natural oils.',
      'Massage cleanser into skin in a gentle, circular motion.',
      'Rinse thoroughly and pat dry with a soft, clean towel.',
    ],
    ingredients: [
      { name: 'Ceramide NP', note: 'Barrier support' },
      { name: 'Hyaluronic Acid', note: 'Hydration' },
      { name: 'Glycerin', note: 'Humectant' },
    ],
    retailers: ['Sephora', 'Ulta', 'Amazon'],
    concerns: ['hydration', 'barrier'],
  },
  {
    id: 'laneige-cream',
    brand: 'LANEIGE',
    name: 'Water Bank Blue Cream',
    category: 'Moisturizer',
    skinType: 'All Skin Types',
    price: '$40.00',
    matchPercent: 88,
    rating: 4.6,
    reviewCount: '856',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBe8cKqZsW-z1OnZU0HalAdQJSkiRZYgnEmenQ7hdBRzyk3wku3l1bNsuEgROvB9PCnKdcy_c7uWur1O0JVNMQsCeLqClmb9pQSqiTG_gXYuv0R-mDgL85gxLpXrx8QaT4Kk9DQCj9sQRUSCH8gTTJOV3uQARbQdztURRVpF9xCb7lW5NOT1emH8pGL2OKDypfkMIZEdLRrkKoniQPZgdBH3bDa2LSqnr-hD84hk-kabfixFFIJcHDFG5dyFbWGu02_Lv4hDXmZdgs',
    whyMatch:
      'Delivers layered hydration that targets mild dehydration detected in your last scan while remaining lightweight on oil-prone areas.',
    description:
      'Blue hyaluronic acid and squalane work together to strengthen the moisture barrier and lock in hydration for up to 48 hours.',
    benefits: ['Lightweight gel-cream texture', 'Strengthens moisture barrier', 'Dermatologist tested'],
    howToUse: [
      'Apply after serum on slightly damp skin.',
      'Press gently into cheeks, forehead, and neck.',
      'Use morning and evening as your moisturizer step.',
    ],
    ingredients: [
      { name: 'Blue Hyaluronic Acid' },
      { name: 'Squalane' },
      { name: 'Mineral Water' },
    ],
    retailers: ['Sephora', 'Amazon'],
    concerns: ['hydration'],
  },
  {
    id: 'skinceuticals-ce',
    brand: 'SKINCEUTICALS',
    name: 'C E Ferulic Serum',
    category: 'Serum',
    skinType: 'Normal / Combination',
    price: '$182.00',
    matchPercent: 95,
    rating: 4.9,
    reviewCount: '2.4k',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8nJk8eygpxxUgYNV9fg-XLxOyfTOXlBFUmnkgFved44SXopWn6mBp2XTLraMjqUhq8xozV6FkbUInQ2cU2NB3catWK7sv37KeEW_kpwyZ_s1WWOTDwdOzTdtTg2rRhmyjURpTG1jxdB6wckzEPvppwN2a_yDlsMAZlC_fNeedClFMYUDnrl6rlysbLaQlxnqxRjWr08xKbXIHc_z3nBackk5ETYrmFXShaQdlmyrKvNw7hsOi5MxoXMf8jlMKkPNXZlxwqO5LgxA',
    whyMatch:
      'Gold-standard antioxidant defense that supports brightness goals without conflicting with your current low-grade congestion profile.',
    description:
      'A patented combination of 15% L-ascorbic acid, 1% vitamin E, and 0.5% ferulic acid for advanced environmental protection.',
    benefits: ['8× boosted environmental protection', 'Improves fine lines', 'Paraben-free'],
    howToUse: [
      'Apply 4–5 drops to dry face, neck, and chest in the morning.',
      'Wait 1 minute before moisturizer and SPF.',
      'Store in a cool, dark place after opening.',
    ],
    ingredients: [
      { name: 'L-Ascorbic Acid', note: '15%' },
      { name: 'Vitamin E' },
      { name: 'Ferulic Acid' },
    ],
    retailers: ['Sephora', 'Dermstore'],
    concerns: ['texture'],
  },
  {
    id: 'lrp-spf',
    brand: 'LA ROCHE-POSAY',
    name: 'Anthelios UV Correct',
    category: 'Sunscreen',
    skinType: 'Sensitive / Acne-prone',
    price: '$34.99',
    matchPercent: 85,
    rating: 4.7,
    reviewCount: '3.1k',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDq5ZBIMnv6gOZ6H7leaxNN2E74Y3E_pkcA8oW5z93ZHV7gAMSA12yTcbMT_WDMmMoYshivvI3YlJxsHmMVSJ3fN66d2CM9gvFL5zDWwZmeeA7xrThrP8jzuvD2Vz-q8QDwRJn-s1KaHLbLfoHqBnZ5tZrjrnGz82q821txRDmyQOCrkWrFVqTfUR57mLGNiT0oNY_Hnhe5v5dKX7DFUbweZCduCVn1xU2lKswqHigYWs7YtfZRTqulrEMEtqnfGAj9oarZfz6ANIg',
    whyMatch:
      'Daily UV protection helps prevent texture changes and post-blemish marks from darkening — essential for your AM routine.',
    description:
      'Broad-spectrum SPF 50+ with niacinamide to help correct uneven tone while protecting against UVA/UVB.',
    benefits: ['Oil-controlling finish', 'Niacinamide for tone', 'Non-greasy on combination skin'],
    howToUse: [
      'Apply as the final step every morning.',
      'Use two finger-lengths for face and neck.',
      'Reapply every 2 hours when outdoors.',
    ],
    ingredients: [
      { name: 'Niacinamide' },
      { name: 'Mexoryl SX' },
      { name: 'Glycerin' },
    ],
    retailers: ['Ulta', 'Amazon', 'Target'],
    concerns: ['texture', 'acne'],
  },
  {
    id: 'paula-bha',
    brand: "PAULA'S CHOICE",
    name: '2% BHA Liquid Exfoliant',
    category: 'Exfoliant',
    skinType: 'Oily / Combination',
    price: '$35.00',
    matchPercent: 90,
    rating: 4.8,
    reviewCount: '12k',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0mhvdteCir74PwkXvRvGDk5H0NrygZ2RbdHudcY0CJ_bvoIx14J_TgPxKZsjJ4ye6VW_6FaNk1TI6DBxJV__JmMkAYWRsBBYBU6o8KKMi35qpFmeBNKblGgtVVFHMnnyvfAPHkhEp5noori73JPwvPwGfY_ZqXXpGAIbRAh9fB96Kf0uq5uOdNfe2cAcKG8WEufrvMyzk7OG683HEuh2aBH4TjP4vXjRe2-Hx0EoA9GHq1aULIuO3KHFKzL6KlAtR9h8dfxzZyWw',
    whyMatch:
      'Salicylic acid unclogs pores along the chin and jaw while staying gentle enough for your current barrier health score.',
    description:
      'Leave-on exfoliant with 2% salicylic acid to clear pores, smooth texture, and calm redness.',
    benefits: ['Unclogs pores', 'Smooths uneven texture', 'Fragrance-free'],
    howToUse: [
      'Apply with cotton pad 1–2× weekly PM only to start.',
      'Do not rinse; follow with moisturizer.',
      'Always use SPF the following morning.',
    ],
    ingredients: [
      { name: 'Salicylic Acid', note: '2%' },
      { name: 'Green Tea' },
      { name: 'Methylpropanediol' },
    ],
    retailers: ['Sephora', 'Amazon'],
    concerns: ['acne', 'texture'],
  },
  {
    id: 'tatcha-night',
    brand: 'TATCHA',
    name: 'The Indigo Overnight Repair',
    category: 'Night Cream',
    skinType: 'Dry / Sensitive',
    price: '$92.00',
    matchPercent: 82,
    rating: 4.5,
    reviewCount: '530',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAH-AJ13hVTGGVLwWo0Kkrwk3-RxShPJlfJscXGDS99jcoRsiVTTn4rlD6uCRWW3ys1MrpLDxwq-h2bDTmHVW6bn2N_UetjasMdmn_ZOZfKB-RwqGiGA9T0aTbIGPRCXCF-9hNgTf7ScuL6P9n5as5B6W6k60aGFwfABAL6gRCl_XHh3NEy-8ffRwW1xLLOyLalMu7VeaGhUxgzUEMQw8hndYYZjZlNYVgu9WQq0e85wIgN_GlPfW7S-xXGH1hL4nyfwMVf1G-eer8',
    whyMatch:
      'Supports overnight barrier recovery with soothing indigo and ceramides — complements your evening routine focus.',
    description:
      'Rich cream with Japanese indigo, ceramides, and hyaluronic acid to calm and repair skin overnight.',
    benefits: ['Calms visible redness', 'Deep overnight hydration', 'Silicone-free'],
    howToUse: [
      'Apply as the final PM step after serums.',
      'Warm between palms and press into skin.',
      'Use 2–3 nights per week if new to rich creams.',
    ],
    ingredients: [
      { name: 'Japanese Indigo' },
      { name: 'Ceramides' },
      { name: 'Hyaluronic Acid' },
    ],
    retailers: ['Sephora', 'Tatcha'],
    concerns: ['barrier', 'hydration'],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id);
}

export function matchBadgeStyle(matchPercent: number) {
  if (matchPercent >= 80) return { bg: colors.primaryDark, text: colors.textInverse };
  if (matchPercent >= 60) return { bg: colors.primaryPale, text: colors.primaryDark };
  return { bg: 'rgba(245, 158, 11, 0.2)', text: '#783D01' };
}
