import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { houseModels, modelMedia, media } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

const images = await db
  .select({
    modelCode: houseModels.modelCode,
    title: houseModels.title,
    mediaId: modelMedia.mediaId,
    path: media.path,
    isHero: modelMedia.isHero,
    isThumbnail: modelMedia.isThumbnail,
    sortOrder: modelMedia.sortOrder,
  })
  .from(modelMedia)
  .innerJoin(media, eq(modelMedia.mediaId, media.id))
  .innerJoin(houseModels, eq(modelMedia.modelId, houseModels.id))
  .orderBy(houseModels.modelCode, modelMedia.sortOrder);

// Group by model
const byModel: Record<string, typeof images> = {};
for (const img of images) {
  if (!byModel[img.modelCode]) byModel[img.modelCode] = [];
  byModel[img.modelCode].push(img);
}

console.log("Models with images but no hero:");
for (const [code, imgs] of Object.entries(byModel)) {
  const hasHero = imgs.some((i) => i.isHero);
  if (!hasHero) {
    console.log(`\n  ${code}:`);
    imgs.forEach((i) => console.log(`    [sort=${i.sortOrder}] hero=${i.isHero} thumb=${i.isThumbnail}  ${i.path}`));
  }
}

await sql.end();
