/**
 * Seed the `news` table from the WP inventory (`design-audit/wp-inventory/posts.json`).
 *
 * Idempotent: safe to re-run. Inserts the 5 user-approved news entries
 * (matches what `scripts/seed-news.ts` expects), de-duplicating on
 * `news.slug`. HTML titles are stripped to plain text; the rendered HTML
 * body is stored as-is (the news renderer pipes it through `marked`, which
 * passes HTML blocks through).
 *
 * After running this, run `scripts/seed-news.ts` to link the 3 cover
 * images that were uploaded to R2.
 *
 * Usage:  bun x tsx scripts/seed-news-rows.ts
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "../src/db/db";
import { news } from "../src/db/schema";

const POSTS_PATH = new URL(
  "../design-audit/wp-inventory/posts.json",
  import.meta.url,
);

// The 5 user-approved slugs from CANDIDATES.md (foerdertoepfe was unticked
// and is intentionally excluded).
const APPROVED_SLUGS = new Set([
  "april-samstag-13-06-2026-werksfuehrung-bei-keitel-haus",
  "mai-samstag-02-05-2026-werksfuehrung-bei-keitel-haus",
  "april-2026-stelltermin-in-steinheim-a-d-murr",
  "april-richtfest-in-75242-muenisngen",
  "aprilt-richtfest-in-7177-steinheim",
]);

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string } | string;
  excerpt_rendered?: string;
  content_rendered?: string;
}

function decodeEntities(html: string): string {
  return html
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#160;|&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

async function main() {
  const raw = await readFile(POSTS_PATH, "utf8");
  const parsed = JSON.parse(raw) as Record<string, WpPost> | WpPost[];
  const posts: WpPost[] = Array.isArray(parsed) ? parsed : Object.values(parsed);

  let inserted = 0;
  let skipped = 0;
  let missing = 0;

  for (const slug of APPROVED_SLUGS) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      console.warn(`[warn] No WP post found for slug "${slug}" — skipping`);
      missing += 1;
      continue;
    }

    const existing = await db.query.news.findFirst({
      where: eq(news.slug, slug),
    });
    if (existing) {
      skipped += 1;
      console.log(`  skip   ${slug}`);
      continue;
    }

    const titleRaw =
      typeof post.title === "string" ? post.title : post.title.rendered;
    const title = stripTags(titleRaw);
    const excerpt = post.excerpt_rendered
      ? stripTags(post.excerpt_rendered)
      : null;
    const content = post.content_rendered
      ? decodeEntities(post.content_rendered)
      : null;
    const publishedAt = new Date(post.date);

    await db.insert(news).values({
      title,
      slug,
      excerpt,
      content,
      isPublished: true,
      publishedAt,
    });
    inserted += 1;
    console.log(`  insert ${slug}  (${publishedAt.toISOString().slice(0, 10)})`);
  }

  console.log(
    `\nDone: inserted ${inserted} news rows, skipped ${skipped} duplicates, ` +
      `${missing} missing in posts.json.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
