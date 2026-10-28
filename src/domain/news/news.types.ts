import type { AttachedImage } from "../media/image.types";

export type NewsPost = {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  media: AttachedImage[];
};
