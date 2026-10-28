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
  | "cube"
  | "shedRoofHouse";

export type ModelCategory = {
  name: string;
  slug: string;
  description: string | null;
  media: AttachedImage[];
};
