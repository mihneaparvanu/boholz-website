import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { notInArray } from "drizzle-orm";
import { houseModels, houseDetails, modelMedia, floorMedia } from "../src/db/schema.ts";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

// All model codes from the PDF catalog (28 models to KEEP)
const pdfModelCodes = [
  // Einfamilienhaus
  "38-115-125", "38-128-125", "38-138-125", "45-139-75", "22-141-190",
  "22-162-190", "25-168-190", "35-181-150", "28-182-170", "22-173-190",
  "35-146-150", "28-194-170",
  // Stadtvilla
  "18-140", "22-157", "22-166", "22-173",
  // Bungalow
  "22-117", "22-134", "22-149",
  // Kubus
  "0-166", "0-190", "0-278",
  // Generationenhaus
  "28-264-160",
  // Pultdachhaus
  "21-349-225",
  // Doppelhaus
  "38-238-125", "28-299",
];

async function main() {
  // 1. Fetch all models from DB
  const allModels = await db.select({
    id: houseModels.id,
    title: houseModels.title,
    modelCode: houseModels.modelCode,
  }).from(houseModels);

  console.log(`\nTotal models in DB: ${allModels.length}`);
  console.log(`Models in PDF catalog: ${pdfModelCodes.length}`);

  // 2. Find models NOT in the PDF
  const toDelete = allModels.filter(m => !pdfModelCodes.includes(m.modelCode));
  const toKeep = allModels.filter(m => pdfModelCodes.includes(m.modelCode));

  console.log(`\nModels to KEEP (${toKeep.length}):`);
  toKeep.forEach(m => console.log(`  ✓ ${m.modelCode} - ${m.title}`));

  console.log(`\nModels to DELETE (${toDelete.length}):`);
  toDelete.forEach(m => console.log(`  ✗ ${m.modelCode} - ${m.title}`));

  // 3. Check for PDF codes not found in DB
  const dbCodes = allModels.map(m => m.modelCode);
  const notInDb = pdfModelCodes.filter(code => !dbCodes.includes(code));
  if (notInDb.length > 0) {
    console.log(`\nPDF codes NOT found in DB: ${notInDb.join(", ")}`);
  }

  if (toDelete.length === 0) {
    console.log("\nNothing to delete. DB matches the PDF catalog.");
    await client.end();
    return;
  }

  // 4. Delete related rows first (FK constraints), then models
  const deleteIds = toDelete.map(m => m.id);

  console.log("\nDeleting related rows...");

  // Delete from pivot/detail tables first
  const floorDeleted = await db.delete(floorMedia).where(sql`${floorMedia.modelId} = ANY(${deleteIds})`).returning();
  console.log(`  Deleted ${floorDeleted.length} floor_media rows`);

  const modelMediaDeleted = await db.delete(modelMedia).where(sql`${modelMedia.modelId} = ANY(${deleteIds})`).returning();
  console.log(`  Deleted ${modelMediaDeleted.length} model_media rows`);

  const detailsDeleted = await db.delete(houseDetails).where(sql`${houseDetails.id} = ANY(${deleteIds})`).returning();
  console.log(`  Deleted ${detailsDeleted.length} house_details rows`);

  // Delete the models themselves
  const modelsDeleted = await db.delete(houseModels).where(sql`${houseModels.id} = ANY(${deleteIds})`).returning();
  console.log(`  Deleted ${modelsDeleted.length} house_models rows`);

  console.log("\nDone! Cleanup complete.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
