export type IngredientStatus = 'good' | 'caution';

export type ScannedIngredient = {
  id: string;
  name: string;
  note: string;
  status: IngredientStatus;
};

export const INGREDIENT_SCAN_PREVIEW_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDCC7MT7H58hz8c45-PodkItC5bpTsOnQO-4WVvKFSqfQa3soMmQVT1JnZ3zd_dwcanxgNr0tjmOPZgSnET03BeKcPqI3Gbn4DFQbpaZ7z_U3IkBw2Q44_wbay-0Sh3u24xH1vQeP1HhsF484yCxSoCBamEKkgWdCmBVGFb1MZwpgm1gal1MOttQ39O-vxA7aUXqxwEBthF8E8LIGrTu2ipZs7sT_LDSqLzul5l17xn0kxuILxw5U3ecu3g-gTdOhnB67r0P7LKLrk';

export const INGREDIENT_SCAN_RESULT = {
  category: 'CLEANSER',
  name: 'CeraVe Hydrating Cleanser',
  subtitle: 'Non-foaming face wash for normal to dry skin',
  heroImageUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCrRx4b0QiRBH97oArJ4xNIAR1ws3AavZ1mmZzWxmV20DHY4GG2dCnXrhXSzaNllsBzmI-AUjPO4U7uoARVyJuAsGPgnyjc_HXN-soL6JCnlr8dyNbmGuZo4L5knXvlwg1kEfV8yPiNLXzFx-pAtoJadX58yrYFNHyf_UqbpqkQKwIx_EM0QasbIPmEPm7KPuH677eRSr2JI3dd6Oh7vWlpruwN__nCKJ5IhzDB64q5zhBw5S31bJUF0ph_tM9JVV1sYYpAfRiNsP8',
  safetyScore: 88,
  matchScore: 92,
  watchOutTitle: 'What to watch out for',
  watchOutBody:
    'Contains Phenoxyethanol which may cause mild sensitivity for highly compromised barriers. Avoid direct eye contact.',
  totalIngredients: 32,
  ingredients: [
    {
      id: 'i1',
      name: 'Ceramides (1, 3, 6-II)',
      note: 'Skin-identical barrier support',
      status: 'good',
    },
    {
      id: 'i2',
      name: 'Hyaluronic Acid',
      note: 'Powerful humectant for hydration',
      status: 'good',
    },
    {
      id: 'i3',
      name: 'Phenoxyethanol',
      note: 'Preservative, possible mild allergen',
      status: 'caution',
    },
    {
      id: 'i4',
      name: 'Glycerin',
      note: 'Moisture-attracting clinical base',
      status: 'good',
    },
  ] satisfies ScannedIngredient[],
};
