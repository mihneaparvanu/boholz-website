import type { IconName } from "@/lib/icons";

/**
 * Trust proof points rendered as `<StatBlock>` rows.
 * Icons are passed by name (cross-island prop pattern) and resolved
 * inside the Vue island via `getIcon()`.
 */
export interface TrustBadge {
  icon: IconName;
  /** Big number / value. String so units like "100%" work. */
  value: string;
  /** Short label under the value. */
  label: string;
  /** Optional explainer below the label. */
  caption?: string;
  /** When true, the card renders the Germany-flag visual above its value. */
  flag?: boolean;
}

export const trustBadges: TrustBadge[] = [
  {
    icon: "hammer",
    value: "100%",
    label: "Made in Germany",
    caption: "Vorgefertigt im Werk, montiert vom Boholz-Team.",
  },
  {
    icon: "calendar-check",
    value: "18",
    label: "Monate Festpreis",
    caption: "Garantiert keine Nachforderungen während der Bauzeit.",
  },
  {
    icon: "shield",
    value: "5",
    label: "Jahre Gewährleistung",
    caption: "Vertraglich gesichert auf Konstruktion und Material.",
  },
];
