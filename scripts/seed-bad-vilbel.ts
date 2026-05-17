/**
 * Seed media for the "Bad Vilbel" showhouse.
 *
 * Idempotent: safe to re-run. Inserts the 8 staged R2 media rows for the
 * bad-vilbel showhouse, de-duplicating on `media.path`.
 *
 * Showhouses live in the `locations` table (kind = "showhouse"). The current
 * schema has NO `location_media` pivot, so this script only ensures the
 * `media` rows are present. If/when a pivot is added, extend this script to
 * link bad-vilbel's `location.id` to the inserted `media.id` values.
 *
 * Usage:  bun x tsx scripts/seed-bad-vilbel.ts
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
  // Semantic role of the image inside the showhouse (informational only —
  // not stored, since there's no location_media pivot to carry the flag).
  role: "hero" | "exterior" | "interior" | "plan";
  sortOrder: number;
};

const SHOWHOUSE_SLUG = "bad-vilbel";

const MEDIA: MediaSeed[] = [
  {
    path: "/images/showhouses/bad-vilbel/hero.webp",
    alt: "Bad Vilbel showhouse hero",
    width: 1500,
    height: 946,
    role: "hero",
    sortOrder: 0,
  },
  {
    path: "/images/showhouses/bad-vilbel/gallery/exterior-01.webp",
    alt: "Bad Vilbel exterior",
    width: 800,
    height: 533,
    role: "exterior",
    sortOrder: 1,
  },
  {
    path: "/images/showhouses/bad-vilbel/gallery/interior-04.webp",
    alt: "Küche",
    width: 968,
    height: 648,
    role: "interior",
    sortOrder: 4,
  },
  {
    path: "/images/showhouses/bad-vilbel/gallery/interior-05.webp",
    alt: "Master-Bad",
    width: 968,
    height: 648,
    role: "interior",
    sortOrder: 5,
  },
  {
    path: "/images/showhouses/bad-vilbel/gallery/interior-06.webp",
    alt: "Theke",
    width: 968,
    height: 648,
    role: "interior",
    sortOrder: 6,
  },
  {
    path: "/images/showhouses/bad-vilbel/gallery/interior-07.webp",
    alt: "Wohnen",
    width: 968,
    height: 648,
    role: "interior",
    sortOrder: 7,
  },
  {
    path: "/images/showhouses/bad-vilbel/plans/plan-02.webp",
    alt: "Erdgeschoss Grundriss",
    width: 661,
    height: 605,
    role: "plan",
    sortOrder: 2,
  },
  {
    path: "/images/showhouses/bad-vilbel/plans/plan-03.webp",
    alt: "Site plan",
    width: 612,
    height: 567,
    role: "plan",
    sortOrder: 3,
  },
];

async function main() {
  // Verify the showhouse exists so the user is warned about the missing
  // prerequisite if it doesn't.
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
