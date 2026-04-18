import { db } from "../src/db/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    const models = await db.execute(sql`SELECT count(*) FROM boholz.house_models`);
    const cats = await db.execute(sql`SELECT count(*) FROM boholz.house_categories`);
    console.log("Models count:", models[0].count);
    console.log("Categories count:", cats[0].count);
  } catch (e) {
    console.error(e);
  }
  process.exit();
}
run();
