import { ROUTES } from "@/utils/routes";
import type { NavLink } from "../nav.types";

/** Secondary navigation rendered in the footer. */
export const FOOTER_NAV: NavLink[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Kontakt", path: ROUTES.contact },
  { label: "Vor-Ort-Beratung", path: ROUTES.onsite },
  { label: "Über Uns", path: ROUTES.aboutUS },
];

// Quality badges moved to `src/data/quality-badges.ts` — one canonical
// list, consumed by the footer (all badges) and the page-top proof strip
// (filtered subset).
export { QUALITY_BADGES as FOOTER_CERTIFICATIONS } from "@/data/quality-badges";
export type { QualityBadge as FooterCertification } from "@/data/quality-badges";
