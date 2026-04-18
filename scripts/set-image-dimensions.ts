import { eq, isNull, or } from "drizzle-orm";
import probe from "probe-image-size";
import dotenv from "dotenv";
import { db } from "../src/db/db";
import { media } from "../src/db/schema";

dotenv.config();

const BASE_URL = process.env.PUBLIC_ASSETS_URL;

if (!BASE_URL) {
  throw new Error("PUBLIC_ASSETS_URL is missing in .env");
}

async function run() {
  // Only fetch rows that are missing dimensions
  const rows = await db
    .select()
    .from(media)
    .where(or(isNull(media.width), isNull(media.height)));

  console.log(`Found ${rows.length} media rows missing dimensions.`);

  let updated = 0;
  let failed = 0;

  for (const row of rows) {
    const url = `${BASE_URL}/${row.path.replace(/^\//, "")}`;

    try {
      const result = await probe(url);

      await db
        .update(media)
        .set({ width: result.width, height: result.height })
        .where(eq(media.id, row.id));

      updated++;
      console.log(`✅ ${row.path} → ${result.width}×${result.height}`);
    } catch (err: any) {
      failed++;
      console.error(`❌ ${row.path}: ${err.message}`);
    }
  }

  console.log(`\nDone. Updated: ${updated}, Failed: ${failed}`);
  process.exit(0);
}

run();
