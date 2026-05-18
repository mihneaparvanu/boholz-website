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
 * Each entry maps to a `<symbol id>` inside `src/icons/qualityBadgesColor.svg`,
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
  { id: "badge-iso-color", label: "ISO-zertifiziert", aspect: "560 / 512" },
  { id: "badge-bdf-color", label: "Bundesverband Deutscher Fertigbau", aspect: "474 / 512" },
  { id: "badge-gdf-color", label: "Gütegemeinschaft Deutsche Fertigbau", aspect: "709 / 512" },
  { id: "badge-qdf-color", label: "Qualitätsgemeinschaft Deutscher Fertigbau", aspect: "469 / 512" },
  // RAL cropped to "RAL Gütezeichen" only — Holzhausbau house-frame mark below was excluded per client.
  { id: "badge-ral-color", label: "RAL Gütezeichen", aspect: "256 / 120" },
  { id: "badge-holz-klima-color", label: "Holz Rettet Klima 2030", aspect: "1 / 1" },
];
