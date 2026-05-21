// Generate a DB migration plan (preview + SQL) from the image-manifest.
// Strategy: wipe category_media + model_media + floor_media + their media rows
// (preserving news_media + location_media references), then INSERT fresh.

import manifest from "../../image-manifest.json";
import db from "../../dev/asset-audit/db-state.json";

type Asset = (typeof manifest.assets)[number];

const modelAssets = manifest.assets.filter(
  (a): a is Asset & { matchedModelSlug: string } =>
    a.destinationClass === "model" && !!a.matchedModelSlug,
);

const stockAssets = manifest.assets.filter((a) => a.destinationClass === "stock");
const stagingAssets = manifest.assets.filter((a) => a.destinationClass === "staging-review");

const modelBySlug = new Map(db.models.map((m) => [m.slug, m]));
const categoryById = new Map(db.categories.map((c) => [c.id, c]));

// Group manifest assets by model
const byModel = new Map<string, Asset[]>();
for (const a of modelAssets) {
  if (!byModel.has(a.matchedModelSlug!)) byModel.set(a.matchedModelSlug!, []);
  byModel.get(a.matchedModelSlug!)!.push(a);
}

// Derive German floor-plan title from filename
function deriveFloorTitle(r2Key: string): string {
  const lower = r2Key.toLowerCase();
  const hasELW = lower.includes("-elw-");
  let base = "Grundriss";
  if (/-erdgeschoss|-eg(?![a-z])/i.test(lower)) base = "Erdgeschoss";
  else if (/-obergeschoss|-og(?![a-z])/i.test(lower)) base = "Obergeschoss";
  else if (/-dachgeschoss|-dg(?![a-z])/i.test(lower)) base = "Dachgeschoss";
  else if (/-keller/i.test(lower)) base = "Kellergeschoss";
  return hasELW ? `${base} (mit ELW)` : base;
}

// Plan per model
type PlannedMedia = {
  r2Key: string;
  path: string; // with leading slash
  width: number;
  height: number;
  alt: null;
};

type PlannedModelMedia = {
  modelId: string;
  asset: Asset;
  isHero: boolean;
  isThumbnail: boolean;
  sortOrder: number;
};

type PlannedFloorMedia = {
  modelId: string;
  asset: Asset;
  title: string;
  sortOrder: number;
};

const planMedia: PlannedMedia[] = [];
const planModelMedia: PlannedModelMedia[] = [];
const planFloorMedia: PlannedFloorMedia[] = [];

for (const [slug, assets] of byModel) {
  const model = modelBySlug.get(slug);
  if (!model) { console.error(`MISSING MODEL ${slug}`); continue; }

  // Classify by ACTUAL R2 location (the variant logic routes ELW/Flachdach
  // into /floor-plans/ regardless of source suspectedType)
  const photos = assets.filter((a) => !a.r2Key.includes("/floor-plans/"));
  const floors = assets.filter((a) => a.r2Key.includes("/floor-plans/"));

  photos.sort((a, b) => a.r2Key.localeCompare(b.r2Key));
  floors.sort((a, b) => a.r2Key.localeCompare(b.r2Key));

  photos.forEach((p, i) => {
    planModelMedia.push({
      modelId: model.id,
      asset: p,
      isHero: i === 0,
      isThumbnail: i === 0,
      sortOrder: i,
    });
  });
  floors.forEach((f, i) => {
    planFloorMedia.push({
      modelId: model.id,
      asset: f,
      title: deriveFloorTitle(f.r2Key),
      sortOrder: i,
    });
  });
}

// All assets (model + stock + staging) get media rows
for (const a of manifest.assets) {
  planMedia.push({
    r2Key: a.r2Key,
    path: `/${a.r2Key}`,
    width: a.width,
    height: a.height,
    alt: null,
  });
}

// Category thumbnails: pick the first hero per category
const categoryHeroPick = new Map<string, Asset>();
for (const mm of planModelMedia.filter((p) => p.isHero)) {
  const model = db.models.find((m) => m.id === mm.modelId)!;
  const cat = categoryById.get(model.categoryId)!;
  if (!categoryHeroPick.has(cat.slug)) categoryHeroPick.set(cat.slug, mm.asset);
}

// Save plan
const plan = {
  generatedAt: new Date().toISOString(),
  summary: {
    mediaRowsToInsert: planMedia.length,
    modelMediaRowsToInsert: planModelMedia.length,
    floorMediaRowsToInsert: planFloorMedia.length,
    categoryMediaRowsToInsert: categoryHeroPick.size,
    modelsAffected: byModel.size,
    stagingReviewRows: stagingAssets.length,
    stockRows: stockAssets.length,
  },
  modelsCovered: [...byModel.keys()].sort(),
  categoriesWithHero: [...categoryHeroPick.entries()].map(([cat, a]) => ({
    category: cat,
    r2Key: a.r2Key,
  })),
  floorMediaTitles: planFloorMedia.map((f) => ({
    model: db.models.find((m) => m.id === f.modelId)!.slug,
    title: f.title,
    r2Key: f.asset.r2Key,
  })),
};

await Bun.write("dev/asset-audit/migration-plan.json", JSON.stringify(plan, null, 2));
console.log("Migration plan:");
console.log(JSON.stringify(plan.summary, null, 2));
console.log("\nFloor-plan titles per model (first 10):");
for (const f of plan.floorMediaTitles.slice(0, 10))
  console.log(`  ${f.model.padEnd(40)} title="${f.title}" key=${f.r2Key.split("/").pop()}`);
console.log("\nCategory heroes:");
for (const c of plan.categoriesWithHero) console.log(`  ${c.category.padEnd(20)} ← ${c.r2Key}`);

// Pretty-print plan summary then write the structured plan
console.log("\nFull plan written to dev/asset-audit/migration-plan.json");
