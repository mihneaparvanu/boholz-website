import { pagePath } from '@/core/routing';

import type { NavLink } from "../nav.types";

export const TRANSPARENT_NAV: NavLink[] = [
  { label: "Häuser", path: pagePath("houses") },
  { label: "Ihr Neues Zuhause", path: pagePath("yourHouse") },
  { label: "Bauen mit BoHolz", path: pagePath("promise") },
];

export const PRIMARY_NAV: NavLink[] = [
  { label: "Häuser", path: pagePath("houses") },
  { label: "Ihr Neues Zuhause", path: pagePath("yourHouse") },
  { label: "Bauen mit BoHolz", path: pagePath("promise") },
  { label: "News", path: pagePath("news") },
  { label: "Über Uns", path: pagePath("about") },
  { label: "Kontakt", path: pagePath("contact") },
];

/**
 * Extra links rendered inside the "Häuser" dropdown alongside the DB-driven
 * category list. Reserved for landing/campaign pages that aren't real
 * categories. Currently empty — Mehrfamilienhaus is now a real DB category
 * that filters /hauser directly (the landing page /wohnen/mehrfamilien still
 * exists for campaign traffic but isn't linked from the navbar).
 *
 * `mirrorCategorySlug` opts a non-category link into the showcase panel by
 * borrowing another category's hero image on hover. Link/title still point
 * to the extra link's own destination.
 */
export interface HouseDropExtraLink extends NavLink {
  mirrorCategorySlug?: string;
}

export const HOUSE_DROP_EXTRA_LINKS: HouseDropExtraLink[] = [];
