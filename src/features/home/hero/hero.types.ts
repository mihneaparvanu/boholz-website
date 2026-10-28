import type { HouseModelRecord } from "@/domain/house-models/house-models.types";

export type HeroSlide = Pick<HouseModelRecord, "slug" | "title"> & {
  heroImgURL: string | null;
};
