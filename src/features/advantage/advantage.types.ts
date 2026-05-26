import type { IconName } from "@/lib/icons";

/**
 * One half of a side-by-side comparison card pair (e.g. Sommer vs Winter,
 * ECO Nature vs ECO Nature Plus).
 *
 * Used by `FeatureCardPair.vue`. Two cards render side-by-side from tablet
 * up, stacked on mobile. The icon is a small visual anchor next to the
 * eyebrow; the image is the dominant card visual.
 */
export interface FeatureCard {
  /** Small uppercase eyebrow above the title — "Sommer", "Winter", "KfW 55", etc. */
  eyebrow: string;
  /** Card title — short, ~2–4 words. */
  title: string;
  /** Optional one-sentence lede under the title. */
  lede?: string;
  /** Bullet list of supporting points. */
  bullets: string[];
  /** Image URL (R2). */
  imageURL: string;
  /** Image alt text. */
  imageAlt: string;
  /** Optional Lucide icon name shown next to the eyebrow. */
  icon?: IconName;
}
