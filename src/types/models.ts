import type { InferSelectModel } from "drizzle-orm";
import {
  houseModels,
  houseDetails,
  modelMedia,
  houseCategories,
  categoryMedia,
  media,
} from "../db/schema";

// Raw table row types — one per table
export type BaseHouseModel = InferSelectModel<typeof houseModels>;
export type BaseHouseDetails = InferSelectModel<typeof houseDetails>;
export type BaseModelMedia = InferSelectModel<typeof modelMedia>;
export type BaseMedia = InferSelectModel<typeof media>;
export type BaseHouseCategory = InferSelectModel<typeof houseCategories>;
export type BaseCategoryMedia = InferSelectModel<typeof categoryMedia>;

export type HouseModel = BaseHouseModel & {
  // details is nullable — not every model has one yet
  details: BaseHouseDetails | null;
  // the parent category (with its media)
  category: HouseCategory | null;
  // media is the pivot array; each pivot row carries the actual media record nested inside it
  media: (Pick<BaseModelMedia, "isHero" | "isThumbnail" | "sortOrder"> & {
    media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
  })[];
};

export type HouseCategory = BaseHouseCategory & {
  media: (Pick<BaseCategoryMedia, "isThumbnail" | "isHero"> & {
    media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
  })[];
};
