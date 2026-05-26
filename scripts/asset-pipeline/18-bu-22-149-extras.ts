// One-off: optimize + upload the two BU 22-149 files sitting loose in
// public/images/ (the Walmdach hero JPG + the EG floor-plan PNG), wire them
// to bungalow-22-149 (gallery + floor_media), then delete the local files.
//
// Per user: this is the Walmdach variant (which is the model's default per
// the spreadsheet — row 29 of houses-table.md). No "(Walmdach)" qualifier
// is added — the default variant stays unqualified; the future Flachdach
// variant will be the one carrying the qualifier.

import { $ } from 'bun';
import { sql } from 'drizzle-orm';
import { rm } from 'node:fs/promises';
import sharp from 'sharp';

import { db } from '../../src/db/db';

const DRY_RUN = process.env.DRY === "1";
const BUCKET = process.env.R2_BUCKET!;
const ENDPOINT = process.env.R2_ENDPOINT!;
if (!DRY_RUN && (!BUCKET || !ENDPOINT)) {
  console.error("Need R2_BUCKET + R2_ENDPOINT");
  process.exit(1);
}

const tasks: {
  source: string;
  r2Key: string;
  kind: "gallery" | "floor";
  title?: string;
  webpOpts: sharp.WebpOptions;
}[] = [
  {
    source: "public/images/BU 22-149 hero.jpg",
    r2Key: "images/models/bungalow/22-149/gallery/bungalow-22-149-gallery-hero.webp",
    kind: "gallery",
    webpOpts: { quality: 82, effort: 4 },
  },
  {
    source: "public/images/BU 22-149 plan.png",
    r2Key: "images/models/bungalow/22-149/floor-plans/bungalow-22-149-floor-plan-eg.webp",
    kind: "floor",
    title: "Erdgeschoss",
    webpOpts: { lossless: true, effort: 4 },
  },
];

// Optimize to a temp staging dir
const stagedFiles: { task: typeof tasks[number]; outPath: string; size: number; width: number; height: number }[] = [];
for (const t of tasks) {
  const outPath = `/tmp/${t.r2Key.split("/").pop()!}`;
  let pipeline = sharp(t.source).rotate().resize({
    width: 2400, height: 2400, fit: "inside", withoutEnlargement: true,
  }).keepIccProfile().webp(t.webpOpts);
  const info = await pipeline.toFile(outPath);
  stagedFiles.push({ task: t, outPath, size: info.size, width: info.width, height: info.height });
  console.log(`  ${t.source} → ${outPath}  (${(info.size/1024).toFixed(0)}KB ${info.width}×${info.height})`);
}

if (DRY_RUN) {
  console.log("\nDRY RUN — set DRY=0 to apply.");
  process.exit(0);
}

// Upload to R2 (idempotent)
for (const s of stagedFiles) {
  const head = await $`aws s3api head-object --bucket ${BUCKET} --key ${s.task.r2Key} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
  if (head.exitCode === 0) {
    const out = JSON.parse(head.stdout.toString());
    if (out.ContentLength === s.size) { console.log(`  cached: ${s.task.r2Key}`); continue; }
  }
  const r = await $`aws s3 cp ${s.outPath} s3://${BUCKET}/${s.task.r2Key} --endpoint-url ${ENDPOINT} --cache-control "public, max-age=31536000, immutable" --content-type image/webp`.nothrow().quiet();
  if (r.exitCode === 0) console.log(`  uploaded: ${s.task.r2Key}`);
  else { console.error(`FAIL ${s.task.r2Key}: ${r.stderr.toString().trim()}`); process.exit(1); }
}

// Wire to DB
const m = await db.execute(sql`SELECT id FROM boholz.house_models WHERE slug = 'bungalow-22-149'`);
const modelId = m[0].id as string;

await db.transaction(async (tx) => {
  for (const s of stagedFiles) {
    const dbPath = "/" + s.task.r2Key;
    // Insert or fetch media row
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

    if (s.task.kind === "gallery") {
      const max = await tx.execute(sql`SELECT COALESCE(MAX(sort_order), -1) AS m FROM boholz.model_media WHERE model_id = ${modelId}`);
      await tx.execute(sql`
        INSERT INTO boholz.model_media (model_id, media_id, is_hero, is_thumbnail, sort_order)
        VALUES (${modelId}, ${mediaId}, false, false, ${Number(max[0].m) + 1})
        ON CONFLICT DO NOTHING
      `);
    } else {
      const max = await tx.execute(sql`SELECT COALESCE(MAX(sort_order), -1) AS m FROM boholz.floor_media WHERE model_id = ${modelId}`);
      await tx.execute(sql`
        INSERT INTO boholz.floor_media (model_id, media_id, title, sort_order)
        VALUES (${modelId}, ${mediaId}, ${s.task.title}, ${Number(max[0].m) + 1})
      `);
    }
  }
});
console.log("DB wired.");

// Delete local source files
for (const t of tasks) {
  await rm(t.source);
  console.log(`  deleted ${t.source}`);
}
// Clean staging
for (const s of stagedFiles) await rm(s.outPath);

console.log("Done.");
