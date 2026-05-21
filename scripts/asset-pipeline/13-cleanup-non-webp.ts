// Classify R2 non-WebP files as optimize (referenced in src/) vs orphan (not).
// Also identify lifestyle-merge candidates and possibly-orphan WebPs under
// team/, homepage/, construction/.
//
// Output: dev/asset-audit/cleanup-plan.json

import { $ } from "bun";

const BUCKET = process.env.R2_BUCKET!;
const ENDPOINT = process.env.R2_ENDPOINT!;
if (!BUCKET || !ENDPOINT) {
  console.error("Need R2_BUCKET + R2_ENDPOINT");
  process.exit(1);
}

const ls = await $`aws s3 ls s3://${BUCKET}/images/ --recursive --endpoint-url ${ENDPOINT}`.text();
type Obj = { sizeBytes: number; key: string };
const all: Obj[] = ls
  .trim()
  .split("\n")
  .map((l) => {
    const m = l.match(/^(\S+)\s+(\S+)\s+(\d+)\s+(.+)$/);
    return m ? { sizeBytes: Number(m[3]), key: m[4] } : null;
  })
  .filter((o): o is Obj => !!o);

const manifestText = await Bun.file("public/manifest.json").text();

async function isReferencedInSource(key: string): Promise<boolean> {
  const p = "/" + key;
  const r = await $`grep -r --include='*.astro' --include='*.vue' --include='*.ts' ${p} src/`.nothrow().quiet();
  return r.exitCode === 0 && r.stdout.length > 0;
}

function isReferencedInManifest(key: string): boolean {
  return manifestText.includes(key);
}

const toOptimize: { key: string; sizeBytes: number }[] = [];
const toDeleteOrphan: { key: string; sizeBytes: number; refs: string }[] = [];

for (const o of all.filter((o) => !o.key.endsWith(".webp"))) {
  const inSrc = await isReferencedInSource(o.key);
  if (inSrc) {
    toOptimize.push({ key: o.key, sizeBytes: o.sizeBytes });
  } else {
    toDeleteOrphan.push({
      key: o.key,
      sizeBytes: o.sizeBytes,
      refs: isReferencedInManifest(o.key) ? "manifest.json only" : "none",
    });
  }
}

const possiblyOrphanWebp: { key: string; sizeBytes: number; refs: string }[] = [];
for (const o of all.filter((o) => /^images\/(team|homepage|construction)\//.test(o.key))) {
  if (await isReferencedInSource(o.key)) continue;
  possiblyOrphanWebp.push({
    key: o.key,
    sizeBytes: o.sizeBytes,
    refs: isReferencedInManifest(o.key) ? "manifest.json only" : "none",
  });
}

const lifestyleMerge: { from: string; to: string; sizeBytes: number; refs: string[] }[] = [];
for (const o of all.filter((o) => o.key.startsWith("images/lifestyle/"))) {
  const r = await $`grep -rl --include='*.astro' --include='*.vue' --include='*.ts' ${"/" + o.key} src/`.nothrow().quiet();
  const refs = r.exitCode === 0 ? r.stdout.toString().trim().split("\n").filter(Boolean) : [];
  lifestyleMerge.push({
    from: o.key,
    to: o.key.replace("images/lifestyle/", "images/stock/lifestyle/"),
    sizeBytes: o.sizeBytes,
    refs,
  });
}

const plan = {
  generatedAt: new Date().toISOString(),
  toOptimize,
  toDeleteOrphan,
  possiblyOrphanWebp,
  lifestyleMerge,
};

await Bun.write("dev/asset-audit/cleanup-plan.json", JSON.stringify(plan, null, 2));

function mb(n: number) {
  return (n / 1024 / 1024).toFixed(1);
}
console.log(`Optimize: ${toOptimize.length} files (${mb(toOptimize.reduce((s, o) => s + o.sizeBytes, 0))}MB)`);
for (const o of toOptimize) console.log(`  ${o.key} (${mb(o.sizeBytes)}MB)`);
console.log();
console.log(`Delete orphan: ${toDeleteOrphan.length} files (${mb(toDeleteOrphan.reduce((s, o) => s + o.sizeBytes, 0))}MB)`);
for (const o of toDeleteOrphan.slice(0, 12)) console.log(`  ${o.key} (${mb(o.sizeBytes)}MB, refs=${o.refs})`);
if (toDeleteOrphan.length > 12) console.log(`  ...${toDeleteOrphan.length - 12} more`);
console.log();
console.log(`Possibly orphan WebP: ${possiblyOrphanWebp.length} files`);
console.log(`Lifestyle merge: ${lifestyleMerge.length} files`);
