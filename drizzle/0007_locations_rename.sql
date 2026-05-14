ALTER TABLE "boholz"."showhouse_agents" DROP CONSTRAINT "showhouse_agents_showhouse_id_showhouses_id_fk";--> statement-breakpoint
ALTER TABLE "boholz"."showhouse_agents" DROP CONSTRAINT "showhouse_agents_agent_id_agents_id_fk";--> statement-breakpoint
ALTER TABLE "boholz"."showhouses" RENAME TO "locations";--> statement-breakpoint
ALTER TABLE "boholz"."showhouse_agents" RENAME TO "location_agents";--> statement-breakpoint
ALTER TABLE "boholz"."location_agents" RENAME COLUMN "showhouse_id" TO "location_id";--> statement-breakpoint
ALTER TABLE "boholz"."locations" ADD COLUMN "kind" varchar DEFAULT 'office' NOT NULL;--> statement-breakpoint
ALTER TABLE "boholz"."locations" ADD COLUMN "postal_code" varchar;--> statement-breakpoint
ALTER TABLE "boholz"."locations" ADD COLUMN "phone" varchar;--> statement-breakpoint
ALTER TABLE "boholz"."locations" ADD COLUMN "email" varchar;--> statement-breakpoint
UPDATE "boholz"."locations" SET "kind" = 'showhouse' WHERE "slug" IN ('bad-vilbel', 'fellbach');--> statement-breakpoint
ALTER TABLE "boholz"."location_agents" ADD CONSTRAINT "location_agents_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "boholz"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boholz"."location_agents" ADD CONSTRAINT "location_agents_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "boholz"."locations"("id") ON DELETE no action ON UPDATE no action;
