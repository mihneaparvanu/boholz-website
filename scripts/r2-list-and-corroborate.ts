/**
 * Lists all objects in R2 and cross-references with DB models.
 * Outputs a report of: matched, unmatched in R2, DB models with no images.
 */
import "dotenv/config";
import { execSync } from "child_process";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { houseModels, houseCategories } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

const R2_ENDPOINT = "https://294d3965b7100cc2d62ccf8cd24c588a.r2.cloudflarestorage.com";
const BUCKET = "boholz";

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

// 1. List R2
console.log("Listing R2 bucket...");
let rawOutput = "";
try {
  rawOutput = execSync(
    `aws s3 ls s3://${BUCKET} --recursive --endpoint-url ${R2_ENDPOINT}`,
    { encoding: "utf-8" }
  );
} catch (e) {
  console.error("AWS CLI failed:", e);
  process.exit(1);
}

const r2Keys = rawOutput
  .trim()
  .split("\n")
  .map((line) => line.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+\d+\s+(.*)/)?.[1])
  .filter(Boolean) as string[];

const imageKeys = r2Keys.filter((k) => /\.(jpg|jpeg|png|webp)$/i.test(k));

console.log(`\nTotal R2 files: ${r2Keys.length}`);
console.log(`Image files:    ${imageKeys.length}`);
console.log("\nAll R2 keys:");
r2Keys.forEach((k) => console.log(" ", k));

// 2. Load DB models
const models = await db
  .select({
    id: houseModels.id,
    slug: houseModels.slug,
    modelCode: houseModels.modelCode,
    categorySlug: houseCategories.slug,
  })
  .from(houseModels)
  .leftJoin(houseCategories, eq(houseModels.categoryId, houseCategories.id));

// 3. Cross-reference: find model slug in R2 path
console.log("\n=== R2 vs DB MODELS ===");
const matchedSlugs = new Set<string>();

for (const model of models) {
  const matchingImages = imageKeys.filter((k) =>
    k.includes(model.slug)
  );
  if (matchingImages.length > 0) {
    matchedSlugs.add(model.slug);
    console.log(`\n✅ ${model.modelCode} (slug: ${model.slug})`);
    matchingImages.forEach((k) => console.log(`   ${k}`));
  } else {
    console.log(`\n❌ NO IMAGES: ${model.modelCode} (slug: ${model.slug})`);
  }
}

// 4. R2 images with no matching DB model
const unmatchedKeys = imageKeys.filter((k) => {
  const parts = k.split("/");
  // Typically: images/models/<category>/<model-slug>/filename
  const modelSlugIndex = parts.indexOf("models") + 2;
  if (modelSlugIndex >= parts.length) return false;
  const modelSlug = parts[modelSlugIndex];
  return !models.some((m) => m.slug === modelSlug);
});

if (unmatchedKeys.length > 0) {
  console.log("\n=== R2 IMAGES WITH NO DB MATCH ===");
  unmatchedKeys.forEach((k) => console.log(" ", k));
}

await sql.end();
