// Parse existing floor_media titles, populate the new `variant` column,
// strip the parenthetical suffix from the title.
//
// Examples:
//   "Erdgeschoss"                       → title="Erdgeschoss",  variant=null
//   "Erdgeschoss (Alternative)"         → title="Erdgeschoss",  variant="alternative"
//   "Erdgeschoss (Flachdach)"           → title="Erdgeschoss",  variant="flachdach"
//   "Erdgeschoss (mit ELW)"             → title="Erdgeschoss",  variant="elw"
//   "Erdgeschoss (mit ELW, Alternative)"→ title="Erdgeschoss",  variant="elw_alternative"
//   "Grundriss (Flachdach)"             → title="Grundriss",    variant="flachdach"

import { db } from "../../src/db/db";
import { sql } from "drizzle-orm";

const DRY_RUN = process.env.DRY === "1";

function parseTitle(title: string): { newTitle: string; variant: string | null } {
  // No parens → default variant
  const m = title.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!m) return { newTitle: title.trim(), variant: null };

  const base = m[1].trim();
  const tag = m[2].trim().toLowerCase();
  let variant: string;
  if (tag === "alternative") variant = "alternative";
  else if (tag === "flachdach") variant = "flachdach";
  else if (tag === "mit elw") variant = "elw";
  else if (tag === "mit elw, alternative") variant = "elw_alternative";
  else {
    console.warn(`  unmapped parens "(${tag})" on title "${title}" — keeping as-is`);
    return { newTitle: title.trim(), variant: null };
  }
  return { newTitle: base, variant };
}

const rows = (await db.execute(sql`SELECT id, title FROM boholz.floor_media`)) as unknown as Array<{ id: string; title: string }>;

const updates: { id: string; oldTitle: string; newTitle: string; variant: string | null }[] = [];
for (const r of rows) {
  const parsed = parseTitle(r.title);
  if (parsed.newTitle !== r.title || parsed.variant !== null) {
    updates.push({ id: r.id, oldTitle: r.title, newTitle: parsed.newTitle, variant: parsed.variant });
  }
}

console.log(`Total floor_media: ${rows.length}`);
console.log(`Updates: ${updates.length}`);
console.log();
const byVariant = new Map<string | null, number>();
for (const u of updates) byVariant.set(u.variant, (byVariant.get(u.variant) ?? 0) + 1);
console.log("Variant breakdown of updates:");
for (const [v, n] of byVariant) console.log(`  ${v ?? "(null)"} : ${n}`);
console.log();
console.log("Sample (first 5):");
for (const u of updates.slice(0, 5)) {
  console.log(`  "${u.oldTitle.padEnd(40)}" → "${u.newTitle}" + variant=${u.variant}`);
}

if (DRY_RUN) {
  console.log("\nDRY RUN — set DRY=0 to apply.");
  process.exit(0);
}

await db.transaction(async (tx) => {
  for (const u of updates) {
    await tx.execute(sql`
      UPDATE boholz.floor_media
      SET title = ${u.newTitle}, variant = ${u.variant}
      WHERE id = ${u.id}
    `);
  }
});

console.log(`\nCommitted. ${updates.length} floor_media rows updated.`);
