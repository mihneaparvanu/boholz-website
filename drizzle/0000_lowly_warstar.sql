CREATE SCHEMA "boholz";
--> statement-breakpoint
CREATE TABLE "boholz"."agent_media" (
	"agent_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"label" varchar,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "boholz"."agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"role" varchar,
	"phone_number" varchar,
	"email" varchar,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE "boholz"."category_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"url" text NOT NULL,
	"is_thumbnail" boolean DEFAULT false,
	"is_hero" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "boholz"."house_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boholz"."house_details" (
	"id" uuid PRIMARY KEY NOT NULL,
	"level_count" smallint,
	"bedroom_count" smallint,
	"bathroom_count" smallint,
	"families_count" smallint
);
--> statement-breakpoint
CREATE TABLE "boholz"."house_floor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_model" uuid DEFAULT gen_random_uuid(),
	"title" varchar,
	"order" smallint,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "boholz"."house_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" uuid,
	"url" text NOT NULL,
	"is_hero" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "boholz"."house_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"model_code" varchar NOT NULL,
	"roof_pitch" integer,
	"living_area" numeric,
	"total_area" numeric,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "boholz"."media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"width" integer,
	"height" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "boholz"."showhouse_agents" (
	"agent_id" uuid NOT NULL,
	"showhouse_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "boholz"."showhouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"address" text,
	"city" varchar,
	"country" varchar DEFAULT 'Germany',
	"lat" numeric,
	"lng" numeric
);
--> statement-breakpoint
ALTER TABLE "boholz"."category_media" ADD CONSTRAINT "category_media_category_id_house_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "boholz"."house_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."house_floor" ADD CONSTRAINT "house_floor_house_model_house_models_id_fk" FOREIGN KEY ("house_model") REFERENCES "boholz"."house_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."house_images" ADD CONSTRAINT "house_images_house_id_house_models_id_fk" FOREIGN KEY ("house_id") REFERENCES "boholz"."house_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."house_models" ADD CONSTRAINT "house_models_category_id_house_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "boholz"."house_categories"("id") ON DELETE no action ON UPDATE no action;