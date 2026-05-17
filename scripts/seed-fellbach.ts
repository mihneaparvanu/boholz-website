/**
 * Seed media for the "Fellbach" showhouse.
 *
 * Idempotent: safe to re-run. Inserts the 11 staged R2 media rows for the
 * fellbach showhouse and links them via `location_media` to the `locations`
 * row (kind = "showhouse", slug = "fellbach").
 *
 * Usage:  bun x tsx scripts/seed-fellbach.ts
 */
import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { db } from "../src/db/db";
import { media, locations, locationMedia } from "../src/db/schema";

type MediaSeed = {
  path: string;
  alt: string;
  width: number;
  height: number;
  role: "hero" | "exterior" | "interior";
  sortOrder: number;
};

const SHOWHOUSE_SLUG = "fellbach";

const MEDIA: MediaSeed[] = [
  {
    path: "/images/showhouses/fellbach/hero.webp",
    alt: "Fellbach showhouse hero",
    width: 1500,
    height: 946,
    role: "hero",
    sortOrder: 0,
  },
  {
    path: "/images/showhouses/fellbach/gallery/exterior-01.webp",
    alt: "Fellbach exterior",
    width: 800,
    height: 585,
    role: "exterior",
    sortOrder: 1,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-02.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 2,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-03.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 3,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-04.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 4,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-05.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 5,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-06.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 6,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-07.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 7,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-08.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 8,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-09.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 600,
    role: "interior",
    sortOrder: 9,
  },
  {
    path: "/images/showhouses/fellbach/gallery/interior-10.webp",
    alt: "Fellbach interior",
    width: 800,
    height: 1067,
    role: "interior",
    sortOrder: 10,
  },
];

async function main() {
  const showhouse = await db.query.locations.findFirst({
    where: eq(locations.slug, SHOWHOUSE_SLUG),
  });
  if (!showhouse) {
    console.error(
      `[error] No "locations" row with slug="${SHOWHOUSE_SLUG}". Aborting — ` +
        `seed the locations row first.`,
    );
    process.exit(1);
  }
  if (showhouse.kind !== "showhouse") {
    console.warn(
      `[warn] Location "${SHOWHOUSE_SLUG}" exists but kind="${showhouse.kind}" ` +
        `(expected "showhouse").`,
    );
  }
  console.log(`Found showhouse: ${showhouse.title} (${showhouse.id})`);

  let insertedMedia = 0;
  let skippedMedia = 0;
  let linkedPivots = 0;
  let skippedPivots = 0;

  for (const m of MEDIA) {
    let mediaRow = await db.query.media.findFirst({
      where: eq(media.path, m.path),
    });
    if (mediaRow) {
      skippedMedia += 1;
      console.log(`  skip   media ${m.path}`);
    } else {
      const [row] = await db
        .insert(media)
        .values({ path: m.path, alt: m.alt, width: m.width, height: m.height })
        .returning();
      mediaRow = row;
      insertedMedia += 1;
      console.log(`  insert media ${m.path}  (${m.role})`);
    }

    const existingPivot = await db.query.locationMedia.findFirst({
      where: and(
        eq(locationMedia.locationId, showhouse.id),
        eq(locationMedia.mediaId, mediaRow.id),
      ),
    });
    if (existingPivot) {
      skippedPivots += 1;
      continue;
    }
    await db.insert(locationMedia).values({
      locationId: showhouse.id,
      mediaId: mediaRow.id,
      isHero: m.role === "hero",
      classification: m.role === "hero" ? null : m.role,
      sortOrder: m.sortOrder,
    });
    linkedPivots += 1;
  }

  console.log(
    `\nDone: inserted ${insertedMedia} new media rows (${skippedMedia} dup), ` +
      `linked ${linkedPivots} new pivots (${skippedPivots} dup).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
