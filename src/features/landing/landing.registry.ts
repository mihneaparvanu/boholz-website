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
