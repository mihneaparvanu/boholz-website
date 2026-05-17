CREATE TABLE "boholz"."location_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"is_hero" boolean DEFAULT false,
	"is_thumbnail" boolean DEFAULT false,
	"classification" varchar,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "boholz"."location_media" ADD CONSTRAINT "location_media_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "boholz"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."location_media" ADD CONSTRAINT "location_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "boholz"."media"("id") ON DELETE no action ON UPDATE no action;