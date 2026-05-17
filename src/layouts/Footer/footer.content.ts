import { ROUTES } from "@/utils/routes";
import type { NavLink } from "../nav.types";

/** Secondary navigation rendered in the footer. */
export const FOOTER_NAV: NavLink[] = [
  { label: "Kontakt", path: ROUTES.contact },
  { label: "Vor-Ort-Beratung", path: ROUTES.onsite },
  { label: "Über Uns", path: ROUTES.aboutUS },
];
