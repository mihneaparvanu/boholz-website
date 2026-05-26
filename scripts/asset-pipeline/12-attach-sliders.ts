// Append each /images/stock/{cat}-slider/* image to every model's gallery
// in that category. One media row per slider image, referenced from N pivots.
// New pivots get sortOrder = (existing max + 1 + index), isHero/isThumbnail false.

import { sql } from 'drizzle-orm';

import manifest from '../../image-manifest.json';
import { db } from '../../src/db/db';

const DRY_RUN = process.env.DRY === "1";

// Folder name on R2 → DB category slug
const FOLDER_TO_CAT: Record<string, string> = {
  "einfamilienhaeuser-slider": "einfamilienhaus",
  "stadtvillen-slider": "stadtvilla",
  "bungalow-slider": "bungalow",
  "doppelhaeuser-slider": "doppelhaus",
  "kubus-slider": "kubus",
  "pultdachhaeuser-slider": "pultdachhaus",
  "generationenhaeuser-slider": "generationenhaus",
};

const slider = manifest.assets.filter(
  (a) => a.r2Key.startsWith("images/stock/") && a.r2Key.includes("-slider/"),
);

const byCat = new Map<string, typeof slider>();
for (const a of slider) {
  const folder = a.r2Key.split("/")[2];
  const cat = FOLDER_TO_CAT[folder];
  if (!cat) continue;
  if (!byCat.has(cat)) byCat.set(cat, []);
  byCat.get(cat)!.push(a);
}

// Load categories + their models
const categories = await db.execute(sql`SELECT id, slug FROM boholz.house_categories`);
const models = await db.execute(sql`SELECT id, slug, category_id FROM boholz.house_models`);

// Current max sortOrder per model in model_media
const maxSort = await db.execute(sql`
  SELECT model_id, MAX(sort_order) AS max_sort
  FROM boholz.model_media
  GROUP BY model_id
`);
const maxSortByModel = new Map<string, number>();
for (const r of maxSort) maxSortByModel.set(r.model_id as string, Number(r.max_sort));

// Plan
type Plan = {
  newMediaRows: { r2Key: string; path: string; width: number; height: number }[];
  newPivotRows: { modelId: string; sliderR2Key: string; sortOrder: number }[];
};
const plan: Plan = { newMediaRows: [], newPivotRows: [] };

for (const [catSlug, sliderAssets] of byCat) {
  const cat = categories.find((c) => c.slug === catSlug);
  if (!cat) { console.warn(`No DB category ${catSlug}`); continue; }
  const catModels = models.filter((m) => m.category_id === cat.id);
  for (const a of sliderAssets) {
    plan.newMediaRows.push({
      r2Key: a.r2Key,
      path: `/${a.r2Key}`,
      width: a.width,
      height: a.height,
    });
    for (const m of catModels) {
      const base = (maxSortByModel.get(m.id as string) ?? -1) + 1;
      plan.newPivotRows.push({
        modelId: m.id as string,
        sliderR2Key: a.r2Key,
        sortOrder: base + sliderAssets.indexOf(a),
      });
    }
  }
}

console.log(`Plan: ${plan.newMediaRows.length} new media rows + ${plan.newPivotRows.length} new model_media pivots`);
console.log();
for (const [catSlug, sliderAssets] of byCat) {
  const cat = categories.find((c) => c.slug === catSlug)!;
  const n = models.filter((m) => m.category_id === cat.id).length;
  console.log(`  ${catSlug.padEnd(20)} ${sliderAssets.length} slider × ${n} models = ${sliderAssets.length * n} pivots`);
}

if (DRY_RUN) {
  console.log("\nDRY RUN — set DRY=0 (or unset) to apply.");
  process.exit(0);
}

await db.transaction(async (tx) => {
  const keyToId = new Map<string, string>();
  for (const m of plan.newMediaRows) {
    const r = await tx.execute(sql`
      INSERT INTO boholz.media (path, width, height)
      VALUES (${m.path}, ${m.width}, ${m.height})
      RETURNING id
    `);
    keyToId.set(m.r2Key, r[0].id as string);
  }
  console.log(`  inserted ${keyToId.size} media rows`);

  for (const p of plan.newPivotRows) {
    await tx.execute(sql`
      INSERT INTO boholz.model_media (model_id, media_id, is_hero, is_thumbnail, sort_order)
      VALUES (${p.modelId}, ${keyToId.get(p.sliderR2Key)}, false, false, ${p.sortOrder})
    `);
  }
  console.log(`  inserted ${plan.newPivotRows.length} model_media rows`);
});

console.log("\nCommitted.");
