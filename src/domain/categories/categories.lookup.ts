import { categories } from "./categories";
import type { Category, ModelCategory } from "./categories.types";

/**
 * The category a model belongs to, resolved from its key.
 *
 * Returns `undefined` rather than throwing, which keeps every call site the
 * same shape it had when the model carried a nested category object. A miss
 * is a real outcome: `Category` is every key a model may reference, while
 * this list is only the categories the site displays.
 *
 * A linear scan over nine categories, called once per model while rendering.
 * A keyed record would be constant-time instead, but the display order is the
 * point of this list, and nine comparisons are not worth giving that up for.
 */
export function categoryOf(
  m: { category: Category } | null | undefined,
): ModelCategory | undefined {
  if (!m) return undefined;
  return categories.find((c) => c.category === m.category);
}
