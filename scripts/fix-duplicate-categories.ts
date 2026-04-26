/**
 * Removes duplicate house_categories rows that have no associated media.
 * Keeps the row with media (original); deletes the new ones inserted by seed-categories.ts.
 */
import { db } from "../src/db/db";
import { sql } from "drizzle-orm";

type DupeRow = { slug: string; count: string; ids: string[] };
type MediaRow = { category_id: string };

async function main() {
  const dupeResult = await db.execute(sql`
    SELECT slug, COUNT(*)::text as count, array_agg(id::text ORDER BY id) as ids
    FROM boholz.house_categories
    GROUP BY slug
    HAVING COUNT(*) > 1
  `);

  const dupes: DupeRow[] = Array.isArray(dupeResult)
    ? (dupeResult as unknown as DupeRow[])
    : ((dupeResult as any).rows as DupeRow[]) ?? [];

  if (dupes.length === 0) {
    console.log("No duplicate categories found.");
    process.exit(0);
  }

  console.log(`Found ${dupes.length} duplicated slug(s):`);

  for (const row of dupes) {
    console.log(`  "${row.slug}": ${row.ids.length} rows → ${row.ids.join(", ")}`);

    const mediaResult = await db.execute(sql`
      SELECT DISTINCT category_id::text
      FROM boholz.category_media
      WHERE category_id::text = ANY(ARRAY[${sql.raw(row.ids.map((id) => `'${id}'`).join(","))}])
    `);

    const mediaRows: MediaRow[] = Array.isArray(mediaResult)
      ? (mediaResult as unknown as MediaRow[])
      : ((mediaResult as any).rows as MediaRow[]) ?? [];

    const idsWithMedia = new Set(mediaRows.map((r) => r.category_id));
    const toDelete = row.ids.filter((id) => !idsWithMedia.has(id));

    // If none have media, keep first
    if (toDelete.length === row.ids.length) {
      toDelete.splice(0, 1);
    }

    if (toDelete.length === 0) {
      console.log(`    → skipping (all rows have media, manual review needed)`);
      continue;
    }

    await db.execute(sql`
      DELETE FROM boholz.house_categories
      WHERE id::text = ANY(ARRAY[${sql.raw(toDelete.map((id) => `'${id}'`).join(","))}])
    `);
    console.log(`    → deleted ${toDelete.length} duplicate(s)`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
