import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDb | undefined;

function createDb(): DrizzleDb {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing in environment variables");
  }
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

// Lazy singleton — no connection is made at build time, only on first request
export const db = new Proxy({} as DrizzleDb, {
  get(_, key: string | symbol) {
    if (!_db) _db = createDb();
    return Reflect.get(_db, key);
  },
});
