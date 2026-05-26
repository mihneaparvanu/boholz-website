// Upload public/images/{model-slug}/*.webp to R2 at the canonical model-gallery
// path, then INSERT media + model_media rows so each image shows up in the
// model's gallery. No isHero / isThumbnail flags set — these are appended
// to the end of the existing gallery.

import { $ } from 'bun';
import { sql } from 'drizzle-orm';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

import { db } from '../../src/db/db';

const DRY_RUN = process.env.DRY === "1";
const BUCKET = process.env.R2_BUCKET!;
const ENDPOINT = process.env.R2_ENDPOINT!;
if (!DRY_RUN && (!BUCKET || !ENDPOINT)) {
  console.error("Need R2_BUCKET + R2_ENDPOINT");
  process.exit(1);
}

// Source folder → DB model slug. mehframilienhauser is skipped (no matching model).
const sources: { folder: string; modelSlug: string; categorySlug: string; modelCode: string }[] = [
  { folder: "public/images/bungalow-22-134",                modelSlug: "bungalow-22-134",                categorySlug: "bungalow",        modelCode: "22-134" },
  { folder: "public/images/einfamilienhaus-28-194-170",     modelSlug: "einfamilienhaus-28-194-170",     categorySlug: "einfamilienhaus", modelCode: "28-194-170" },
];

// Convert a source filename → the slug used inside the canonical R2 key.
function normalizeSlug(file: string, categorySlug: string): string {
  let s = file
    .toLowerCase()
    .replace(/\.webp$/, "")
    .replace(/^ubsersicht-/, "")        // typo'd "ubsersicht"
    .replace(/^ubersicht-/, "")         // landing-page prefix
    .replace(new RegExp(`^${categorySlug}-`), "") // redundant category prefix
    .replace(/^gallery-/, "");          // redundant subfolder prefix
  return s || "image";
}

type Plan = {
  modelId: string;
  modelSlug: string;
  uploads: { localPath: string; r2Key: string; slug: string; sizeBytes: number; width: number; height: number }[];
  startSortOrder: number;
};

const plans: Plan[] = [];
for (const src of sources) {
  // Resolve modelId + current max sortOrder
  const m = await db.execute(sql`SELECT id FROM boholz.house_models WHERE slug = ${src.modelSlug}`);
  if (m.length === 0) { console.error(`Model ${src.modelSlug} not found`); continue; }
  const modelId = m[0].id as string;
  const max = await db.execute(sql`SELECT COALESCE(MAX(sort_order), -1) AS m FROM boholz.model_media WHERE model_id = ${modelId}`);
  const startSortOrder = (Number(max[0].m) + 1);

  const files = (await readdir(src.folder)).filter((f) => f.endsWith(".webp")).sort();
  const uploads: Plan["uploads"] = [];
  for (const file of files) {
    const localPath = join(src.folder, file);
    const slug = normalizeSlug(file, src.categorySlug);
    const r2Key = `images/models/${src.categorySlug}/${src.modelCode}/gallery/${src.categorySlug}-${src.modelCode}-gallery-${slug}.webp`;
    const meta = await sharp(localPath).metadata();
    const stat = await Bun.file(localPath).stat();
    uploads.push({ localPath, r2Key, slug, sizeBytes: stat.size, width: meta.width!, height: meta.height! });
  }
  plans.push({ modelId, modelSlug: src.modelSlug, uploads, startSortOrder });
}

console.log("Plan:");
for (const p of plans) {
  console.log(`  ${p.modelSlug}  (start sort=${p.startSortOrder})`);
  for (const u of p.uploads) {
    console.log(`    ${u.localPath} → ${u.r2Key}  (${(u.sizeBytes/1024).toFixed(0)}KB ${u.width}×${u.height})`);
  }
}

if (DRY_RUN) {
  console.log("\nDRY RUN — set DRY=0 to apply.");
  process.exit(0);
}

// === Phase 1: upload to R2 (idempotent via HEAD) ===
let uploaded = 0, skipped = 0;
for (const p of plans) {
  for (const u of p.uploads) {
    const head = await $`aws s3api head-object --bucket ${BUCKET} --key ${u.r2Key} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
    if (head.exitCode === 0) {
      const out = JSON.parse(head.stdout.toString());
      if (out.ContentLength === u.sizeBytes) { skipped++; continue; }
    }
    const r = await $`aws s3 cp ${u.localPath} s3://${BUCKET}/${u.r2Key} --endpoint-url ${ENDPOINT} --cache-control "public, max-age=31536000, immutable" --content-type image/webp`.nothrow().quiet();
    if (r.exitCode === 0) uploaded++;
    else console.error(`FAIL ${u.r2Key}: ${r.stderr.toString().trim()}`);
  }
}
console.log(`R2 upload: ${uploaded} uploaded, ${skipped} already current`);

// === Phase 2: INSERT media + model_media in one transaction ===
await db.transaction(async (tx) => {
  for (const p of plans) {
    for (let i = 0; i < p.uploads.length; i++) {
      const u = p.uploads[i];
      // Check whether a media row already exists for this exact path
      const existing = await tx.execute(sql`SELECT id FROM boholz.media WHERE path = ${"/" + u.r2Key}`);
      let mediaId: string;
      if (existing.length > 0) {
        mediaId = existing[0].id as string;
      } else {
        const ins = await tx.execute(sql`
          INSERT INTO boholz.media (path, width, height)
          VALUES (${"/" + u.r2Key}, ${u.width}, ${u.height})
          RETURNING id
        `);
        mediaId = ins[0].id as string;
      }
      // Insert pivot if not already present
      const pivotExists = await tx.execute(sql`
        SELECT 1 FROM boholz.model_media WHERE model_id = ${p.modelId} AND media_id = ${mediaId}
      `);
      if (pivotExists.length === 0) {
        await tx.execute(sql`
          INSERT INTO boholz.model_media (model_id, media_id, is_hero, is_thumbnail, sort_order)
          VALUES (${p.modelId}, ${mediaId}, false, false, ${p.startSortOrder + i})
        `);
      }
    }
  }
});
console.log(`DB: inserted ${plans.reduce((s,p) => s + p.uploads.length, 0)} model_media pivots`);
console.log("Committed.");
