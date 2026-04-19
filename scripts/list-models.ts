import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { houseModels } from '../src/db/schema.ts';

const client = postgres('postgresql://boholz:zuDja2-ciqfys-dikcap@192.168.1.180:5433/boholz-db', { ssl: false });
const db = drizzle(client);
const rows = await db.select({ id: houseModels.id, code: houseModels.modelCode, title: houseModels.title }).from(houseModels);
rows.forEach(r => console.log(`${r.code}  ${r.title}`));
await client.end();
