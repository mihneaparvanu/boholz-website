// bungalow-22-149-gallery-bu-22-149.webp is actually a floor plan (the user
// confirmed). Currently it's the model's hero+thumbnail in model_media.
// Reclassify:
//   1. Move R2 object from /gallery/ to /floor-plans/, renaming to canonical
//      bungalow-22-149-floor-plan-eg.webp ... wait that path is already taken
//      by the real EG plan uploaded in script 18. So name it -eg-2.webp to
//      avoid collision, with variant=null and title "Erdgeschoss" — but title
//      collides with the existing "Erdgeschoss". Use the variant system: this
//      one is the "Alternative" since the script-18 plan is the canonical one.
//      Decision: title=Erdgeschoss, variant=alternative.
//   2. UPDATE media.path to the new key.
//   3. DELETE the model_media pivot (was hero+thumb).
//   4. INSERT floor_media pivot (title="Erdgeschoss", variant="alternative",
//      sortOrder appended after the existing floor plans).
//   5. Promote bungalow-22-149-gallery-hero.webp (the real Walmdach exterior
//      photo uploaded in script 18) to isHero=true isThumbnail=true so the
//      model still has a hero.

import { db } from "../../src/db/db";
import { sql } from "drizzle-orm";
import { $ } from "bun";

const DRY_RUN = process.env.DRY === "1";
const BUCKET = process.env.R2_BUCKET!;
const ENDPOINT = process.env.R2_ENDPOINT!;
if (!DRY_RUN && (!BUCKET || !ENDPOINT)) {
  console.error("Need R2_BUCKET + R2_ENDPOINT");
  process.exit(1);
}

const MODEL_SLUG = "bungalow-22-149";
const OLD_KEY = "images/models/bungalow/22-149/gallery/bungalow-22-149-gallery-bu-22-149.webp";
const NEW_KEY = "images/models/bungalow/22-149/floor-plans/bungalow-22-149-floor-plan-bu-22-149-alt.webp";
const NEW_HERO_PATH = "/images/models/bungalow/22-149/gallery/bungalow-22-149-gallery-hero.webp";

const m = await db.execute(sql`SELECT id FROM boholz.house_models WHERE slug = ${MODEL_SLUG}`);
const modelId = m[0].id as string;

const oldMedia = await db.execute(sql`SELECT id FROM boholz.media WHERE path = ${"/" + OLD_KEY}`);
if (oldMedia.length === 0) { console.error(`Media row not found: ${OLD_KEY}`); process.exit(1); }
const oldMediaId = oldMedia[0].id as string;

const heroMedia = await db.execute(sql`SELECT id FROM boholz.media WHERE path = ${NEW_HERO_PATH}`);
if (heroMedia.length === 0) { console.error(`Hero media row not found: ${NEW_HERO_PATH}`); process.exit(1); }
const heroMediaId = heroMedia[0].id as string;

console.log("Plan:");
console.log(`  1. R2: cp ${OLD_KEY}`);
console.log(`         → ${NEW_KEY}`);
console.log(`     R2: rm ${OLD_KEY}`);
console.log(`  2. media.path: update to ${NEW_KEY}`);
console.log(`  3. DELETE model_media pivot for ${oldMediaId} (was hero+thumb)`);
console.log(`  4. INSERT floor_media: title="Erdgeschoss", variant="alternative"`);
console.log(`  5. Promote ${NEW_HERO_PATH} to hero+thumb on the model`);

if (DRY_RUN) {
  console.log("\nDRY RUN — set DRY=0 to apply.");
  process.exit(0);
}

// Phase 1: R2 move
const cp = await $`aws s3 cp s3://${BUCKET}/${OLD_KEY} s3://${BUCKET}/${NEW_KEY} --endpoint-url ${ENDPOINT} --metadata-directive REPLACE --cache-control "public, max-age=31536000, immutable" --content-type image/webp`.nothrow().quiet();
if (cp.exitCode !== 0) { console.error("FAIL cp:", cp.stderr.toString()); process.exit(1); }
console.log(`  copied to ${NEW_KEY}`);
await $`aws s3 rm s3://${BUCKET}/${OLD_KEY} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
console.log(`  deleted ${OLD_KEY}`);

// Phase 2-5: DB transaction
await db.transaction(async (tx) => {
  // Update path on the existing media row
  await tx.execute(sql`UPDATE boholz.media SET path = ${"/" + NEW_KEY} WHERE id = ${oldMediaId}`);

  // Drop the model_media pivot
  await tx.execute(sql`DELETE FROM boholz.model_media WHERE model_id = ${modelId} AND media_id = ${oldMediaId}`);

  // Insert floor_media row
  const fmMax = await tx.execute(sql`SELECT COALESCE(MAX(sort_order), -1) AS m FROM boholz.floor_media WHERE model_id = ${modelId}`);
  await tx.execute(sql`
    INSERT INTO boholz.floor_media (model_id, media_id, title, variant, sort_order)
    VALUES (${modelId}, ${oldMediaId}, 'Erdgeschoss', 'alternative', ${Number(fmMax[0].m) + 1})
  `);

  // Promote the real hero photo
  await tx.execute(sql`UPDATE boholz.model_media SET is_hero = false, is_thumbnail = false WHERE model_id = ${modelId}`);
  await tx.execute(sql`UPDATE boholz.model_media SET is_hero = true, is_thumbnail = true WHERE model_id = ${modelId} AND media_id = ${heroMediaId}`);
});

console.log("\nDone.");
