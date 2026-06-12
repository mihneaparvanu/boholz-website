-- Data migration for the client change list "Änderungen 110626" (11 June 2026).
-- Covers, in order: floor-plan ordering (#5), the Pultdachhaus white image (#8),
-- the Bad Vilbel partner + new Vertriebsbüros (#7), and the merged news (#6).
-- No schema change — data only. Every statement is idempotent (keyed by slug /
-- path, guarded by NOT EXISTS / scoped UPDATE), so this is safe to re-run.

-- ══════════════════════════════════════════════════════════════════════════
-- New media rows (idempotent by path). Files already uploaded to R2.
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO "boholz"."media" ("path", "alt", "width", "height")
SELECT '/images/models/pultdachhaus/pultdachhaus-weiss.webp', 'Pultdachhaus – weißes Musterhaus mit Flachdach', 1143, 591
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."media" WHERE "path" = '/images/models/pultdachhaus/pultdachhaus-weiss.webp');--> statement-breakpoint
INSERT INTO "boholz"."media" ("path", "alt", "width", "height")
SELECT '/images/news/juli-samstag-04-07-2026-werksfuehrung-bei-keitel-haus/cover.webp', 'Werksführung bei Keitel-Haus', 1600, 1200
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."media" WHERE "path" = '/images/news/juli-samstag-04-07-2026-werksfuehrung-bei-keitel-haus/cover.webp');--> statement-breakpoint

-- ══════════════════════════════════════════════════════════════════════════
-- #8 Pultdachhaus — the completely white flat-roof render in the category
-- button (thumbnail) + category hero AND on the house model itself.
-- ══════════════════════════════════════════════════════════════════════════
UPDATE "boholz"."category_media"
SET "media_id" = (SELECT "id" FROM "boholz"."media" WHERE "path" = '/images/models/pultdachhaus/pultdachhaus-weiss.webp')
WHERE "category_id" = (SELECT "id" FROM "boholz"."house_categories" WHERE "slug" = 'pultdachhaus')
  AND ("is_thumbnail" = TRUE OR "is_hero" = TRUE);--> statement-breakpoint
UPDATE "boholz"."model_media"
SET "media_id" = (SELECT "id" FROM "boholz"."media" WHERE "path" = '/images/models/pultdachhaus/pultdachhaus-weiss.webp')
WHERE "model_id" = (SELECT "id" FROM "boholz"."house_models" WHERE "slug" = 'pultdachhaus-21-349-225')
  AND "is_hero" = TRUE AND "is_thumbnail" = TRUE;--> statement-breakpoint

-- ══════════════════════════════════════════════════════════════════════════
-- #5 Floor plans — always Erdgeschoss → … → Dachgeschoss. Re-rank sort_order
-- by floor name, partitioned per (model, variant) so each variant tab keeps
-- its own clean ordering. Idempotent: re-running yields the same ranks.
-- ══════════════════════════════════════════════════════════════════════════
UPDATE "boholz"."floor_media" AS fm
SET "sort_order" = sub.rk
FROM (
  SELECT "id",
    (ROW_NUMBER() OVER (
      PARTITION BY "model_id", "variant"
      ORDER BY
        CASE "title"
          WHEN 'Erdgeschoss'    THEN 1
          WHEN 'Obergeschoss'   THEN 2
          WHEN 'Obergeschoss 1' THEN 3
          WHEN 'Obergeschoss 2' THEN 4
          WHEN 'Dachgeschoss'   THEN 5
          WHEN 'Grundriss'      THEN 6
          ELSE 9
        END,
        "title"
    ) - 1) AS rk
  FROM "boholz"."floor_media"
) AS sub
WHERE fm."id" = sub."id";--> statement-breakpoint

-- ══════════════════════════════════════════════════════════════════════════
-- #7 Bad Vilbel sales contact — add Erich Pliester.
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'Erich Pliester', 'erich-pliester', 'Beratung und Verkauf', '+49 1577 620 2 2 91', '+49 6101 80 27 660', 'm.pliester@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'erich-pliester');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'Erich Pliester', "role" = 'Beratung und Verkauf', "phone_number" = '+49 1577 620 2 2 91', "phone_secondary" = '+49 6101 80 27 660', "email" = 'm.pliester@boholz-haus.de' WHERE "slug" = 'erich-pliester';--> statement-breakpoint
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", FALSE, 2
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'erich-pliester' AND l."slug" = 'bad-vilbel'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");--> statement-breakpoint

-- ── Vertriebsbüro Jockgrim — remove Katja Rodewald-Willms entirely ──────────
DELETE FROM "boholz"."location_agents"
WHERE "agent_id" = (SELECT "id" FROM "boholz"."agents" WHERE "slug" = 'katja-rodewald-willms')
  AND "location_id" = (SELECT "id" FROM "boholz"."locations" WHERE "slug" = 'vertriebsbuero-jockgrim');--> statement-breakpoint
DELETE FROM "boholz"."agent_media" WHERE "agent_id" = (SELECT "id" FROM "boholz"."agents" WHERE "slug" = 'katja-rodewald-willms');--> statement-breakpoint
DELETE FROM "boholz"."agents" a
WHERE a."slug" = 'katja-rodewald-willms'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id");--> statement-breakpoint

-- ── New Vertriebsbüros: Zirndorf, Remchingen, Nittel ────────────────────────
INSERT INTO "boholz"."locations" ("title", "slug", "kind", "address", "postal_code", "city", "phone", "email")
SELECT 'Vertriebsbüro Zirndorf', 'vertriebsbuero-zirndorf', 'office', 'Traubenstraße 7', '90513', 'Zirndorf', '+49 176 20 56 63 40', 'h.simon@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."locations" WHERE "slug" = 'vertriebsbuero-zirndorf');--> statement-breakpoint
UPDATE "boholz"."locations" SET "title" = 'Vertriebsbüro Zirndorf', "kind" = 'office', "address" = 'Traubenstraße 7', "postal_code" = '90513', "city" = 'Zirndorf', "phone" = '+49 176 20 56 63 40', "email" = 'h.simon@boholz-haus.de' WHERE "slug" = 'vertriebsbuero-zirndorf';--> statement-breakpoint
INSERT INTO "boholz"."locations" ("title", "slug", "kind", "address", "postal_code", "city", "phone", "email")
SELECT 'Vertriebsbüro Remchingen', 'vertriebsbuero-remchingen', 'office', 'Murgstr. 12', '75196', 'Remchingen', '+49 172 72 33 05 7', 'a.roeck@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."locations" WHERE "slug" = 'vertriebsbuero-remchingen');--> statement-breakpoint
UPDATE "boholz"."locations" SET "title" = 'Vertriebsbüro Remchingen', "kind" = 'office', "address" = 'Murgstr. 12', "postal_code" = '75196', "city" = 'Remchingen', "phone" = '+49 172 72 33 05 7', "email" = 'a.roeck@boholz-haus.de' WHERE "slug" = 'vertriebsbuero-remchingen';--> statement-breakpoint
INSERT INTO "boholz"."locations" ("title", "slug", "kind", "address", "postal_code", "city", "phone", "email")
SELECT 'Vertriebsbüro Nittel', 'vertriebsbuero-nittel', 'office', 'In der Gewann 8', '54453', 'Nittel', '+49 176 40 90 12 69', 'g.schaffer@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."locations" WHERE "slug" = 'vertriebsbuero-nittel');--> statement-breakpoint
UPDATE "boholz"."locations" SET "title" = 'Vertriebsbüro Nittel', "kind" = 'office', "address" = 'In der Gewann 8', "postal_code" = '54453', "city" = 'Nittel', "phone" = '+49 176 40 90 12 69', "email" = 'g.schaffer@boholz-haus.de' WHERE "slug" = 'vertriebsbuero-nittel';--> statement-breakpoint

-- Remchingen has a named contact: Andreas Röck.
INSERT INTO "boholz"."agents" ("full_name", "slug", "role", "phone_number", "phone_secondary", "email")
SELECT 'Andreas Röck', 'andreas-roeck', 'Beratung und Verkauf', '+49 172 72 33 05 7', NULL, 'a.roeck@boholz-haus.de'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."agents" WHERE "slug" = 'andreas-roeck');--> statement-breakpoint
UPDATE "boholz"."agents" SET "full_name" = 'Andreas Röck', "role" = 'Beratung und Verkauf', "phone_number" = '+49 172 72 33 05 7', "email" = 'a.roeck@boholz-haus.de' WHERE "slug" = 'andreas-roeck';--> statement-breakpoint
INSERT INTO "boholz"."location_agents" ("agent_id", "location_id", "is_primary", "sort_order")
SELECT a."id", l."id", TRUE, 0
FROM "boholz"."agents" a, "boholz"."locations" l
WHERE a."slug" = 'andreas-roeck' AND l."slug" = 'vertriebsbuero-remchingen'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_agents" la WHERE la."agent_id" = a."id" AND la."location_id" = l."id");--> statement-breakpoint

-- Office house images (any house render — client: "Hauptsache es sind Bilder da").
INSERT INTO "boholz"."location_media" ("location_id", "media_id", "is_hero", "sort_order")
SELECT l."id", '01bee970-50ab-4e98-bf0c-07d7af5ac687', TRUE, 0
FROM "boholz"."locations" l WHERE l."slug" = 'vertriebsbuero-zirndorf'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_media" lm WHERE lm."location_id" = l."id" AND lm."is_hero" = TRUE);--> statement-breakpoint
INSERT INTO "boholz"."location_media" ("location_id", "media_id", "is_hero", "sort_order")
SELECT l."id", '9465bb0b-d5b4-4bce-81ae-53cfe69e6c34', TRUE, 0
FROM "boholz"."locations" l WHERE l."slug" = 'vertriebsbuero-remchingen'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_media" lm WHERE lm."location_id" = l."id" AND lm."is_hero" = TRUE);--> statement-breakpoint
INSERT INTO "boholz"."location_media" ("location_id", "media_id", "is_hero", "sort_order")
SELECT l."id", 'c7b54ce6-b2eb-415e-a884-d16ed63c44bc', TRUE, 0
FROM "boholz"."locations" l WHERE l."slug" = 'vertriebsbuero-nittel'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."location_media" lm WHERE lm."location_id" = l."id" AND lm."is_hero" = TRUE);--> statement-breakpoint

-- ══════════════════════════════════════════════════════════════════════════
-- #6 News — merge the 3 posts from boholz-haus.de that aren't in the DB yet.
-- Content is Markdown (rendered by news/[slug].astro via marked).
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO "boholz"."news" ("title", "slug", "excerpt", "content", "is_published", "published_at")
SELECT
  'Juli Samstag, 04.07.2026 Werksführung bei Keitel-Haus',
  'juli-samstag-04-07-2026-werksfuehrung-bei-keitel-haus',
  'Die Keitel-Haus GmbH ermöglicht interessierten Bauherrinnen und Bauherren in regelmäßigen Abständen sich selbst ein Bild von der Qualität der produzierten Fertighäuser zu machen.',
  E'Die Keitel-Haus GmbH ermöglicht interessierten Bauherrinnen und Bauherren in regelmäßigen Abständen sich selbst ein Bild von der Qualität der produzierten Fertighäuser zu machen.\n\nWir laden Sie somit herzlich ein, sich das Werk der Keitel-Haus GmbH in 74585 Rot am See-Brettheim bei der nächsten öffentlichen Führung (Beginn: 10:00 Uhr) anzusehen.\n\nBei Interesse melden Sie sich bitte bei BoHolz-Haus unter: [info@boholz-haus.de](mailto:info@boholz-haus.de)',
  TRUE, '2025-09-11 15:00:07+02'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."news" WHERE "slug" = 'juli-samstag-04-07-2026-werksfuehrung-bei-keitel-haus');--> statement-breakpoint
INSERT INTO "boholz"."news" ("title", "slug", "excerpt", "content", "is_published", "published_at")
SELECT
  '04. April 2026 Richtfest in 75242 Münsingen',
  'april-richtfest-in-75242-muenisngen',
  'Ein Richtfest ist ein besonderer Moment einer jeden Baufamilie und eine alte Tradition, die wir gerne mit unseren Bauinteressenten teilen möchten.',
  E'Ein Richtfest ist ein besonderer Moment einer jeden Baufamilie und eine alte Tradition, die wir gerne mit unseren Bauinteressenten teilen möchten.\n\nWir freuen uns Sie herzlich bei diesem Event begrüßen zu dürfen. Für das leibliche Wohl ist bestens gesorgt.\n\nFür weitere Informationen stehe ich Ihnen gerne telefonisch oder per E-Mail zur Verfügung.\n\nMobil: 0176 621 265 25  \nE-Mail: [m.dittrich@boholz-haus.de](mailto:m.dittrich@boholz-haus.de)\n\nIhr  \nMichael Dittrich',
  TRUE, '2024-07-15 11:07:21+02'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."news" WHERE "slug" = 'april-richtfest-in-75242-muenisngen');--> statement-breakpoint
INSERT INTO "boholz"."news" ("title", "slug", "excerpt", "content", "is_published", "published_at")
SELECT
  '30.04.2026 Richtfest in 71711 Steinheim a.d. Murr – Kleinbottwar',
  'aprilt-richtfest-in-7177-steinheim',
  'Ein Richtfest ist ein besonderer Moment einer jeden Baufamilie und eine alte Tradition, die wir gerne mit unseren Bauinteressenten teilen möchten.',
  E'Ein Richtfest ist ein besonderer Moment einer jeden Baufamilie und eine alte Tradition, die wir gerne mit unseren Bauinteressenten teilen möchten.\n\nWir freuen uns Sie herzlich bei diesem Event begrüßen zu dürfen. Für das leibliche Wohl ist bestens gesorgt.\n\nFür weitere Informationen stehe ich Ihnen gerne telefonisch oder per E-Mail zur Verfügung.\n\nMobil: 0176 621 265 25  \nE-Mail: [m.dittrich@boholz-haus.de](mailto:m.dittrich@boholz-haus.de)\n\nIhr  \nMichael Dittrich',
  TRUE, '2024-07-15 11:06:21+02'
WHERE NOT EXISTS (SELECT 1 FROM "boholz"."news" WHERE "slug" = 'aprilt-richtfest-in-7177-steinheim');--> statement-breakpoint

-- Juli post cover (the two Richtfest posts had no image on the old site).
INSERT INTO "boholz"."news_media" ("news_id", "media_id", "is_hero", "sort_order")
SELECT n."id", m."id", TRUE, 0
FROM "boholz"."news" n, "boholz"."media" m
WHERE n."slug" = 'juli-samstag-04-07-2026-werksfuehrung-bei-keitel-haus'
  AND m."path" = '/images/news/juli-samstag-04-07-2026-werksfuehrung-bei-keitel-haus/cover.webp'
  AND NOT EXISTS (SELECT 1 FROM "boholz"."news_media" nm WHERE nm."news_id" = n."id" AND nm."is_hero" = TRUE);
