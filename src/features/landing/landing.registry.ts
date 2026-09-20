import { singleFamilyContent } from "./single-family.content";
import { bungalowContent } from "./bungalow.content";
import { multiFamilyContent } from "./multi-family.content";
import type { LandingPageContent } from "./landing.types";

type LandingPageCategory = "einfamilienhaus" | "bungalow" | "mehrfamilienhaus";

type LandingPage = Record<LandingPageCategory, LandingPageContent>;

export const landingPages: LandingPage = {
  einfamilienhaus: singleFamilyContent,
  bungalow: bungalowContent,
  mehrfamilienhaus: multiFamilyContent,
};
