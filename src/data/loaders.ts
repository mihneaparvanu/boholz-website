import { db } from "../db/db";
import { not, inArray } from "drizzle-orm";
import { houseCategories, houseModels as houseModelsTable } from "../db/schema";
import type { HouseCategory, HouseModel } from "../types/models";
import { getMediaURL } from "../utils/media";

const HIDDEN_CATEGORY_SLUGS = ["pultdachhaus", "doppelhaus"];

/** Resolve all nested media paths to full URLs so client components don't need env vars. */
function resolveMediaPaths<T extends { media: { path: string }[] | { media: { path: string } }[] }>(
  items: T[],
): T[] {
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

  return resolveMediaPaths(data as unknown as HouseCategory[]);
}

export type NavbarCategory = HouseCategory & {
  heroImage: { path: string; alt: string | null } | null;
};

/** Categories enriched with a representative model hero image for the navbar dropdown. */
export async function getNavbarCategories(): Promise<NavbarCategory[]> {
  const categories = await getCategories();

  // Fetch models for visible categories to get hero images
  const categoryIds = categories.map((c) => c.id);
  const models = categoryIds.length
    ? await db.query.houseModels.findMany({
        where: inArray(houseModelsTable.categoryId, categoryIds),
        with: {
          category: true,
          media: {
            with: { media: true },
            orderBy: (modelMedia, { asc }) => [asc(modelMedia.sortOrder)],
          },
        },
      })
    : [];

  const resolvedModels = resolveMediaPaths(models as any[]);

  // Build a map: categoryId -> first model's hero image
  const heroByCategory = new Map<string, { path: string; alt: string | null }>();
  for (const model of resolvedModels) {
    const catId = (model as any).category?.id;
    if (!catId || heroByCategory.has(catId)) continue;
    const hero = (model as any).media.find((m: any) => m.isHero);
    if (hero?.media) {
      heroByCategory.set(catId, { path: hero.media.path, alt: hero.media.alt });
    }
  }

  return categories.map((cat) => ({
    ...cat,
    heroImage: heroByCategory.get(cat.id) ?? null,
  }));
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
