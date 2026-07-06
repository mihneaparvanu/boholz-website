/**
 * Canonical certification marks.
 *
 * Whitelist per the client revisions — the marks below may appear in the
 * public proof strip and footer. "Holz rettet Klima" was re-added in the
 * 2026-07 revision (PDF), having been dropped in the 2026-05 one.
 *
 * Each entry points at a `<symbol id>` inside `certifications.svg`,
 * inlined site-wide by `layouts/Layout.astro`.
 */

export interface Certification {
  /** SVG sprite symbol id, without the leading `#`. */
  id: string;
  /** Human-readable name for screen readers and the visible list label. */
  label: string;
  /** width / height ratio derived from the symbol's viewBox. */
  aspect: string;
  /**
   * Visual mass class. `wide` lifts narrow-aspect marks (RAL, Creditreform)
   * so their content reads at the same perceived weight as the squarer
   * neighbours.
   */
  size?: "default" | "wide" | "tall";
}

/**
 * Order matches the client's PDF screenshot.
 * cert-gdf is the simple square Gütegemeinschaft mark; cert-din-1052 is
 * the separate combined Keitel-Haus / DIN 1052 / Holztafelbau / GDF badge.
 */
export const CERTIFICATIONS: Certification[] = [
  {
    id: "cert-qdf",
    label: "Qualitätsgemeinschaft Deutscher Fertigbau",
    aspect: "469 / 512",
  },
  {
    id: "cert-gdf",
    label: "Gütegemeinschaft Deutsche Fertigbau",
    aspect: "709 / 512",
  },
  {
    id: "cert-din-1052",
    label: "DIN 1052 Holztafelbau (Keitel-Haus, GDF)",
    aspect: "386 / 512",
    size: "tall",
  },
  {
    id: "cert-ral",
    label: "RAL Gütezeichen Holzhausbau",
    aspect: "257 / 512",
    size: "tall",
  },
  {
    id: "cert-bdf",
    label: "Bundesverband Deutscher Fertigbau",
    aspect: "474 / 512",
  },
  {
    id: "cert-creditreform",
    label: "Creditreform Bonitätszertifikat (CrefoZert)",
    aspect: "388 / 512",
    size: "wide",
  },
  {
    id: "cert-holz-klima",
    label: "Holz rettet Klima",
    aspect: "1 / 1",
  },
];

/** Proof strip = full list. */
export const PROOF_CERTIFICATIONS: Certification[] = CERTIFICATIONS;
