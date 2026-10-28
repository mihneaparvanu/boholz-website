import type { HouseModel } from "@/domain/house-models/houseModels.types";

export type HeroSlide = Pick<HouseModel, "slug" | "title"> & {
  heroImgURL: string | null;
};
