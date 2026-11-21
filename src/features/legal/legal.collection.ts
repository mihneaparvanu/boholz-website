import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const legal = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/features/legal/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});
