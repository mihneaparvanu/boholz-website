/**
 * Seed media for the "Fellbach" showhouse.
 *
 * Idempotent: safe to re-run. Inserts the 11 staged R2 media rows for the
 * fellbach showhouse, de-duplicating on `media.path`.
 *
 * Showhouses live in the `locations` table (kind = "showhouse"). The current
 * schema has NO `location_media` pivot, so this script only ensures the
 * `media` rows are present. If/when a pivot is added, extend this script to
 * link fellbach's `location.id` to the inserted `media.id` values.
 *
 * Usage:  bun x tsx scripts/seed-fellbach.ts
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/db/db";
import { media, locations } from "../src/db/schema";

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
    console.warn(
      `[warn] No "locations" row with slug="${SHOWHOUSE_SLUG}" found. ` +
        `Media rows will still be inserted, but they won't be linked to any ` +
        `showhouse (no location_media pivot exists in the schema).`,
    );
  } else if (showhouse.kind !== "showhouse") {
    console.warn(
      `[warn] Location "${SHOWHOUSE_SLUG}" exists but kind="${showhouse.kind}" ` +
        `(expected "showhouse").`,
    );
  } else {
    console.log(`Found showhouse: ${showhouse.title} (${showhouse.id})`);
  }

  let inserted = 0;
  let skipped = 0;

  for (const m of MEDIA) {
    const existing = await db.query.media.findFirst({
      where: eq(media.path, m.path),
    });
    if (existing) {
      skipped += 1;
      console.log(`  skip   ${m.path}`);
      continue;
    }
    await db.insert(media).values({
      path: m.path,
      alt: m.alt,
      width: m.width,
      height: m.height,
    });
    inserted += 1;
    console.log(`  insert ${m.path}  (${m.role})`);
  }

  console.log(
    `\nDone: inserted ${inserted} new media rows, skipped ${skipped} duplicates, linked 0 pivots ` +
      `(no location_media pivot exists in the schema).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
