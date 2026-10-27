import { type NewsPost } from "@/domain/news/news.types";
import { getNews } from "@/db/loaders";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const articles = await getNews();

const exported: NewsPost[] = articles.map((a) => ({
  slug: a.slug,
  title: a.title,
  content: a.content,
  excerpt: a.excerpt,
  media: a.media.map((m) => ({
    path: m.media.path,
    alt: m.media.alt,
    height: m.media.height,
    width: m.media.width,
    isHero: m.isHero,
  })),
}));

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "../..", "src/domain/news/news.ts");

const file = `import type { NewsPost } from "./news.types";
export const categories: NewsPost[] = ${JSON.stringify(exported, null, 2)};`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, file, "utf-8");

console.log(`wrote ${exported.length} categories in ${out}`);
