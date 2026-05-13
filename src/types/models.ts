import type { InferSelectModel } from "drizzle-orm";
import {
  houseModels,
  houseDetails,
  modelMedia,
  houseCategories,
  categoryMedia,
  floorMedia,
  media,
  news,
  newsMedia,
  showhouses,
} from "../db/schema";

// Raw table row types — one per table
export type BaseHouseModel = InferSelectModel<typeof houseModels>;
export type BaseHouseDetails = InferSelectModel<typeof houseDetails>;
export type BaseModelMedia = InferSelectModel<typeof modelMedia>;
export type BaseMedia = InferSelectModel<typeof media>;
export type BaseHouseCategory = InferSelectModel<typeof houseCategories>;
export type BaseCategoryMedia = InferSelectModel<typeof categoryMedia>;
export type BaseFloorMedia = InferSelectModel<typeof floorMedia>;
export type BaseNews = InferSelectModel<typeof news>;
export type BaseNewsMedia = InferSelectModel<typeof newsMedia>;
export type Showhouse = InferSelectModel<typeof showhouses>;

export type HouseModel = BaseHouseModel & {
  // details is nullable — not every model has one yet
  details: BaseHouseDetails | null;
  // the parent category (with its media)
  category: HouseCategory | null;
  // media is the pivot array; each pivot row carries the actual media record nested inside it
  media: (Pick<BaseModelMedia, "isHero" | "isThumbnail" | "sortOrder"> & {
    media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
  })[];
  // floor plans linked via floor_media pivot
  floors: HouseFloor[];
};

export type HouseFloor = Pick<BaseFloorMedia, "title" | "sortOrder"> & {
  media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
};

export type HouseCategory = BaseHouseCategory & {
  media: (Pick<BaseCategoryMedia, "isThumbnail" | "isHero"> & {
    media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
  })[];
};

export type NewsArticle = BaseNews & {
  media: (Pick<BaseNewsMedia, "isHero" | "sortOrder"> & {
    media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
  })[];
};
