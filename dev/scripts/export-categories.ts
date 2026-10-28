import "./_bare-paths";

import { getCategories } from "@/db/loaders";
import type { ModelCategory } from "@/domain/categories/categories.types";

import { toAttachedImage } from "./attached-image";
import { categoryKey } from "./category-keys";
import { exportEntity } from "./export-entity";

const live = await getCategories();
const parked = await getCategories({ hidden: true });

const toRecord = (c: (typeof live)[number]): ModelCategory => ({
  category: categoryKey(c.slug),
  name: c.name,
  slug: c.slug,
  description: c.description,
  media: c.media.map(toAttachedImage),
});

await exportEntity({
  entity: "categories",
  typeName: "ModelCategory",
  data: live.map(toRecord),
});

// HIDDEN_CATEGORY_SLUGS keeps pultdachhaus off the site, and its one model is
// already in houseModels.parked.ts. Without this file that model could not be
// un-parked: its category would resolve to nothing.
await exportEntity({
  entity: "categories",
  fileName: "categories.parked",
  exportName: "parkedCategories",
  typeName: "ModelCategory",
  data: parked.map(toRecord),
});

process.exit(0);
