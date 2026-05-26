// Generationenhaus 28-264-160 cleanup:
//  1. Fix title typo: "28-244-160" → "28-264-160".
//  2. Reclassify `gh-264-28-160.webp` (currently floor_media "Grundriss (mit ELW) (2)")
//     as the model hero — move R2 path from /floor-plans/ to /gallery/, rename,
//     update media.path, swap floor_media → model_media (isHero=true, isThumbnail=true).
//  3. Delete the 4 × "3D Ansicht N" entries entirely (pivot + media + R2 object).
//  4. Dedup pivots:
//     - "Obergeschoss (mit ELW)" + "(2)" share one media row — drop the (2) pivot.
//     - "Erdgeschoss (mit ELW)" (long bodenplatte name) + "(2)" (short eg-elw name) are
//       250 bytes apart (same plan with metadata variance) — keep the SHORT path,
//       delete the LONG one's pivot + media + R2 object, rename (2)→canonical.

import { $ } from 'bun';
import { sql } from 'drizzle-orm';

import { db } from '../../src/db/db';

const DRY_RUN = process.env.DRY === "1";
const BUCKET = process.env.R2_BUCKET!;
const ENDPOINT = process.env.R2_ENDPOINT!;
if (!DRY_RUN && (!BUCKET || !ENDPOINT)) {
  console.error("Need R2_BUCKET + R2_ENDPOINT");
  process.exit(1);
}

const MODEL_SLUG = "generationenhaus-28-264-160";
const m = await db.execute(sql`SELECT id FROM boholz.house_models WHERE slug = ${MODEL_SLUG}`);
const modelId = m[0].id as string;

// === Inventory current state ===
const pivots = await db.execute(sql`
  SELECT fm.id AS pivot_id, fm.media_id, fm.title, m.path
  FROM boholz.floor_media fm
  JOIN boholz.media m ON m.id = fm.media_id
  WHERE fm.model_id = ${modelId}
`);

function find(title: string): { pivot_id: string; media_id: string; path: string } {
  const r = pivots.find((p: any) => p.title === title);
  if (!r) throw new Error(`pivot not found: ${title}`);
  return { pivot_id: r.pivot_id as string, media_id: r.media_id as string, path: r.path as string };
}

const heroSrc = find("Grundriss (mit ELW) (2)"); // gh-264-28-160.webp
const og2 = find("Obergeschoss (mit ELW) (2)");
const eg_long = find("Erdgeschoss (mit ELW)");
const eg_short = find("Erdgeschoss (mit ELW) (2)");
const threeD = ["3D Ansicht 1", "3D Ansicht 2", "3D Ansicht 3", "3D Ansicht 4"].map(find);

const heroNewKey = "images/models/generationenhaus/28-264-160/gallery/generationenhaus-28-264-160-gallery-hero.webp";
const heroOldKey = heroSrc.path.replace(/^\//, "");

console.log("Plan:");
console.log(`  1. Title fix: "Generationenhaus 28-244-160" → "Generationenhaus 28-264-160"`);
console.log(`  2. Hero reclassify: ${heroOldKey} → ${heroNewKey}`);
console.log(`  3. Delete 4 × 3D Ansicht entries (pivots + media + R2)`);
console.log(`  4. Drop OG-2 pivot (shares media with canonical OG)`);
console.log(`  5. EG dedup: delete long-name (${eg_long.path.split("/").pop()}); rename short-name pivot title to "Erdgeschoss (mit ELW)"`);

if (DRY_RUN) {
  console.log("\nDRY RUN — set DRY=0 to apply.");
  process.exit(0);
}

// === Phase A: title fix ===
await db.execute(sql`UPDATE boholz.house_models SET title = 'Generationenhaus 28-264-160' WHERE id = ${modelId}`);
console.log("  title fixed");

// === Phase B: hero reclassify ===
// 1. Copy R2 object to new gallery key
const cp = await $`aws s3 cp s3://${BUCKET}/${heroOldKey} s3://${BUCKET}/${heroNewKey} --endpoint-url ${ENDPOINT} --metadata-directive REPLACE --cache-control "public, max-age=31536000, immutable" --content-type image/webp`.nothrow().quiet();
if (cp.exitCode !== 0) { console.error("FAIL copy hero:", cp.stderr.toString()); process.exit(1); }
console.log(`  copied to ${heroNewKey}`);
// 2. Delete old R2 key
await $`aws s3 rm s3://${BUCKET}/${heroOldKey} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
console.log(`  deleted old key ${heroOldKey}`);
// 3. DB swap: update media.path, drop floor_media pivot, insert model_media pivot
await db.transaction(async (tx) => {
  await tx.execute(sql`UPDATE boholz.media SET path = ${"/" + heroNewKey} WHERE id = ${heroSrc.media_id}`);
  await tx.execute(sql`DELETE FROM boholz.floor_media WHERE id = ${heroSrc.pivot_id}`);
  // Demote any existing isHero/isThumbnail on this model before inserting (none currently per earlier query)
  await tx.execute(sql`UPDATE boholz.model_media SET is_hero = false, is_thumbnail = false WHERE model_id = ${modelId}`);
  await tx.execute(sql`
    INSERT INTO boholz.model_media (model_id, media_id, is_hero, is_thumbnail, sort_order)
    VALUES (${modelId}, ${heroSrc.media_id}, true, true, 0)
  `);
});
console.log(`  hero swapped to model_media (isHero=true, isThumbnail=true)`);

// === Phase C: delete 3D Ansicht entries ===
await db.transaction(async (tx) => {
  for (const r of threeD) {
    await tx.execute(sql`DELETE FROM boholz.floor_media WHERE id = ${r.pivot_id}`);
    await tx.execute(sql`DELETE FROM boholz.media WHERE id = ${r.media_id}`);
  }
});
for (const r of threeD) {
  const key = r.path.replace(/^\//, "");
  await $`aws s3 rm s3://${BUCKET}/${key} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
  console.log(`  deleted 3D R2 object: ${key.split("/").pop()}`);
}

// === Phase D: drop OG-2 pivot ===
await db.execute(sql`DELETE FROM boholz.floor_media WHERE id = ${og2.pivot_id}`);
console.log(`  dropped OG-2 pivot (shares media with canonical OG — kept)`);

// === Phase E: EG dedup ===
await db.transaction(async (tx) => {
  // Delete the long-name pivot + media row
  await tx.execute(sql`DELETE FROM boholz.floor_media WHERE id = ${eg_long.pivot_id}`);
  await tx.execute(sql`DELETE FROM boholz.media WHERE id = ${eg_long.media_id}`);
  // Rename the short-name pivot's title from "(2)" to canonical
  await tx.execute(sql`UPDATE boholz.floor_media SET title = 'Erdgeschoss (mit ELW)' WHERE id = ${eg_short.pivot_id}`);
});
const egLongKey = eg_long.path.replace(/^\//, "");
await $`aws s3 rm s3://${BUCKET}/${egLongKey} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
console.log(`  EG dedup: deleted long-name R2 object + media row; renamed short-name pivot to canonical title`);

console.log("\nDone.");
