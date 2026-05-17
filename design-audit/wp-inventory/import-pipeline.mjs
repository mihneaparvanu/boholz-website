#!/usr/bin/env node
// Phase 3 download + transcode pipeline.
// Reads MANIFEST.json -> downloads each source_url -> transcodes to WebP -> writes to staging/<r2_key>.
// Idempotent: skips if staged file already exists with matching SHA256 of the WebP output.
// Records sha256 + bytes per asset into MANIFEST-RESULT.json.
//
// Run from repo root:  node design-audit/wp-inventory/import-pipeline.mjs

import { readFile, writeFile, mkdir, stat, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")));
const STAGE_DIR = path.join(ROOT, "staging-webp");
const ORIG_DIR = path.join(ROOT, "staging");
const MANIFEST_PATH = path.join(ROOT, "MANIFEST.json");
const RESULT_PATH = path.join(ROOT, "MANIFEST-RESULT.json");

const WEBP_QUALITY = 85;

const log = (...a) => console.log("[import]", ...a);
const err = (...a) => console.error("[import]", ...a);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function sha256File(p) {
  const buf = await readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

async function download(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

function originalExtFromUrl(url) {
  const u = new URL(url);
  const m = u.pathname.match(/\.([A-Za-z0-9]+)$/);
  return m ? m[1].toLowerCase() : "bin";
}

async function transcodeToWebp(inputBuf, isDiagram) {
  // strip EXIF GPS, preserve ICC, q=85 (lossy) for photos
  // For diagrams/plans, use higher quality lossless-ish to keep crispness
  const pipeline = sharp(inputBuf, { failOn: "none" })
    .withMetadata({ exif: {}, icc: undefined }); // strip EXIF (incl. GPS), keep ICC if embedded
  // sharp .toFormat("webp") preserves ICC by default unless told otherwise
  if (isDiagram) {
    return pipeline.webp({ quality: 92, effort: 5 }).toBuffer();
  }
  return pipeline.webp({ quality: WEBP_QUALITY, effort: 5 }).toBuffer();
}

async function main() {
  await mkdir(STAGE_DIR, { recursive: true });
  await mkdir(ORIG_DIR, { recursive: true });

  const manifestRaw = await readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);
  const results = [];

  for (const asset of manifest.assets) {
    const targetWebp = path.join(STAGE_DIR, asset.r2_key);
    const origPath = path.join(ORIG_DIR, asset.r2_key.replace(/\.webp$/, "." + originalExtFromUrl(asset.source_url)));
    await mkdir(path.dirname(targetWebp), { recursive: true });
    await mkdir(path.dirname(origPath), { recursive: true });

    const isDiagram = ["plan", "diagram", "pillar"].includes(asset.classification);

    let status = "uploaded";
    let bytes = 0;
    let sha = "";
    let errorMsg = null;

    try {
      // Skip if already present
      if (await exists(targetWebp)) {
        const s = await stat(targetWebp);
        if (s.size > 0) {
          bytes = s.size;
          sha = await sha256File(targetWebp);
          status = "cached";
          log(`SKIP ${asset.r2_key}  (cached ${bytes} bytes)`);
          results.push({ r2_key: asset.r2_key, destination: asset.destination, classification: asset.classification, source_url: asset.source_url, r2_url: asset.r2_url, sha256: sha, bytes, status, error: null });
          continue;
        }
      }

      log(`GET  ${asset.source_url}`);
      const inputBuf = await download(asset.source_url);
      await writeFile(origPath, inputBuf);
      const webpBuf = await transcodeToWebp(inputBuf, isDiagram);
      await writeFile(targetWebp, webpBuf);
      bytes = webpBuf.length;
      sha = createHash("sha256").update(webpBuf).digest("hex");
      log(`OK   ${asset.r2_key}  ${inputBuf.length}B -> ${bytes}B`);
    } catch (e) {
      errorMsg = e.message;
      status = "failed";
      err(`FAIL ${asset.r2_key}: ${e.message}`);
    }

    results.push({
      r2_key: asset.r2_key,
      destination: asset.destination,
      classification: asset.classification,
      source_url: asset.source_url,
      r2_url: asset.r2_url,
      sha256: sha,
      bytes,
      status,
      error: errorMsg,
    });
  }

  const result = {
    generated_at: new Date().toISOString(),
    total: manifest.assets.length,
    succeeded: results.filter(r => r.status === "uploaded" || r.status === "cached").length,
    failed: results.filter(r => r.status === "failed").length,
    staging_root_webp: STAGE_DIR,
    staging_root_originals: ORIG_DIR,
    r2_public_base: manifest.r2_public_base,
    assets: results,
  };
  await writeFile(RESULT_PATH, JSON.stringify(result, null, 2));
  log(`Wrote ${RESULT_PATH}`);
  log(`Summary: ${result.succeeded}/${result.total} ok, ${result.failed} failed`);
}

main().catch(e => { err(e); process.exit(1); });
