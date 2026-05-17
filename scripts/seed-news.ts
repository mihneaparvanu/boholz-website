/**
 * Seed cover media for the freshly-staged news posts.
 *
 * Idempotent: safe to re-run.
 *  - For each news post with a cover, insert (or reuse) a row in `media`
 *    and link it via the `news_media` pivot as the hero (isHero = true).
 *  - For the two cover-less posts, verify the news row exists but do nothing
 *    else. The `NewsCard.vue` component already falls back to a generic
 *    `<ImagePlaceholder />` when no hero media is present, so no DB
 *    placeholder row is needed.
 *
 * Prerequisites: each news row must already exist (located by slug). If a
 * row is missing the script prints a warning and skips it — no INSERT into
 * `news` happens here; that's a separate seed concern.
 *
 * Note on duplicated covers: two werksfuehrung posts share the same source
 * image but get distinct R2 keys (per user decision) so they live as two
 * distinct rows in `media`.
 *
 * Usage:  bun x tsx scripts/seed-news.ts
 */
import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { db } from "../src/db/db";
import { media, news, newsMedia } from "../src/db/schema";

type NewsCoverSeed = {
  newsSlug: string;
  cover: {
    path: string;
    alt: string;
    width: number;
    height: number;
  };
};

type NewsWithoutCoverSeed = {
  newsSlug: string;
  reason: string;
};

const NEWS_WITH_COVER: NewsCoverSeed[] = [
  {
    newsSlug: "foerdertoepfe",
    cover: {
      path: "/images/news/foerdertoepfe/cover.webp",
      alt: "KfW-Förderung",
      width: 600,
      height: 440,
    },
  },
  {
    newsSlug: "april-samstag-13-06-2026-werksfuehrung-bei-keitel-haus",
    cover: {
      path: "/images/news/april-samstag-13-06-2026-werksfuehrung-bei-keitel-haus/cover.webp",
      alt: "Werksführung bei Keitel-Haus",
      width: 4000,
      height: 3000,
    },
  },
  {
    newsSlug: "mai-samstag-02-05-2026-werksfuehrung-bei-keitel-haus",
    cover: {
      path: "/images/news/mai-samstag-02-05-2026-werksfuehrung-bei-keitel-haus/cover.webp",
      alt: "Werksführung bei Keitel-Haus",
      width: 4000,
      height: 3000,
    },
  },
  {
    newsSlug: "april-2026-stelltermin-in-steinheim-a-d-murr",
    cover: {
      path: "/images/news/april-2026-stelltermin-in-steinheim-a-d-murr/cover.webp",
      alt: "Stelltermin Steinheim",
      width: 600,
      height: 440,
    },
  },
];

const NEWS_WITHOUT_COVER: NewsWithoutCoverSeed[] = [
  {
    newsSlug: "april-richtfest-in-75242-muenisngen",
    reason: "No cover image staged; UI falls back to <ImagePlaceholder />",
  },
  {
    newsSlug: "aprilt-richtfest-in-7177-steinheim",
    reason: "No cover image staged; UI falls back to <ImagePlaceholder />",
  },
];

async function upsertMedia(m: NewsCoverSeed["cover"]): Promise<{
  id: string;
  isNew: boolean;
}> {
  const existing = await db.query.media.findFirst({
    where: eq(media.path, m.path),
  });
  if (existing) return { id: existing.id, isNew: false };

  const [inserted] = await db
    .insert(media)
    .values({
      path: m.path,
      alt: m.alt,
      width: m.width,
      height: m.height,
    })
    .returning({ id: media.id });
  return { id: inserted.id, isNew: true };
}

async function ensureNewsMediaLink(
  newsId: string,
  mediaId: string,
): Promise<boolean> {
  // Look for an existing pivot row with this (newsId, mediaId) pair.
  const existing = await db.query.newsMedia.findFirst({
    where: and(eq(newsMedia.newsId, newsId), eq(newsMedia.mediaId, mediaId)),
  });
  if (existing) return false;

  await db.insert(newsMedia).values({
    newsId,
    mediaId,
    isHero: true,
    sortOrder: 0,
  });
  return true;
}

async function main() {
  let inserted = 0;
  let skipped = 0;
  let linked = 0;
  let missingNews = 0;

  for (const entry of NEWS_WITH_COVER) {
    const newsRow = await db.query.news.findFirst({
      where: eq(news.slug, entry.newsSlug),
    });
    if (!newsRow) {
      missingNews += 1;
      console.warn(
        `  [warn] news row missing: slug="${entry.newsSlug}". ` +
          `Cover staged but cannot be linked. Seed the news row first.`,
      );
      continue;
    }

    const { id: mediaId, isNew } = await upsertMedia(entry.cover);
    if (isNew) {
      inserted += 1;
      console.log(`  insert media   ${entry.cover.path}`);
    } else {
      skipped += 1;
      console.log(`  skip   media   ${entry.cover.path}`);
    }

    const didLink = await ensureNewsMediaLink(newsRow.id, mediaId);
    if (didLink) {
      linked += 1;
      console.log(`  link           news="${entry.newsSlug}" -> media (hero)`);
    } else {
      console.log(`  skip   link    news="${entry.newsSlug}" (already linked)`);
    }
  }

  console.log("\nCover-less news posts (no DB writes expected):");
  for (const entry of NEWS_WITHOUT_COVER) {
    const newsRow = await db.query.news.findFirst({
      where: eq(news.slug, entry.newsSlug),
    });
    if (!newsRow) {
      missingNews += 1;
      console.warn(
        `  [warn] news row missing: slug="${entry.newsSlug}". ` +
          `Nothing to do here, but the news row should exist.`,
      );
      continue;
    }
    console.log(`  ok     ${entry.newsSlug} — ${entry.reason}`);
  }

  console.log(
    `\nDone: inserted ${inserted} new media rows, skipped ${skipped} duplicates, ` +
      `linked ${linked} pivots.`,
  );
  if (missingNews > 0) {
    console.warn(
      `[warn] ${missingNews} expected news row(s) were missing — see warnings above.`,
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
