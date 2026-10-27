import type { HouseCategory } from "@/db/models";
import type { Image } from "../media/image.types";

export type CategoryImage = Image &
  Omit<HouseCategory["media"][number], "media">;
export type ModelCategory = Omit<HouseCategory, "id" | "media"> & {
  media: CategoryImage[];
};
