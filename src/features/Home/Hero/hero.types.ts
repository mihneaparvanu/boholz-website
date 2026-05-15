import type { HouseModel } from "@/types/models";

export type HeroSlide = Pick<HouseModel, "id" | "slug" | "title"> & {
  heroImgURL: string | null;
};
