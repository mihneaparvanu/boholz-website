ALTER TABLE "boholz"."house_details" ADD COLUMN "is_barrier_free" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "has_children_room" boolean DEFAULT false;--> statement-breakpoint
-- All bungalows are barrier-free by definition
UPDATE "boholz"."house_details"
SET "is_barrier_free" = true
WHERE "id" IN (
  SELECT hm.id
  FROM "boholz"."house_models" hm
  JOIN "boholz"."house_categories" hc ON hc.id = hm.category_id
  WHERE hc.slug = 'bungalow'
);