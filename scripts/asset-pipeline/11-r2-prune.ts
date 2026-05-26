// Find R2 objects under images/ that aren't referenced in the live DB and aren't
import { $ } from 'bun';
import { sql } from 'drizzle-orm';

// in the new manifest (staging-review + stock). Show count + sample, then delete.
import manifest from '../../image-manifest.json';
import { db } from '../../src/db/db';

const BUCKET = process.env.R2_BUCKET!;
const ENDPOINT = process.env.R2_ENDPOINT!;
if (!BUCKET || !ENDPOINT) {
  console.error("Need R2_BUCKET + R2_ENDPOINT in env");
  process.exit(1);
}

// 1. Collect all keys we want to KEEP:
//    - Anything referenced by DB media.path
//    - Anything in the manifest (covers stock + staging-review)
const dbPaths = await db.execute(sql`SELECT path FROM boholz.media WHERE path LIKE '/images/%'`);
const keep = new Set<string>();
for (const r of dbPaths) {
  const p = (r.path as string).replace(/^\//, "");
  keep.add(p);
}
for (const a of manifest.assets) keep.add(a.r2Key);

// 2. List R2 objects ONLY under images/models/ — everything else (brand, content,
//    construction, lifestyle, showhouses, homepage, team) is referenced from .content.ts
//    files and not tracked by the DB.
const lsResult = await $`aws s3 ls s3://${BUCKET}/images/models/ --recursive --endpoint-url ${ENDPOINT}`.text();
const allKeys = lsResult
  .trim()
  .split("\n")
  .map((l) => l.replace(/^\S+\s+\S+\s+\S+\s+/, "").trim())
  .filter(Boolean);

// 3. Diff
const orphans = allKeys.filter((k) => !keep.has(k));

console.log(`R2 objects total: ${allKeys.length}`);
console.log(`Keep (in DB or manifest): ${keep.size}`);
console.log(`Orphan candidates: ${orphans.length}`);
console.log();
console.log("Sample orphans (first 20):");
for (const k of orphans.slice(0, 20)) console.log("  " + k);

await Bun.write("dev/asset-audit/orphans.json", JSON.stringify(orphans, null, 2));
console.log(`\nFull list: dev/asset-audit/orphans.json`);

if (process.env.DELETE === "1") {
  console.log("\nDeleting orphans...");
  let n = 0;
  for (const k of orphans) {
    const r = await $`aws s3 rm s3://${BUCKET}/${k} --endpoint-url ${ENDPOINT}`.nothrow().quiet();
    if (r.exitCode === 0) n++;
    else console.error(`FAIL ${k}`);
  }
  console.log(`Deleted ${n}/${orphans.length}`);
} else {
  console.log("\nDRY RUN. Set DELETE=1 to actually delete.");
}
