import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { media, modelMedia, houseModels } from "../src/db/schema.ts";
import { eq, and } from "drizzle-orm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "new-hero-images.json");

type HeroEntry = {
  modelCode: string;
  path: string;
  alt: string;
  width: number;
  height: number;
  isHero: boolean;
  isThumbnail: boolean;
};

const entries: HeroEntry[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

console.log(`Linking ${entries.length} hero images...`);

for (const entry of entries) {
  // Find model
  const models = await db
    .select({ id: houseModels.id })
    .from(houseModels)
    .where(eq(houseModels.modelCode, entry.modelCode));

  if (models.length === 0) {
    console.log(`  WARN: model not found: ${entry.modelCode}`);
    continue;
  }
  const modelId = models[0].id;

  // Check if media record already exists
  const existing = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.path, entry.path));

  let mediaId: string;
  if (existing.length > 0) {
    mediaId = existing[0].id;
    console.log(`  media exists: ${entry.path}`);
  } else {
    const [inserted] = await db
      .insert(media)
      .values({
        path: entry.path,
        alt: entry.alt,
        width: entry.width,
        height: entry.height,
      })
      .returning({ id: media.id });
    mediaId = inserted.id;
    console.log(`  media inserted: ${entry.path}`);
  }

  // Check if model_media already linked
  const linkedCheck = await db
    .select({ id: modelMedia.id })
    .from(modelMedia)
    .where(and(eq(modelMedia.modelId, modelId), eq(modelMedia.mediaId, mediaId)));

  if (linkedCheck.length > 0) {
    console.log(`  model_media already linked, skipping`);
    continue;
  }

  await db.insert(modelMedia).values({
    modelId,
    mediaId,
    isHero: entry.isHero,
    isThumbnail: entry.isThumbnail,
    sortOrder: 0,
  });
  console.log(`  model_media linked: ${entry.modelCode} isHero=${entry.isHero}`);
}

console.log("\nAll done.");
await sql.end();
