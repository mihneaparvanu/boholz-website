import { db } from '../../src/db/db';
import {
    categoryMedia, floorMedia, houseCategories, houseModels, media, modelMedia
} from '../../src/db/schema';

const categories = await db.select().from(houseCategories);
const models = await db.select().from(houseModels);
const mediaRows = await db.select().from(media);
const mm = await db.select().from(modelMedia);
const cm = await db.select().from(categoryMedia);
const fm = await db.select().from(floorMedia);

const snapshot = {
  generatedAt: new Date().toISOString(),
  categories: categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
  models: models.map((m) => ({
    id: m.id,
    slug: m.slug,
    title: m.title,
    modelCode: m.modelCode,
    categoryId: m.categoryId,
    isFeatured: m.isFeatured,
  })),
  media: mediaRows,
  modelMedia: mm,
  categoryMedia: cm,
  floorMedia: fm,
};

await Bun.write("dev/asset-audit/db-state.json", JSON.stringify(snapshot, null, 2));
console.log(
  `DB: ${categories.length} categories, ${models.length} models, ${mediaRows.length} media rows, ${mm.length} model_media, ${cm.length} category_media, ${fm.length} floor_media`
);
