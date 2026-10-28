import type { HouseModelRecord } from "@/domain/house-models/houseModels.types";

export type HeroSlide = Pick<HouseModelRecord, "slug" | "title"> & {
  heroImgURL: string | null;
};
