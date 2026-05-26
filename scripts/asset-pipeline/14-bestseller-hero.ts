// Set the bestseller houseCategory's category_media hero+thumbnail to the
// SECOND gallery photo of bestseller-family-150 (alphabetical order).

import { sql } from 'drizzle-orm';

import { db } from '../../src/db/db';

const cat = await db.execute(sql`SELECT id FROM boholz.house_categories WHERE slug = 'bestseller'`);
if (cat.length === 0) {
  console.error("No bestseller category found");
  process.exit(1);
}
const bestsellerId = cat[0].id as string;

const photos = await db.execute(sql`
  SELECT m.id, m.path
  FROM boholz.model_media mm
  JOIN boholz.media m ON m.id = mm.media_id
  JOIN boholz.house_models hm ON hm.id = mm.model_id
  WHERE hm.slug = 'bestseller-family-150'
    AND m.path NOT LIKE '%floor-plan%'
    AND m.path LIKE '/images/models/%'
  ORDER BY m.path
`);
if (photos.length < 2) {
  console.error(`Need ≥2 gallery photos for bestseller-family-150, found ${photos.length}`);
  process.exit(1);
}
const mediaId = photos[1].id as string;
console.log(`Selected hero: ${photos[1].path}`);

await db.transaction(async (tx) => {
  await tx.execute(sql`DELETE FROM boholz.category_media WHERE category_id = ${bestsellerId}`);
  await tx.execute(sql`
    INSERT INTO boholz.category_media (category_id, media_id, is_hero, is_thumbnail, sort_order)
    VALUES (${bestsellerId}, ${mediaId}, true, true, 0)
  `);
});
console.log("Committed.");
