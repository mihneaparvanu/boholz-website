-- Data migration: seed the Vertriebspartner (sales contacts) for the two
-- Musterhäuser and link them to their showhouse locations, per client request
-- (PDF "Änderungen Homepage 05062026", change 7).
--
-- Bad Vilbel → Erich Zeller, Karlheinz Seipp.
-- Fellbach   → István Aszalós, Dieter Wissmann, Hagen Kober, Michael Dittrich.
--
-- Mobile number → phone_number, shared office line → phone_secondary (added in
-- 0013). No schema change here — data only. All statements are idempotent:
-- agents keyed by slug (INSERT-if-absent + UPDATE to converge), pivot rows
-- guarded by NOT EXISTS. Safe to re-run.

-- ── Agents ───────────────────────────────────────────────────────────────
INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'Erich Zeller', 'erich-zeller', 'Beratung und Verkauf', '+49 172 29 08 788', '+49 6101 80 27 660', 'e.zeller@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'erich-zeller');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'Erich Zeller', "role" = 'Beratung und Verkauf', "phone_number" = '+49 172 29 08 788', "phone_secondary" = '+49 6101 80 27 660', "email" = 'e.zeller@boholz-haus.de' WHERE "slug" = 'erich-zeller';--> statement-breakpoint

INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'Karlheinz Seipp', 'karlheinz-seipp', 'Beratung und Verkauf', '+49 163 404 19 61', '+49 6101 80 27 660', 'k.seipp@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'karlheinz-seipp');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'Karlheinz Seipp', "role" = 'Beratung und Verkauf', "phone_number" = '+49 163 404 19 61', "phone_secondary" = '+49 6101 80 27 660', "email" = 'k.seipp@boholz-haus.de' WHERE "slug" = 'karlheinz-seipp';--> statement-breakpoint

INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'István Aszalós', 'istvan-aszalos', 'Beratung und Verkauf', '+49 171 28 93 414', NULL, 'i.aszalos@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'istvan-aszalos');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'István Aszalós', "role" = 'Beratung und Verkauf', "phone_number" = '+49 171 28 93 414', "phone_secondary" = NULL, "email" = 'i.aszalos@boholz-haus.de' WHERE "slug" = 'istvan-aszalos';--> statement-breakpoint

INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'Dieter Wissmann', 'dieter-wissmann', 'Gebietsverkaufsleiter', '+49 171 12 80 274', '+49 711 90 12 03 79', 'd.wissmann@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'dieter-wissmann');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'Dieter Wissmann', "role" = 'Gebietsverkaufsleiter', "phone_number" = '+49 171 12 80 274', "phone_secondary" = '+49 711 90 12 03 79', "email" = 'd.wissmann@boholz-haus.de' WHERE "slug" = 'dieter-wissmann';--> statement-breakpoint

INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'Hagen Kober', 'hagen-kober', 'Beratung und Verkauf', '+49 163 379 02 68', NULL, 'h.kober@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'hagen-kober');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'Hagen Kober', "role" = 'Beratung und Verkauf', "phone_number" = '+49 163 379 02 68', "phone_secondary" = NULL, "email" = 'h.kober@boholz-haus.de' WHERE "slug" = 'hagen-kober';--> statement-breakpoint

INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'Michael Dittrich', 'michael-dittrich', 'Beratung und Verkauf', '+49 176 62 12 65 25', '+49 711 90 12 03 79', 'm.dittrich@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'michael-dittrich');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'Michael Dittrich', "role" = 'Beratung und Verkauf', "phone_number" = '+49 176 62 12 65 25', "phone_secondary" = '+49 711 90 12 03 79', "email" = 'm.dittrich@boholz-haus.de' WHERE "slug" = 'michael-dittrich';--> statement-breakpoint

-- ── Pivot: link each contact to its Musterhaus ───────────────────────────
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", TRUE, 0
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'erich-zeller' AND l."slug" = 'bad-vilbel'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");--> statement-breakpoint
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", FALSE, 1
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'karlheinz-seipp' AND l."slug" = 'bad-vilbel'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");--> statement-breakpoint
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", TRUE, 0
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'istvan-aszalos' AND l."slug" = 'fellbach'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");--> statement-breakpoint
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", FALSE, 1
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'dieter-wissmann' AND l."slug" = 'fellbach'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");--> statement-breakpoint
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", FALSE, 2
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'hagen-kober' AND l."slug" = 'fellbach'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");--> statement-breakpoint
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", FALSE, 3
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'michael-dittrich' AND l."slug" = 'fellbach'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");
