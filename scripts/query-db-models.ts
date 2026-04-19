import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { houseModels, houseCategories } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

const categories = await db.select().from(houseCategories);
const models = await db
  .select({
    id: houseModels.id,
    title: houseModels.title,
    modelCode: houseModels.modelCode,
    roofPitch: houseModels.roofPitch,
    livingArea: houseModels.livingArea,
    totalArea: houseModels.totalArea,
    categoryName: houseCategories.name,
  })
  .from(houseModels)
  .leftJoin(houseCategories, eq(houseModels.categoryId, houseCategories.id))
  .orderBy(houseCategories.name, houseModels.modelCode);

console.log("\n=== HOUSE CATEGORIES ===");
for (const cat of categories) {
  console.log(`  [${cat.slug}] ${cat.name}`);
}

console.log(`\n=== HOUSE MODELS (${models.length} total) ===`);
let lastCat = "";
for (const m of models) {
  if (m.categoryName !== lastCat) {
    console.log(`\n--- ${m.categoryName ?? "No category"} ---`);
    lastCat = m.categoryName ?? "";
  }
  console.log(
    `  ${m.modelCode.padEnd(35)} | totalArea: ${String(m.totalArea ?? "").padStart(7)} | livingArea: ${String(m.livingArea ?? "").padStart(7)} | roofPitch: ${m.roofPitch ?? "?"}`
  );
}

await sql.end();
