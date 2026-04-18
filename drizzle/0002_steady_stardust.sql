ALTER TABLE "boholz"."house_details" ADD COLUMN "width" numeric;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "length" numeric;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "ridge_height" numeric;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "has_garage" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "boholz"."house_models" ADD COLUMN "price" numeric;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD CONSTRAINT "house_details_id_house_models_id_fk" FOREIGN KEY ("id") REFERENCES "boholz"."house_models"("id") ON DELETE no action ON UPDATE no action;