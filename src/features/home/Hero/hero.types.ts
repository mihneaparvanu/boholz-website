import type { HouseModel } from "@/db/models";

export type HeroSlide = Pick<HouseModel, "id" | "slug" | "title"> & {
  heroImgURL: string | null;
};
