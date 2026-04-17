import { execSync } from "child_process";
import { eq } from "drizzle-orm";
import { db } from "../src/db/db";
import { houseModels, houseImages } from "../src/db/schema";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

async function run() {
  console.log("☁️ Fetching images directly from Cloudflare R2...");
  let output = "";

  try {
    // Run the AWS CLI command to list all objects recursively
    // We assume you have the AWS CLI configured or environment variables set
    const endpoint = "https://294d3965b7100cc2d62ccf8cd24c588a.r2.cloudflarestorage.com";
    output = execSync(`aws s3 ls s3://boholz --recursive --endpoint-url ${endpoint}`, { encoding: "utf-8" });
  } catch (error) {
    console.error("❌ Failed to fetch from R2. Make sure your AWS CLI is configured or AWS_ACCESS_KEY_ID is in your .env!");
    process.exit(1);
  }

  // Parse the output (Example line: "2026-04-17 12:00:00  12345 images/models/duplex/28-299/duplex-hero.jpg")
  const lines = output.trim().split("\n");
  const s3Keys = lines
    .map(line => {
      const match = line.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+\d+\s+(.*)/);
      return match ? match[1] : null;
    })
    .filter(Boolean) as string[];

  console.log(`Found ${s3Keys.length} files in R2 bucket.`);

  // Filter only images (jpg, png, webp, etc.)
  const imageKeys = s3Keys.filter(key => /\.(jpg|jpeg|png|webp)$/i.test(key));
  
  console.log(`Validating ${imageKeys.length} images for the database...`);

  // Clear existing images to avoid duplicates? (Uncomment if needed)
  // await db.delete(houseImages);
  // console.log("Cleared old images from DB.");

  for (const key of imageKeys) {
    // Reconstruct the path as it will be accessed via the media utility
    // The key is likely something like "images/models/duplex/28-299/hero.jpg"
    const url = `/${key}`; 
    const file = key.toLowerCase();

    // Determine flags based on filename
    const isHero = file.includes("hero");
    const isThumbnail = file.includes("thumb") || file.includes("selector");

    // Extract slug (assuming structure: images/models/<category>/<model_slug>/...)
    const parts = key.split("/");
    // Be flexible depending on your folder depth
    const modelSlugIndex = parts.indexOf("models") + 2; 
    
    if (modelSlugIndex < 2 || modelSlugIndex >= parts.length) {
      console.log(`⏭️ Skipping ${key} (Does not look like a model image)`);
      continue;
    }

    const modelSlug = parts[modelSlugIndex];

    const [model] = await db
      .select({ id: houseModels.id })
      .from(houseModels)
      .where(eq(houseModels.slug, modelSlug))
      .limit(1);

    if (model) {
      // Check if image already exists to avoid duplicates
      const [existing] = await db
        .select()
        .from(houseImages)
        .where(eq(houseImages.url, url))
        .limit(1);

      if (!existing) {
        await db.insert(houseImages).values({
          houseId: model.id,
          url: url,
          isHero: isHero,
          isThumbnail: isThumbnail,
          sortOrder: 0,
        });
        console.log(`✅ Linked ${key} to model ${modelSlug}`);
      } else {
        console.log(`🔄 Image already exists in DB: ${key}`);
      }
    } else {
      console.log(`⚠️ Model not found in DB for slug: ${modelSlug} (File: ${key})`);
    }
  }

  console.log("🎉 R2 Sync to Database complete!");
  process.exit(0);
}

run().catch(console.error);
