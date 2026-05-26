// Differentiate floor_media titles that collide within the same model.
// Heuristics from the filename:
//   - "3d-{N}-xxl"          → "3D Ansicht {N}"
//   - "alternativ|alternative" in name → suffix " (Alternative)"
//   - "flachdach"           → suffix " (Flachdach)"
//   - otherwise keep existing title
// After heuristic pass: if duplicates still remain within a model, append
// numeric suffix " (2)", " (3)" to disambiguate.

import { sql } from 'drizzle-orm';

import { db } from '../../src/db/db';

const DRY_RUN = process.env.DRY === "1";

type Row = {
  id: string;
  model_id: string;
  title: string;
  path: string;
  sort_order: number;
};

const rows = (await db.execute(sql`
  SELECT fm.id, fm.model_id, fm.title, fm.sort_order, m.path
  FROM boholz.floor_media fm
  JOIN boholz.media m ON m.id = fm.media_id
  ORDER BY fm.model_id, fm.sort_order
`)) as unknown as Row[];

function addQualifier(current: string, qualifier: string): string {
  // If the base already ends with a "(…)" group, merge: "Erdgeschoss (mit ELW)" + "Alternative" → "Erdgeschoss (mit ELW, Alternative)"
  // Otherwise wrap: "Erdgeschoss" + "Flachdach" → "Erdgeschoss (Flachdach)"
  const m = current.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (m && !m[2].toLowerCase().includes(qualifier.toLowerCase())) {
    return `${m[1].trim()} (${m[2]}, ${qualifier})`;
  }
  if (!m) return `${current} (${qualifier})`;
  return current; // qualifier already inside
}

function retitle(current: string, path: string): string {
  const file = path.split("/").pop()!.toLowerCase();
  const m3d = file.match(/3d-(\d)-xxl/);
  if (m3d) return `3D Ansicht ${m3d[1]}`;
  if (file.includes("flachdach")) return addQualifier(current, "Flachdach");
  if (/alternativ(?:e)?/.test(file)) return addQualifier(current, "Alternative");
  return current;
}

// Pass 1: apply heuristic retitle
const updates: { id: string; oldTitle: string; newTitle: string; path: string }[] = [];
const byModel = new Map<string, Row[]>();
for (const r of rows) {
  const newTitle = retitle(r.title, r.path);
  if (newTitle !== r.title) {
    updates.push({ id: r.id, oldTitle: r.title, newTitle, path: r.path });
  }
  // Stage the post-retitle title for the dupe-resolution pass
  r.title = newTitle;
  if (!byModel.has(r.model_id)) byModel.set(r.model_id, []);
  byModel.get(r.model_id)!.push(r);
}

// Pass 2: within each model, if titles still collide, append " (2)", " (3)", ...
for (const [, modelRows] of byModel) {
  const seen = new Map<string, number>();
  for (const r of modelRows.sort((a, b) => a.sort_order - b.sort_order)) {
    const count = (seen.get(r.title) ?? 0) + 1;
    seen.set(r.title, count);
    if (count > 1) {
      const newTitle = `${r.title} (${count})`;
      const existing = updates.find((u) => u.id === r.id);
      if (existing) existing.newTitle = newTitle;
      else updates.push({ id: r.id, oldTitle: r.title, newTitle, path: r.path });
      r.title = newTitle;
    }
  }
}

console.log(`Floor plans inspected: ${rows.length}`);
console.log(`Retitle updates: ${updates.length}`);
console.log();
for (const u of updates) {
  console.log(`  "${u.oldTitle.padEnd(28)}" → "${u.newTitle}"`);
  console.log(`     ${u.path.split("/").pop()}`);
}

if (DRY_RUN) {
  console.log("\nDRY RUN — set DRY=0 to apply.");
  process.exit(0);
}

if (updates.length === 0) {
  console.log("\nNothing to update.");
  process.exit(0);
}

await db.transaction(async (tx) => {
  for (const u of updates) {
    await tx.execute(sql`UPDATE boholz.floor_media SET title = ${u.newTitle} WHERE id = ${u.id}`);
  }
});
console.log("\nCommitted.");
