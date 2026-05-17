import { ROUTES } from "@/utils/routes";
import type { NavLink } from "../nav.types";

/** Secondary navigation rendered in the footer. */
export const FOOTER_NAV: NavLink[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Kontakt", path: ROUTES.contact },
  { label: "Vor-Ort-Beratung", path: ROUTES.onsite },
  { label: "Über Uns", path: ROUTES.aboutUS },
];

/**
 * Quality / certification badges shown as a single institutional row.
 * Each entry maps to a `<symbol id>` inside `src/icons/qualityBadges.svg`,
 * which is injected globally by `layouts/Layout.astro`.
 *
 * `aspect` keeps the SVG slot width correct without a known intrinsic size
 * (the sprite ships as <symbol viewBox> only); values mirror the source viewBoxes.
 */
export interface FooterCertification {
  /** SVG sprite symbol id, without the leading `#`. */
  id: string;
  /** Human-readable name for screen readers and the visible list label. */
  label: string;
  /** width / height ratio derived from the symbol's viewBox. */
  aspect: string;
}

export const FOOTER_CERTIFICATIONS: FooterCertification[] = [
  { id: "badge-iso", label: "ISO-zertifiziert", aspect: "34.7 / 31.7" },
  { id: "badge-bdf", label: "Bundesverband Deutscher Fertigbau", aspect: "29.4 / 31.7" },
  { id: "badge-gdf", label: "Gütegemeinschaft Deutsche Fertigbau", aspect: "43.9 / 31.7" },
  { id: "badge-qdf", label: "Qualitätsgemeinschaft Deutscher Fertigbau", aspect: "29.1 / 31.7" },
  { id: "badge-gdf-shield", label: "GDF Schutzsiegel", aspect: "23.9 / 31.7" },
  { id: "badge-ral", label: "RAL Gütezeichen", aspect: "100 / 70" },
];
