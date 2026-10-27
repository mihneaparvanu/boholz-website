import { type ModelCategory } from "@/domain/categories/categories.types";
import { getCategories } from "@/db/loaders";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const categories = await getCategories();

const exported: ModelCategory[] = categories.map((c) => ({
  name: c.name,
  slug: c.slug,
  description: c.description,
  media: c.media.map((m) => ({
    isThumbnail: m.isThumbnail,
    isHero: m.isHero,
    path: m.media.path,
    alt: m.media.alt,
    width: m.media.width,
    height: m.media.height,
  })),
}));

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "../..", "src/domain/categories/categories.ts");

const cfg = await prettier.resolveConfig(out);

const file = `import type { ModelCategory } from "./categories.types";
export const categories: ModelCategory[] = ${JSON.stringify(exported, null, 2)};`;

const pretty = await prettier.format(file, { ...cfg, filepath: out });

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, pretty, "utf-8");

console.log(`wrote ${exported.length} categories in ${out}`);
