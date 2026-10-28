import { getCategories } from "@/db/loaders";
import type { ModelCategory } from "@/domain/categories/categories.types";

import { exportEntity } from "./export-entity";

const live = await getCategories();
const parked = await getCategories({ hidden: true });

const toRecord = (c: (typeof live)[number]): ModelCategory => ({
  name: c.name,
  slug: c.slug,
  description: c.description,
  media: c.media.map((m) => ({
    isThumbnail: m.isThumbnail,
    isHero: m.isHero,
    path: m.media.path,
    alt: m.media.alt,
    width: m.media.width,
    height: m.media.height,
    isAi: m.media.isAi,
  })),
});

await exportEntity({
  entity: "categories",
  typeName: "ModelCategory",
  data: live.map(toRecord),
});

// HIDDEN_CATEGORY_SLUGS keeps pultdachhaus off the site, and its one model is
// already in house-models.parked.ts. Without this file that model could not be
// un-parked: its categorySlug would resolve to nothing.
await exportEntity({
  entity: "categories",
  fileName: "categories.parked",
  exportName: "parkedCategories",
  typeName: "ModelCategory",
  data: parked.map(toRecord),
});

process.exit(0);
