import { type HouseCategory } from "@/db/models";
export type CategoryMedia = HouseCategory["media"][number];
export type FlatMedia = Omit<CategoryMedia, "media"> & CategoryMedia["media"];

export type ExportedCategory = Omit<HouseCategory, "id" | "media"> & {
  media: FlatMedia[];
};
