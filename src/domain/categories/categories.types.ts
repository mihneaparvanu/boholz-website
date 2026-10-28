import { type AttachedImage } from "../media/image.types";

export type Category =
  | "bestseller"
  | "oneFamilyHouse"
  | "cityVilla"
  | "bungalow"
  | "doubleHouse"
  | "generationHouse"
  | "twoFamilyHouse"
  | "multiFamilyHouse"
  | "cube";

export type ModelCategory = {
  category: Category;
  name: string;
  slug: string;
  description: string | null;
  media: AttachedImage[];
};
