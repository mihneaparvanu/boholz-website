import { HouseCategory } from "./../../src/db/models";
import { HouseCategory } from "@/src/db/models";
import { type HouseCategory } from "@/db/models";
import { getCategories } from "@/db/loaders";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const categories = await getCategories();
const exported = categories.map(({ id, ...c }) => c) satisfies Omit<
  HouseCategory,
  "id"
>[];

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "src/domain/categories/categories.ts");

const file = `import type { HouseCategory } from @/db/models";
export const categories = ${JSON.stringify(exported, null, 2)} satsifies Omit<HouseCategory, "id">[];`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, file, "utf-8");

console.log(`wrote ${exported.length} categories in ${out}`);
