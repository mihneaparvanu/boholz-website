import type { InferSelectModel } from "drizzle-orm";
import { houseModels, modelMedia, media } from "../db/schema";

export type BaseHouseModel = InferSelectModel<typeof houseModels>;
export type BaseModelMedia = InferSelectModel<typeof modelMedia>;
export type BaseMedia = InferSelectModel<typeof media>;

// Composed type that matches our specific DB Query in index.astro
export type HouseModel = BaseHouseModel & {
  media: (Pick<BaseModelMedia, "isHero"> & {
    media: Pick<BaseMedia, "path">
  })[];
};
