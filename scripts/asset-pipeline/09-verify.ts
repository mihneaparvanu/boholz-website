// Post-migration verification: counts + sample paths + spot-check a few R2 keys
import { db } from "../../src/db/db";
import { sql } from "drizzle-orm";

const tables = [
  "house_categories",
  "house_models",
  "media",
  "model_media",
  "floor_media",
  "category_media",
  "news_media",
  "location_media",
] as const;

for (const t of tables) {
  const r = await db.execute(sql.raw(`SELECT COUNT(*) AS c FROM boholz.${t}`));
  console.log(`  ${t.padEnd(20)} ${r[0].c}`);
}
console.log();

const newPaths = await db.execute(
  sql`SELECT path FROM boholz.media WHERE path LIKE '/images/models/%' ORDER BY path LIMIT 5`,
);
console.log("Sample new media paths:");
for (const r of newPaths) console.log(`  ${r.path}`);
console.log();

const allPaths = await db.execute(sql`SELECT COUNT(*) c FROM boholz.media WHERE path LIKE '/images/models/%'`);
console.log(`Total /images/models/% rows: ${allPaths[0].c}`);

const oldFmt = await db.execute(
  sql`SELECT path FROM boholz.media WHERE path LIKE '%single-family%' OR path LIKE '%city-villa%' OR path LIKE '%cube-house%' LIMIT 3`,
);
console.log(`Old-format leftover rows (kept by news/loc): ${oldFmt.length}`);
for (const r of oldFmt) console.log(`  ${r.path}`);

process.exit(0);
