// 1. Repoint pivots + delete 7 within-model R2 dupes identified by ETag scan.
// 2. Optimize + upload 3 new floor plans for einfamilienhaus-28-194-170.
// 3. Delete the local PNG sources after success.
//
// Cross-model dupes (slider photo across categories, placeholder photos used
// on multiple Bestseller models, news cover shared between two events) are
// LEFT IN PLACE — they may be intentional. Flagged in the script comments.

import { db } from "../../src/db/db";
import { sql } from "drizzle-orm";
import { $ } from "bun";
import sharp from "sharp";
import { rm } from "node:fs/promises";

const DRY_RUN = process.env.DRY === "1";
const BUCKET = process.env.R2_BUCKET!;
const ENDPOINT = process.env.R2_ENDPOINT!;
if (!DRY_RUN && (!BUCKET || !ENDPOINT)) {
  console.error("Need R2_BUCKET + R2_ENDPOINT");
  process.exit(1);
}

// ============================================================================
// PART 1 — DEDUP ACTIONS (7 pairs)
// ============================================================================
// Each entry: keep the `keepKey`, repoint pivots from `removeKey`'s media row
// to `keepKey`'s media row, delete the `removeKey` media row + R2 object.

const dedupActions: { keepKey: string; removeKey: string; reason: string }[] = [
  {
    keepKey: "images/models/stadtvilla/18-140/floor-plans/stadtvilla-18-140-floor-plan-sv-140-18-0-bodenplatte-expose-grundrisse300dpi-neu-website-erdgeschoss.webp",
    removeKey: "images/models/stadtvilla/18-140/floor-plans/stadtvilla-18-140-floor-plan-flachdach-sv-140-18-0-bodenplatte-expose-grundrisse300dpi-neu-website-erdgeschoss.webp",
    reason: "Identical content; no real Flachdach plan exists separately",
  },
  {
    keepKey: "images/models/stadtvilla/18-140/floor-plans/stadtvilla-18-140-floor-plan-sv-140-18-0-bodenplatte-expose-grundrisse300dpi-neu-website-obergeschoss.webp",
    removeKey: "images/models/stadtvilla/18-140/floor-plans/stadtvilla-18-140-floor-plan-flachdach-sv-140-18-0-bodenplatte-expose-grundrisse300dpi-neu-website-obergeschoss.webp",
    reason: "Identical content",
  },
  {
    keepKey: "images/models/stadtvilla/22-173/floor-plans/stadtvilla-22-173-floor-plan-elw-sv-elw-173-22-0-eg-alternative.webp",
    removeKey: "images/models/stadtvilla/22-173/floor-plans/stadtvilla-22-173-floor-plan-sv-elw-173-22-0-eg-alternative.webp",
    reason: "Identical content; keep the elw-prefixed path",
  },
  {
    keepKey: "images/models/stadtvilla/22-173/floor-plans/stadtvilla-22-173-floor-plan-elw-sv-elw-173-22-0-og-neu.webp",
    removeKey: "images/models/stadtvilla/22-173/floor-plans/stadtvilla-22-173-floor-plan-sv-elw-173-22-0-og-neu.webp",
    reason: "Identical content; keep the elw-prefixed path",
  },
  {
    keepKey: "images/models/generationenhaus/28-264-160/floor-plans/generationenhaus-28-264-160-floor-plan-elw-gh-264-28-160-og-elw.webp",
    removeKey: "images/models/generationenhaus/28-264-160/floor-plans/generationenhaus-28-264-160-floor-plan-elw-gh-264-28-160-bodenplatte-expose-grundrisse300dpi-neu-website-obergeschoss.webp",
    reason: "Identical content; keep the cleaner short slug",
  },
  {
    keepKey: "images/models/einfamilienhaus/35-181-150/floor-plans/einfamilienhaus-35-181-150-floor-plan-elw-efh-181-35-150-og-m-elw.webp",
    removeKey: "images/models/einfamilienhaus/35-181-150/floor-plans/einfamilienhaus-35-181-150-floor-plan-efh-181-35-150-og-m-elw.webp",
    reason: "Identical content; keep elw-prefixed (matches variant convention)",
  },
  {
    keepKey: "images/staging-review/kubus-kubus-0-145/gallery/kubus-140-0-0.webp",
    removeKey: "images/models/stadtvilla/18-140/floor-plans/stadtvilla-18-140-floor-plan-flachdach-kubus-145-0-0.webp",
    reason: "Misfiled Kubus 145 plan in stadtvilla/18-140; correct copy lives in staging-review",
  },
];

console.log(`=== PART 1: R2 dedup (${dedupActions.length} pairs) ===\n`);

for (const a of dedupActions) {
  console.log(`  KEEP    ${a.keepKey}`);
  console.log(`  REMOVE  ${a.removeKey}`);
  console.log(`  reason: ${a.reason}\n`);
}

// ============================================================================
// PART 2 — UPLOAD + WIRE 3 NEW EFH 28-194-170 PLANS
// ============================================================================
type PlanTask = { source: string; r2Key: string; title: string };

const newPlans: PlanTask[] = [
  {
    source: "public/images/einfamilienhaus/EFH-28-194-170-oL-EG.png",
    r2Key: "images/models/einfamilienhaus/28-194-170/floor-plans/einfamilienhaus-28-194-170-floor-plan-eg.webp",
    title: "Erdgeschoss",
  },
  {
    source: "public/images/einfamilienhaus/EFH-28-194-170-oL-OG.png",
    r2Key: "images/models/einfamilienhaus/28-194-170/floor-plans/einfamilienhaus-28-194-170-floor-plan-og.webp",
    title: "Obergeschoss",
  },
  {
    source: "public/images/einfamilienhaus/28-194-170-mit-ELW-oL-EG-2.png",
    r2Key: "images/models/einfamilienhaus/28-194-170/floor-plans/einfamilienhaus-28-194-170-floor-plan-elw-eg.webp",
    title: "Erdgeschoss (mit ELW)",
  },
];

console.log(`=== PART 2: 3 new EFH 28-194-170 floor plans ===\n`);
for (const p of newPlans) {
  console.log(`  ${p.source}\n  → ${p.r2Key}\n  title: "${p.title}"\n`);
}

if (DRY_RUN) {
  console.log("DRY RUN — set DRY=0 to apply.");
  process.exit(0);
}

// === Execute PART 1: repoint pivots + delete R2 objects + delete media rows ===
console.log("\n--- Applying dedup ---");
for (const a of dedupActions) {
  await db.transaction(async (tx) => {
    const keep = await tx.execute(sql`SELECT id FROM boholz.media WHERE path = ${"/" + a.keepKey}`);
    const remove = await tx.execute(sql`SELECT id FROM boholz.media WHERE path = ${"/" + a.removeKey}`);
    if (keep.length === 0) {
      console.error(`SKIP — keepKey media row not found: ${a.keepKey}`);
      return;
    }
    if (remove.length === 0) {
      console.log(`  ${a.removeKey} — no DB media row; will only delete R2 object`);
    } else {
      const keepId = keep[0].id as string;
      const removeId = remove[0].id as string;
      // Repoint any pivots
      const fmUp = await tx.execute(sql`UPDATE boholz.floor_media SET media_id = ${keepId} WHERE media_id = ${removeId} RETURNING id`);
      const mmUp = await tx.execute(sql`UPDATE boholz.model_media SET media_id = ${keepId} WHERE media_id = ${removeId} RETURNING id`);
      console.log(`  repointed ${fmUp.length} floor_media + ${mmUp.length} model_media pivots from ${removeId} → ${keepId}`);
      // Delete dupe media row
      await tx.execute(sql`DELETE FROM boholz.media WHERE id = ${removeId}`);
    }
  });
  // Delete R2 object
  const r = await $`aws s3 rm s3://${BUCKET}/${a.removeKey} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
  if (r.exitCode === 0) console.log(`  deleted R2: ${a.removeKey}`);
  else console.error(`  FAIL R2 rm: ${r.stderr.toString().trim()}`);
}

// === Execute PART 2: optimize + upload + wire new plans ===
console.log("\n--- Optimizing + uploading 3 new EFH 28-194-170 plans ---");
const modelRow = await db.execute(sql`SELECT id FROM boholz.house_models WHERE slug = 'einfamilienhaus-28-194-170'`);
const modelId = modelRow[0].id as string;

const staged: { task: PlanTask; tmpPath: string; size: number; width: number; height: number }[] = [];
for (const p of newPlans) {
  const tmpPath = `/tmp/${p.r2Key.split("/").pop()!}`;
  const info = await sharp(p.source)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .keepIccProfile()
    .webp({ lossless: true, effort: 4 })
    .toFile(tmpPath);
  console.log(`  optimized: ${p.source} → ${tmpPath} (${(info.size / 1024).toFixed(0)}KB ${info.width}×${info.height})`);
  staged.push({ task: p, tmpPath, size: info.size, width: info.width, height: info.height });
}

for (const s of staged) {
  const head = await $`aws s3api head-object --bucket ${BUCKET} --key ${s.task.r2Key} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
  if (head.exitCode === 0) {
    const out = JSON.parse(head.stdout.toString());
    if (out.ContentLength === s.size) {
      console.log(`  cached: ${s.task.r2Key}`);
      continue;
    }
  }
  const r = await $`aws s3 cp ${s.tmpPath} s3://${BUCKET}/${s.task.r2Key} --endpoint-url ${ENDPOINT} --cache-control "public, max-age=31536000, immutable" --content-type image/webp`.nothrow().quiet();
  if (r.exitCode === 0) console.log(`  uploaded: ${s.task.r2Key}`);
  else {
    console.error(`  FAIL upload: ${r.stderr.toString().trim()}`);
    process.exit(1);
  }
}

// Wire to floor_media
await db.transaction(async (tx) => {
  const max = await tx.execute(sql`SELECT COALESCE(MAX(sort_order), -1) AS m FROM boholz.floor_media WHERE model_id = ${modelId}`);
  let sortOrder = Number(max[0].m) + 1;
  for (const s of staged) {
    const dbPath = "/" + s.task.r2Key;
    const ex = await tx.execute(sql`SELECT id FROM boholz.media WHERE path = ${dbPath}`);
    let mediaId: string;
    if (ex.length > 0) {
      mediaId = ex[0].id as string;
    } else {
      const ins = await tx.execute(sql`
        INSERT INTO boholz.media (path, width, height)
        VALUES (${dbPath}, ${s.width}, ${s.height})
        RETURNING id
      `);
      mediaId = ins[0].id as string;
    }
    await tx.execute(sql`
      INSERT INTO boholz.floor_media (model_id, media_id, title, sort_order)
      VALUES (${modelId}, ${mediaId}, ${s.task.title}, ${sortOrder})
    `);
    sortOrder++;
  }
});
console.log("  wired 3 floor_media rows");

// Delete local sources + tmp
for (const p of newPlans) {
  await rm(p.source);
  console.log(`  deleted ${p.source}`);
}
for (const s of staged) await rm(s.tmpPath);

console.log("\nDone.");
