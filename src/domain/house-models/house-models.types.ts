import type { CategorySlug } from "@/db/loaders";
import type { HouseModel } from "@/db/models";

import type { Image } from "../media/image.types";

export type HouseModelMedia = Omit<
  HouseModel["media"][number],
  "media" | "sortOrder"
> &
  Image;

export type HouseModelFloor = Omit<
  HouseModel["floors"][number],
  "media" | "sortOrder"
> &
  Image;

/**
 * The 17 specification fields, lifted onto the model itself.
 *
 * In the database these live in a second table, and two of the 32 models have
 * no row there at all. That distinction is not kept, because nothing ever read
 * it: every consumer guards each field on its own (`d?.floorCount`, and the
 * row hides itself when null), and the two three-state filters collapsed
 * anyway — `HousesPage` keeps a model only when a boolean filter answers
 * exactly `true`, so "no spec sheet" and "field empty" were always identical.
 *
 * Required rather than optional: every one of the 17 columns is nullable on
 * its own, so the two models without a row carry 17 nulls. That keeps the
 * completeness check — add a column to house_details and this file stops
 * compiling, which `Partial` would have silently allowed.
 */
export type ModelSpecs = Omit<NonNullable<HouseModel["details"]>, "id">;

export type HouseModelRecord = Omit<
  HouseModel,
  | "id"
  | "categoryId"
  | "isHidden"
  | "totalArea"
  | "createdAt"
  | "category"
  | "details"
  | "media"
  | "floors"
> &
  ModelSpecs & {
    categorySlug: CategorySlug;
    media: HouseModelMedia[];
    floors: HouseModelFloor[];
  };
