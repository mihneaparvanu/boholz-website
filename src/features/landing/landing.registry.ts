import { singleFamilyContent } from "./content/single-family.content";
import { bungalowContent } from "./content/bungalow.content";
import { multiFamilyContent } from "./content/multi-family.content";
import { stadtvillaContent } from "./content/stadtvilla.content";
import { doppelhausContent } from "./content/doppelhaus.content";
import { generationenhausContent } from "./content/generationenhaus.content";
import { zweifamilienhausContent } from "./content/zweifamilienhaus.content";
import { kubusContent } from "./content/kubus.content";
import { bestsellerContent } from "./content/bestseller.content";
import type { LandingPageContent } from "./landing.types";

export const landingPages = {
  einfamilienhaus: singleFamilyContent,
  stadtvilla: stadtvillaContent,
  bungalow: bungalowContent,
  doppelhaus: doppelhausContent,
  generationenhaus: generationenhausContent,
  zweifamilienhaus: zweifamilienhausContent,
  mehrfamilien: multiFamilyContent,
  kubus: kubusContent,
  bestseller: bestsellerContent,
} satisfies Record<string, LandingPageContent>;

export const landingPagesKeys = Object.keys(landingPages);

export type LandingCategory = keyof typeof landingPages;

export const landingCategories = Object.keys(landingPages) as LandingCategory[];

/**
 * These keys are URL segments, not category slugs: `mehrfamilien` is the
 * landing page for the `mehrfamilienhaus` category, and `pultdachhaus` has no
 * landing page at all. Callers that build a /wohnen/<slug> link must narrow
 * first — the route is prerendered, so a wrong slug is a hard 404, not a soft
 * miss.
 */
export function isLandingCategory(
  value: string | undefined,
): value is LandingCategory {
  return value !== undefined && value in landingPages;
}
