import { CATEGORY_ORDER, getModels, type CategorySlug } from "@/db/loaders";
import type { HouseModel } from "@/db/models";
import type {
  HouseModelDetails,
  HouseModelRecord,
} from "@/domain/house-models/house-models.types";

import { exportEntity } from "./export-entity";

// `s is CategorySlug` = if this returns true, treat s as one of the real
// category slugs. `.some` rather than `.includes` so no cast is needed.
const isCategorySlug = (s: string): s is CategorySlug =>
  CATEGORY_ORDER.some((c) => c === s);

// The details row's id IS the model's id — it is how the two rows were
// joined, and the nesting replaces it.
const stripId = (d: NonNullable<HouseModel["details"]>): HouseModelDetails => {
  const { id, ...rest } = d;
  return rest;
};

// getModels() already drops hidden models and sorts the media by sortOrder.
const models = await getModels();

const exported: HouseModelRecord[] = models.map((m) => {
  if (m.category === null) {
    throw new Error(`model "${m.slug}" has no category`);
  }
  if (!isCategorySlug(m.category.slug)) {
    throw new Error(
      `model "${m.slug}" sits in category "${m.category.slug}", which is not in CATEGORY_ORDER`,
    );
  }

  return {
    slug: m.slug,
    title: m.title,
    modelCode: m.modelCode,
    description: m.description,
    // numeric columns — Drizzle reports these as strings, not numbers
    livingArea: m.livingArea,
    price: m.price,
    roofPitch: m.roofPitch,
    isFeatured: m.isFeatured,
    categorySlug: m.category.slug,
    // one spec row or nothing; two of the 32 models have none
    details: m.details === null ? null : stripId(m.details),
    media: m.media.map((mm) => ({
      isHero: mm.isHero,
      isThumbnail: mm.isThumbnail,
      path: mm.media.path,
      alt: mm.media.alt,
      width: mm.media.width,
      height: mm.media.height,
      isAi: mm.media.isAi,
    })),
    floors: m.floors.map((f) => ({
      title: f.title,
      variant: f.variant,
      path: f.media.path,
      alt: f.media.alt,
      width: f.media.width,
      height: f.media.height,
      isAi: f.media.isAi,
    })),
  };
});

await exportEntity({
  entity: "house-models",
  exportName: "houseModels",
  typeName: "HouseModelRecord",
  data: exported,
});

process.exit(0);
