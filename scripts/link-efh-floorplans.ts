import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { media, floorMedia, houseModels } from "../src/db/schema.ts";
import { eq, and } from "drizzle-orm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "efh-floorplans.json");

type Entry = {
  modelCode: string;
  path: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  sortOrder: number;
};

const entries: Entry[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

console.log(`Linking ${entries.length} floor plan images...`);

for (const entry of entries) {
  const models = await db
    .select({ id: houseModels.id })
    .from(houseModels)
    .where(eq(houseModels.modelCode, entry.modelCode));

  if (models.length === 0) {
    console.log(`  WARN: model not found: ${entry.modelCode}`);
    continue;
  }
  const modelId = models[0].id;

  // Upsert media
  const existing = await db.select({ id: media.id }).from(media).where(eq(media.path, entry.path));

  let mediaId: string;
  if (existing.length > 0) {
    mediaId = existing[0].id;
    console.log(`  media exists: ${entry.path}`);
  } else {
    const [inserted] = await db
      .insert(media)
      .values({ path: entry.path, alt: entry.alt, width: entry.width, height: entry.height })
      .returning({ id: media.id });
    mediaId = inserted.id;
    console.log(`  media inserted: ${entry.modelCode} / ${entry.title}`);
  }

  // Check floor_media link
  const linked = await db
    .select({ id: floorMedia.id })
    .from(floorMedia)
    .where(and(eq(floorMedia.modelId, modelId), eq(floorMedia.mediaId, mediaId)));

  if (linked.length > 0) {
    console.log(`  floor_media already linked, skipping`);
    continue;
  }

  await db.insert(floorMedia).values({
    modelId,
    mediaId,
    title: entry.title,
    sortOrder: entry.sortOrder,
  });
  console.log(`  floor_media linked: ${entry.modelCode} / ${entry.title}`);
}

console.log("\nAll done.");
await sql.end();
