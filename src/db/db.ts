import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  (typeof process !== "undefined" ? process.env.DATABASE_URL : undefined) ||
  // @ts-ignore
  (import.meta.env ? import.meta.env.DATABASE_URL : undefined);

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

// Disable prepare for serverless or general robust connections
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
