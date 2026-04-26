CREATE TABLE "boholz"."news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"excerpt" text,
	"content" text,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "boholz"."news_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"news_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"is_hero" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "roof_type" varchar;--> statement-breakpoint
ALTER TABLE "boholz"."house_details" ADD COLUMN "kniestock" smallint;--> statement-breakpoint
ALTER TABLE "boholz"."news_media" ADD CONSTRAINT "news_media_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "boholz"."news"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."news_media" ADD CONSTRAINT "news_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "boholz"."media"("id") ON DELETE no action ON UPDATE no action;