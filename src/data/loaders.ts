import { db } from "../db/db";
import { not, inArray } from "drizzle-orm";
import { houseCategories } from "../db/schema";
import type { HouseCategory, HouseModel } from "../types/models";
import { getMediaURL } from "../utils/media";

const HIDDEN_CATEGORY_SLUGS = ["pultdachhaus", "doppelhaus"];

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

  return resolveMediaPaths(data as unknown as HouseCategory[]);
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
