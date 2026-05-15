import { media } from "./../db/schema";
import { db } from "@/db/db";
import { not, inArray, eq } from "drizzle-orm";
import { houseCategories, houseModels, news } from "@/db/schema";
import type {
  HouseCategory,
  HouseModel,
  Location,
  LocationWithAgents,
  NewsArticle,
} from "@/types/models";
import type { HeroSlide } from "@/features/Home/home.types";
import { getMediaURL } from "@/utils/media";
import { m } from "motion-v";
import { title } from "node:process";
export { BESTSELLER_CATEGORY_ID } from "./constants";

const HIDDEN_CATEGORY_SLUGS: string[] = [];

// Virtual "Bestseller" category — not stored in DB; filtered client-side by model.isFeatured
export const BESTSELLER_CATEGORY: HouseCategory = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Bestseller",
  slug: "bestseller",
  description: null,
  media: [],
};

/** Resolve all nested media paths to full URLs so client components don't need env vars. */
function resolveMediaPaths<
  T extends { media: { path: string }[] | { media: { path: string } }[] },
>(items: T[]): T[] {
  return items.map((item) => ({
    ...item,
    media: item.media.map((m: any) => {
      if (m.media?.path) {
        return { ...m, media: { ...m.media, path: getMediaURL(m.media.path) } };
      }
      if (m.path) {
        return { ...m, path: getMediaURL(m.path) };
      }
      return m;
    }),
  }));
}

export async function getCategories(): Promise<HouseCategory[]> {
  const data = await db.query.houseCategories.findMany({
    where: not(inArray(houseCategories.slug, HIDDEN_CATEGORY_SLUGS)),
    with: {
      media: {
        with: { media: true },
        orderBy: (categoryMedia, { asc }) => [asc(categoryMedia.sortOrder)],
      },
    },
  });

  const resolved = resolveMediaPaths(data as unknown as HouseCategory[]);
  // Append virtual Bestseller at the end
  return [...resolved, BESTSELLER_CATEGORY];
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
    },
    orderBy: (l, { asc }) => [asc(l.title)],
  });
  return rows as LocationWithAgents[];
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
