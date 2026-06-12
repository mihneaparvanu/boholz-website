-- Pultdachhaus 21-349-225: short, accurate placeholder description pending
-- client confirmation. Avoids committing to a specific m² figure (349 vs the
-- 280,60 m² WoFlV) — that's flagged for the client to confirm. Data only.

UPDATE "boholz"."house_models"
SET "description" = 'Dieses moderne Pultdachhaus bietet auf drei Vollgeschossen großzügigen Wohnraum und einen wunderbaren Ausblick in die Natur.'
WHERE "slug" = 'pultdachhaus-21-349-225';
