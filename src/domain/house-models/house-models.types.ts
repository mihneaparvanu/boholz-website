import type { CategorySlug } from "@/db/loaders";
import type { HouseModel } from "@/db/models";

import type { Image } from "../media/image.types";

export type HouseModelMedia = Omit<
  HouseModel["media"][number],
  "media" | "sortOrder"
> &
  Image;

export type HouseModelDetails = Omit<NonNullable<HouseModel["details"]>, "id">;

export type HouseModelFloor = Omit<
  HouseModel["floors"][number],
  "media" | "sortOrder"
> &
  Image;

export type HouseModelRecord = Omit<
  HouseModel,
  | "id"
  | "categoryId"
  | "isHidden"
  | "totalArea"
  | "createdAt"
  | "category"
  | "details"
  | "media"
  | "floors"
> & {
  categorySlug: CategorySlug;
  details: HouseModelDetails | null;
  media: HouseModelMedia[];
  floors: HouseModelFloor[];
};
