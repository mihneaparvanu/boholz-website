import "./_bare-paths";

import { getCategories } from "@/db/loaders";
import type { ModelCategory } from "@/domain/categories/categories.types";

import { toAttachedImage } from "./attached-image";
import { categoryKey } from "./category-keys";
import { exportEntity } from "./export-entity";

const live = await getCategories();
const parked = await getCategories({ hidden: true });

type Row = (typeof live)[number];

// Keyed by Category, because models reference a category by key. The key is
// the identity, so the value carries no `category` field to disagree with it.
const toRecord = (rows: Row[]) =>
  Object.fromEntries(
    rows.map((c) => [
      categoryKey(c.slug),
      {
        name: c.name,
        slug: c.slug,
        description: c.description,
        media: c.media.map(toAttachedImage),
      } satisfies ModelCategory,
    ]),
  );

const TYPES = ["Category", "ModelCategory"];
// Partial, not Record: `Category` carries every key a model may reference,
// which is more than the site displays.
const TYPE_EXPR = "Partial<Record<Category, ModelCategory>>";

await exportEntity({
  entity: "categories",
  typeName: TYPES,
  typeExpr: TYPE_EXPR,
  data: toRecord(live),
  append: `// Key order is display order.
export const displayCategories = Object.values(categories);`,
});

// HIDDEN_CATEGORY_SLUGS keeps pultdachhaus off the site, and its one model is
// already in houseModels.parked.ts. Without this file that model could not be
// un-parked: its category would resolve to nothing.
await exportEntity({
  entity: "categories",
  fileName: "categories.parked",
  exportName: "parkedCategories",
  typeName: TYPES,
  typeExpr: TYPE_EXPR,
  data: toRecord(parked),
});

process.exit(0);
