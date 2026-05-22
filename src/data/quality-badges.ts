/**
 * Canonical quality / certification badges.
 *
 * One ordered list, two consumers: the footer renders all of them under
 * "Geprüfte Qualität"; the page-top proof strip filters to the core five
 * (excludes ISO and Holz-Rettet-Klima — those belong to the institutional
 * and sustainability stories respectively).
 *
 * Each entry points at a `<symbol id>` inside
 * `src/icons/qualityBadgesColor.svg`. The sprite is tokenised — see the
 * file header — so colour and mono variants come from the same source.
 */

export interface QualityBadge {
  /** SVG sprite symbol id, without the leading `#`. */
  id: string;
  /** Human-readable name for screen readers and the visible list label. */
  label: string;
  /** width / height ratio derived from the symbol's viewBox. */
  aspect: string;
  /**
   * Visual mass class. `wide` lifts narrow-aspect marks (RAL, Creditreform)
   * so their content reads at the same perceived weight as the squarer
   * neighbours; `tall` is the oversize anchor mark (Holz-Rettet-Klima).
   */
  size?: "default" | "wide" | "tall";
}

/** Ordered, canonical list. */
export const QUALITY_BADGES: QualityBadge[] = [
  { id: "badge-iso-color", label: "ISO-zertifiziert", aspect: "560 / 512" },
  { id: "badge-bdf-color", label: "Bundesverband Deutscher Fertigbau", aspect: "474 / 512" },
  { id: "badge-gdf-color", label: "Gütegemeinschaft Deutsche Fertigbau", aspect: "709 / 512" },
  { id: "badge-qdf-color", label: "Qualitätsgemeinschaft Deutscher Fertigbau", aspect: "469 / 512" },
  { id: "badge-ral-color", label: "RAL Gütezeichen", aspect: "256 / 120", size: "wide" },
  { id: "badge-creditreform-color", label: "Creditreform Bonitätszertifikat", aspect: "388 / 512", size: "wide" },
  { id: "badge-holz-klima-color", label: "Holz Rettet Klima 2030", aspect: "1 / 1", size: "tall" },
];

/**
 * The page-top proof strip omits the institutional ISO mark (carried by
 * the footer's wider trust block) and the sustainability-themed
 * Holz-Rettet-Klima (which belongs with the eco messaging).
 */
const PROOF_OMIT = new Set(["badge-iso-color", "badge-holz-klima-color"]);

export const PROOF_BADGES: QualityBadge[] = QUALITY_BADGES.filter(
  (b) => !PROOF_OMIT.has(b.id),
);
