import { z } from 'zod';

export const waitlistBodySchema = z.object({
  email: z
    .string()
    .trim()
    .min(3)
    .max(254)
    .email({ message: 'invalid_email' }),
  name: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  /** Honeypot — bots fill this; humans leave empty */
  website: z.string().optional(),
});

export type WaitlistBody = z.infer<typeof waitlistBodySchema>;
