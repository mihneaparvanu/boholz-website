import { eq, inArray, not } from "drizzle-orm";

import { db } from "@/db/db";
import { houseCategories, houseModels, news } from "@/db/schema";
import { getMediaURL } from "@/lib/media";

import type {
  HouseCategory,
  HouseModel,
  Location,
  LocationWithAgents,
  NewsArticle,
} from "@/db/models";
import type { HeroSlide } from "@/features/home/hero/hero.types";
const HIDDEN_CATEGORY_SLUGS: string[] = [];

type PivotMediaRow = { media: { path: string } };
type WithPivotMedia<M extends PivotMediaRow> = { media: M[] };

/** Resolve nested pivot-media paths to full URLs so client components don't need env vars. */
function resolveMediaPaths<
  M extends PivotMediaRow,
  T extends WithPivotMedia<M>,
>(items: T[]): T[] {
  return items.map((item) => ({
    ...item,
    media: item.media.map((m) => ({
      ...m,
      media: { ...m.media, path: getMediaURL(m.media.path) },
    })),
  }));
}

export const CATEGORY_ORDER = [
  "bestseller",
  "einfamilienhaus",
  "stadtvilla",
  "bungalow",
  "doppelhaus",
  "generationenhaus",
  "zweifamilienhaus",
  "mehrfamilienhaus",
  "kubus",
  "pultdachhaus",
] as const satisfies readonly string[];

export type CategorySlug = (typeof CATEGORY_ORDER)[number];

export async function getCategories(): Promise<HouseCategory[]> {
  // 1. fetch
  const data = await db.query.houseCategories.findMany({
    where: not(inArray(houseCategories.slug, HIDDEN_CATEGORY_SLUGS)),
    with: {
      media: {
        with: { media: true },
        orderBy: (categoryMedia, { asc }) => [asc(categoryMedia.sortOrder)],
      },
    },
  });

  // 2. resolve R2 paths
  const resolved = resolveMediaPaths(data as unknown as HouseCategory[]);

  // 3. sort by canonical order
  const rank = new Map(CATEGORY_ORDER.map((s, i) => [s, i] as const));
  return resolved.sort(
    (a, b) => (rank.get(a.slug) ?? Infinity) - (rank.get(b.slug) ?? Infinity),
  );
}

export async function getModels(): Promise<HouseModel[]> {
  const data = await db.query.houseModels.findMany({
    with: {
      category: true,
      details: true,
      media: {
        with: { media: true },
        orderBy: (modelMedia, { asc }) => [asc(modelMedia.sortOrder)],
      },
      floors: {
        with: { media: true },
        orderBy: (floor, { asc }) => [asc(floor.sortOrder)],
      },
    },
  });

  const models = resolveMediaPaths(data as unknown as HouseModel[]);

  // Also resolve floor media paths
  return models.map((model) => ({
    ...model,
    floors: model.floors.map((floor) => ({
      ...floor,
      media: floor.media?.path
        ? { ...floor.media, path: getMediaURL(floor.media.path) }
        : floor.media,
    })),
  }));
}

export async function getModelBySlug(
  slug: string,
): Promise<HouseModel | undefined> {
  const data = await db.query.houseModels.findFirst({
    where: eq(houseModels.slug, slug),
    with: {
      category: true,
      details: true,
      media: {
        with: { media: true },
        orderBy: (modelMedia, { asc }) => [asc(modelMedia.sortOrder)],
      },
      floors: {
        with: { media: true },
        orderBy: (floor, { asc }) => [asc(floor.sortOrder)],
      },
    },
  });

  if (!data) return undefined;

  const [model] = resolveMediaPaths([data] as unknown as HouseModel[]);
  return {
    ...model,
    floors: model.floors.map((floor) => ({
      ...floor,
      media: floor.media?.path
        ? { ...floor.media, path: getMediaURL(floor.media.path) }
        : floor.media,
    })),
  };
}

export async function getNews(): Promise<NewsArticle[]> {
  const data = await db.query.news.findMany({
    where: eq(news.isPublished, true),
    with: {
      media: {
        with: { media: true },
        orderBy: (newsMedia, { asc }) => [asc(newsMedia.sortOrder)],
      },
    },
    orderBy: (news, { desc }) => [desc(news.publishedAt)],
  });

  return resolveMediaPaths(data as unknown as NewsArticle[]);
}

export async function getNewsBySlug(
  slug: string,
): Promise<NewsArticle | undefined> {
  const data = await db.query.news.findFirst({
    where: eq(news.slug, slug),
    with: {
      media: {
        with: { media: true },
        orderBy: (newsMedia, { asc }) => [asc(newsMedia.sortOrder)],
      },
    },
  });

  if (!data) return undefined;
  const [article] = resolveMediaPaths([data] as unknown as NewsArticle[]);
  return article;
}

export async function getLocations(opts?: {
  kind?: Location["kind"];
  exceptKind?: Location["kind"];
}): Promise<LocationWithAgents[]> {
  const rows = await db.query.locations.findMany({
    where: opts?.kind
      ? (l, { eq }) => eq(l.kind, opts.kind!)
      : opts?.exceptKind
        ? (l, { ne }) => ne(l.kind, opts.exceptKind!)
        : undefined,
    with: {
      agents: {
        with: { agent: true },
        orderBy: (la, { asc }) => [asc(la.sortOrder)],
      },
      media: {
        with: { media: true },
        orderBy: (lm, { asc }) => [asc(lm.sortOrder)],
      },
    },
    orderBy: (l, { asc }) => [asc(l.title)],
  });
  return resolveMediaPaths(rows as unknown as LocationWithAgents[]);
}

export async function getHeroSlides(limit = 6): Promise<HeroSlide[]> {
  const rows = await db.query.houseModels.findMany({
    where: (m, { eq }) => eq(m.isFeatured, true),
    orderBy: (m, { asc }) => asc(m.title),
    limit,
    with: {
      media: {
        where: (mm, { eq }) => eq(mm.isHero, true),
        limit: 1,
        with: {
          media: true,
        },
      },
    },
  });
  return rows.map((m) => ({
    id: m.id,
    slug: m.slug,
    title: m.title,
    heroImgURL: m.media[0] ? getMediaURL(m.media[0].media.path) : null,
  }));
}
