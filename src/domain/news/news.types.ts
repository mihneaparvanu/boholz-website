import type { AttachedImage } from "../media/image.types";

export type NewsPost = {
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  publishedAt: string | null;
  media: AttachedImage[];
};
