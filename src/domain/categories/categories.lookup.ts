import { categories } from "./categories";
import type { Category, ModelCategory } from "./categories.types";

// `categories` keeps its literal keys so `displayCategories` stays exact, and
// a model may carry a key it omits — only this view admits the lookup.
const byKey: Partial<Record<Category, ModelCategory>> = categories;

export function categoryOf(
  m: { category: Category } | null | undefined,
): ModelCategory | undefined {
  return m ? byKey[m.category] : undefined;
}

// A model carries a key and a category value carries a slug, so the two never
// compare directly — `m.category === c.slug` is false for all but bestseller.
export function isInCategory(
  m: { category: Category },
  c: Pick<ModelCategory, "slug">,
): boolean {
  return categoryOf(m)?.slug === c.slug;
}
