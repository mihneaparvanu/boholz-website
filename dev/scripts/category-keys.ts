import type { Category } from "@/domain/categories/categories.types";

// Postgres stores the German slug, which is the public URL and must not
// change; the domain keys off English. This is the only place the two
// vocabularies meet, so every export that reads a category goes through it.
const CATEGORY_KEYS: Record<string, Category | undefined> = {
  bestseller: "bestseller",
  einfamilienhaus: "oneFamilyHouse",
  stadtvilla: "cityVilla",
  bungalow: "bungalow",
  doppelhaus: "doubleHouse",
  generationenhaus: "generationHouse",
  zweifamilienhaus: "twoFamilyHouse",
  mehrfamilienhaus: "multiFamilyHouse",
  kubus: "cube",
  pultdachhaus: "shedRoofHouse",
};

export function categoryKey(slug: string): Category {
  const key = CATEGORY_KEYS[slug];
  if (!key) {
    throw new Error(`category slug "${slug}" has no Category key`);
  }
  return key;
}
