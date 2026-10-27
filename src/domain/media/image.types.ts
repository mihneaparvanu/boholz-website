import type { BaseMedia } from "@/db/models";

export type Image = Pick<
  BaseMedia,
  "path" | "alt" | "width" | "height" | "isAi"
>;
