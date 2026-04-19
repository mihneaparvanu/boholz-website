/**
 * Reads scripts/new-floorplans.json (produced by upload-new-floorplans.py)
 * and for each entry:
 *   1. Inserts a media record (or skips if path already exists)
 *   2. Inserts a floor_media record linking it to the house model
 *
 * Also updates houseDetails with corrected bed/bath/garage/families counts
 * based on floor plan visual analysis.
 */

import "dotenv/config";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { media, floorMedia, houseModels, houseDetails } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", {
  prepare: false,
});
const db = drizzle(sql);

// ── 1. Link new floor plan images to their models ─────────────────────────
const jsonPath = resolve(__dirname, "new-floorplans.json");
const entries: Array<{
  category: string;
  modelCode: string;
  level: string;
  title: string;
  path: string;
  width: number;
  height: number;
  sortOrder: number;
}> = JSON.parse(readFileSync(jsonPath, "utf-8"));

console.log(`Linking ${entries.length} new floor plan images...`);

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

  // Upsert media record
  const existing = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.path, entry.path));

  let mediaId: string;
  if (existing.length > 0) {
    mediaId = existing[0].id;
    console.log(`  media exists (${entry.path.split("/").pop()})`);
  } else {
    const [inserted] = await db
      .insert(media)
      .values({
        path: entry.path,
        alt: `${entry.modelCode} – ${entry.title}`,
        width: entry.width,
        height: entry.height,
      })
      .returning({ id: media.id });
    mediaId = inserted.id;
    console.log(`  media inserted: ${entry.path.split("/").pop()}`);
  }

  // Insert floor_media (skip if already linked)
  const existingLink = await db
    .select({ id: floorMedia.id })
    .from(floorMedia)
    .where(eq(floorMedia.mediaId, mediaId));

  if (existingLink.length > 0) {
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

// ── 2. Correct houseDetails for the newly-confirmed models ────────────────
console.log("\nUpdating houseDetails with confirmed values...");

type DetailPatch = {
  modelCode: string;
  bedroomCount: number;
  bathroomCount: number;
  familiesCount: number;
  hasGarage: boolean;
};

const patches: DetailPatch[] = [
  // 25-168-190: EG=Büro+WC/Du, OG=Schlafen+Kind1+Kind2+Bad
  { modelCode: "25-168-190",  bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  // 22-173-190 (ELW): EG=WE2 studio+WC/Du, OG=Schlafen+Ankleide+Kind1+Kind2+Büro/Gast+Bad
  { modelCode: "22-173-190",  bedroomCount: 4, bathroomCount: 2, familiesCount: 2, hasGarage: false },
  // 28-194-170 (ELW): EG=Arbeiten/Gast+WC/Du, OG=Schlafen+Ankleide+Kind1+Kind2+Bad → ELW confirmed
  { modelCode: "28-194-170",  bedroomCount: 4, bathroomCount: 2, familiesCount: 2, hasGarage: false },
  // Bungalow 22-134 (ELW): EG=Schlafen+Gast+Bad+WC → 1 level, ELW option
  { modelCode: "22-134",      bedroomCount: 2, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  // Kubus 0-190: EG=Gast+WC+Garage(solid), OG=Schlafen/Ankleide+Kind1+Kind2+Bad+Arbeiten
  { modelCode: "0-190",       bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: true  },
  // Stadtvilla 22-166: EG=Gast+WC+Garage(solid), OG=Schlafen/Ankleide+Arbeiten+Kind1+Kind2+Bad
  { modelCode: "22-166",      bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: true  },
  // Stadtvilla 22-173 (ELW): EG=WE2 studio, OG=Schlafen+Ankleide+Kind1+Kind2+Büro/Gast+Bad
  { modelCode: "22-173",      bedroomCount: 4, bathroomCount: 2, familiesCount: 2, hasGarage: false },
];

for (const p of patches) {
  const models = await db
    .select({ id: houseModels.id })
    .from(houseModels)
    .where(eq(houseModels.modelCode, p.modelCode));

  if (models.length === 0) {
    console.log(`  WARN: model not found: ${p.modelCode}`);
    continue;
  }

  await db
    .update(houseDetails)
    .set({
      bedroomCount: p.bedroomCount,
      bathroomCount: p.bathroomCount,
      familiesCount: p.familiesCount,
      hasGarage: p.hasGarage,
    })
    .where(eq(houseDetails.id, models[0].id));

  console.log(`  ${p.modelCode}: beds=${p.bedroomCount}, baths=${p.bathroomCount}, families=${p.familiesCount}, garage=${p.hasGarage}`);
}

await sql.end();
console.log("\nAll done.");
