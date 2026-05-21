// Apply the DB migration:
//  1. DELETE category_media, model_media, floor_media (all rows)
//  2. DELETE media WHERE id NOT IN (news_media + location_media + agent_media refs)
//  3. INSERT new media for all 151 manifest assets
//  4. INSERT new model_media + floor_media + category_media pivots
//
// Run with DRY=1 to print the row counts and abort BEFORE writing.
// Run without DRY=1 to apply. Wraps everything in a transaction.

import manifest from "../../image-manifest.json";
import db from "../../dev/asset-audit/db-state.json";
import { db as drizzle } from "../../src/db/db";
import { sql } from "drizzle-orm";

const DRY_RUN = process.env.DRY === "1";
const TX_MODE = process.env.TX === "0" ? false : true;

type Asset = (typeof manifest.assets)[number];
const modelAssets = manifest.assets.filter(
  (a) => a.destinationClass === "model" && !!a.matchedModelSlug,
);

const modelBySlug = new Map(db.models.map((m) => [m.slug, m]));
const categoryBySlug = new Map(db.categories.map((c) => [c.slug, c]));

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

const byModel = new Map<string, Asset[]>();
for (const a of modelAssets) {
  if (!byModel.has(a.matchedModelSlug!)) byModel.set(a.matchedModelSlug!, []);
  byModel.get(a.matchedModelSlug!)!.push(a);
}

// === Compute the work ===
type MediaRow = { tempId: string; path: string; width: number; height: number };
type ModelMediaRow = { modelId: string; mediaTempId: string; isHero: boolean; isThumbnail: boolean; sortOrder: number };
type FloorMediaRow = { modelId: string; mediaTempId: string; title: string; sortOrder: number };
type CategoryMediaRow = { categoryId: string; mediaTempId: string; isHero: boolean; isThumbnail: boolean; sortOrder: number };

const mediaRows: MediaRow[] = [];
const modelMediaRows: ModelMediaRow[] = [];
const floorMediaRows: FloorMediaRow[] = [];
const categoryMediaRows: CategoryMediaRow[] = [];
const keyToTempId = new Map<string, string>();

// Only insert media rows for assets that will get a pivot. Stock + staging-review
// stay R2-only (they're not referenced from DB-driven pages).
for (const a of manifest.assets) {
  if (a.destinationClass !== "model") continue;
  const tempId = `m_${a.r2Key}`;
  keyToTempId.set(a.r2Key, tempId);
  mediaRows.push({
    tempId,
    path: `/${a.r2Key}`,
    width: a.width,
    height: a.height,
  });
}

for (const [slug, assets] of byModel) {
  const model = modelBySlug.get(slug);
  if (!model) continue;
  const photos = assets.filter((a) => !a.r2Key.includes("/floor-plans/")).sort((a,b)=>a.r2Key.localeCompare(b.r2Key));
  const floors = assets.filter((a) => a.r2Key.includes("/floor-plans/")).sort((a,b)=>a.r2Key.localeCompare(b.r2Key));
  photos.forEach((p, i) => modelMediaRows.push({
    modelId: model.id,
    mediaTempId: keyToTempId.get(p.r2Key)!,
    isHero: i === 0,
    isThumbnail: i === 0,
    sortOrder: i,
  }));
  floors.forEach((f, i) => floorMediaRows.push({
    modelId: model.id,
    mediaTempId: keyToTempId.get(f.r2Key)!,
    title: deriveFloorTitle(f.r2Key),
    sortOrder: i,
  }));
}

// Category heroes: first hero per category
const categoryHeroPicked = new Set<string>();
for (const mm of modelMediaRows.filter((m) => m.isHero).sort((a,b)=>{
  const ma = db.models.find(m => m.id === a.modelId)!;
  const mb = db.models.find(m => m.id === b.modelId)!;
  return ma.modelCode.localeCompare(mb.modelCode);
})) {
  const model = db.models.find((m) => m.id === mm.modelId)!;
  const cat = db.categories.find((c) => c.id === model.categoryId)!;
  if (categoryHeroPicked.has(cat.id)) continue;
  categoryHeroPicked.add(cat.id);
  categoryMediaRows.push({
    categoryId: cat.id,
    mediaTempId: mm.mediaTempId,
    isHero: true,
    isThumbnail: true,
    sortOrder: 0,
  });
}

// === Print plan ===
console.log("=== MIGRATION PLAN ===");
console.log(`DELETE category_media: ${db.categoryMedia.length} rows`);
console.log(`DELETE model_media:    ${db.modelMedia.length} rows`);
console.log(`DELETE floor_media:    ${db.floorMedia.length} rows`);
console.log(`DELETE media:          (orphans only, preserving news_media + location_media + agent_media refs)`);
console.log();
console.log(`INSERT media:          ${mediaRows.length} rows`);
console.log(`INSERT model_media:    ${modelMediaRows.length} rows`);
console.log(`INSERT floor_media:    ${floorMediaRows.length} rows`);
console.log(`INSERT category_media: ${categoryMediaRows.length} rows`);
console.log();

if (DRY_RUN) {
  console.log("DRY RUN — no changes applied. Set DRY=0 (or unset) to apply.");
  process.exit(0);
}

// === Apply ===
async function run() {
  // Find media IDs still referenced by other pivots (preserve them)
  const preservedRefs = await drizzle.execute(sql`
    SELECT DISTINCT media_id FROM boholz.news_media
    UNION
    SELECT DISTINCT media_id FROM boholz.location_media
    UNION
    SELECT DISTINCT media_id FROM boholz.agent_media
  `);
  const preservedIds = new Set(preservedRefs.map((r: any) => r.media_id));
  console.log(`Preserving ${preservedIds.size} media rows referenced by news/location/agent pivots`);

  try {
    await drizzle.transaction(async (tx) => {
      await tx.execute(sql`DELETE FROM boholz.category_media`);
      await tx.execute(sql`DELETE FROM boholz.model_media`);
      await tx.execute(sql`DELETE FROM boholz.floor_media`);
      if (preservedIds.size === 0) {
        await tx.execute(sql`DELETE FROM boholz.media`);
      } else {
        const idList = [...preservedIds].map((id) => `'${id}'`).join(",");
        await tx.execute(sql.raw(`DELETE FROM boholz.media WHERE id NOT IN (${idList})`));
      }

      const tempToUuid = new Map<string, string>();
      for (const m of mediaRows) {
        const r = await tx.execute(sql`
          INSERT INTO boholz.media (path, width, height)
          VALUES (${m.path}, ${m.width}, ${m.height})
          RETURNING id
        `);
        tempToUuid.set(m.tempId, r[0].id as string);
      }
      console.log(`  inserted ${tempToUuid.size} media rows`);

      for (const mm of modelMediaRows) {
        await tx.execute(sql`
          INSERT INTO boholz.model_media (model_id, media_id, is_hero, is_thumbnail, sort_order)
          VALUES (${mm.modelId}, ${tempToUuid.get(mm.mediaTempId)}, ${mm.isHero}, ${mm.isThumbnail}, ${mm.sortOrder})
        `);
      }
      console.log(`  inserted ${modelMediaRows.length} model_media rows`);

      for (const fm of floorMediaRows) {
        await tx.execute(sql`
          INSERT INTO boholz.floor_media (model_id, media_id, title, sort_order)
          VALUES (${fm.modelId}, ${tempToUuid.get(fm.mediaTempId)}, ${fm.title}, ${fm.sortOrder})
        `);
      }
      console.log(`  inserted ${floorMediaRows.length} floor_media rows`);

      for (const cm of categoryMediaRows) {
        await tx.execute(sql`
          INSERT INTO boholz.category_media (category_id, media_id, is_hero, is_thumbnail, sort_order)
          VALUES (${cm.categoryId}, ${tempToUuid.get(cm.mediaTempId)}, ${cm.isHero}, ${cm.isThumbnail}, ${cm.sortOrder})
        `);
      }
      console.log(`  inserted ${categoryMediaRows.length} category_media rows`);
    });
    console.log("\nCommitted.");
  } catch (e) {
    console.error("ROLLED BACK:", (e as Error).message);
    process.exit(1);
  }
}

await run();
