import type { AttachedImage } from "@/domain/media/image.types";

type PivotRow = {
  isHero: boolean | null;
  media: Pick<AttachedImage, "path" | "alt" | "width" | "height" | "isAi">;
};

// Every pivot table (category_media, model_media, location_media, news_media)
// hangs the same flag off the media row, and `is_hero` is nullable in Postgres
// even though it defaults to false.
export const toAttachedImage = (row: PivotRow): AttachedImage => ({
  isHero: row.isHero ?? false,
  path: row.media.path,
  alt: row.media.alt,
  width: row.media.width,
  height: row.media.height,
  isAi: row.media.isAi,
});
