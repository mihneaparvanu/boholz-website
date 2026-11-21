import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const news = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/features/news/articles" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().nullable(),
    publishedAt: z.coerce.date().nullable(),
    hero: z.object({
      path: z.string(),
      alt: z.string().nullable(),
      width: z.number().nullable(),
      height: z.number().nullable(),
      isAi: z.boolean().default(false),
    }),
  }),
});
