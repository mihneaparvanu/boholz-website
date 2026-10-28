import { type AttachedImage } from "../media/image.types";
export type ModelCategory = {
  name: string;
  slug: string;
  description: string | null;
  media: AttachedImage[];
};

export type CategorySlug = keyof typeof import("./categories").categories;
