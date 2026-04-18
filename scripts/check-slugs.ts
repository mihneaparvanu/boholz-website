import { db } from "../src/db/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    const models = await db.execute(sql`SELECT slug FROM boholz.house_models`);
    console.log("Slugs:", models.map(m => m.slug));
  } catch (e) {
    console.error(e);
  }
  process.exit();
}
run();
