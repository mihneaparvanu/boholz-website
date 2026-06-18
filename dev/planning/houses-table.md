# Hausliste Homepage — House Filter Reference Table

> **Source:** marketing-team spreadsheet "Hausliste Homepage" (screenshot provided 2026-05-21).
> **Status:** transcription — pending user confirmation of accuracy before any DB / filter logic changes.
>
> This document has three sections:
> 1. **Section 1** — the raw table, transcribed row-for-row from the screenshot.
> 2. **Section 2** — column glossary (what each German header means + which are already in the DB / filter panel).
> 3. **Section 3** — cross-reference against the 32 models currently in `boholz.house_models`, calling out the new model and the roof-variant gaps.

---

## Section 1 — Raw Table

| # | Hausname | Wohnfläche (m²) | Geschosse | Dachform | Dachneigung | Kniestock | Netto-Grundfläche nach DIN | Gesamtwohnfläche nach WoFlV | Anbau | Einliegerwohnung möglich |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Einfamilienhaus 38-115-125 | 115 | 1,5 | Satteldach | 38° | 125 cm | 114,94 m² | 104,94 m² | — | — |
| 2 | Einfamilienhaus 38-128-125 | 128 | 1,5 | Satteldach | 38° | 125 cm | 127,57 m² | 116,56 m² | — | — |
| 3 | Einfamilienhaus 45-139-75 | 139 | 1,5 | Satteldach | 45° | 75 cm | 138,57 m² | 126,01 m² | Erker 38° | — |
| 4 | Einfamilienhaus 38-138-125 | 138 | 1,5 | Satteldach | 38° | 125 cm | 137,90 m² | 126,73 m² | — | — |
| 5 | Einfamilienhaus 22-141-190 | 141 | 1,5 | Satteldach | 22° | 190 cm | 141,56 m² | 132,49 m² | — | — |
| 6 | Einfamilienhaus 35-146-150 | 146 | 1,5 | Satteldach | 35° | 150 cm | 145,86 m² | 137,47 m² | — | — |
| 7 | Einfamilienhaus 22-162-190 | 162 | 1,5 | Satteldach | 22° | 190 cm | 161,95 m² | 152,89 m² | — | — |
| 8 | Einfamilienhaus 25-168-190 | 168 | 1,5 | Satteldach | 25° | 190 cm | 168,15 m² | 161,05 m² | — | — |
| 9 | Einfamilienhaus 35-181-150 | 181 | 1,5 | Satteldach | 35° | 150 cm | 181,22 m² | 171,54 m² | — | **ja** |
| 10 | Einfamilienhaus 28-182-170 | 182 | 1,5 | Satteldach | 28° | 170 cm | 182,17 m² | 171,06 m² | — | — |
| 11 | Einfamilienhaus 22-173-190 | 173 | 1,5 | Satteldach | 22° | 190 cm | 172,58 m² | 162,45 m² | — | **ja** |
| 12 | Einfamilienhaus 28-194-170 | 194 | 1,5 | Satteldach | 28° | 170 cm | 194,07 m² | 177,26 m² | — | **ja** |
| 13 | Stadtvilla 18-140 | 140 | 2 | Walmdach | 18° | nein | 139,90 m² | 136,25 m² | — | — |
| 14 | Stadtvilla 18-140 | 140 | 2 | Flachdach, Attika | — | nein | 139,90 m² | 136,25 m² | — | — |
| 15 | Stadtvilla 22-157 | 157 | 2 | Walmdach | 22° | nein | 156,91 m² | 154,96 m² | Garage | — |
| 16 | Stadtvilla 22-166 | 166 | 2 | Walmdach | 22° | nein | 166,36 m² | 164,54 m² | Garage | — |
| 17 | Stadtvilla 22-173 | 173 | 2 | Walmdach | 22° | nein | 172,58 m² | 170,85 m² | — | **ja** |
| 18 | Stadtvilla 22-173 | 173 | 2 | Flachdach | 22° | nein | 172,58 m² | 170,85 m² | — | **ja** |
| 19 | Generationenhaus 28-264-160 | 264 | 1,5 | Satteldach | 28° | 160 cm | 263,89 m² | 244,71 m² | — | **ja** |
| 20 | Generationenhaus 22-280 | 280 | 2 | Walmdach | 22° | nein | 268,90 m² | — | — | — |
| 21 | Pultdachhaus 21-349-225 | 349 | 1,5 | Pultdach | 21° | 225 cm | 348,66 m² | 280,60 m² | — | **ja** |
| 22 | Doppelhaus 38-238-125 | 238 | 1,5 | Satteldach | 38° | 125 cm | 237,78 m² | 226,87 m² | — | — |
| 23 | Doppelhaus 28-299 | 299 | 2 | Walmdach | 28° | nein | 299,04 m² | 295,17 m² | — | — |
| 24 | Kubus 0-166 | 166 | 2 | Flachdach, Attika | — | nein | 166,36 m² | 164,54 m² | Garage | — |
| 25 | Kubus 0-190 | 190 | 2 | Flachdach, Attika | — | nein | 189,68 m² | 176,30 m² | — | — |
| 26 | Kubus 0-278 | 278 | 2 | Flachdach, Attika | — | nein | 278,01 m² | 245,22 m² | — | — |
| 27 | Bungalow 22-117 | 117 | 1 | Walmdach | 22° | nein | 116,58 m² | 111,74 m² | — | — |
| 28 | Bungalow 22-134 | 134 | 1 | Walmdach | 22° | nein | 134,18 m² | 134,18 m² | — | **ja** |
| 29 | Bungalow 22-149 | 149 | 1 | Walmdach | 22° | nein | 149,18 m² | 134,54 m² | — | — |
| 30 | Bungalow 22-149 | 149 | 1 | Flachdach, Attika | — | nein | 149,18 m² | 134,54 m² | — | — |
| 31 | Bestseller Famiy 150 *(sic — spreadsheet typo)* | 150 | 1,5 | Satteldach | 32° | — | 150,15 m² | 139,52 m² | — | — |
| 32 | Bestseller Komfort 116 | 116 | 1 | Walmdach | 22° | — | 116,20 m² | 106,77 m² | — | — |
| 33 | Bestseller Weitblick 140 | 140 | 2 | Walmdach | 22° | — | 139,61 m² | 137,95 m² | — | — |
| 34 | Bestseller Plus 223 | 223 | 1,5 | Satteldach | 30° | — | 223,39 m² | 209,90 m² | — | — |
| 35 | Bestseller Twin 138 | 138 | 1,5 | Satteldach | 25° | — | 137,50 m² | 134,76 m² | — | — |
| 36 | Bestseller Freiraum 167 | 167 | 1,5 | Satteldach | 30° | — | 167,48 m² | 156,96 m² | — | — |

### Extraction conventions
- Empty cell in the screenshot → `—` (em-dash).
- `nein` in the Kniestock column means "no knee wall" (a full-height upper storey or a flat-roof house — i.e. there is no sloped attic with a dwarf wall under it).
- `ja` in the Einliegerwohnung column means a granny-flat ("ELW") layout is offered.
- Row 31 — "Famiy" is a typo for "Family" but is preserved as it appears in the spreadsheet so you can grep for the exact source string.
- Rows 13/14, 17/18, 29/30 are roof variants of the same base model (different Dachform, identical Wohnfläche / Geschosse / areas). These are **not** separate models in the DB sense — they're two roof options on one model.

---

## Section 2 — Column Glossary

| Column | Meaning | Storage type | In DB today? | Filterable today? |
|---|---|---|---|---|
| **Hausname** | Display title (e.g. "Einfamilienhaus 38-115-125"). | `varchar` | ✅ `house_models.title` | n/a (display) |
| **Wohnfläche** | Living area in m². | `numeric` | ✅ `house_models.living_area` | ❌ only sortable, no range filter |
| **Geschosse** | Floor count. `1` = single-storey, `1,5` = ground floor + sloped attic (Ausbaureserve = "expansion reserve" — a partly-finished upper floor under a sloped roof), `2` = two full storeys. | numeric (1/1.5/2) | ⚠ `house_details.level_count` is `smallint` — cannot store 1.5 | ❌ not in filter options |
| **Dachform** | Roof shape. Values seen: `Satteldach` (gabled, standard 2-slope), `Walmdach` (hipped, slopes on all 4 sides), `Flachdach` (flat), `Flachdach, Attika` (flat-roof with a raised parapet), `Pultdach` (mono-pitched / shed). | enum/varchar | ✅ `house_details.roof_type` | ✅ `roofType` enum filter — but the "Flachdach, Attika" compound value isn't in the existing enum |
| **Dachneigung** | Roof pitch in degrees. Empty for flat-roof variants (Flachdach has no pitch). | `integer` | ✅ `house_models.roof_pitch` | ❌ not in filter options |
| **Kniestock** | Knee-wall height in cm — the short vertical wall between the upper floor's floor slab and the sloped roof. Affects upper-floor head-height. `nein` = no kniestock (full storey, flat roof, etc.). Empty (Bestseller rows) = value not published in this table. | `smallint` (cm) or null | ✅ `house_details.kniestock` (nullable smallint) | ✅ `hasKniestock` boolean filter (presence only — not exact height) |
| **Netto-Grundfläche nach DIN** | Net floor area per DIN 277 — usable interior floor area excluding wall thickness, columns, etc. The "raw" interior area metric. | `numeric` m² | ❌ **no column** | ❌ |
| **Gesamtwohnfläche nach WoFlV** | Total living area per Wohnflächenverordnung (German residential floor-area calculation method — counts sloped-ceiling area at 50% if ceiling is 1-2m tall, 0% if <1m). The legally-quoted "marketing" living area. | `numeric` m² | ⚠ `house_models.total_area` exists but is undocumented and currently empty — may or may not be intended for this. Needs decision. | ❌ |
| **Anbau** | "Add-on" / extension. Free text. Values seen: `Erker 38°` (a bay window with its own 38°-pitched roof), `Garage`, or empty. | nullable `varchar` | ❌ no field for free-text extensions (`has_garage` boolean exists but loses both the bay-window info and the pitch) | ⚠ partial via `hasGarage` filter |
| **Einliegerwohnung möglich** | "Granny flat possible". `ja` = the floor plan supports a separate self-contained unit (own entrance, kitchen, bathroom — common in German EFHs to house ageing parents or as rental income). Empty = not offered. | `boolean` | ❌ **no column** | ❌ |

### What's missing from the DB (summary)

Five table columns are not yet represented in `house_models` / `house_details`:

1. **Geschosse as 1/1.5/2** — `level_count` is `smallint`, can't represent half-floors.
2. **Netto-Grundfläche nach DIN** — no column.
3. **Gesamtwohnfläche nach WoFlV** — `total_area` exists but unused/undocumented; needs confirmation.
4. **Anbau (free-text extension)** — only a `has_garage` boolean; loses bay-window detail.
5. **Einliegerwohnung möglich** — no column.

### What's missing from the filter panel (summary)

Five filter axes the table exposes that the panel doesn't:

1. **Floor count** (1 / 1.5 / 2) — not filterable.
2. **Roof pitch** range — not filterable.
3. **Living area** range (e.g. <150 / 150-200 / 200-250 / 250+) — only sortable.
4. **Extension** (Erker / Garage / none) — only `hasGarage` boolean exists.
5. **Granny flat** — not filterable.

---

## Section 3 — Cross-reference: Table vs. DB

**Unique models in the table** (after collapsing roof variants): **33**
**Models currently in `boholz.house_models`:** **32**

### 3.1 Matches (32 — every DB model has a corresponding table row)

| Table row | DB slug | DB modelCode | Category |
|---|---|---|---|
| 1 — Einfamilienhaus 38-115-125 | `einfamilienhaus-38-115-125` | 38-115-125 | einfamilienhaus |
| 2 — Einfamilienhaus 38-128-125 | `einfamilienhaus-38-128-125` | 38-128-125 | einfamilienhaus |
| 3 — Einfamilienhaus 45-139-75 | `einfamilienhaus-45-139-75` | 45-139-75 | einfamilienhaus |
| 4 — Einfamilienhaus 38-138-125 | `einfamilienhaus-38-138-125` | 38-138-125 | einfamilienhaus |
| 5 — Einfamilienhaus 22-141-190 | `einfamilienhaus-22-141-190` | 22-141-190 | einfamilienhaus |
| 6 — Einfamilienhaus 35-146-150 | `einfamilienhaus-35-146-150` | 35-146-150 | einfamilienhaus |
| 7 — Einfamilienhaus 22-162-190 | `einfamilienhaus-22-162-190` | 22-162-190 | einfamilienhaus |
| 8 — Einfamilienhaus 25-168-190 | `einfamilienhaus-25-168-190` | 25-168-190 | einfamilienhaus |
| 9 — Einfamilienhaus 35-181-150 | `einfamilienhaus-35-181-150` | 35-181-150 | einfamilienhaus |
| 10 — Einfamilienhaus 28-182-170 | `einfamilienhaus-28-182-170` | 28-182-170 | einfamilienhaus |
| 11 — Einfamilienhaus 22-173-190 | `einfamilienhaus-22-173-190` | 22-173-190 | einfamilienhaus |
| 12 — Einfamilienhaus 28-194-170 | `einfamilienhaus-28-194-170` | 28-194-170 | einfamilienhaus |
| 13/14 — Stadtvilla 18-140 (2 roof variants) | `stadtvilla-18-140` | 18-140 | stadtvilla |
| 15 — Stadtvilla 22-157 | `stadtvilla-22-157` | 22-157 | stadtvilla |
| 16 — Stadtvilla 22-166 | `stadtvilla-22-166` | 22-166 | stadtvilla |
| 17/18 — Stadtvilla 22-173 (2 roof variants) | `stadtvilla-22-173` | 22-173 | stadtvilla |
| 19 — Generationenhaus 28-264-160 | `generationenhaus-28-264-160` | 28-264-160 | generationenhaus |
| 21 — Pultdachhaus 21-349-225 | `pultdachhaus-21-349-225` | 21-349-225 | pultdachhaus |
| 22 — Doppelhaus 38-238-125 | `doppelhaus-38-238-125` | 38-238-125 | doppelhaus |
| 23 — Doppelhaus 28-299 | `doppelhaus-28-299` | 28-299 | doppelhaus |
| 24 — Kubus 0-166 | `kubus-0-166` | 0-166 | kubus |
| 25 — Kubus 0-190 | `kubus-0-190` | 0-190 | kubus |
| 26 — Kubus 0-278 | `kubus-0-278` | 0-278 | kubus |
| 27 — Bungalow 22-117 | `bungalow-22-117` | 22-117 | bungalow |
| 28 — Bungalow 22-134 | `bungalow-22-134` | 22-134 | bungalow |
| 29/30 — Bungalow 22-149 (2 roof variants) | `bungalow-22-149` | 22-149 | bungalow |
| 31 — Bestseller Famiy 150 | `bestseller-family-150` | 32-150-170 | einfamilienhaus (isFeatured) |
| 32 — Bestseller Komfort 116 | `bestseller-komfort-116` | 22-116-000 | bungalow (isFeatured) |
| 33 — Bestseller Weitblick 140 | `bestseller-weitblick-140` | 22-140-000 | stadtvilla (isFeatured) |
| 34 — Bestseller Plus 223 | `bestseller-plus-223` | 30-223-160 | generationenhaus (isFeatured) |
| 35 — Bestseller Twin 138 | `bestseller-twin-138` | 25-138-210 | doppelhaus (isFeatured) |
| 36 — Bestseller Freiraum 167 | `bestseller-freiraum-167` | 30-168-160 | einfamilienhaus (isFeatured) |

### 3.2 In table but **not** in DB

- **Row 20 — Generationenhaus 22-280** (280 m², 2 Geschosse, Walmdach 22°, no Kniestock). **NEW model — needs an `INSERT INTO boholz.house_models` (and matching `house_details`, images, etc.).** No existing model code or slug to graft onto.

### 3.3 In DB but **not** in table

None. Every DB model maps to at least one table row.

### 3.4 Roof variants — the structural gap

Three models in the table appear twice (same code, different Dachform). The DB stores ONE `roof_type` per model, so it can only carry one of the two variants per row:

| Model | Variant A | Variant B |
|---|---|---|
| Stadtvilla 18-140 | Walmdach 18° | Flachdach, Attika (no pitch) |
| Stadtvilla 22-173 | Walmdach 22° | Flachdach 22° |
| Bungalow 22-149 | Walmdach 22° | Flachdach, Attika (no pitch) |

The current DB row for each of these stores only one of the two — meaning **the site currently misrepresents these as single-roof models**. Fix options:

- **(A)** JSON column `house_models.roof_variants` — array of `{type, pitch}`.
- **(B)** Pivot table `roof_variants(model_id, roof_type, roof_pitch, sort_order)`. Cleanest; future-proof for further variants. **Recommended.**
- **(C)** Promote each variant to its own row (slug-suffixed). Heaviest impact — touches URLs, R2 paths, all pivot tables. Not recommended.

---

## Next steps (pending user confirmation)

1. **User confirms** Section 1 is accurate vs. the screenshot.
2. **User confirms** which DB approach to take for the gaps (Section 2) and the roof variants (Section 3.4).
3. I produce a sub-plan with the exact Drizzle migration, seed-script, and `filter-panel.options.ts` additions.
4. Apply the changes in one transactional pass.
