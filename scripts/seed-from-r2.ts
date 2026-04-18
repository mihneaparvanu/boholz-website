import { execSync } from "child_process";
import { eq, like } from "drizzle-orm";
import { db } from "../src/db/db";
import {
  houseModels,
  houseCategories,
  media,
  modelMedia,
  categoryMedia,
} from "../src/db/schema";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

async function run() {
  console.log("☁️ Fetching images directly from Cloudflare R2...");
  let output = "";

  try {
    // Run the AWS CLI command to list all objects recursively
    // We assume you have the AWS CLI configured or environment variables set
    const endpoint =
      "https://294d3965b7100cc2d62ccf8cd24c588a.r2.cloudflarestorage.com";
    output = execSync(
      `aws s3 ls s3://boholz --recursive --endpoint-url ${endpoint}`,
      { encoding: "utf-8" },
    );
  } catch (error) {
    console.error(
      "❌ Failed to fetch from R2. Make sure your AWS CLI is configured or AWS_ACCESS_KEY_ID is in your .env!",
    );
    process.exit(1);
  }

  // Parse the output (Example line: "2026-04-17 12:00:00  12345 images/models/duplex/28-299/duplex-hero.jpg")
  const lines = output.trim().split("\n");
  const s3Keys = lines
    .map((line) => {
      const match = line.match(
        /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+\d+\s+(.*)/,
      );
      return match ? match[1] : null;
    })
    .filter(Boolean) as string[];

  console.log(`Found ${s3Keys.length} files in R2 bucket.`);

  // Filter only images (jpg, png, webp, etc.)
  const imageKeys = s3Keys.filter((key) => /\.(jpg|jpeg|png|webp)$/i.test(key));

  console.log(`Validating ${imageKeys.length} images for the database...`);

  // Clear existing images to avoid duplicates? (Uncomment if needed)
  // await db.delete(modelMedia);
  // await db.delete(media);
  // console.log("Cleared old images from DB.");

  for (const key of imageKeys) {
    // Reconstruct the path as it will be accessed via the media utility
    const url = `/${key}`;
    const file = key.toLowerCase();

    // Determine flags based on filename
    const isHero = file.includes("hero");
    const isThumbnail = file.includes("thumb") || file.includes("selector");

    // Extract slug (assuming structure: images/models/<category>/<model_slug>/...)
    const parts = key.split("/");
    const modelSlugIndex = parts.indexOf("models") + 2;

    if (modelSlugIndex < 2 || modelSlugIndex >= parts.length) {
      console.log(`⏭️ Skipping ${key} (Does not look like a model image)`);
      continue;
    }

    const modelSlug = parts[modelSlugIndex];

    const [model] = await db
      .select({ id: houseModels.id })
      .from(houseModels)
      .where(like(houseModels.slug, `%${modelSlug}%`))
      .limit(1);

    if (model) {
      // Check if media already exists to avoid duplicates
      const [existingMedia] = await db
        .select()
        .from(media)
        .where(eq(media.path, url))
        .limit(1);

      if (!existingMedia) {
        // 1. Insert into Central Media
        const [insertedMedia] = await db
          .insert(media)
          .values({
            path: url,
          })
          .returning({ id: media.id });

        // 2. Link via Pivot Table
        await db.insert(modelMedia).values({
          modelId: model.id,
          mediaId: insertedMedia.id,
          isHero: isHero,
          isThumbnail: isThumbnail,
          sortOrder: 0,
        });
        console.log(`✅ Linked ${key} to model ${modelSlug}`);
      } else {
        console.log(`🔄 Image already exists in DB: ${key}`);
      }
    } else {
      console.log(
        `⚠️ Model not found in DB for slug: ${modelSlug} (File: ${key})`,
      );
    }
  }

  console.log("🎉 R2 Sync to Database complete!");

  // -------------------------------------------------------------------------
  // CATEGORY THUMBNAILS
  // R2 dirs use English slugs; DB categories use German slugs.
  // -------------------------------------------------------------------------
  const categoryThumbMap: Record<string, string> = {
    bungalow: "bungalow",
    "city-villa": "stadtvilla",
    "cube-house": "kubus",
    "multi-generational": "generationenhaus",
    "single-family": "einfamilienhaus",
  };

  console.log("\n🖼️  Seeding category thumbnails...");

  for (const [r2Dir, dbSlug] of Object.entries(categoryThumbMap)) {
    const key = `images/models/${r2Dir}/${r2Dir}-thumb.jpg`;
    const url = `/${key}`;

    const [category] = await db
      .select({ id: houseCategories.id })
      .from(houseCategories)
      .where(eq(houseCategories.slug, dbSlug))
      .limit(1);

    if (!category) {
      console.log(`⚠️ Category not found in DB for slug: ${dbSlug}`);
      continue;
    }

    // Idempotent: skip if already seeded
    const [existing] = await db
      .select()
      .from(media)
      .where(eq(media.path, url))
      .limit(1);

    if (existing) {
      console.log(`🔄 Already seeded: ${key}`);
      continue;
    }

    const [inserted] = await db
      .insert(media)
      .values({ path: url })
      .returning({ id: media.id });

    await db.insert(categoryMedia).values({
      categoryId: category.id,
      mediaId: inserted.id,
      isThumbnail: true,
      isHero: false,
      sortOrder: 0,
    });

    console.log(`✅ Linked ${key} → category "${dbSlug}"`);
  }

  console.log("🎉 Category thumbnails done!");

  // -------------------------------------------------------------------------
  // CATEGORY HEROES
  // Explicit map of known hero files at category root level.
  // -------------------------------------------------------------------------
  const categoryHeroMap: { r2Key: string; dbSlug: string }[] = [
    {
      r2Key: "images/models/bungalow/bungalow-hero-1.webp",
      dbSlug: "bungalow",
    },
    {
      r2Key: "images/models/single-family/single-family-hero-1.webp",
      dbSlug: "einfamilienhaus",
    },
  ];

  console.log("\n🦸  Seeding category heroes...");

  for (const { r2Key, dbSlug } of categoryHeroMap) {
    const url = `/${r2Key}`;

    const [category] = await db
      .select({ id: houseCategories.id })
      .from(houseCategories)
      .where(eq(houseCategories.slug, dbSlug))
      .limit(1);

    if (!category) {
      console.log(`⚠️ Category not found in DB for slug: ${dbSlug}`);
      continue;
    }

    const [existing] = await db
      .select()
      .from(media)
      .where(eq(media.path, url))
      .limit(1);

    if (existing) {
      console.log(`🔄 Already seeded: ${r2Key}`);
      continue;
    }

    const [inserted] = await db
      .insert(media)
      .values({ path: url })
      .returning({ id: media.id });

    await db.insert(categoryMedia).values({
      categoryId: category.id,
      mediaId: inserted.id,
      isThumbnail: false,
      isHero: true,
      sortOrder: 0,
    });

    console.log(`✅ Linked ${r2Key} → category "${dbSlug}" (hero)`);
  }

  console.log("🎉 Category heroes done!");
  process.exit(0);
}

run().catch(console.error);
