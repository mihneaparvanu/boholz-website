import { db } from "../src/db/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("🏗️ Migrating schema to the new Media architecture...");
  try {
    const rawSql = `
      -- 1. Create Media Single Source of Truth
      CREATE TABLE IF NOT EXISTS boholz.media (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        path text NOT NULL,
        alt text,
        width integer,
        height integer,
        created_at timestamp with time zone DEFAULT now()
      );

      -- 2. Rename old tables & fix references (houseImages -> modelMedia)
      ALTER TABLE boholz.house_images RENAME TO model_media;
      
      -- Replace url column with media_id
      ALTER TABLE boholz.model_media ADD COLUMN IF NOT EXISTS media_id uuid REFERENCES boholz.media(id);
      
      -- Instead of full migration, since you probably haven't seeded prod data,
      -- we can safely recreate the pivot structure for a clean state:
      DROP TABLE IF EXISTS boholz.model_media CASCADE;
      DROP TABLE IF EXISTS boholz.house_floor CASCADE;
      DROP TABLE IF EXISTS boholz.category_media CASCADE;
      DROP TABLE IF EXISTS boholz.agent_media CASCADE;

      -- Create House Media Pivot
      CREATE TABLE boholz.model_media (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        model_id uuid REFERENCES boholz.house_models(id) NOT NULL,
        media_id uuid REFERENCES boholz.media(id) NOT NULL,
        is_hero boolean DEFAULT false,
        is_thumbnail boolean DEFAULT false,
        sort_order integer DEFAULT 0
      );

      -- Create Category Media Pivot
      CREATE TABLE boholz.category_media (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id uuid REFERENCES boholz.house_categories(id) NOT NULL,
        media_id uuid REFERENCES boholz.media(id) NOT NULL,
        is_hero boolean DEFAULT false,
        is_thumbnail boolean DEFAULT false,
        sort_order integer DEFAULT 0
      );

      -- Create Floor Media Pivot
      CREATE TABLE boholz.floor_media (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        model_id uuid REFERENCES boholz.house_models(id),
        media_id uuid REFERENCES boholz.media(id) NOT NULL,
        title varchar,
        sort_order smallint
      );

      -- Create Agent Media Pivot
      CREATE TABLE boholz.agent_media (
        agent_id uuid REFERENCES boholz.agents(id) NOT NULL,
        media_id uuid REFERENCES boholz.media(id) NOT NULL,
        label varchar,
        sort_order integer DEFAULT 0
      );
    `;
    await db.execute(sql.raw(rawSql));
    console.log("✅ Schema migrated successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
  process.exit();
}
run();
