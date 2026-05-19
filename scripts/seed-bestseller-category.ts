/**
 * Seed the Bestseller category as a real DB row.
 *
 * Why: until now Bestseller was a virtual category injected client-side
 * (see legacy `BESTSELLER_CATEGORY` in `src/data/loaders.ts`). Promoting
 * it to a real `house_categories` row lets it carry media via the
 * `category_media` pivot like every other category and removes the
 * client-side fallback plumbing.
 *
 * Tagging strategy: this script does NOT remap any model's `categoryId`.
 * The set of "bestseller models" is still defined by
 * `house_models.is_featured = true` — that boolean IS the tag. Filtering
 * for `slug = bestseller` continues to be handled in code by checking
 * `is_featured` instead of `category_id` (see `HousesPage.vue`).
 *
 * The category's thumbnail/hero image is borrowed at seed time from
 * the first featured model that has a hero image (preference: a Family
 * 150 model, matching the prior runtime patch in `hauser.astro`). Swap
 * to a dedicated image later by updating the `category_media` pivot.
 *
 * Idempotent. Safe to re-run.
 *
 * Usage:  bun x tsx scripts/seed-bestseller-category.ts
 */
import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { db } from "../src/db/db";
import {
  houseCategories,
  houseModels,
  modelMedia,
  categoryMedia,
} from "../src/db/schema";
import { BESTSELLER_CATEGORY_ID } from "../src/data/constants";

const BESTSELLER_SLUG = "bestseller";
const BESTSELLER_NAME = "Bestseller";
const BESTSELLER_DESCRIPTION =
  "Die beliebtesten BoHolz-Modelle — meistgewählt von unseren Kunden.";

async function pickBestsellerHeroMediaId(): Promise<string | null> {
  const featured = await db.query.houseModels.findMany({
    where: eq(houseModels.isFeatured, true),
    with: {
      media: {
        with: { media: true },
        orderBy: (modelMedia, { asc }) => [asc(modelMedia.sortOrder)],
      },
    },
  });

  if (featured.length === 0) {
    console.warn(
      "[warn] No featured models found — cannot seed a hero image for the " +
        "Bestseller category. Run again after marking models as featured, " +
        "or upload a dedicated image and link it via category_media manually.",
    );
    return null;
  }

  // Preference: Family 150 (matches prior runtime patch). Fallback: first
  // featured model with a hero pivot. Final fallback: first featured
  // model's first media row.
  const preferred = featured.find(
    (m) => m.title.toLowerCase().includes("family") && m.title.includes("150"),
  );
  const source =
    preferred ??
    featured.find((m) => m.media.some((p) => p.isHero)) ??
    featured[0];

  const heroPivot = source.media.find((p) => p.isHero) ?? source.media[0];
  if (!heroPivot) {
    console.warn(`[warn] Featured model "${source.title}" has no media rows.`);
    return null;
  }
  console.log(
    `Borrowing hero image from "${source.title}" (media ${heroPivot.media.id}).`,
  );
  return heroPivot.media.id;
}

async function main() {
  // 1. Upsert the category row by stable UUID. We use the same UUID that
  //    `src/data/constants.ts#BESTSELLER_CATEGORY_ID` already references so
  //    every existing `id === BESTSELLER_CATEGORY_ID` check (HousesPage,
  //    useCategoryGallery historically) continues to match.
  const existingById = await db.query.houseCategories.findFirst({
    where: eq(houseCategories.id, BESTSELLER_CATEGORY_ID),
  });
  const existingBySlug = await db.query.houseCategories.findFirst({
    where: eq(houseCategories.slug, BESTSELLER_SLUG),
  });

  if (existingBySlug && existingBySlug.id !== BESTSELLER_CATEGORY_ID) {
    console.error(
      `[error] A category with slug "${BESTSELLER_SLUG}" already exists but ` +
        `with id ${existingBySlug.id} (expected ${BESTSELLER_CATEGORY_ID}). ` +
        `Delete it manually, then re-run.`,
    );
    process.exit(1);
  }

  let categoryId: string;
  if (existingById) {
    categoryId = existingById.id;
    console.log(`skip   category ${BESTSELLER_SLUG} (already exists).`);
  } else {
    const [row] = await db
      .insert(houseCategories)
      .values({
        id: BESTSELLER_CATEGORY_ID,
        slug: BESTSELLER_SLUG,
        name: BESTSELLER_NAME,
        description: BESTSELLER_DESCRIPTION,
      })
      .returning();
    categoryId = row.id;
    console.log(`insert category ${BESTSELLER_SLUG} (${row.id}).`);
  }

  // 2. Pivot a media row (the hero/thumbnail) onto the category. Idempotent.
  const existingPivot = await db.query.categoryMedia.findFirst({
    where: eq(categoryMedia.categoryId, categoryId),
  });
  if (existingPivot) {
    console.log("skip   category_media (already linked).");
  } else {
    const mediaId = await pickBestsellerHeroMediaId();
    if (mediaId) {
      await db.insert(categoryMedia).values({
        categoryId,
        mediaId,
        isHero: true,
        isThumbnail: true,
        sortOrder: 0,
      });
      console.log(`insert category_media ${categoryId} → ${mediaId}.`);
    }
  }

  console.log("\nDone.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
