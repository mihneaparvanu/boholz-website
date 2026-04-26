/**
 * Seed script for missing house categories.
 * Run with: npx tsx --env-file=.env scripts/seed-categories.ts
 *
 * Uses INSERT ... ON CONFLICT DO NOTHING so it's safe to run multiple times.
 */

import { sql } from "drizzle-orm";
import { db } from "../src/db/db";
import { houseCategories } from "../src/db/schema";

const CATEGORIES = [
  {
    name: "Einfamilienhaus",
    slug: "einfamilienhaus",
    description: "Klassische Einfamilienhäuser für die ganze Familie.",
  },
  {
    name: "Bungalow",
    slug: "bungalow",
    description: "Barrierefreie Bungalows auf einer Ebene.",
  },
  {
    name: "Doppelhaus",
    slug: "doppelhaus",
    description: "Doppelhäuser – zwei Einheiten unter einem Dach.",
  },
  {
    name: "Mehrfamilienhaus",
    slug: "mehrfamilienhaus",
    description: "Mehrfamilienhäuser für mehrere Parteien.",
  },
];

async function main() {
  console.log("Seeding categories...");

  for (const category of CATEGORIES) {
    await db
      .insert(houseCategories)
      .values(category)
      .onConflictDoNothing();

    console.log(`  ✓ ${category.name} (${category.slug})`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
