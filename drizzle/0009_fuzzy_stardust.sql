ALTER TABLE "boholz"."house_details" ADD COLUMN "floor_count" numeric;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "extension_description" varchar;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "net_floor_area_din" numeric;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "total_living_area_woflv" numeric;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "allows_granny_flat" boolean DEFAULT false;