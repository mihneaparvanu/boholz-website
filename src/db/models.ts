import type { InferSelectModel } from "drizzle-orm";
import {
  agents,
  categoryMedia,
  floorMedia,
  houseCategories,
  houseDetails,
  houseModels,
  leads,
  locationAgents,
  locationMedia,
  locations,
  media,
  modelMedia,
  news,
  newsMedia,
} from "@/db/schema";

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
export type Location = InferSelectModel<typeof locations>;
export type Agent = InferSelectModel<typeof agents>;
export type Lead = InferSelectModel<typeof leads>;
export type BaseLocationAgent = InferSelectModel<typeof locationAgents>;
export type BaseLocationMedia = InferSelectModel<typeof locationMedia>;

// Location with its joined agents (via location_agents pivot, ordered by
// sortOrder) and its gallery media (via location_media pivot).
export type LocationWithAgents = Location & {
  agents: (Pick<BaseLocationAgent, "isPrimary" | "sortOrder"> & {
    agent: Agent;
  })[];
  media: (Pick<
    BaseLocationMedia,
    "isHero" | "isThumbnail" | "classification" | "sortOrder"
  > & {
    media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
  })[];
};

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

export type HouseFloor = Pick<
  BaseFloorMedia,
  "title" | "sortOrder" | "variant"
> & {
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
