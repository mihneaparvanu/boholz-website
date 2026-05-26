// Sync staged WebPs to R2. HEAD-check each key; upload if missing or size mismatch.
// Writes back to image-manifest.json with status per asset.
// Idempotent: re-running after success uploads 0 files.

import { $ } from 'bun';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import manifest from '../../image-manifest.json';

const ENDPOINT = process.env.R2_ENDPOINT;
const BUCKET = process.env.R2_BUCKET ?? manifest.bucket;
if (!ENDPOINT) {
  console.error("Set R2_ENDPOINT (e.g. https://<account-id>.r2.cloudflarestorage.com)");
  process.exit(1);
}
if (!BUCKET) {
  console.error("Set R2_BUCKET");
  process.exit(1);
}

const STAGING = "dev/asset-audit/staging";
const CACHE_CONTROL = "public, max-age=31536000, immutable";

let uploaded = 0,
  skipped = 0,
  failed = 0;

for (const a of manifest.assets) {
  const localPath = join(STAGING, a.r2Key);

  // HEAD-check for idempotency
  const head = await $`aws s3api head-object --bucket ${BUCKET} --key ${a.r2Key} --endpoint-url ${ENDPOINT}`
    .nothrow()
    .quiet();

  if (head.exitCode === 0) {
    try {
      const out = JSON.parse(head.stdout.toString());
      if (out.ContentLength === a.optimizedSizeBytes) {
        a.status = "skipped";
        skipped++;
        continue;
      }
    } catch {
      // fall through to upload
    }
  }

  const result =
    await $`aws s3 cp ${localPath} s3://${BUCKET}/${a.r2Key} --endpoint-url ${ENDPOINT} --cache-control ${CACHE_CONTROL} --content-type image/webp`
      .nothrow()
      .quiet();

  if (result.exitCode === 0) {
    a.status = "uploaded";
    uploaded++;
    if (uploaded % 10 === 0) console.log(`  ${uploaded} uploaded`);
  } else {
    a.status = "conflict";
    failed++;
    console.error(`FAIL ${a.r2Key}: ${result.stderr.toString().trim()}`);
  }
}

writeFileSync("image-manifest.json", JSON.stringify(manifest, null, 2));
console.log(`\nUploaded: ${uploaded}, Skipped: ${skipped}, Failed: ${failed}`);
if (failed > 0) process.exit(1);
