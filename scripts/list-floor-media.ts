import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { floorMedia, media, houseModels } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
const db = drizzle(sql);
const rows = await db
  .select({ code: houseModels.modelCode, path: media.path, title: floorMedia.title })
  .from(floorMedia)
  .innerJoin(media, eq(floorMedia.mediaId, media.id))
  .innerJoin(houseModels, eq(floorMedia.modelId, houseModels.id))
  .orderBy(houseModels.modelCode);
console.log("Total:", rows.length);
rows.forEach((r) => console.log(r.code, "|", r.title, "|", r.path));
await sql.end();
