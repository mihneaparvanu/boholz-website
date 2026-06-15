import { z } from "zod";

export const consentSchema = z.object({
  v: z.literal(1),
  analytics: z.boolean(),
  marketing: z.boolean(),
});

export type ConsentV1 = z.infer<typeof consentSchema>;

export const CONSENT_PRESETS = {
  all: { v: 1, analytics: true, marketing: true },
  middle: { v: 1, analytics: true, marketing: false },
  essential: { v: 1, analytics: false, marketing: false },
} as const satisfies Record<string, ConsentV1>;
