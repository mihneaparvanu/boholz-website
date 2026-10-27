import type { NewsArticle } from "@/db/models";
import type { Image } from "../media/image.types";

export type NewsImage = Image & Omit<NewsArticle["media"][number], "media">;
export type NewsPost = Omit<
  NewsArticle,
  "id" | "createdAt" | "publishedAt" | "media"
> & {
  publishDate: string;
  media: NewsImage[];
};
