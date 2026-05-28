import type { HouseCategory, HouseModel } from "@/db/models";

/**
 * The bestseller category is a real `house_categories` row whose membership
 * isn't stored in `categoryId` (a model lives in its typology — einfamilienhaus,
 * bungalow, etc.) but is computed from `house_models.isFeatured`. This module
 * is the single source of truth for that mapping.
 */

/** Slug of the bestseller category row in `house_categories`. */
export const BESTSELLER_SLUG = "bestseller";

/** True when the given category is the bestseller umbrella. */
export const isBestsellerCategory = (
  c: Pick<HouseCategory, "slug"> | null | undefined,
): boolean => c?.slug === BESTSELLER_SLUG;

/**
 * Models that belong to the bestseller category — i.e. the featured ones.
 * Generic over any shape carrying `isFeatured` so the same helper works on
 * raw `HouseModel` rows and on view-model shapes like `HouseModelCardProps`.
 */
export const getBestsellerModels = <T extends Pick<HouseModel, "isFeatured">>(
  models: T[],
): T[] => models.filter((m) => m.isFeatured);
