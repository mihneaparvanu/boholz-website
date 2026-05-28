-- Data migration: align house specs with the client's canonical PDF
-- "Liste Homepage_Angepasst 28052026" (see dev/todo/houses/hausliste-homepage.md).
-- No schema change — data only. All statements are idempotent (keyed by slug;
-- the DELETE no-ops once the stale rows are gone), safe to re-run.

-- 1. Wohnfläche becomes the canonical living_area for every listed model.
--    The first/rounded PDF "Wohnfläche" column is the marketing figure that
--    drives the card, detail StatsGrid, filter thresholds and sort. The precise
--    Netto-DIN and WoFlV numbers stay on house_details for reporting.
--    MFH rows (not on the PDF) are intentionally untouched.
UPDATE "boholz"."house_models" SET "living_area" = CASE "slug"
  WHEN 'einfamilienhaus-38-115-125' THEN 115
  WHEN 'einfamilienhaus-38-128-125' THEN 128
  WHEN 'einfamilienhaus-45-139-75'  THEN 139
  WHEN 'einfamilienhaus-38-138-125' THEN 138
  WHEN 'einfamilienhaus-22-141-190' THEN 141
  WHEN 'einfamilienhaus-35-146-150' THEN 146
  WHEN 'einfamilienhaus-22-162-190' THEN 162
  WHEN 'einfamilienhaus-25-168-190' THEN 168
  WHEN 'einfamilienhaus-35-181-150' THEN 181
  WHEN 'einfamilienhaus-28-182-170' THEN 182
  WHEN 'einfamilienhaus-22-173-190' THEN 173
  WHEN 'einfamilienhaus-28-194-170' THEN 194
  WHEN 'stadtvilla-18-140'          THEN 140
  WHEN 'stadtvilla-22-157'          THEN 157
  WHEN 'stadtvilla-22-166'          THEN 166
  WHEN 'stadtvilla-22-173'          THEN 173
  WHEN 'kubus-0-140'                THEN 140
  WHEN 'kubus-0-166'                THEN 166
  WHEN 'kubus-0-173'                THEN 173
  WHEN 'kubus-0-190'                THEN 190
  WHEN 'kubus-0-278'                THEN 278
  WHEN 'generationenhaus-28-264-160' THEN 264
  WHEN 'zfh-280-22-0'               THEN 280
  WHEN 'pultdachhaus-21-349-225'    THEN 349
  WHEN 'doppelhaus-38-238-125'      THEN 238
  WHEN 'doppelhaus-28-299'          THEN 299
  WHEN 'bungalow-22-117'            THEN 117
  WHEN 'bungalow-22-134'            THEN 134
  WHEN 'bungalow-22-149'            THEN 149
  WHEN 'bestseller-family-150'      THEN 150
  WHEN 'bestseller-komfort-116'     THEN 116
  WHEN 'bestseller-weitblick-140'   THEN 140
  WHEN 'bestseller-plus-223'        THEN 223
  WHEN 'bestseller-twin-138'        THEN 138
  WHEN 'bestseller-freiraum-167'    THEN 167
  ELSE "living_area"
END
WHERE "slug" IN (
  'einfamilienhaus-38-115-125','einfamilienhaus-38-128-125','einfamilienhaus-45-139-75',
  'einfamilienhaus-38-138-125','einfamilienhaus-22-141-190','einfamilienhaus-35-146-150',
  'einfamilienhaus-22-162-190','einfamilienhaus-25-168-190','einfamilienhaus-35-181-150',
  'einfamilienhaus-28-182-170','einfamilienhaus-22-173-190','einfamilienhaus-28-194-170',
  'stadtvilla-18-140','stadtvilla-22-157','stadtvilla-22-166','stadtvilla-22-173',
  'kubus-0-140','kubus-0-166','kubus-0-173','kubus-0-190','kubus-0-278',
  'generationenhaus-28-264-160','zfh-280-22-0','pultdachhaus-21-349-225',
  'doppelhaus-38-238-125','doppelhaus-28-299',
  'bungalow-22-117','bungalow-22-134','bungalow-22-149',
  'bestseller-family-150','bestseller-komfort-116','bestseller-weitblick-140',
  'bestseller-plus-223','bestseller-twin-138','bestseller-freiraum-167'
);--> statement-breakpoint

-- 2. Kubus 0-140 — backfill DIN + WoFlV (was a draft row with NULLs).
UPDATE "boholz"."house_details"
SET "net_floor_area_din" = 139.90,
    "total_living_area_woflv" = 136.25
WHERE "id" = (SELECT "id" FROM "boholz"."house_models" WHERE "slug" = 'kubus-0-140');--> statement-breakpoint

-- 3. Kubus 0-173 — promoted from a Stadtvilla roof-variant to a standalone Kubus
--    in the new PDF. Backfill per PDF: Flachdach (not Attika), pitch 22°,
--    ELW = ja, plus DIN/WoFlV. NOTE: the Flachdach+22° combination is anomalous
--    (every other Kubus is "Flachdach, Attika" with no pitch) — taken literally
--    from the PDF; revisit if the client clarifies. See hausliste-homepage.md ⚠.
UPDATE "boholz"."house_models"
SET "roof_pitch" = 22
WHERE "slug" = 'kubus-0-173';--> statement-breakpoint

UPDATE "boholz"."house_details"
SET "roof_type" = 'Flachdach',
    "allows_granny_flat" = true,
    "net_floor_area_din" = 172.58,
    "total_living_area_woflv" = 170.85
WHERE "id" = (SELECT "id" FROM "boholz"."house_models" WHERE "slug" = 'kubus-0-173');--> statement-breakpoint

-- 4. Stadtvilla 18-140 — drop the stale Flachdach floor plans. The Flachdach
--    version is now the standalone Kubus 0-140, so these rows (which pointed at
--    the Walmdach plans) are misleading. Stadtvilla 18-140 keeps only its
--    default Walmdach EG/OG plans.
DELETE FROM "boholz"."floor_media"
WHERE "variant" = 'flachdach'
  AND "model_id" = (SELECT "id" FROM "boholz"."house_models" WHERE "slug" = 'stadtvilla-18-140');
