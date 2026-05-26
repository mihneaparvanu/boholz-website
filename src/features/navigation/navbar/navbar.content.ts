import { ROUTES } from '@/features/navigation/routes';

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

/**
 * Extra links rendered inside the "Häuser" dropdown alongside the DB-driven
 * category list. Use for landing/campaign pages that aren't real categories
 * (e.g. Mehrfamilienhäuser lives at /wohnen/mehrfamilien).
 *
 * `mirrorCategorySlug` opts a non-category link into the showcase panel by
 * borrowing another category's hero image on hover. Link/title still point
 * to the extra link's own destination.
 */
export interface HouseDropExtraLink extends NavLink {
  mirrorCategorySlug?: string;
}

export const HOUSE_DROP_EXTRA_LINKS: HouseDropExtraLink[] = [
  {
    label: "Mehrfamilienhäuser",
    path: ROUTES.wohnen.mehrfamilien,
    mirrorCategorySlug: "generationenhaus",
  },
];
