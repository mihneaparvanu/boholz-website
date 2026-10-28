import "./_bare-paths";

import { getNews } from "@/db/loaders";
import type { NewsPost } from "@/domain/news/news.types";

import { exportEntity } from "./export-entity";

const live = await getNews();
const parked = await getNews({ unpublished: true });

const toRecord = (a: (typeof live)[number]): NewsPost => ({
  slug: a.slug,
  title: a.title,
  content: a.content,
  excerpt: a.excerpt,
  publishedAt: a.publishedAt?.toISOString() ?? null,
  media: a.media.map((m) => ({
    path: m.media.path,
    alt: m.media.alt,
    height: m.media.height,
    width: m.media.width,
    isHero: m.isHero,
    isAi: m.media.isAi,
  })),
});

await exportEntity({
  entity: "news",
  typeName: "NewsPost",
  data: live.map(toRecord),
});

// Four posts sit at is_published = false: three past events and two slugs with
// typos in them. Kept so retiring the database loses nothing; imported by
// nothing, so the site is unchanged.
await exportEntity({
  entity: "news",
  fileName: "news.parked",
  exportName: "parkedNews",
  typeName: "NewsPost",
  data: parked.map(toRecord),
});

process.exit(0);
