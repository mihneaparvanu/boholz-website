import "dotenv/config";
import postgres from "postgres";

console.log("Connecting to DB...");
const sql = postgres("postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db", { prepare: false });
try {
  const result = await sql`SELECT 1 as test`;
  console.log("Connected successfully:", result);
} catch (err) {
  console.error("Connection error:", err);
} finally {
  await sql.end();
}
