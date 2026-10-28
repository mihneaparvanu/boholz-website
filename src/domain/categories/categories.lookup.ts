import { categories } from "./categories";
import type { ModelCategory } from "./categories.types";

/**
 * The category a model belongs to, resolved from its slug.
 *
 * Returns `undefined` rather than throwing, which keeps every call site the
 * same shape it had when the model carried a nested category object — the
 * database column is nullable, so the code already handled a missing one.
 *
 * A linear scan over nine categories, called once per model while rendering.
 * A keyed record would be constant-time instead, but the display order is the
 * point of this list, and nine comparisons are not worth giving that up for.
 */
export function categoryOf(
  m: { categorySlug: string } | null | undefined,
): ModelCategory | undefined {
  if (!m) return undefined;
  return categories.find((c) => c.slug === m.categorySlug);
}
