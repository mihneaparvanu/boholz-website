import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "../src/db/db";
import {
  houseModels,
  modelMedia,
  houseCategories,
  categoryMedia,
  media,
} from "../src/db/schema";

async function run() {
  console.log("🌱 Starting Manifest Seeder...");

  // 1. Read the manifest
  const manifestPath = path.resolve(process.cwd(), "public/manifest.json");
  const manifestRaw = fs.readFileSync(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestRaw);

  const images = manifest.models || [];
  console.log(`Found ${images.length} model images in manifest.`);

  // 2. Loop through every image in the manifest
  for (const img of images) {
    const url = img.path; // e.g., /images/models/duplex/28-299/duplex-hero.jpg
    const file = img.file.toLowerCase();

    // Determine flags based on filename conventions
    const isHero = file.includes("hero");
    const isThumbnail = file.includes("thumb") || file.includes("selector");

    // Extract the slug or code from the URL
    const parts = url.split("/");
    if (parts.length < 5) continue;

    const categorySlug = parts[3];
    const modelSlug = parts[4];

    // 3. Find the matching model in the database
    const [model] = await db
      .select({ id: houseModels.id })
      .from(houseModels)
      .where(eq(houseModels.slug, modelSlug))
      .limit(1);

    if (model) {
      // 4. Insert into the Central Media table FIRST!
      const [insertedMedia] = await db
        .insert(media)
        .values({
          path: url,
        })
        .returning({ id: media.id });

      // 5. Connect it via the Pivot Table
      await db.insert(modelMedia).values({
        modelId: model.id,
        mediaId: insertedMedia.id,
        isHero: isHero,
        isThumbnail: isThumbnail,
        sortOrder: 0,
      });
      console.log(`✅ Linked ${file} to model ${modelSlug}`);
    } else {
      console.log(`⚠️ Model not found in DB for slug: ${modelSlug}`);
    }
  }

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

run().catch(console.error);
