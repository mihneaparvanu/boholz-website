import "./_bare-paths";

import { getModels } from "@/db/loaders";
import type { HouseModel as ModelRow } from "@/db/models";
import type { HouseModel } from "@/domain/house-models/houseModels.types";

import { toAttachedImage } from "./attached-image";
import { categoryKey } from "./category-keys";
import { exportEntity } from "./export-entity";
import { toNumber } from "./numeric";

// Everything on HouseModel that comes from the house_details row. Omit rather
// than Pick, so a column added to house_details shows up here and forces
// NO_SPECS below to grow with it.
type Specs = Omit<
  HouseModel,
  | "slug"
  | "title"
  | "modelCode"
  | "description"
  | "livingArea"
  | "price"
  | "roofPitch"
  | "isFeatured"
  | "category"
  | "media"
  | "floors"
>;

// The details row's id IS the model's id — it is how the two rows were
// joined, so it carries no information once the fields sit on the model.
const toSpecs = (d: NonNullable<ModelRow["details"]>): Specs => ({
  floorCount: toNumber(d.floorCount),
  roofType: d.roofType,
  kniestock: d.kniestock,
  netFloorAreaDin: toNumber(d.netFloorAreaDin),
  totalLivingAreaWoflv: toNumber(d.totalLivingAreaWoflv),
  extensionDescription: d.extensionDescription,
  allowsGrannyFlat: d.allowsGrannyFlat,
  levelCount: d.levelCount,
  bedroomCount: d.bedroomCount,
  bathroomCount: d.bathroomCount,
  familiesCount: d.familiesCount,
  width: toNumber(d.width),
  length: toNumber(d.length),
  height: toNumber(d.height),
  hasGarage: d.hasGarage,
  isBarrierFree: d.isBarrierFree,
  hasChildrenRoom: d.hasChildrenRoom,
});

// Two of the 32 models have no details row.
const NO_SPECS: Specs = {
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

const toRecord = (m: (typeof live)[number]): HouseModel => {
  if (m.category === null) {
    throw new Error(`model "${m.slug}" has no category`);
  }

  return {
    slug: m.slug,
    title: m.title,
    modelCode: m.modelCode,
    description: m.description,
    livingArea: toNumber(m.livingArea),
    price: toNumber(m.price),
    roofPitch: m.roofPitch,
    isFeatured: m.isFeatured ?? false,
    category: categoryKey(m.category.slug),
    // the 17 spec fields, flattened onto the model
    ...(m.details === null ? NO_SPECS : toSpecs(m.details)),
    media: m.media.map(toAttachedImage),
    floors: m.floors.map((f) => {
      // floor_media.title is nullable, but it is the tab label — a plan
      // without one would render a blank tab.
      if (f.title === null) {
        throw new Error(`model "${m.slug}" has a floor plan with no title`);
      }
      return {
        title: f.title,
        variant: f.variant,
        path: f.media.path,
        alt: f.media.alt,
        width: f.media.width,
        height: f.media.height,
        isAi: f.media.isAi,
      };
    }),
  };
};

await exportEntity({
  entity: "house-models",
  fileName: "houseModels",
  typesFile: "houseModels.types",
  exportName: "houseModels",
  typeName: "HouseModel",
  data: live.map(toRecord),
});

// Parked models go in their own file, imported by nothing. A separate file
// rather than an isHidden flag on one list: with a flag, all five places that
// iterate models would have to remember to filter, and missing one puts a
// parked house on the site. A list that does not contain them cannot.
await exportEntity({
  entity: "house-models",
  fileName: "houseModels.parked",
  typesFile: "houseModels.types",
  exportName: "parkedHouseModels",
  typeName: "HouseModel",
  data: parked.map(toRecord),
});

process.exit(0);
