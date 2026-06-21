/**
 * Gemini structured output schema for skin scan analysis.
 * IDs must match app i18n keys (reportData.*, routine step defs).
 */

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    skinScore: { type: 'NUMBER', description: 'Overall skin health score 0-100' },
    skinTypeId: {
      type: 'STRING',
      enum: ['oily', 'dry', 'combination', 'normal', 'sensitive'],
    },
    fitzpatrickId: {
      type: 'STRING',
      enum: ['typeI', 'typeII', 'typeIII', 'typeIV', 'typeV', 'typeVI'],
    },
    chipIds: {
      type: 'ARRAY',
      items: {
        type: 'STRING',
        enum: ['tZoneOily', 'cheeksNormal', 'seasonalDryness'],
      },
    },
    positiveIds: {
      type: 'ARRAY',
      items: {
        type: 'STRING',
        enum: ['strongBarrier', 'goodElasticity'],
      },
    },
    concerns: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: {
            type: 'STRING',
            enum: ['hydration', 'acne', 'texture', 'barrier', 'redness'],
          },
          severity: {
            type: 'STRING',
            enum: ['healthy', 'low', 'medium', 'high'],
          },
          barPercent: {
            type: 'NUMBER',
            description: '0-100 severity indicator (higher = more concern except barrier)',
          },
          insightId: { type: 'STRING' },
        },
        required: ['id', 'severity', 'barPercent'],
      },
    },
    routine: {
      type: 'OBJECT',
      properties: {
        subtitle: { type: 'STRING' },
        morningStepIds: {
          type: 'ARRAY',
          items: { type: 'STRING' },
        },
        eveningStepIds: {
          type: 'ARRAY',
          items: { type: 'STRING' },
        },
      },
      required: ['subtitle', 'morningStepIds', 'eveningStepIds'],
    },
  },
  required: [
    'skinScore',
    'skinTypeId',
    'fitzpatrickId',
    'chipIds',
    'positiveIds',
    'concerns',
    'routine',
  ],
} as const;

export type GeminiConcernRaw = {
  id: string;
  severity: string;
  barPercent: number;
  insightId?: string;
};

export type GeminiAnalysisRaw = {
  skinScore: number;
  skinTypeId: string;
  fitzpatrickId: string;
  chipIds: string[];
  positiveIds: string[];
  concerns: GeminiConcernRaw[];
  routine: {
    subtitle: string;
    morningStepIds: string[];
    eveningStepIds: string[];
  };
};

export type AnalyzeSkinRequest = {
  locale?: string;
  quizContext?: {
    skinType?: string | null;
    concerns?: string[];
    goals?: string[];
    routine?: string | null;
  } | null;
  images: {
    front?: string;
    right?: string;
    left?: string;
  };
};

export const SYSTEM_PROMPT = `You are a cosmetic skin wellness assistant for the SkinSense app.
Analyze the provided face photos (front required; right/left profile optional) for general skincare guidance only.
This is NOT medical diagnosis. Be conservative and vary scores based on visible differences between photos.

Rules:
- Use only the enum IDs provided in the JSON schema.
- barPercent: 0-100 where higher means more attention needed; for barrier, higher means healthier barrier.
- Include 3-5 concerns from the allowed list; mark clearly healthy areas with severity "healthy".
- morningStepIds / eveningStepIds: pick from ONLY these IDs:
  am-1, am-2, am-3, am-3b, am-4, am-5, am-6, pm-1, pm-2, pm-3, pm-4, pm-5
- Morning must include am-1 (cleanser) and am-5 (SPF). Evening must include pm-2 (cleanser) and pm-4 (moisturizer).
- Weight quiz context lightly; prioritize what you see in the images.
- insightId: use keys like mildCheeks, tzoneOilBreakouts, performingWell, unevenExfolSpf when relevant (optional).`;
