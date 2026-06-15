import type { HouseCategory, HouseModel } from "@/db/models";

/**
 * The bestseller category is a real `house_categories` row whose membership
 * isn't stored in `categoryId` (a model lives in its typology — einfamilienhaus,
 * bungalow, etc.) but is computed from `house_models.isFeatured`. This module
 * is the single source of truth for that mapping.
 */

/** Slug of the bestseller category row in `house_categories`. */
export const BESTSELLER_SLUG = "bestseller";

/**
 * Client (2026-06-15): the Bungalow Komfort 116 must sit last (far right) in
 * the bestseller row — it currently leads. Pinned here rather than via a DB
 * sort_order column, which the bestseller listing doesn't have yet.
 */
export const BESTSELLER_LAST_SLUG = "bestseller-komfort-116";

/** True when the given category is the bestseller umbrella. */
export const isBestsellerCategory = (
  c: Pick<HouseCategory, "slug"> | null | undefined,
): boolean => c?.slug === BESTSELLER_SLUG;

/**
 * Models that belong to the bestseller category — i.e. the featured ones.
 * Generic over any shape carrying `isFeatured` so the same helper works on
 * raw `HouseModel` rows and on view-model shapes like `HouseModelCardProps`.
 */
export const getBestsellerModels = <
  T extends Pick<HouseModel, "isFeatured" | "slug">,
>(
  models: T[],
): T[] =>
  models
    .filter((m) => m.isFeatured)
    // Stable sort (preserves source order) that pins the configured slug last.
    .sort((a, b) =>
      a.slug === BESTSELLER_LAST_SLUG
        ? 1
        : b.slug === BESTSELLER_LAST_SLUG
          ? -1
          : 0,
    );
