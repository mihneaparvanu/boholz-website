import type { InferSelectModel } from "drizzle-orm";
import { houseModels, houseDetails, modelMedia, media } from "../db/schema";

// Raw table row types — one per table
export type BaseHouseModel = InferSelectModel<typeof houseModels>;
export type BaseHouseDetails = InferSelectModel<typeof houseDetails>;
export type BaseModelMedia = InferSelectModel<typeof modelMedia>;
export type BaseMedia = InferSelectModel<typeof media>;

// The composed type that matches our db.query.houseModels.findMany({ with: { details, media } }) query.
// Think of this as the "shape of one API response row".
export type HouseModel = BaseHouseModel & {
  // details is nullable — not every model has one yet
  details: BaseHouseDetails | null;
  // media is the pivot array; each pivot row carries the actual media record nested inside it
  media: (Pick<BaseModelMedia, "isHero" | "isThumbnail" | "sortOrder"> & {
    media: Pick<BaseMedia, "path" | "alt" | "width" | "height">;
  })[];
};
