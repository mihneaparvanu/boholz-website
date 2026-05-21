// Seed house_details with the values from dev/planning/houses-table.md.
//
// Strategy:
//  - For each model the user identified (32 existing slugs + 1 new generationenhaus-22-280),
//    UPSERT a house_details row with the structured values.
//  - For 3 models with roof variants (stadtvilla-18-140, stadtvilla-22-173, bungalow-22-149)
//    we currently store the FIRST (Walmdach) variant only. Roof variants need a separate
//    follow-up decision (JSON column vs pivot table); flagged with `// TODO: roof variant`.
//  - The new generationenhaus-22-280 model also needs an INSERT into house_models first.

import { db } from "../../src/db/db";
import { sql } from "drizzle-orm";

const DRY_RUN = process.env.DRY === "1";

type Row = {
  slug: string;
  floorCount: number;          // 1 | 1.5 | 2
  roofType: string;            // overwrites house_details.roof_type
  roofPitch: number | null;    // overwrites house_models.roof_pitch
  kniestock: number | null;    // cm, null = "nein" or unknown
  netFloorAreaDin: number;     // m²
  totalLivingAreaWoflv: number | null;  // m² — null only for genhaus-22-280
  extensionDescription: string | null;  // "Erker 38°", "Garage", null
  allowsGrannyFlat: boolean;
  // Convenience: if the extension is a garage, mirror to has_garage for back-compat.
  hasGarage: boolean;
  notes?: string;              // free-form note (e.g. roof-variant TODO)
};

// 32 existing models + 1 new (generationenhaus-22-280)
const rows: Row[] = [
  // ===== Einfamilienhaus =====
  { slug: "einfamilienhaus-38-115-125", floorCount: 1.5, roofType: "Satteldach", roofPitch: 38, kniestock: 125, netFloorAreaDin: 114.94, totalLivingAreaWoflv: 104.94, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-38-128-125", floorCount: 1.5, roofType: "Satteldach", roofPitch: 38, kniestock: 125, netFloorAreaDin: 127.57, totalLivingAreaWoflv: 116.56, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-45-139-75",  floorCount: 1.5, roofType: "Satteldach", roofPitch: 45, kniestock: 75,  netFloorAreaDin: 138.57, totalLivingAreaWoflv: 126.01, extensionDescription: "Erker 38°", allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-38-138-125", floorCount: 1.5, roofType: "Satteldach", roofPitch: 38, kniestock: 125, netFloorAreaDin: 137.90, totalLivingAreaWoflv: 126.73, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-22-141-190", floorCount: 1.5, roofType: "Satteldach", roofPitch: 22, kniestock: 190, netFloorAreaDin: 141.56, totalLivingAreaWoflv: 132.49, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-35-146-150", floorCount: 1.5, roofType: "Satteldach", roofPitch: 35, kniestock: 150, netFloorAreaDin: 145.86, totalLivingAreaWoflv: 137.47, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-22-162-190", floorCount: 1.5, roofType: "Satteldach", roofPitch: 22, kniestock: 190, netFloorAreaDin: 161.95, totalLivingAreaWoflv: 152.89, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-25-168-190", floorCount: 1.5, roofType: "Satteldach", roofPitch: 25, kniestock: 190, netFloorAreaDin: 168.15, totalLivingAreaWoflv: 161.05, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-35-181-150", floorCount: 1.5, roofType: "Satteldach", roofPitch: 35, kniestock: 150, netFloorAreaDin: 181.22, totalLivingAreaWoflv: 171.54, extensionDescription: null, allowsGrannyFlat: true,  hasGarage: false },
  { slug: "einfamilienhaus-28-182-170", floorCount: 1.5, roofType: "Satteldach", roofPitch: 28, kniestock: 170, netFloorAreaDin: 182.17, totalLivingAreaWoflv: 171.06, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "einfamilienhaus-22-173-190", floorCount: 1.5, roofType: "Satteldach", roofPitch: 22, kniestock: 190, netFloorAreaDin: 172.58, totalLivingAreaWoflv: 162.45, extensionDescription: null, allowsGrannyFlat: true,  hasGarage: false },
  { slug: "einfamilienhaus-28-194-170", floorCount: 1.5, roofType: "Satteldach", roofPitch: 28, kniestock: 170, netFloorAreaDin: 194.07, totalLivingAreaWoflv: 177.26, extensionDescription: null, allowsGrannyFlat: true,  hasGarage: false },

  // ===== Stadtvilla =====
  { slug: "stadtvilla-18-140", floorCount: 2, roofType: "Walmdach", roofPitch: 18, kniestock: null, netFloorAreaDin: 139.90, totalLivingAreaWoflv: 136.25, extensionDescription: null,     allowsGrannyFlat: false, hasGarage: false, notes: "Also offered as Flachdach Attika — needs roof-variant model" },
  { slug: "stadtvilla-22-157", floorCount: 2, roofType: "Walmdach", roofPitch: 22, kniestock: null, netFloorAreaDin: 156.91, totalLivingAreaWoflv: 154.96, extensionDescription: "Garage",  allowsGrannyFlat: false, hasGarage: true },
  { slug: "stadtvilla-22-166", floorCount: 2, roofType: "Walmdach", roofPitch: 22, kniestock: null, netFloorAreaDin: 166.36, totalLivingAreaWoflv: 164.54, extensionDescription: "Garage",  allowsGrannyFlat: false, hasGarage: true },
  { slug: "stadtvilla-22-173", floorCount: 2, roofType: "Walmdach", roofPitch: 22, kniestock: null, netFloorAreaDin: 172.58, totalLivingAreaWoflv: 170.85, extensionDescription: null,     allowsGrannyFlat: true,  hasGarage: false, notes: "Also offered as Flachdach 22° — needs roof-variant model" },

  // ===== Generationenhaus =====
  { slug: "generationenhaus-28-264-160", floorCount: 1.5, roofType: "Satteldach", roofPitch: 28, kniestock: 160, netFloorAreaDin: 263.89, totalLivingAreaWoflv: 244.71, extensionDescription: null, allowsGrannyFlat: true,  hasGarage: false },
  // NEW: generationenhaus-22-280 — INSERTed before seed runs (see runInsertNewModel below)
  { slug: "generationenhaus-22-280",     floorCount: 2,   roofType: "Walmdach",   roofPitch: 22, kniestock: null, netFloorAreaDin: 268.90, totalLivingAreaWoflv: null,   extensionDescription: null, allowsGrannyFlat: false, hasGarage: false, notes: "WoFlV value missing — client to supply" },

  // ===== Pultdachhaus =====
  { slug: "pultdachhaus-21-349-225", floorCount: 1.5, roofType: "Pultdach", roofPitch: 21, kniestock: 225, netFloorAreaDin: 348.66, totalLivingAreaWoflv: 280.60, extensionDescription: null, allowsGrannyFlat: true, hasGarage: false },

  // ===== Doppelhaus =====
  { slug: "doppelhaus-38-238-125", floorCount: 1.5, roofType: "Satteldach", roofPitch: 38, kniestock: 125, netFloorAreaDin: 237.78, totalLivingAreaWoflv: 226.87, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "doppelhaus-28-299",     floorCount: 2,   roofType: "Walmdach",   roofPitch: 28, kniestock: null, netFloorAreaDin: 299.04, totalLivingAreaWoflv: 295.17, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },

  // ===== Kubus =====
  { slug: "kubus-0-166", floorCount: 2, roofType: "Flachdach, Attika", roofPitch: null, kniestock: null, netFloorAreaDin: 166.36, totalLivingAreaWoflv: 164.54, extensionDescription: "Garage", allowsGrannyFlat: false, hasGarage: true },
  { slug: "kubus-0-190", floorCount: 2, roofType: "Flachdach, Attika", roofPitch: null, kniestock: null, netFloorAreaDin: 189.68, totalLivingAreaWoflv: 176.30, extensionDescription: null,     allowsGrannyFlat: false, hasGarage: false },
  { slug: "kubus-0-278", floorCount: 2, roofType: "Flachdach, Attika", roofPitch: null, kniestock: null, netFloorAreaDin: 278.01, totalLivingAreaWoflv: 245.22, extensionDescription: null,     allowsGrannyFlat: false, hasGarage: false },

  // ===== Bungalow =====
  { slug: "bungalow-22-117", floorCount: 1, roofType: "Walmdach", roofPitch: 22, kniestock: null, netFloorAreaDin: 116.58, totalLivingAreaWoflv: 111.74, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "bungalow-22-134", floorCount: 1, roofType: "Walmdach", roofPitch: 22, kniestock: null, netFloorAreaDin: 134.18, totalLivingAreaWoflv: 134.18, extensionDescription: null, allowsGrannyFlat: true,  hasGarage: false },
  { slug: "bungalow-22-149", floorCount: 1, roofType: "Walmdach", roofPitch: 22, kniestock: null, netFloorAreaDin: 149.18, totalLivingAreaWoflv: 134.54, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false, notes: "Also offered as Flachdach Attika — needs roof-variant model" },

  // ===== Bestseller =====
  // Kniestock is empty in the table for all Bestseller rows — left null.
  // The base-cat models that these "alias" (einfamilienhaus-32-150-170 etc.) are
  // the actual DB rows; the title is "Bestseller Family 150" / etc.
  { slug: "bestseller-family-150",    floorCount: 1.5, roofType: "Satteldach", roofPitch: 32, kniestock: null, netFloorAreaDin: 150.15, totalLivingAreaWoflv: 139.52, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "bestseller-komfort-116",   floorCount: 1,   roofType: "Walmdach",   roofPitch: 22, kniestock: null, netFloorAreaDin: 116.20, totalLivingAreaWoflv: 106.77, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "bestseller-weitblick-140", floorCount: 2,   roofType: "Walmdach",   roofPitch: 22, kniestock: null, netFloorAreaDin: 139.61, totalLivingAreaWoflv: 137.95, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "bestseller-plus-223",      floorCount: 1.5, roofType: "Satteldach", roofPitch: 30, kniestock: null, netFloorAreaDin: 223.39, totalLivingAreaWoflv: 209.90, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "bestseller-twin-138",      floorCount: 1.5, roofType: "Satteldach", roofPitch: 25, kniestock: null, netFloorAreaDin: 137.50, totalLivingAreaWoflv: 134.76, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
  { slug: "bestseller-freiraum-167",  floorCount: 1.5, roofType: "Satteldach", roofPitch: 30, kniestock: null, netFloorAreaDin: 167.48, totalLivingAreaWoflv: 156.96, extensionDescription: null, allowsGrannyFlat: false, hasGarage: false },
];

if (DRY_RUN) {
  console.log(`Plan: ${rows.length} models to seed`);
  const newModels = rows.filter((r) => r.slug === "generationenhaus-22-280");
  console.log(`  ${newModels.length} new house_models INSERT (generationenhaus-22-280)`);
  console.log(`  ${rows.length} house_details upserts`);
  console.log();
  console.log("Roof-variant notes (3 models):");
  for (const r of rows.filter((r) => r.notes?.includes("roof-variant"))) {
    console.log(`  ${r.slug.padEnd(40)} ${r.notes}`);
  }
  console.log();
  console.log("Missing-data note:");
  for (const r of rows.filter((r) => r.totalLivingAreaWoflv === null)) {
    console.log(`  ${r.slug.padEnd(40)} WoFlV = null (${r.notes ?? ""})`);
  }
  process.exit(0);
}

async function run() {
  // === Step 1: insert generationenhaus-22-280 as a new house_models row ===
  const newSlug = "generationenhaus-22-280";
  const existing = await db.execute(sql`SELECT id FROM boholz.house_models WHERE slug = ${newSlug}`);
  let newModelId: string;
  if (existing.length > 0) {
    console.log(`  ${newSlug} already exists (id=${existing[0].id}); skipping INSERT`);
    newModelId = existing[0].id as string;
  } else {
    const cat = await db.execute(sql`SELECT id FROM boholz.house_categories WHERE slug = 'generationenhaus'`);
    if (cat.length === 0) {
      console.error("No generationenhaus category");
      process.exit(1);
    }
    const inserted = await db.execute(sql`
      INSERT INTO boholz.house_models (category_id, title, slug, model_code, roof_pitch, living_area, total_area, is_featured)
      VALUES (${cat[0].id}, 'Generationenhaus 22-280', ${newSlug}, '22-280', 22, 280, 280, false)
      RETURNING id
    `);
    newModelId = inserted[0].id as string;
    console.log(`  inserted new model ${newSlug} (id=${newModelId})`);
  }

  // === Step 2: upsert house_details for every row ===
  await db.transaction(async (tx) => {
    for (const r of rows) {
      const m = await tx.execute(sql`SELECT id FROM boholz.house_models WHERE slug = ${r.slug}`);
      if (m.length === 0) {
        console.error(`  MISSING model: ${r.slug}`);
        continue;
      }
      const modelId = m[0].id as string;

      // Update house_models.roof_pitch (the source of truth for pitch)
      await tx.execute(sql`
        UPDATE boholz.house_models
        SET roof_pitch = ${r.roofPitch}
        WHERE id = ${modelId}
      `);

      // Upsert house_details
      await tx.execute(sql`
        INSERT INTO boholz.house_details (
          id, floor_count, level_count, roof_type, kniestock,
          net_floor_area_din, total_living_area_woflv,
          extension_description, allows_granny_flat, has_garage
        )
        VALUES (
          ${modelId}, ${r.floorCount}, ${Math.floor(r.floorCount)}, ${r.roofType}, ${r.kniestock},
          ${r.netFloorAreaDin}, ${r.totalLivingAreaWoflv},
          ${r.extensionDescription}, ${r.allowsGrannyFlat}, ${r.hasGarage}
        )
        ON CONFLICT (id) DO UPDATE SET
          floor_count = EXCLUDED.floor_count,
          level_count = EXCLUDED.level_count,
          roof_type = EXCLUDED.roof_type,
          kniestock = EXCLUDED.kniestock,
          net_floor_area_din = EXCLUDED.net_floor_area_din,
          total_living_area_woflv = EXCLUDED.total_living_area_woflv,
          extension_description = EXCLUDED.extension_description,
          allows_granny_flat = EXCLUDED.allows_granny_flat,
          has_garage = EXCLUDED.has_garage
      `);
    }
  });
  console.log(`  upserted ${rows.length} house_details rows`);
  console.log("Committed.");
}

await run();
