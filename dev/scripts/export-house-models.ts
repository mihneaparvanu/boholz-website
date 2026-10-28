import { CATEGORY_ORDER, getModels, type CategorySlug } from "@/db/loaders";
import type { HouseModel } from "@/db/models";
import type {
  HouseModelRecord,
  ModelSpecs,
} from "@/domain/house-models/house-models.types";

import { exportEntity } from "./export-entity";

// `s is CategorySlug` = if this returns true, treat s as one of the real
// category slugs. `.some` rather than `.includes` so no cast is needed.
const isCategorySlug = (s: string): s is CategorySlug =>
  CATEGORY_ORDER.some((c) => c === s);

// The details row's id IS the model's id — it is how the two rows were
// joined, so it carries no information once the fields sit on the model.
const stripId = (d: NonNullable<HouseModel["details"]>): ModelSpecs => {
  const { id, ...rest } = d;
  return rest;
};

// Two of the 32 models have no details row. The annotation is what forces
// this list to stay complete when a column is added to house_details.
const NO_SPECS: ModelSpecs = {
  floorCount: null,
  roofType: null,
  kniestock: null,
  netFloorAreaDin: null,
  totalLivingAreaWoflv: null,
  extensionDescription: null,
  allowsGrannyFlat: null,
  levelCount: null,
  bedroomCount: null,
  bathroomCount: null,
  familiesCount: null,
  width: null,
  length: null,
  height: null,
  hasGarage: null,
  isBarrierFree: null,
  hasChildrenRoom: null,
};

// getModels() sorts the media by sortOrder; `hidden` picks which side of the
// is_hidden flag to take.
const live = await getModels();
const parked = await getModels({ hidden: true });

const toRecord = (m: (typeof live)[number]): HouseModelRecord => {
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
    // the 17 spec fields, flattened onto the model
    ...(m.details === null ? NO_SPECS : stripId(m.details)),
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
};

await exportEntity({
  entity: "house-models",
  exportName: "houseModels",
  typeName: "HouseModelRecord",
  data: live.map(toRecord),
});

// Parked models go in their own file, imported by nothing. A separate file
// rather than an isHidden flag on one list: with a flag, all five places that
// iterate models would have to remember to filter, and missing one puts a
// parked house on the site. A list that does not contain them cannot.
await exportEntity({
  entity: "house-models",
  fileName: "house-models.parked",
  exportName: "parkedHouseModels",
  typeName: "HouseModelRecord",
  data: parked.map(toRecord),
});

process.exit(0);
