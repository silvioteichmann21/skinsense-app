export const HOME_DISPLAY_NAME = 'Alex';
export const HOME_SKIN_SCORE = 74;
export const HOME_SCORE_DELTA = '+3 since last scan ↑';
export const HOME_LAST_SCAN = 'Last scanned: 3 days ago';
export const HOME_STREAK_DAYS = 7;

export type RoutinePreviewStep = {
  id: string;
  name: string;
};

export const MORNING_ROUTINE_PREVIEW: RoutinePreviewStep[] = [
  { id: 'am-1', name: 'Gentle Cleanser' },
  { id: 'am-2', name: 'Hydrating Toner' },
  { id: 'am-3', name: 'Vitamin C Serum' },
];

export const LEARN_ARTICLES = [
  {
    id: '1',
    title: 'Why hyaluronic acid works for dehydrated skin',
    tag: 'Hydration',
    tagBg: 'primaryPale' as const,
    readTime: '4 MIN READ',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHuqd1whgQTok0mWTpt0MrCfLIIn-p_cvUei1jBM4kfHDXAaWMfOcE9wimRToOFXppdzBSA9d3ZBA-6FLpHX-OmHVF9fez2AIBlmtr6ZHichmtm29ngP96Lo5M8aXGzKm-ptswD3LWZ6ubhrx5W-5LBcAtwOzbobF-Ybvg_40PFKXyl62BmxRcg9ySS4we9-0OsSoCQWZflnpaCmrasrNlZNoni5ab_ClE3KHOXi7xm_jrh7rnjhtydEoN3he7MYuDXzy0pfo_-Aw',
  },
  {
    id: '2',
    title: 'The ultimate guide to Mineral vs Chemical SPF',
    tag: 'Sun Protection',
    tagBg: 'accentLight' as const,
    readTime: '6 MIN READ',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA79avhoEpHDECTbT1hSi_bakfFjaYmCPVczCiLaXIDxp2HM0EeEGzWCIPFon72To6I-Qkfdp84e9dGNry-ozcOvVxYp9zEGBu2RPzDFkpYuyiTKD6fuSY4xDiP3lNUPKrJvVfmPatAwzL6ydY6neg-cOSVxf1O33knVa37qo6CvGCrxGE81Z_lzUvo85nsWXHJ0g8qkfGz16sHYfjFPzPwKb5kqQnB0gb3Y8jlB1RI2-RrWVZOAz6yEP1CC1N-pgLs_0wllcffSHA',
  },
] as const;
