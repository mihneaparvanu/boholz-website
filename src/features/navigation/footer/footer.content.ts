import { pagePath } from "@/core/routing";

import type { NavLink } from "../nav.types";

/** Secondary navigation rendered in the footer. */
export const FOOTER_NAV: NavLink[] = [
  { label: "Häuser", path: pagePath("houses") },
  { label: "Kontakt", path: pagePath("contact") },
  { label: "Vor-Ort-Beratung", path: pagePath("onsite") },
  { label: "Über Uns", path: pagePath("about") },
];

