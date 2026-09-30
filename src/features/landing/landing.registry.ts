import { singleFamilyContent } from "./single-family.content";
import { bungalowContent } from "./bungalow.content";
import { multiFamilyContent } from "./multi-family.content";
import { stadtvillaContent } from "./stadtvilla.content";
import { doppelhausContent } from "./doppelhaus.content";
import { generationenhausContent } from "./generationenhaus.content";
import { zweifamilienhausContent } from "./zweifamilienhaus.content";
import { kubusContent } from "./kubus.content";
import { bestsellerContent } from "./bestseller.content";
import { templateDemoContent } from "./template-demo.content";
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
  // Structural preview only (/wohnen/template) — dev review, not for prod.
  template: templateDemoContent,
} satisfies Record<string, LandingPageContent>;

export type LandingCategory = keyof typeof landingPages;

export function isLandingCategory(
  value: string | undefined,
): value is LandingCategory {
  return value !== undefined && value in landingPages;
}

/**
 * The landing slugs, typed. `Object.keys` is declared as `string[]` because
 * a value may carry properties beyond its type at runtime — here it cannot,
 * since the object literal is right above. Asserting once, next to the fact
 * it is about, keeps the cast out of every call site.
 */
export const landingCategories = Object.keys(
  landingPages,
) as LandingCategory[];
