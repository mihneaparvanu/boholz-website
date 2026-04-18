CREATE TABLE "boholz"."floor_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid DEFAULT gen_random_uuid(),
	"media_id" uuid NOT NULL,
	"title" varchar,
	"sort_order" smallint
);
--> statement-breakpoint
CREATE TABLE "boholz"."model_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"is_hero" boolean DEFAULT false,
	"is_thumbnail" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "boholz"."house_floor" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "boholz"."house_images" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "boholz"."house_floor" CASCADE;--> statement-breakpoint
DROP TABLE "boholz"."house_images" CASCADE;--> statement-breakpoint
ALTER TABLE "boholz"."category_media" ADD COLUMN "media_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "boholz"."media" ADD COLUMN "path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "boholz"."floor_media" ADD CONSTRAINT "floor_media_model_id_house_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "boholz"."house_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."floor_media" ADD CONSTRAINT "floor_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "boholz"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."model_media" ADD CONSTRAINT "model_media_model_id_house_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "boholz"."house_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."model_media" ADD CONSTRAINT "model_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "boholz"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."agent_media" ADD CONSTRAINT "agent_media_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "boholz"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."agent_media" ADD CONSTRAINT "agent_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "boholz"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."category_media" ADD CONSTRAINT "category_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "boholz"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."showhouse_agents" ADD CONSTRAINT "showhouse_agents_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "boholz"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."showhouse_agents" ADD CONSTRAINT "showhouse_agents_showhouse_id_showhouses_id_fk" FOREIGN KEY ("showhouse_id") REFERENCES "boholz"."showhouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."category_media" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "boholz"."media" DROP COLUMN "url";