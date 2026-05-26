import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { basename, extname, join, relative } from 'node:path';
import sharp from 'sharp';

const ROOT = "public/images-client";
const OUT = "dev/asset-audit/inventory.json";

type Entry = {
  localPath: string;
  sha256: string;
  sizeBytes: number;
  format: string;
  width: number | null;
  height: number | null;
  suspectedCategory: string | null;
  suspectedHouseCode: string | null;
  suspectedType: string;
  notes: string[];
};

async function sha256File(p: string): Promise<string> {
  const h = createHash("sha256");
  for await (const chunk of createReadStream(p)) h.update(chunk);
  return h.digest("hex");
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name !== ".DS_Store") yield p;
  }
}

const CAT_MAP: Record<string, string> = {
  "Einfamilienhäuser": "einfamilienhaus",
  "Stadtvillen": "stadtvilla",
  "Zweifamilienhäuser": "zweifamilienhaus",
  "Doppelhäuser": "doppelhaus",
  "Bungalow": "bungalow",
  "Kubus": "kubus",
  "Mehrfamilienhaus": "mehrfamilienhaus",
  "Pultdachhäuser": "pultdachhaus",
  "Generationenhäuser": "generationenhaus",
  "Bestseller": "bestseller",
};

function classifyFolder(rel: string): Pick<Entry, "suspectedCategory" | "suspectedHouseCode" | "suspectedType"> {
  const segs = rel.split("/");
  const cat = segs[2] ?? "";
  const sub = segs[3] ?? "";
  const file = (segs[segs.length - 1] ?? "").toLowerCase();

  let type = "unknown";
  if (file.startsWith("adobestock_") || file.startsWith("shutterstock_") || file.includes("istock")) type = "stock";
  else if (sub.toLowerCase().includes("slider")) type = "slider";
  else if (/(^|\W)(eg|og|dg|kg|ug|grundriss|bodenplatte|erdgeschoss|obergeschoss)(\W|\.)/i.test(file)) type = "floorplan";
  else if (extname(file).match(/\.(jpe?g|webp|png|tiff?)$/i)) type = sub ? "gallery" : "hero";

  const codeMatch = (sub || cat).match(/(\d{1,3}-\d{1,3}-\d{1,3})/);
  const houseCode = codeMatch
    ? codeMatch[1]
    : cat === "Bestseller" && sub
      ? sub.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
      : null;

  return {
    suspectedCategory: type === "stock" ? "stock" : (CAT_MAP[cat] ?? null),
    suspectedHouseCode: houseCode,
    suspectedType: type,
  };
}

const out: Entry[] = [];
for await (const p of walk(ROOT)) {
  const rel = relative(".", p);
  const st = await stat(p);
  const ext = extname(p).slice(1).toLowerCase();
  const notes: string[] = [];

  let width: number | null = null;
  let height: number | null = null;
  try {
    const meta = await sharp(p, { failOn: "none" }).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  } catch (e) {
    notes.push(`sharp-metadata-failed: ${(e as Error).message}`);
  }

  if (basename(p).match(/[()]/)) notes.push("parens-in-filename");
  if (basename(p).includes(" ")) notes.push("spaces-in-filename");
  if (ext === "tif" || ext === "tiff") notes.push("tiff-source");

  out.push({
    localPath: rel,
    sha256: await sha256File(p),
    sizeBytes: st.size,
    format: ext,
    width,
    height,
    ...classifyFolder(rel),
    notes,
  });
}

await Bun.write(OUT, JSON.stringify(out, null, 2));
console.log(`Inventoried ${out.length} files → ${OUT}`);
