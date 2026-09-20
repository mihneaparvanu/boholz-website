import { singleFamilyContent } from "./single-family.content";
import { bungalowContent } from "./bungalow.content";
import { multiFamilyContent } from "./multi-family.content";
import type { LandingPageContent } from "./landing.types";

export const landingPages = {
  einfamilienhaus: singleFamilyContent,
  bungalow: bungalowContent,
  mehrfamilien: multiFamilyContent,
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
