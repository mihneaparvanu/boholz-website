import { singleFamilyContent } from "./single-family.content";
import { bungalowContent } from "./bungalow.content";
import { multiFamilyContent } from "./multi-family.content";
import { stadtvillaContent } from "./stadtvilla.content";
import { doppelhausContent } from "./doppelhaus.content";
import { generationenhausContent } from "./generationenhaus.content";
import { zweifamilienhausContent } from "./zweifamilienhaus.content";
import { kubusContent } from "./kubus.content";
import { bestsellerContent } from "./bestseller.content";
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

export type LandingCategory = keyof typeof landingPages;

export const landingCategories = Object.keys(landingPages) as LandingCategory[];
