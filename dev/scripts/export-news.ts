import { type NewsPost } from "@/domain/news/news.types";
import { getNews } from "@/db/loaders";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const articles = await getNews();

const exported: NewsPost[] = articles.map((a) => ({
  slug: a.slug,
  title: a.title,
  content: a.content,
  excerpt: a.excerpt,
  publishedAt: a.publishedAt?.toISOString() ?? null,
  media: a.media.map((m) => ({
    path: m.media.path,
    isAi: m.media.isAi,
    alt: m.media.alt,
    height: m.media.height,
    width: m.media.width,
    isHero: m.isHero,
  })),
}));

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "../..", "src/domain/news/news.ts");

const cfg = await prettier.resolveConfig(out);

const file = `import type { NewsPost } from "./news.types";
export const news: NewsPost[] = ${JSON.stringify(exported, null, 2)};`;

const pretty = await prettier.format(file, { ...cfg, filepath: out });

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, pretty, "utf-8");

console.log(`wrote ${exported.length} news in ${out}`);

// The database connection stays open on its own, so the script would never
// finish without this.
process.exit(0);
