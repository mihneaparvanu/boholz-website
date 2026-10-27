import { type ExportedCategory } from "@/domain/categories/categories.types";
import { getCategories } from "@/db/loaders";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const categories = await getCategories();

const exported: ExportedCategory[] = categories.map((c) => ({
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

const file = `import type { ExportedCategory } from "@/db/models";
export const categories = ${JSON.stringify(exported, null, 2)};`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, file, "utf-8");

console.log(`wrote ${exported.length} categories in ${out}`);
