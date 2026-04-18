import { db } from "../src/db/db";
import { media, modelMedia, houseModels } from "../src/db/schema";
import { sql } from "drizzle-orm";

async function run() {
  console.log("🔍 Checking Database...");
  
  try {
    const mediaCount = await db.select({ count: sql<number>`count(*)` }).from(media);
    const pivotCount = await db.select({ count: sql<number>`count(*)` }).from(modelMedia);

    console.log(`\n📊 DB Stats:`);
    console.log(`- Media rows (SSOT): ${mediaCount[0].count}`);
    console.log(`- Model Media links (Pivot): ${pivotCount[0].count}`);

    if (mediaCount[0].count > 0) {
      console.log("\n👀 Sample of the newly inserted data:");
      
      const sample = await db.query.modelMedia.findMany({
        limit: 3,
        with: {
          model: { columns: { slug: true, title: true } },
          media: { columns: { path: true } }
        }
      });

      sample.forEach(row => {
        console.log(`Model: ${row.model.title} (${row.model.slug})`);
        console.log(` └─ Path: ${row.media.path}`);
        console.log(` └─ Flags: isHero=${row.isHero}, isThumbnail=${row.isThumbnail}\n`);
      });
    } else {
      console.log("⚠️ No media found. Did the AWS command return files?");
    }
  } catch (error) {
    console.error("❌ Error querying the DB:", error);
  }
  process.exit(0);
}

run();
