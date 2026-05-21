// Joins inventory.json + db-state.json to produce a draft mapping
// folder/file → canonical R2 key. Tries number permutations because
// folder codes are sometimes reversed (BU/GH) vs DB modelCode.

import inventory from "../../dev/asset-audit/inventory.json";
import db from "../../dev/asset-audit/db-state.json";
import { basename, extname } from "node:path";

type Inv = (typeof inventory)[number];
type DBModel = (typeof db.models)[number];

type Draft = Inv & {
  proposedR2Key: string | null;
  matchedModelSlug: string | null;
  matchedCategorySlug: string | null;
  confidence: "high" | "medium" | "low" | "needs-review";
  reviewReason: string | null;
  skip: boolean;
};

const NON_IMAGE_FORMATS = new Set(["pdf", "psd", "vpl"]);

// Folder-name overrides for typos / known mislabels.
// Key = exact folder basename in dump; value = DB modelCode it should map to.
const FOLDER_CODE_OVERRIDES: Record<string, string> = {
  "EFH 38-146-150": "35-146-150",   // folder typo'd; filenames + DB confirm 35
};

// Variant subfolder detection — these get folded into the base model as
// floor-plan additions with a variant tag baked into the filename slug.
function detectVariant(subFolder: string): { variantSlug: string; baseCodeMatch: string | null } | null {
  const re = /(\d{1,3}-\d{1,3}(?:-\d{1,3})?)\s*(?:\(([^)]+)\)|\s+([A-Za-zÄÖÜäöüß]+))/;
  const m = subFolder.match(re);
  if (!m) return null;
  const variantRaw = (m[2] ?? m[3] ?? "").trim();
  if (!variantRaw) return null;
  return {
    variantSlug: slugify(variantRaw),
    baseCodeMatch: m[1],
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ü/g, "ue").replace(/ö/g, "oe").replace(/ä/g, "ae").replace(/ß/g, "ss")
    .replace(/´/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[()]/g, "")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Build lookup: every modelCode in DB → model+category
const modelByCode = new Map<string, { model: DBModel; categorySlug: string }>();
// Also a title-based lookup so Bestseller folders (named after model titles) match
const modelByTitleFragment = new Map<string, { model: DBModel; categorySlug: string }>();
for (const m of db.models) {
  const cat = db.categories.find((c) => c.id === m.categoryId);
  if (!cat) continue;
  modelByCode.set(m.modelCode, { model: m, categorySlug: cat.slug });
  // Bestseller-titled models: "Bestseller Family 150" → key "family 150"
  const lcTitle = m.title.toLowerCase();
  if (lcTitle.startsWith("bestseller ")) {
    const frag = lcTitle.replace(/^bestseller\s+/, "").trim();
    modelByTitleFragment.set(frag, { model: m, categorySlug: cat.slug });
  }
}

// Try permutations of a code (numbers split by "-") to find a DB match.
// Strips trailing "0"/"000" segments (folders use "-0", DB uses "" or "-000").
function findModelByCodeFuzzy(rawCode: string): { model: DBModel; categorySlug: string } | null {
  const numbers = rawCode.split("-").filter((s) => /^\d+$/.test(s));
  if (numbers.length === 0) return null;

  const candidates = new Set<string>();
  // direct
  candidates.add(numbers.join("-"));
  // drop trailing zeros
  let trimmed = [...numbers];
  while (trimmed.length > 1 && /^0+$/.test(trimmed[trimmed.length - 1])) trimmed.pop();
  candidates.add(trimmed.join("-"));
  // first-two swap, full
  if (numbers.length >= 2) {
    candidates.add([numbers[1], numbers[0], ...numbers.slice(2)].join("-"));
  }
  // first-two swap, trimmed
  if (trimmed.length >= 2) {
    candidates.add([trimmed[1], trimmed[0], ...trimmed.slice(2)].join("-"));
  }

  for (const c of candidates) {
    if (modelByCode.has(c)) return modelByCode.get(c)!;
  }
  return null;
}

const drafts: Draft[] = inventory.map((inv) => {
  const segs = inv.localPath.split("/");
  const catFolder = segs[2] ?? "";
  const subFolder = segs[3] ?? "";
  const fileName = basename(inv.localPath, extname(inv.localPath));

  let proposedR2Key: string | null = null;
  let matchedModelSlug: string | null = null;
  let matchedCategorySlug: string | null = null;
  let confidence: Draft["confidence"] = "needs-review";
  let reviewReason: string | null = null;
  let skip = false;

  // Skip non-image source files
  if (NON_IMAGE_FORMATS.has(inv.format)) {
    skip = true;
    reviewReason = `Non-image source format (${inv.format}); not synced to R2`;
    return { ...inv, proposedR2Key, matchedModelSlug, matchedCategorySlug, confidence: "high", reviewReason, skip };
  }

  // Stock photos
  if (inv.suspectedType === "stock") {
    proposedR2Key = `images/stock/lifestyle/${slugify(fileName)}.webp`;
    confidence = "high";
    return { ...inv, proposedR2Key, matchedModelSlug, matchedCategorySlug, confidence, reviewReason, skip };
  }

  // "Bilder für Slider" folders — category-level stock-y slider images
  if (subFolder.toLowerCase().includes("slider")) {
    // Treat these as category-level lifestyle/stock — they aren't model-specific
    const cleanCat = slugify(catFolder);
    proposedR2Key = `images/stock/${cleanCat}-slider/${slugify(fileName)}.webp`;
    confidence = "medium";
    reviewReason = "'Bilder für Slider' folder — category-wide lifestyle photo, not model-specific";
    return { ...inv, proposedR2Key, matchedModelSlug, matchedCategorySlug, confidence, reviewReason, skip };
  }

  // Folder-override for typos
  let numericCode: string | null = null;
  if (FOLDER_CODE_OVERRIDES[subFolder]) {
    numericCode = FOLDER_CODE_OVERRIDES[subFolder];
  } else {
    numericCode = (subFolder.match(/(\d{1,3}(?:-\d{1,3}){1,2})/) ?? [])[1] ?? null;
  }

  // Variant detection: ELW/Flachdach/Walmdach folders get folded into base model floor-plans
  const variant = detectVariant(subFolder);
  const isVariantFolder = !!variant && /^(elw|flachdach|walmdach|pultdach|sattel|elwexpos)/i.test(variant.variantSlug);

  if (numericCode) {
    const match = findModelByCodeFuzzy(numericCode);
    if (match) {
      matchedModelSlug = match.model.slug;
      matchedCategorySlug = match.categorySlug;

      let typeFolder: string;
      if (isVariantFolder) {
        // Variants always go to floor-plans of the base model
        typeFolder = "floor-plans";
      } else {
        switch (inv.suspectedType) {
          case "floorplan": typeFolder = "floor-plans"; break;
          case "hero": typeFolder = "hero"; break;
          case "slider": typeFolder = "slider"; break;
          case "gallery":
          default: typeFolder = "gallery"; break;
        }
      }

      const typeSingular = typeFolder.replace(/s$/, "").replace(/-plans?$/, "-plan");
      const cleanName = slugify(fileName) || "image";
      const variantTag = isVariantFolder && variant ? `${variant.variantSlug}-` : "";
      proposedR2Key = `images/models/${match.categorySlug}/${match.model.modelCode}/${typeFolder}/${match.categorySlug}-${match.model.modelCode}-${typeSingular}-${variantTag}${cleanName}.webp`;
      confidence = "high";
    } else {
      // No DB match → staging-review (no DB writes, but still upload to R2)
      const cleanFolder = slugify(`${catFolder}-${subFolder}`);
      let typeFolder: string;
      switch (inv.suspectedType) {
        case "floorplan": typeFolder = "floor-plans"; break;
        case "hero": typeFolder = "hero"; break;
        case "slider": typeFolder = "slider"; break;
        case "gallery":
        default: typeFolder = "gallery"; break;
      }
      const cleanName = slugify(fileName) || "image";
      proposedR2Key = `images/staging-review/${cleanFolder}/${typeFolder}/${cleanName}.webp`;
      confidence = "medium";
      reviewReason = `Folder code "${numericCode}" not in DB; uploaded to staging-review for visual triage`;
    }
  } else if (catFolder === "Bestseller" && subFolder) {
    // Bestseller subfolders match the title-fragment of an isFeatured model
    const fragment = subFolder.toLowerCase().trim();
    const match = modelByTitleFragment.get(fragment);
    if (match) {
      matchedModelSlug = match.model.slug;
      matchedCategorySlug = match.categorySlug;
      let typeFolder: string;
      switch (inv.suspectedType) {
        case "floorplan": typeFolder = "floor-plans"; break;
        case "hero": typeFolder = "hero"; break;
        case "slider": typeFolder = "slider"; break;
        case "gallery":
        default: typeFolder = "gallery"; break;
      }
      const cleanName = slugify(fileName) || "image";
      proposedR2Key = `images/models/${match.categorySlug}/${match.model.modelCode}/${typeFolder}/${match.categorySlug}-${match.model.modelCode}-${typeFolder.replace(/s$/, "")}-${cleanName}.webp`;
      confidence = "high";
    } else {
      confidence = "needs-review";
      reviewReason = `Bestseller product line "${subFolder}" — no DB model with title containing "${subFolder}"`;
    }
  } else if (catFolder === "Mehrfamilienhaus" || catFolder.startsWith("Zweifamilienh")) {
    // Categories not in DB → staging-review
    const cleanFolder = slugify(`${catFolder}-${subFolder || fileName}`);
    proposedR2Key = `images/staging-review/${cleanFolder}/${slugify(fileName)}.webp`;
    confidence = "medium";
    reviewReason = `Category "${catFolder}" not in DB; uploaded to staging-review for triage`;
  } else {
    confidence = "needs-review";
    reviewReason = `No house code parseable from "${subFolder || catFolder}"`;
  }

  return { ...inv, proposedR2Key, matchedModelSlug, matchedCategorySlug, confidence, reviewReason, skip };
});

// === Dedup pass: collapse duplicate r2Keys to a single source ===
// Pick the highest-quality source per key; mark the rest skip=true.
const FORMAT_PRIORITY: Record<string, number> = {
  tif: 5, tiff: 5, png: 4, jpeg: 2, jpg: 2, webp: 1,
};
function sourceScore(d: Draft): number {
  const fmt = FORMAT_PRIORITY[d.format] ?? 0;
  const area = (d.width ?? 0) * (d.height ?? 0);
  // Prefer: highest area > format-priority > largest size
  return area * 10 + fmt * 1e8 + d.sizeBytes / 1e6;
}

const byKey = new Map<string, Draft[]>();
for (const d of drafts) {
  if (d.skip || !d.proposedR2Key) continue;
  if (!byKey.has(d.proposedR2Key)) byKey.set(d.proposedR2Key, []);
  byKey.get(d.proposedR2Key)!.push(d);
}
let dedupCount = 0;
for (const [, group] of byKey) {
  if (group.length < 2) continue;
  const sorted = [...group].sort((a, b) => sourceScore(b) - sourceScore(a));
  const winner = sorted[0];
  for (const loser of sorted.slice(1)) {
    loser.skip = true;
    loser.reviewReason = `Duplicate of ${winner.localPath} (kept that one for better quality)`;
    dedupCount++;
  }
}

await Bun.write("dev/asset-audit/mapping-draft.json", JSON.stringify(drafts, null, 2));

const counts = drafts.reduce(
  (acc, d) => {
    const key = d.skip ? "skip" : d.confidence;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);
console.log("Breakdown:", counts);
console.log(`Deduped: ${dedupCount} entries marked skip as duplicates`);
console.log("\nNeeds-review folders (unique):");
const reviewSet = new Set<string>();
for (const d of drafts.filter((d) => !d.skip && d.confidence !== "high")) {
  const folder = d.localPath.split("/").slice(0, 4).join("/");
  reviewSet.add(`${folder} — ${d.reviewReason}`);
}
for (const s of [...reviewSet].sort()) console.log("  " + s);
