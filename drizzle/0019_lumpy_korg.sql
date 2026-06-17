CREATE TYPE "boholz"."lead_form_type" AS ENUM('contact', 'catalog');--> statement-breakpoint
CREATE TABLE "boholz"."leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_type" "boholz"."lead_form_type" NOT NULL,
	"payload" jsonb NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
