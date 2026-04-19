/**
 * Comprehensive DB update script:
 * 1. Fixes totalArea / livingArea values (were storing kniestock cm instead of DIN m²)
 * 2. Fixes wrong model codes (28-244-160 → 28-264-160, 21-369-225 → 21-349-225)
 * 3. Fills missing totalArea on Stadtvilla / Kubus / Bungalow
 * 4. Inserts 8 missing models
 * 5. Upserts houseDetails (levelCount, familiesCount, hasGarage) for all models
 *
 * levelCount inferred from R2 floor plan image filenames.
 * familiesCount set based on floor plan analysis (separate WE units).
 * bedroomCount / bathroomCount inferred by visual floor plan analysis.
 * hasGarage set based on garage presence in floor plans.
 */

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { houseModels, houseCategories, houseDetails } from "../src/db/schema.ts";
import { eq, and } from "drizzle-orm";

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", {
  prepare: false,
});
const db = drizzle(sql);

// ── Fetch category IDs ─────────────────────────────────────────────────────
const cats = await db.select().from(houseCategories);
const catId = (slug: string) => {
  const c = cats.find((c) => c.slug === slug);
  if (!c) throw new Error(`Category not found: ${slug}`);
  return c.id;
};

// ── 1. Fix wrong model codes ───────────────────────────────────────────────
console.log("Fixing model codes...");

await db
  .update(houseModels)
  .set({ modelCode: "28-264-160" })
  .where(eq(houseModels.modelCode, "28-244-160"));
console.log("  28-244-160 → 28-264-160");

await db
  .update(houseModels)
  .set({ modelCode: "21-349-225" })
  .where(eq(houseModels.modelCode, "21-369-225"));
console.log("  21-369-225 → 21-349-225");

// ── 2. Fix totalArea / livingArea for existing models ─────────────────────
console.log("\nFixing totalArea / livingArea...");

type ModelFix = {
  modelCode: string;
  totalArea: string;
  livingArea: string;
  roofPitch?: number;
};

const fixes: ModelFix[] = [
  // Einfamilienhaus — totalArea was storing kniestock (125/150/190), not DIN m²
  { modelCode: "38-115-125", totalArea: "114.94", livingArea: "104.94" },
  { modelCode: "38-128-125", totalArea: "127.57", livingArea: "116.56" },
  { modelCode: "38-138-125", totalArea: "137.90", livingArea: "126.73" },
  { modelCode: "22-162-190", totalArea: "161.95", livingArea: "152.89" },
  { modelCode: "25-168-190", totalArea: "168.15", livingArea: "161.05" },
  { modelCode: "35-181-150", totalArea: "181.22", livingArea: "171.54" },
  // Generationenhaus
  { modelCode: "28-264-160", totalArea: "263.89", livingArea: "244.71" },
  // Pultdachhaus
  { modelCode: "21-349-225", totalArea: "348.66", livingArea: "280.60" },
  // Doppelhaus — livingArea / totalArea were swapped
  { modelCode: "38-238-125", totalArea: "237.78", livingArea: "226.87" },
  // Stadtvilla — totalArea was null
  { modelCode: "18-140", totalArea: "139.90", livingArea: "136.25" },
  { modelCode: "22-157", totalArea: "156.91", livingArea: "154.96" },
  { modelCode: "22-166", totalArea: "166.36", livingArea: "164.54" },
  // Kubus — totalArea was null, livingArea was using DIN value
  { modelCode: "0-166", totalArea: "166.36", livingArea: "164.54" },
  { modelCode: "0-190", totalArea: "189.68", livingArea: "176.30" },
  { modelCode: "0-278", totalArea: "278.01", livingArea: "245.22" },
  // Bungalow — totalArea null, 22-134 livingArea was wrong
  { modelCode: "22-117", totalArea: "116.58", livingArea: "111.74" },
  { modelCode: "22-134", totalArea: "134.18", livingArea: "134.18" },
  { modelCode: "22-149", totalArea: "149.18", livingArea: "134.54" },
];

for (const fix of fixes) {
  await db
    .update(houseModels)
    .set({ totalArea: fix.totalArea, livingArea: fix.livingArea })
    .where(eq(houseModels.modelCode, fix.modelCode));
  console.log(`  ${fix.modelCode}: totalArea=${fix.totalArea}, livingArea=${fix.livingArea}`);
}

// ── 3. Insert missing models ───────────────────────────────────────────────
console.log("\nInserting missing models...");

type NewModel = {
  categorySlug: string;
  title: string;
  slug: string;
  modelCode: string;
  roofPitch: number;
  totalArea: string;
  livingArea: string;
};

const missingModels: NewModel[] = [
  // Einfamilienhaus
  {
    categorySlug: "einfamilienhaus",
    title: "Einfamilienhaus 45-139-75",
    slug: "einfamilienhaus-45-139-75",
    modelCode: "45-139-75",
    roofPitch: 45,
    totalArea: "138.57",
    livingArea: "126.01",
  },
  {
    categorySlug: "einfamilienhaus",
    title: "Einfamilienhaus 22-141-190",
    slug: "einfamilienhaus-22-141-190",
    modelCode: "22-141-190",
    roofPitch: 22,
    totalArea: "141.56",
    livingArea: "132.49",
  },
  {
    categorySlug: "einfamilienhaus",
    title: "Einfamilienhaus 35-146-150",
    slug: "einfamilienhaus-35-146-150",
    modelCode: "35-146-150",
    roofPitch: 35,
    totalArea: "145.86",
    livingArea: "137.47",
  },
  {
    categorySlug: "einfamilienhaus",
    title: "Einfamilienhaus 28-182-170",
    slug: "einfamilienhaus-28-182-170",
    modelCode: "28-182-170",
    roofPitch: 28,
    totalArea: "182.17",
    livingArea: "171.06",
  },
  {
    categorySlug: "einfamilienhaus",
    title: "Einfamilienhaus 22-173-190",
    slug: "einfamilienhaus-22-173-190",
    modelCode: "22-173-190",
    roofPitch: 22,
    totalArea: "172.58",
    livingArea: "162.45",
  },
  {
    categorySlug: "einfamilienhaus",
    title: "Einfamilienhaus 28-194-170",
    slug: "einfamilienhaus-28-194-170",
    modelCode: "28-194-170",
    roofPitch: 28,
    totalArea: "194.07",
    livingArea: "177.26",
  },
  // Stadtvilla
  {
    categorySlug: "stadtvilla",
    title: "Stadtvilla 22-173",
    slug: "stadtvilla-22-173",
    modelCode: "22-173",
    roofPitch: 22,
    totalArea: "172.58",
    livingArea: "170.85",
  },
  // Doppelhaus
  {
    categorySlug: "doppelhaus",
    title: "Doppelhaus 28-299",
    slug: "doppelhaus-28-299",
    modelCode: "28-299",
    roofPitch: 28,
    totalArea: "299.04",
    livingArea: "295.17",
  },
];

const insertedIds: Record<string, string> = {};

for (const m of missingModels) {
  // Check if already exists
  const existing = await db
    .select({ id: houseModels.id })
    .from(houseModels)
    .where(eq(houseModels.modelCode, m.modelCode));

  if (existing.length > 0) {
    console.log(`  SKIP (exists): ${m.modelCode}`);
    insertedIds[m.modelCode] = existing[0].id;
    continue;
  }

  const [inserted] = await db
    .insert(houseModels)
    .values({
      categoryId: catId(m.categorySlug),
      title: m.title,
      slug: m.slug,
      modelCode: m.modelCode,
      roofPitch: m.roofPitch,
      totalArea: m.totalArea,
      livingArea: m.livingArea,
    })
    .returning({ id: houseModels.id });

  insertedIds[m.modelCode] = inserted.id;
  console.log(`  INSERTED: ${m.modelCode} (id=${inserted.id})`);
}

// ── 4. Upsert houseDetails for all models ─────────────────────────────────
console.log("\nUpserting house details...");

/**
 * levelCount inferred from R2 floor plan image layers:
 *   - Bungalows: only ground floor → 1
 *   - Most EFH/Stadtvilla/Doppelhaus/Kubus/Generationenhaus: ground + upper/attic → 2
 *   - Pultdachhaus 21-349-225: basement + ground + attic → 3
 *
 * familiesCount:
 *   - 1 normally
 *   - 2 for Generationenhaus, Doppelhaus, Pultdachhaus 21-349-225
 *
 * bedroomCount / bathroomCount:
 *   Inferred by visual analysis of R2 floor plan images.
 *   For models without R2 images, values inferred from similar models in category.
 *   Doppelhaus counts are per half-unit (each family's share).
 *
 * hasGarage:
 *   true for Kubus 0-166, 0-190 (garage in solid walls on floor plan)
 *   true for Pultdachhaus 21-349-225 (garage in KG floor plan)
 *   false for all others
 */

type DetailSpec = {
  modelCode: string;
  levelCount: number;
  bedroomCount: number;
  bathroomCount: number;
  familiesCount: number;
  hasGarage: boolean;
};

const detailSpecs: DetailSpec[] = [
  // Einfamilienhaus — confirmed from floor plan images
  { modelCode: "38-115-125", levelCount: 2, bedroomCount: 3, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "38-128-125", levelCount: 2, bedroomCount: 3, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "38-138-125", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "45-139-75",  levelCount: 2, bedroomCount: 3, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "22-141-190", levelCount: 2, bedroomCount: 3, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "35-146-150", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "22-162-190", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "25-168-190", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: false }, // inferred (similar to 22-162-190)
  { modelCode: "35-181-150", levelCount: 2, bedroomCount: 6, bathroomCount: 2, familiesCount: 1, hasGarage: false }, // confirmed: EG Arbeiten/Gast + DG Schlafen+Kind1-4
  { modelCode: "28-182-170", levelCount: 2, bedroomCount: 5, bathroomCount: 2, familiesCount: 1, hasGarage: false }, // inferred (large 182m²)
  { modelCode: "22-173-190", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 2, hasGarage: false }, // ELW confirmed from floor plan
  { modelCode: "28-194-170", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 2, hasGarage: false }, // ELW confirmed from floor plan
  // Stadtvilla — confirmed from floor plan images
  { modelCode: "18-140", levelCount: 2, bedroomCount: 3, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "22-157", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "22-166", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: false }, // inferred (similar to 22-157)
  { modelCode: "22-173", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 2, hasGarage: false }, // ELW confirmed from floor plan
  // Generationenhaus — confirmed: WE1(EG)+WE2(DG), EG-WE2 Schlafen + DG Schlafen+Kind1+Kind2+Arbeiten
  { modelCode: "28-264-160", levelCount: 2, bedroomCount: 5, bathroomCount: 3, familiesCount: 2, hasGarage: false },
  // Pultdachhaus — confirmed: KG=WE2(Schlafen+Wohnen+Bad+Garage) + EG=WE1(Wohnen+Küche+Arbeiten+WC/Du)
  { modelCode: "21-349-225", levelCount: 2, bedroomCount: 2, bathroomCount: 2, familiesCount: 2, hasGarage: true },
  // Doppelhaus — counts are per half-unit; confirmed from floor plan images
  { modelCode: "38-238-125", levelCount: 2, bedroomCount: 3, bathroomCount: 2, familiesCount: 2, hasGarage: false },
  { modelCode: "28-299",     levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 2, hasGarage: false },
  // Kubus — confirmed from floor plan images (0-166 and 0-278)
  { modelCode: "0-166", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: true },  // garage solid walls EG
  { modelCode: "0-190", levelCount: 2, bedroomCount: 4, bathroomCount: 2, familiesCount: 1, hasGarage: true },  // inferred from 0-166
  { modelCode: "0-278", levelCount: 2, bedroomCount: 5, bathroomCount: 3, familiesCount: 1, hasGarage: false }, // large premium model
  // Bungalow — confirmed from floor plan images
  { modelCode: "22-117", levelCount: 1, bedroomCount: 2, bathroomCount: 2, familiesCount: 1, hasGarage: false },
  { modelCode: "22-134", levelCount: 1, bedroomCount: 2, bathroomCount: 2, familiesCount: 1, hasGarage: false }, // inferred from 22-117
  { modelCode: "22-149", levelCount: 1, bedroomCount: 2, bathroomCount: 2, familiesCount: 1, hasGarage: false },
];

for (const spec of detailSpecs) {
  const models = await db
    .select({ id: houseModels.id })
    .from(houseModels)
    .where(eq(houseModels.modelCode, spec.modelCode));

  if (models.length === 0) {
    console.log(`  WARN: model not found for ${spec.modelCode}`);
    continue;
  }

  const modelId = models[0].id;

  // Upsert: try insert, on conflict update
  await db
    .insert(houseDetails)
    .values({
      id: modelId,
      levelCount: spec.levelCount,
      bedroomCount: spec.bedroomCount,
      bathroomCount: spec.bathroomCount,
      familiesCount: spec.familiesCount,
      hasGarage: spec.hasGarage,
    })
    .onConflictDoUpdate({
      target: houseDetails.id,
      set: {
        levelCount: spec.levelCount,
        bedroomCount: spec.bedroomCount,
        bathroomCount: spec.bathroomCount,
        familiesCount: spec.familiesCount,
        hasGarage: spec.hasGarage,
      },
    });

  console.log(
    `  ${spec.modelCode}: levels=${spec.levelCount}, beds=${spec.bedroomCount}, baths=${spec.bathroomCount}, families=${spec.familiesCount}, garage=${spec.hasGarage}`
  );
}

console.log("\nDone.");
await sql.end();
