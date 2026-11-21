import type { ModelCategory } from "./categories.types";

/**
 * Bestseller is a virtual category: its models live in their own typology and
 * are flagged `isFeatured`. This is the order they are shown in, everywhere.
 * Client (2026-06-15): Bungalow Komfort 116 sits last (far right).
 */
export const bestsellerOrder = [
  "bestseller-twin-138",
  "bestseller-weitblick-140",
  "bestseller-fellbach-148",
  "bestseller-family-150",
  "bestseller-plus-223",
  "bestseller-komfort-116",
];

const rank = (slug: string) => {
  const i = bestsellerOrder.indexOf(slug);
  return i < 0 ? bestsellerOrder.length : i;
};

export const byBestsellerOrder = (a: { slug: string }, b: { slug: string }) =>
  rank(a.slug) - rank(b.slug);

export const isBestsellerCategory = (
  c: Pick<ModelCategory, "slug"> | null | undefined,
) => c?.slug === "bestseller";

export const getBestsellerModels = <
  T extends { slug: string; isFeatured?: boolean },
>(
  models: T[],
): T[] => models.filter((m) => m.isFeatured).sort(byBestsellerOrder);
