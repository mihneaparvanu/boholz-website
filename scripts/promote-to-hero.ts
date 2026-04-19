import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { modelMedia, houseModels } from "../src/db/schema.ts";
import { eq, inArray } from "drizzle-orm";

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);

const models = await db
  .select({ id: houseModels.id, code: houseModels.modelCode })
  .from(houseModels)
  .where(inArray(houseModels.modelCode, ["18-140", "22-149"]));

for (const m of models) {
  const rows = await db.select({ id: modelMedia.id }).from(modelMedia).where(eq(modelMedia.modelId, m.id));
  if (rows.length === 0) { console.log("no images:", m.code); continue; }
  await db.update(modelMedia).set({ isHero: true, isThumbnail: true }).where(eq(modelMedia.modelId, m.id));
  console.log(`promoted ${rows.length} image(s) for ${m.code}`);
}

console.log("Done.");
await sql.end();
