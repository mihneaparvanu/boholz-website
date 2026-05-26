// Build image-manifest.json from staged WebPs. Each entry has source path,
// optimized sha256/size/dimensions, r2 key + url, matched DB references, status.

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

import mapping from '../../dev/asset-audit/mapping-final.json';

const STAGING = "dev/asset-audit/staging";
const R2_PUBLIC = "https://pub-47ece1c9a40d42ad8886561941b959b5.r2.dev";
const BUCKET = process.env.R2_BUCKET ?? "boholz";

async function sha256(p: string): Promise<string> {
  const h = createHash("sha256");
  for await (const chunk of createReadStream(p)) h.update(chunk);
  return h.digest("hex");
}

const targets = mapping.filter((e) => !e.skip && e.proposedR2Key);

type ManifestAsset = {
  sourceLocalPath: string;
  sourceSha256: string;
  optimizedSha256: string;
  optimizedSizeBytes: number;
  width: number;
  height: number;
  r2Key: string;
  r2Url: string;
  matchedModelSlug: string | null;
  matchedCategorySlug: string | null;
  suspectedType: string;
  destinationClass: "model" | "stock" | "staging-review";
  status: "pending" | "uploaded" | "skipped" | "conflict";
};

const assets: ManifestAsset[] = [];
let failed = 0;

for (const e of targets) {
  const stagingPath = join(STAGING, e.proposedR2Key!);
  try {
    const s = await stat(stagingPath);
    const meta = await sharp(stagingPath).metadata();

    let destinationClass: ManifestAsset["destinationClass"] = "model";
    if (e.proposedR2Key!.startsWith("images/staging-review/")) destinationClass = "staging-review";
    else if (e.proposedR2Key!.startsWith("images/stock/")) destinationClass = "stock";

    assets.push({
      sourceLocalPath: e.localPath,
      sourceSha256: e.sha256,
      optimizedSha256: await sha256(stagingPath),
      optimizedSizeBytes: s.size,
      width: meta.width!,
      height: meta.height!,
      r2Key: e.proposedR2Key!,
      r2Url: `${R2_PUBLIC}/${e.proposedR2Key!}`,
      matchedModelSlug: e.matchedModelSlug,
      matchedCategorySlug: e.matchedCategorySlug,
      suspectedType: e.suspectedType,
      destinationClass,
      status: "pending",
    });
  } catch (err) {
    failed++;
    console.error(`MISSING STAGING FILE: ${stagingPath}`);
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  bucket: BUCKET,
  r2Public: R2_PUBLIC,
  assets,
};

await Bun.write("image-manifest.json", JSON.stringify(manifest, null, 2));
const totalMB = assets.reduce((s, a) => s + a.optimizedSizeBytes, 0) / 1024 / 1024;
console.log(`Manifest: ${assets.length} assets, ${totalMB.toFixed(1)}MB total`);
if (failed > 0) {
  console.error(`WARN: ${failed} staging files missing — re-run optimization`);
  process.exit(1);
}
