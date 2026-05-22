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
 *
 * `size` lets each badge declare its own visual mass. The CSS maps these to
 * height tokens so re-ordering the list never breaks layout (the old
 * nth-child(6) hack is gone). `wide` lifts narrow-aspect marks (e.g. RAL,
 * Creditreform) so their content reads at the same perceived weight as the
 * roughly-square neighbours; `tall` is the oversize Holz-Rettet-Klima mark
 * the client wants emphasised.
 */
export interface FooterCertification {
  /** SVG sprite symbol id, without the leading `#`. */
  id: string;
  /** Human-readable name for screen readers and the visible list label. */
  label: string;
  /** width / height ratio derived from the symbol's viewBox. */
  aspect: string;
  /** Visual mass class — drives the CSS height per-badge. */
  size?: "default" | "wide" | "tall";
}

export const FOOTER_CERTIFICATIONS: FooterCertification[] = [
  { id: "badge-iso-color", label: "ISO-zertifiziert", aspect: "560 / 512" },
  { id: "badge-bdf-color", label: "Bundesverband Deutscher Fertigbau", aspect: "474 / 512" },
  { id: "badge-gdf-color", label: "Gütegemeinschaft Deutsche Fertigbau", aspect: "709 / 512" },
  { id: "badge-qdf-color", label: "Qualitätsgemeinschaft Deutscher Fertigbau", aspect: "469 / 512" },
  // RAL cropped to "RAL Gütezeichen" only — Holzhausbau house-frame mark below was excluded per client.
  { id: "badge-ral-color", label: "RAL Gütezeichen", aspect: "256 / 120", size: "wide" },
  { id: "badge-creditreform-color", label: "Creditreform Bonitätszertifikat", aspect: "388 / 512" },
  { id: "badge-holz-klima-color", label: "Holz Rettet Klima 2030", aspect: "1 / 1", size: "tall" },
];
