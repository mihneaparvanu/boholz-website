ALTER TABLE "boholz"."house_categories" ADD COLUMN IF NOT EXISTS "description" text;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" RENAME COLUMN "ridge_height" TO "height";--> statement-breakpoint
ALTER TABLE "boholz"."house_models" ADD COLUMN "description" text;