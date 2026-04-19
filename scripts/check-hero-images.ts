import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { houseModels, modelMedia, media } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

// Get all models
const models = await db
  .select({ id: houseModels.id, code: houseModels.modelCode, title: houseModels.title })
  .from(houseModels)
  .orderBy(houseModels.modelCode);

// Get all model_media records
const images = await db
  .select({
    modelId: modelMedia.modelId,
    path: media.path,
    isHero: modelMedia.isHero,
    isThumbnail: modelMedia.isThumbnail,
  })
  .from(modelMedia)
  .innerJoin(media, eq(modelMedia.mediaId, media.id));

// Group by modelId
const byModel: Record<string, typeof images> = {};
for (const img of images) {
  if (!byModel[img.modelId]) byModel[img.modelId] = [];
  byModel[img.modelId].push(img);
}

console.log(`\n=== Hero / Thumbnail image status for ${models.length} models ===\n`);

const missingHero: string[] = [];
const missingAll: string[] = [];

for (const m of models) {
  const imgs = byModel[m.id] ?? [];
  const hero = imgs.find((i) => i.isHero);
  const thumb = imgs.find((i) => i.isThumbnail);
  const total = imgs.length;

  if (total === 0) {
    console.log(`  ❌ NO IMAGES   ${m.code}  (${m.title})`);
    missingAll.push(m.code);
    missingHero.push(m.code);
  } else if (!hero) {
    console.log(`  ⚠️  NO HERO     ${m.code}  (${m.title})  — ${total} image(s), thumb=${!!thumb}`);
    missingHero.push(m.code);
  } else {
    console.log(`  ✅ OK           ${m.code}  hero=${hero.path}`);
  }
}

console.log(`\nSummary:`);
console.log(`  Total models: ${models.length}`);
console.log(`  Missing hero: ${missingHero.length}  → ${missingHero.join(", ") || "none"}`);
console.log(`  No images at all: ${missingAll.length}  → ${missingAll.join(", ") || "none"}`);

await sql.end();
