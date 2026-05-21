// Sharp optimization: source → 2400w max WebP (lossy q=82 photos / lossless floor plans),
// EXIF GPS stripped, ICC preserved. Output to dev/asset-audit/staging/<r2-key>.
// Idempotent: skips entries whose output already exists.

import sharp from "sharp";
import mapping from "../../dev/asset-audit/mapping-final.json";
import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

const STAGING = "dev/asset-audit/staging";
const MAX_DIM = 2400;
const JPEG_QUALITY = 82;

type Entry = (typeof mapping)[number];

const targets = mapping.filter(
  (e): e is Entry & { proposedR2Key: string } => !e.skip && !!e.proposedR2Key,
);

console.log(`Processing ${targets.length} entries...`);

let done = 0,
  skipped = 0,
  failed = 0;
const failures: { path: string; error: string }[] = [];

for (const e of targets) {
  const outPath = join(STAGING, e.proposedR2Key);
  await mkdir(dirname(outPath), { recursive: true });

  try {
    try {
      await stat(outPath);
      skipped++;
      continue;
    } catch {}

    const isFloorPlan = e.suspectedType === "floorplan";
    let pipeline = sharp(e.localPath, { failOn: "none" })
      .rotate()
      .resize({
        width: MAX_DIM,
        height: MAX_DIM,
        fit: "inside",
        withoutEnlargement: true,
      })
      .keepIccProfile();

    if (isFloorPlan) {
      pipeline = pipeline.webp({ lossless: true, effort: 4 });
    } else {
      pipeline = pipeline.webp({ quality: JPEG_QUALITY, effort: 4 });
    }

    await pipeline.toFile(outPath);
    done++;
    if (done % 10 === 0) {
      console.log(`  ${done + skipped}/${targets.length} (${done} done, ${skipped} cached, ${failed} failed)`);
    }
  } catch (err) {
    failed++;
    failures.push({ path: e.localPath, error: (err as Error).message });
    console.error(`FAIL ${e.localPath}: ${(err as Error).message}`);
  }
}

console.log(`\nResult: ${done} new, ${skipped} cached, ${failed} failed`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log(`  ${f.path}: ${f.error}`);
}
