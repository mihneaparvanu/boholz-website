-- Pultdachhaus 21-349-225 spec correction (client-confirmed, 12 June 2026).
-- Etagen was 1.5, which contradicts the description ("drei Vollgeschossen")
-- and the client image (a clearly 3-storey house) → set to 3. The model
-- number 21-349-225 (349, not 369) is confirmed; converge title/code to it.
-- Data only, idempotent — safe to re-run.

UPDATE "boholz"."house_details"
SET "floor_count" = 3
WHERE "id" = (SELECT "id" FROM "boholz"."house_models" WHERE "slug" = 'pultdachhaus-21-349-225');--> statement-breakpoint

UPDATE "boholz"."house_models"
SET "title" = 'Pultdachhaus 21-349-225', "model_code" = '21-349-225'
WHERE "slug" = 'pultdachhaus-21-349-225';
