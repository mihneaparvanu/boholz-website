import { ROUTES } from "@/utils/routes";
import type { NavLink } from "../nav.types";

export const TRANSPARENT_NAV: NavLink[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Dein Zuhause", path: ROUTES.yourHouse },
  { label: "Das BoHolz Versprechen", path: ROUTES.promise },
];

export const PRIMARY_NAV: NavLink[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Das BoHolz Versprechen", path: ROUTES.promise },
  { label: "Dein Zuhause", path: ROUTES.yourHouse },
  { label: "Über Uns", path: ROUTES.aboutUS },
  { label: "News", path: ROUTES.news },
  { label: "Kontakt", path: ROUTES.contact },
];
