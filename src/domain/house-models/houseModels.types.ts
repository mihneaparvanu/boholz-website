import type { HouseModel } from "@/db/models";
import type { Image } from "../media/image.types";
import type { CategorySlug } from "@/db/loaders";

export type HouseModelRecord = Omit<
  HouseModel,
  | "id"
  | "categoryId"
  | "isHidden"
  | "media"
  | "details"
  | "createdAt"
  | "category"
  | "floors"
> & {
  categorySlug: CategorySlug;
  details: HouseModelDetails[] | null;
  media: HouseModelMedia[];
  floors: HouseModelFloor[];
};

export type HouseModelMedia = Omit<
  HouseModel["media"][number],
  "media" | "sortOrder"
> &
  Image & {
    isAi: boolean;
  };

export type HouseModelDetails = Omit<NonNullable<HouseModel["details"]>, "id">;

export type HouseModelFloor = Omit<
  HouseModel["floors"][number],
  "media" | "sortOrder"
> &
  Image;
