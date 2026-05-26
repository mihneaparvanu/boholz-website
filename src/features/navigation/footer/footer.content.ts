import { ROUTES } from "@/features/navigation/routes";

import type { NavLink } from "../nav.types";

/** Secondary navigation rendered in the footer. */
export const FOOTER_NAV: NavLink[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Kontakt", path: ROUTES.contact },
  { label: "Vor-Ort-Beratung", path: ROUTES.onsite },
  { label: "Über Uns", path: ROUTES.aboutUS },
];

