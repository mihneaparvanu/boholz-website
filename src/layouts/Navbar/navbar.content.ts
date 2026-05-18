import { ROUTES } from "@/utils/routes";
import type { NavLink } from "../nav.types";

export const TRANSPARENT_NAV: NavLink[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Ihr Neues Zuhause", path: ROUTES.yourHouse },
  { label: "Bauen mit BoHolz", path: ROUTES.promise },
];

export const PRIMARY_NAV: NavLink[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Ihr Neues Zuhause", path: ROUTES.yourHouse },
  { label: "Bauen mit BoHolz", path: ROUTES.promise },
  { label: "News", path: ROUTES.news },
  { label: "Über Uns", path: ROUTES.aboutUS },
  { label: "Kontakt", path: ROUTES.contact },
];
