#!/usr/bin/env node
// Phase 3 R2 sync. Reads MANIFEST-RESULT.json + uploads each staged WebP to R2.
// Idempotent: HEADs the object first; if SHA256 (custom metadata) matches, skips.
//
// Required env:
//   R2_ACCOUNT_ID         (e.g. 64-char hex from Cloudflare dashboard)
//   R2_BUCKET             (e.g. boholz-assets)
//   AWS_ACCESS_KEY_ID     (from .env)
//   AWS_SECRET_ACCESS_KEY (from .env)
//
// Run:
//   R2_ACCOUNT_ID=xxx R2_BUCKET=boholz-assets node design-audit/wp-inventory/r2-upload.mjs

import { readFile, stat } from "node:fs/promises";
import { createHash, createHmac } from "node:crypto";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")));
const STAGE_DIR = path.join(ROOT, "staging-webp");
const RESULT_PATH = path.join(ROOT, "MANIFEST-RESULT.json");
const UPLOAD_LOG_PATH = path.join(ROOT, "MANIFEST-UPLOADED.json");

const {
  R2_ACCOUNT_ID,
  R2_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_BUCKET || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error("Missing required env: R2_ACCOUNT_ID, R2_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY");
  process.exit(1);
}

const ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const REGION = "auto";
const SERVICE = "s3";

// ---------- SigV4 helpers ----------
function hmac(key, data) { return createHmac("sha256", key).update(data).digest(); }
function hash(data) { return createHash("sha256").update(data).digest("hex"); }

function getSigningKey(secret, date, region, service) {
  const kDate = hmac("AWS4" + secret, date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

function isoDate() {
  const d = new Date();
  const amz = d.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return { amzDate: amz, dateStamp: amz.slice(0, 8) };
}

function uriEncode(s) {
  return encodeURIComponent(s).replace(/[!*'()]/g, c => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function uriEncodePath(p) {
  return p.split("/").map(uriEncode).join("/");
}

async function signedRequest({ method, key, body = "", extraHeaders = {} }) {
  const { amzDate, dateStamp } = isoDate();
  const host = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const canonicalUri = "/" + uriEncodePath(`${R2_BUCKET}/${key}`);
  const payloadHash = hash(body);

  const headers = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    ...extraHeaders,
  };

  const sortedHeaderKeys = Object.keys(headers).map(k => k.toLowerCase()).sort();
  const canonicalHeaders = sortedHeaderKeys
    .map(k => `${k}:${headers[Object.keys(headers).find(h => h.toLowerCase() === k)].toString().trim()}\n`)
    .join("");
  const signedHeaders = sortedHeaderKeys.join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hash(canonicalRequest),
  ].join("\n");

  const signingKey = getSigningKey(AWS_SECRET_ACCESS_KEY, dateStamp, REGION, SERVICE);
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const authHeader = `AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const url = `${ENDPOINT}${canonicalUri}`;
  const res = await fetch(url, {
    method,
    headers: { ...headers, Authorization: authHeader },
    body: method === "GET" || method === "HEAD" ? undefined : body,
  });
  return res;
}

function mimeFor(p) {
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

async function head(key) {
  const res = await signedRequest({ method: "HEAD", key });
  if (res.status === 200) {
    return {
      exists: true,
      etag: res.headers.get("etag")?.replaceAll('"', ""),
      sha256: res.headers.get("x-amz-meta-sha256") || null,
    };
  }
  return { exists: false };
}

async function put(key, body, sha256) {
  const res = await signedRequest({
    method: "PUT",
    key,
    body,
    extraHeaders: {
      "content-type": mimeFor(key),
      "x-amz-meta-sha256": sha256,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUT ${key} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.headers.get("etag")?.replaceAll('"', "");
}

async function main() {
  const data = JSON.parse(await readFile(RESULT_PATH, "utf8"));
  const log = [];

  console.log(`[upload] endpoint=${ENDPOINT}  bucket=${R2_BUCKET}  assets=${data.assets.length}`);

  for (const a of data.assets) {
    if (a.status === "failed") {
      console.log(`[upload] SKIP ${a.r2_key}  (stage failed)`);
      log.push({ ...a, upload_status: "skipped-stage-failed" });
      continue;
    }
    const local = path.join(STAGE_DIR, a.r2_key);
    try {
      const existing = await head(a.r2_key);
      if (existing.exists && existing.sha256 === a.sha256) {
        console.log(`[upload] CACHED ${a.r2_key}  (sha match)`);
        log.push({ ...a, upload_status: "cached", r2_etag: existing.etag });
        continue;
      }
      const buf = await readFile(local);
      const etag = await put(a.r2_key, buf, a.sha256);
      console.log(`[upload] OK ${a.r2_key}  etag=${etag}`);
      log.push({ ...a, upload_status: "uploaded", r2_etag: etag });
    } catch (e) {
      console.error(`[upload] FAIL ${a.r2_key}: ${e.message}`);
      log.push({ ...a, upload_status: "failed", upload_error: e.message });
    }
  }

  const summary = {
    generated_at: new Date().toISOString(),
    endpoint: ENDPOINT,
    bucket: R2_BUCKET,
    public_base: data.r2_public_base,
    totals: {
      uploaded: log.filter(x => x.upload_status === "uploaded").length,
      cached: log.filter(x => x.upload_status === "cached").length,
      failed: log.filter(x => x.upload_status === "failed").length,
    },
    assets: log,
  };
  await import("node:fs/promises").then(fs => fs.writeFile(UPLOAD_LOG_PATH, JSON.stringify(summary, null, 2)));
  console.log(`[upload] wrote ${UPLOAD_LOG_PATH}`);
  console.log(`[upload] uploaded=${summary.totals.uploaded} cached=${summary.totals.cached} failed=${summary.totals.failed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
