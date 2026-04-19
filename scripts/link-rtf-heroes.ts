import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { media, modelMedia, houseModels } from "../src/db/schema.ts";
import { eq, and } from "drizzle-orm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entries = JSON.parse(readFileSync(resolve(__dirname, "rtf-hero-images.json"), "utf-8"));

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

console.log(`Linking ${entries.length} hero images...`);

for (const e of entries) {
  const [model] = await db.select({ id: houseModels.id }).from(houseModels).where(eq(houseModels.modelCode, e.modelCode));
  if (!model) { console.log("WARN no model:", e.modelCode); continue; }

  const existing = await db.select({ id: media.id }).from(media).where(eq(media.path, e.path));
  let mediaId = existing[0]?.id;
  if (!mediaId) {
    const [ins] = await db.insert(media).values({ path: e.path, alt: e.alt, width: e.width, height: e.height }).returning({ id: media.id });
    mediaId = ins.id;
    console.log("  media inserted:", e.modelCode);
  } else {
    console.log("  media exists:", e.modelCode);
  }

  const linked = await db.select({ id: modelMedia.id }).from(modelMedia)
    .where(and(eq(modelMedia.modelId, model.id), eq(modelMedia.mediaId, mediaId)));
  if (linked.length > 0) { console.log("  already linked:", e.modelCode); continue; }

  await db.insert(modelMedia).values({ modelId: model.id, mediaId, isHero: true, isThumbnail: true, sortOrder: 0 });
  console.log("  linked:", e.modelCode);
}

console.log("Done.");
await sql.end();
