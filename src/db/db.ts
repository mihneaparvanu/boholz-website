import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDb | undefined;

function createDb(): DrizzleDb {
  // Prefer the runtime Node env so values supplied via Docker `--env-file`
  // (or any other runtime mechanism) win over anything Vite may have inlined
  // from `import.meta.env` at build time. The `import.meta.env` branch is
  // kept as a fallback for environments where `process.env` is not populated
  // (e.g. some build-time loaders).
  const connectionString =
    process.env.DATABASE_URL ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (typeof (import.meta as any).env !== "undefined"
      ? (import.meta as any).env.DATABASE_URL
      : undefined);
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing in environment variables");
  }
  const client = postgres(connectionString, {
    prepare: false,
    connect_timeout: 10,
  });
  return drizzle(client, { schema });
}

// Lazy singleton — no connection is made at build time, only on first request
export const db = new Proxy({} as DrizzleDb, {
  get(_, key: string | symbol) {
    if (!_db) _db = createDb();
    return Reflect.get(_db, key);
  },
});
