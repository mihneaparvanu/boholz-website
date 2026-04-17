import type { InferSelectModel } from "drizzle-orm";
import { houseModels, houseImages } from "../db/schema";

export type BaseHouseModel = InferSelectModel<typeof houseModels>;
export type BaseHouseImage = InferSelectModel<typeof houseImages>;

// Composed type that matches our specific DB Query in index.astro
export type HouseModel = BaseHouseModel & {
  images: Pick<BaseHouseImage, "url" | "isHero">[];
};
