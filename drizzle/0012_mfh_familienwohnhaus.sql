-- Data migration: rename the four Mehrfamilienhaus models to "<n>-Familienwohnhaus"
-- per client request (2026-06), surface their living area as "auf Anfrage"
-- (living_area = NULL → StatsGrid renders "auf Anfrage"), harmonise the
-- back-office families_count with the new names, and give Schechingen the shared
-- MFH body copy (Dombühl/Ilshofen/Satteldorf already carry it).
--
-- No schema change — data only. All statements are idempotent (keyed by slug),
-- safe to re-run. The `description` column is plain text; the detail page
-- renders it with `white-space: pre-line`, so the blank lines and "•" bullet
-- rows below survive verbatim — no markdown parsing required.

-- 1. Titles — "Haus <Ort> · Mehrfamilienhaus" becomes "<n>-Familienwohnhaus".
--    The category eyebrow still reads "Mehrfamilienhaus"; the slug is unchanged
--    so existing /haus/<slug> URLs keep resolving.
UPDATE "boholz"."house_models" SET "title" = CASE "slug"
  WHEN 'mfh-dombuhl'     THEN '10-Familienwohnhaus'
  WHEN 'mfh-ilshofen'    THEN '12-Familienwohnhaus'
  WHEN 'mfh-satteldorf'  THEN '12-Familienwohnhaus'
  WHEN 'mfh-schechingen' THEN '18-Familienwohnhaus'
  ELSE "title"
END
WHERE "slug" IN ('mfh-dombuhl','mfh-ilshofen','mfh-satteldorf','mfh-schechingen');--> statement-breakpoint

-- 2. Fläche "auf Anfrage" — clearing living_area makes the detail StatsGrid show
--    "auf Anfrage" instead of an m² figure (these designs are concepts, not a
--    fixed Wohnfläche). Listing/landing cards omit the area line for null.
UPDATE "boholz"."house_models" SET "living_area" = NULL
WHERE "slug" IN ('mfh-dombuhl','mfh-ilshofen','mfh-satteldorf','mfh-schechingen');--> statement-breakpoint

-- 3. Unit counts harmonised with the new names. families_count is back-office
--    only (not on the detail page) but drives the "<n> Einheiten" card spec in
--    lib/derive.ts, so keep it truthful. Ilshofen & Satteldorf stay 12.
UPDATE "boholz"."house_details" AS d SET "families_count" = 10
FROM "boholz"."house_models" AS m
WHERE m."id" = d."id" AND m."slug" = 'mfh-dombuhl';--> statement-breakpoint

UPDATE "boholz"."house_details" AS d SET "families_count" = 18
FROM "boholz"."house_models" AS m
WHERE m."id" = d."id" AND m."slug" = 'mfh-schechingen';--> statement-breakpoint

-- 4. Descriptions.
--    Dombühl: keep the existing shared body, only swap the headline + unit count
--    from 12 to 10.
UPDATE "boholz"."house_models" SET "description" = $body$Modernes 10-Familienhaus in nachhaltiger Bauweise.

Dieser Entwurf zeigt ein mögliches Konzept für ein Mehrfamilienhaus mit 10 Wohneinheiten, das sowohl zur Vermietung als auch zum Verkauf realisiert werden könnte. Die Bauweise in KfW-40-Standard sorgt für eine hohe Energieeffizienz und niedrige Betriebskosten.

Mögliche Merkmale des Gebäudes:

• Wohnungsgrößen von ca. 40 m² bis 120 m² – für Singles, Paare und Familien
• Verschiedene Grundrisse, individuell anpassbar nach Bedarf
• Barrierefreie und altersgerechte Gestaltung mit Aufzug
• Balkone oder Terrassen für jede Wohneinheit
• Tiefgarage und Außenstellplätze für komfortables Parken
• Nachhaltige Bauweise für ein angenehmes Wohnklima

Dieser Entwurf dient als Orientierung für ein mögliches Bauprojekt. Anpassungen an individuelle Wünsche und Gegebenheiten sind jederzeit möglich.$body$
WHERE "slug" = 'mfh-dombuhl';--> statement-breakpoint

-- 4b. Schechingen: previously empty. Use the client-supplied copy, with the body
--     unit count harmonised to 18 to match the "18-Familienhaus" headline.
UPDATE "boholz"."house_models" SET "description" = $body$Modernes 18-Familienhaus in nachhaltiger Bauweise.

Dieser Entwurf zeigt ein mögliches Konzept für ein Mehrfamilienhaus mit 18 Wohneinheiten, das sowohl zur Vermietung als auch zum Verkauf realisiert werden könnte. Die Bauweise in KfW-40-Standard sorgt für eine hohe Energieeffizienz und niedrige Betriebskosten.

Mögliche Merkmale des Gebäudes:

• Wohnungsgrößen von ca. 40 m² bis 120 m² – für Singles, Paare und Familien
• Verschiedene Grundrisse, individuell anpassbar nach Bedarf
• Barrierefreie und altersgerechte Gestaltung mit Aufzug
• Balkone oder Terrassen für jede Wohneinheit
• Tiefgarage und Außenstellplätze für komfortables Parken
• Nachhaltige Bauweise für ein angenehmes Wohnklima

Dieser Entwurf dient als Orientierung für ein mögliches Bauprojekt. Anpassungen an individuelle Wünsche und Gegebenheiten sind jederzeit möglich.$body$
WHERE "slug" = 'mfh-schechingen';
