# Hausliste Homepage (Stand 28.05.2026)

Source: client PDF `Liste Homepage_Angepasst 28052026.pdf`, supplied 2026-05-28.
This is the canonical specification of which models appear in the homepage
catalogue and what their headline specs are. The PDF is deleted after this
conversion — this file is now the source of truth.

## Column legend

| Column | Meaning |
| --- | --- |
| **Wohnfläche** | Marketing/round living-area figure used in the model name |
| **Geschosse** | Full storeys (1, 1.5, 2) |
| **Dachform** | Satteldach (gable), Walmdach (hip), Pultdach (mono-pitch), Flachdach (flat), "Attika" = parapet |
| **Dachneigung** | Roof pitch (degrees); blank for true flat roofs |
| **Kniestock** | Knee-wall height (cm); `nein` for full 2-storey houses, blank where unspecified (Bestseller series) |
| **Netto-Grundfläche DIN** | Net floor area per DIN 277 |
| **Gesamtwohnfläche WoFlV** | Total living area per Wohnflächenverordnung (legally binding figure) |
| **Anbau** | Optional extension (Erker = bay, Garage) |
| **Einliegerwohnung** | `ja` if granny-flat layout is available |

Non-Bestseller naming pattern: `<Typ> <Dachneigung>-<Wohnfläche>-<Kniestock>`
(e.g. `Einfamilienhaus 38-115-125` = 38° pitch, 115 m², 125 cm knee wall).

---

## ⭐ Filter & Detail spec — the 10 green-highlighted PDF columns

The columns highlighted green in the source PDF are **the canonical set of specs** for every house in the homepage catalogue. They are:

1. The complete list of fields that must appear on every house's detail page
2. The complete set the filter panel operates on

Anything else carried in the DB (bedroom count, bathroom count, width / length / height, has-garage legacy boolean, barrier-free flag, children-room flag, families count, total_area, price for non-Bestseller rows) **is not in this spec** and must not appear on the detail page or in filters. The data stays in the DB for back-office use; the front-end is gated by this list.

| # | PDF column | DB source | Detail page | Filter |
| - | --- | --- | --- | --- |
| 1 | **Hausname** | `house_models.title` | Title (`SideCard.title`) | — (free-text search optional, not in spec) |
| 2 | **Wohnfläche** | `house_models.living_area` (rounded marketing m²) | Hero stat (`StatsGrid` → "Fläche") | ✓ threshold or range slider |
| 3 | **Geschosse** | `house_details.floor_count` (1 / 1.5 / 2) | DetailsGrid → "Etagen" | ✓ enum chips |
| 4 | **Dachform** | `house_details.roof_type` (Satteldach / Walmdach / Pultdach / Flachdach / Flachdach, Attika) | Roof capsule (`RoofCapsule`) on detail page, mirroring the card | ✓ enum chips |
| 5 | **Dachneigung** | `house_models.roof_pitch` (degrees, NULL for flat roofs) | Bundled into the roof capsule next to the type | ✓ range slider, hide when Dachform = Flachdach\* |
| 6 | **Kniestock** | `house_details.kniestock` (cm; NULL = nein / not applicable) | DetailsGrid → "Kniestock" (display "—" or "nein" when NULL) | ✓ "vorhanden" toggle, optionally a cm-band range |
| 7 | **Netto-Grundfläche nach DIN** | `house_details.net_floor_area_din` (m²) | DetailsGrid → "Netto-Grundfläche (DIN 277)" | ✗ detail-only (too precise to filter on) |
| 8 | **Gesamtwohnfläche nach WoFlV** | `house_details.total_living_area_woflv` (m²) | DetailsGrid → "Gesamtwohnfläche (WoFlV)" — note this is the **legally binding** figure | ✗ detail-only |
| 9 | **Anbau** | `house_details.extension_description` (free text: "Erker 38°", "Garage", or NULL) | DetailsGrid → "Anbau" (omit row when NULL) | ✓ presence toggle, or enum on the populated values (Erker / Garage) |
| 10 | **Einliegerwohnung möglich** | `house_details.allows_granny_flat` (boolean) | DetailsGrid → "Einliegerwohnung" ja/nein | ✓ yes-toggle |

### Implementation directives for the detail page rebuild

- The detail page should render rows 2–10 (everything except the title, which is already in the header) as a single "Technische Daten" / DetailsGrid block.
- Suppress rows whose value is NULL/empty so the layout adapts (e.g. Bestsellers have no Kniestock value, Stadtvillen have no Kniestock by design — the row should just not render).
- The roof capsule already lives on the catalogue card; reuse `RoofCapsule.vue` on the detail page rather than building a parallel display for Dachform + Dachneigung.
- Today's `DetailsGrid` carries Breite / Länge / Höhe / Garage (legacy boolean) that are NOT in this spec — remove these from the detail page (keep the DB columns).

### Implementation directives for the filter overhaul

- Filter panel should expose **only** the rows marked ✓ above (Wohnfläche, Geschosse, Dachform, Dachneigung, Kniestock, Anbau, Einliegerwohnung).
- The current `Schlafzimmer` and `Badezimmer` count chips, the `Garage` boolean toggle (legacy), and the `Preis ↑↓` sort option must come out.
- Sort options should be trimmed to: Wohnfläche, Name (Geschosse and Schlafzimmer sorts are out — Geschosse is too coarse, Schlafzimmer isn't in the spec).
- Dachneigung filter is conditional: only meaningful for pitched roofs; if Dachform = Flachdach is selected, the Dachneigung control should be disabled or hidden.

\* Note on Flachdach + Dachneigung: in the current data, `Kubus 0-173` carries `Flachdach` with `roof_pitch = 22°` (the only flat-roof model with a pitch); every other Kubus has Dachform = `Flachdach, Attika` with NULL pitch. Whether 0-173 keeps the 22° depends on client clarification (flagged ⚠ in the Kubus section below) — the filter behaviour should default to "hide pitch when flat" but tolerate the 0-173 anomaly until resolved.

---

## Einfamilienhaus — 12 models

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto DIN | WoFlV | Anbau | ELW |
| --- | ---: | :-: | --- | :-: | :-: | ---: | ---: | --- | :-: |
| Einfamilienhaus 38-115-125 | 115 | 1,5 | Satteldach | 38° | 125 cm | 114,94 m² | 104,94 m² | | |
| Einfamilienhaus 38-128-125 | 128 | 1,5 | Satteldach | 38° | 125 cm | 127,57 m² | 116,56 m² | | |
| Einfamilienhaus 45-139-75 | 139 | 1,5 | Satteldach | 45° | 75 cm | 138,57 m² | 126,01 m² | Erker 38° | |
| Einfamilienhaus 38-138-125 | 138 | 1,5 | Satteldach | 38° | 125 cm | 137,90 m² | 126,73 m² | | |
| Einfamilienhaus 22-141-190 | 141 | 1,5 | Satteldach | 22° | 190 cm | 141,56 m² | 132,49 m² | | |
| Einfamilienhaus 35-146-150 | 146 | 1,5 | Satteldach | 35° | 150 cm | 145,86 m² | 137,47 m² | | |
| Einfamilienhaus 22-162-190 | 162 | 1,5 | Satteldach | 22° | 190 cm | 161,95 m² | 152,89 m² | | |
| Einfamilienhaus 25-168-190 | 168 | 1,5 | Satteldach | 25° | 190 cm | 168,15 m² | 161,05 m² | | |
| Einfamilienhaus 35-181-150 | 181 | 1,5 | Satteldach | 35° | 150 cm | 181,22 m² | 171,54 m² | | ja |
| Einfamilienhaus 28-182-170 | 182 | 1,5 | Satteldach | 28° | 170 cm | 182,17 m² | 171,06 m² | | |
| Einfamilienhaus 22-173-190 | 173 | 1,5 | Satteldach | 22° | 190 cm | 172,58 m² | 162,45 m² | | ja |
| Einfamilienhaus 28-194-170 | 194 | 1,5 | Satteldach | 28° | 170 cm | 194,07 m² | 177,26 m² | | ja |

## Stadtvilla — 4 models

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto DIN | WoFlV | Anbau | ELW |
| --- | ---: | :-: | --- | :-: | :-: | ---: | ---: | --- | :-: |
| Stadtvilla 18-140 | 140 | 2 | Walmdach | 18° | nein | 139,90 m² | 136,25 m² | | |
| Stadtvilla 22-157 | 157 | 2 | Walmdach | 22° | nein | 156,91 m² | 154,96 m² | Garage | |
| Stadtvilla 22-166 | 166 | 2 | Walmdach | 22° | nein | 166,36 m² | 164,54 m² | Garage | |
| Stadtvilla 22-173 | 173 | 2 | Walmdach | 22° | nein | 172,58 m² | 170,85 m² | | ja |

## Kubus — 5 models

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto DIN | WoFlV | Anbau | ELW |
| --- | ---: | :-: | --- | :-: | :-: | ---: | ---: | --- | :-: |
| Kubus 0-140 | 140 | 2 | Flachdach, Attika | | nein | 139,90 m² | 136,25 m² | | |
| Kubus 0-166 | 166 | 2 | Flachdach, Attika | | nein | 166,36 m² | 164,54 m² | Garage | |
| Kubus 0-173 | 173 | 2 | Flachdach | 22° ⚠ | nein | 172,58 m² | 170,85 m² | | ja |
| Kubus 0-190 | 190 | 2 | Flachdach, Attika | | nein | 189,68 m² | 176,30 m² | | |
| Kubus 0-278 | 278 | 2 | Flachdach, Attika | | nein | 278,01 m² | 245,22 m² | | |

⚠ Kubus 0-173 in the source PDF has Dachform = `Flachdach` (without "Attika") and Dachneigung = `22°`. Every other Kubus is `Flachdach, Attika` with no pitch. Verify with client whether 0-173 is genuinely a different roof construction or whether this is a transcription artefact carried over from when the row used to be `Stadtvilla 22-173 Flachdach`.

## Generationenhaus — 2 models

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto DIN | WoFlV | Anbau | ELW |
| --- | ---: | :-: | --- | :-: | :-: | ---: | ---: | --- | :-: |
| Generationenhaus 28-264-160 | 264 | 1,5 | Satteldach | 28° | 160 cm | 263,89 m² | 244,71 m² | | ja |
| Generationenhaus 22-280 | 280 | 2 | Walmdach | 22° | nein | 268,90 m² | — | | |

## Pultdachhaus — 1 model

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto DIN | WoFlV | Anbau | ELW |
| --- | ---: | :-: | --- | :-: | :-: | ---: | ---: | --- | :-: |
| Pultdachhaus 21-349-225 | 349 | 1,5 | Pultdach | 21° | 225 cm | 348,66 m² | 280,60 m² | | ja |

## Doppelhaus — 2 models

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto DIN | WoFlV | Anbau | ELW |
| --- | ---: | :-: | --- | :-: | :-: | ---: | ---: | --- | :-: |
| Doppelhaus 38-238-125 | 238 | 1,5 | Satteldach | 38° | 125 cm | 237,78 m² | 226,87 m² | | |
| Doppelhaus 28-299 | 299 | 2 | Walmdach | 28° | nein | 299,04 m² | 295,17 m² | | |

## Bungalow — 3 models

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto DIN | WoFlV | Anbau | ELW |
| --- | ---: | :-: | --- | :-: | :-: | ---: | ---: | --- | :-: |
| Bungalow 22-117 | 117 | 1 | Walmdach | 22° | nein | 116,58 m² | 111,74 m² | | |
| Bungalow 22-134 | 134 | 1 | Walmdach | 22° | nein | 134,18 m² | 134,18 m² | | ja |
| Bungalow 22-149 | 149 | 1 | Walmdach | 22° | nein | 149,18 m² | 134,54 m² | | |

## Bestseller — 6 models (virtual category)

Surfaced via `houseModels.isFeatured = true`; each row's structural category
(Einfamilienhaus, Stadtvilla, Bungalow, Doppelhaus, Generationenhaus) is
preserved in `category_id`. Bestseller is now a **real `house_categories` row**
(slug `bestseller`) whose membership is computed from `isFeatured` — the helpers
live in `src/lib/bestseller.ts` (`BESTSELLER_SLUG`, `isBestsellerCategory`,
`getBestsellerModels`). The old `BESTSELLER_CATEGORY` constant in
`src/lib/constants.ts` was removed on the dev branch (commit `ffa1ae4`).

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Netto DIN | WoFlV | Strukturkategorie |
| --- | ---: | :-: | --- | :-: | ---: | ---: | --- |
| Bestseller Famiy 150 ⚠ | 150 | 1,5 | Satteldach | 32° | 150,15 m² | 139,52 m² | Einfamilienhaus |
| Bestseller Komfort 116 | 116 | 1 | Walmdach | 22° | 116,20 m² | 106,77 m² | Bungalow |
| Bestseller Weitblick 140 | 140 | 2 | Walmdach | 22° | 139,61 m² | 137,95 m² | Stadtvilla |
| Bestseller Plus 223 | 223 | 1,5 | Satteldach | 30° | 223,39 m² | 209,90 m² | Generationenhaus |
| Bestseller Twin 138 | 138 | 1,5 | Satteldach | 25° | 137,50 m² | 134,76 m² | Doppelhaus |
| Bestseller Freiraum 167 | 167 | 1,5 | Satteldach | 30° | 167,48 m² | 156,96 m² | Einfamilienhaus |

⚠ Source PDF spells "Famiy"; DB stores the corrected "Bestseller Family 150".

**Totals:** 35 PDF rows = 12 EFH + 4 SV + 5 Kubus + 2 GenH + 1 PDH + 2 DH + 3 Bung + 6 Bestseller.

---

## What changed since the prior PDF (2026-05-26)

The earlier "duplicate name with two roof variants" rows have been resolved by promoting the Flachdach versions to standalone Kubus models:

| Prior PDF row | New PDF representation |
| --- | --- |
| Stadtvilla 18-140 (Flachdach, Attika) | **Kubus 0-140** (own row) |
| Stadtvilla 22-173 (Flachdach 22°) | **Kubus 0-173** (own row, see ⚠ above) |
| Bungalow 22-149 (Flachdach, Attika) | **removed entirely** — no Kubus equivalent |

All other 32 rows are unchanged from the prior PDF.

---

## DB diff against this PDF (live state, post-cleanup 2026-05-28)

DB inventory: 39 rows across 10 categories. PDF lists 35 rows across 8 categories.

### Reconciled rows (PDF ↔ DB)

All 35 PDF rows are present in the DB. All 8 PDF data columns (Wohnfläche, Geschosse, Dachform, Dachneigung, Kniestock, Netto DIN, WoFlV, Anbau, ELW) now mirror the PDF 1:1.

### In DB but NOT on the PDF (4 rows + 1 category mismatch — both intentional)

| DB row | Status |
| --- | --- |
| Zweifamilienhaus 22-280 | **Intentional divergence (2026-05-28 client decision).** PDF labels this `Generationenhaus 22-280`; DB keeps it as `Zweifamilienhaus 22-280` under category `zweifamilienhaus`. The Zweifamilienhaus category remains in the DB. Treat PDF "Generationenhaus" as a marketing umbrella in this one case. |
| Dombühl / Ilshofen / Satteldorf / Schechingen | Mehrfamilienhaus product line — out of scope for the homepage catalogue; lives on a dedicated landing page. |

### Wohnfläche = rounded marketing value (DB-wide, applied 2026-05-28)

Per client directive, the **first/rounded Wohnfläche column from the PDF is now the canonical `house_models.living_area`** for every listed model. The granular Netto-DIN and WoFlV figures are preserved on `house_details.net_floor_area_din` and `total_living_area_woflv` for reporting, but every consumer of `livingArea` (catalogue card, detail page StatsGrid, filter thresholds, sort) now reflects the marketing rounded number.

Examples after the migration:

| Model | Old `living_area` (WoFlV) | New `living_area` (Wohnfläche) |
| --- | ---: | ---: |
| Einfamilienhaus 38-115-125 | 104,94 | **115** |
| Stadtvilla 18-140 | 136,25 | **140** |
| Kubus 0-278 | 245,22 | **278** |
| Pultdachhaus 21-349-225 | 280,60 | **349** |
| Bestseller Plus 223 | 209,90 | **223** |

MFH rows (Dombühl, Ilshofen, Satteldorf, Schechingen) were preserved as-is — they're not on the PDF.

### DB changes applied 2026-05-28

- `Kubus 0-140`: `net_floor_area_din = 139,90`, `total_living_area_woflv = 136,25`
- `Kubus 0-173`: `roof_pitch = 22`, `roof_type = 'Flachdach'`, `allows_granny_flat = true`, `net_floor_area_din = 172,58`, `total_living_area_woflv = 170,85` (PDF taken literally on the anomalous roof axis — see ⚠ above; revisit if client clarifies)
- `house_models.living_area` updated to PDF Wohnfläche for all 35 listed models
- `Stadtvilla 18-140`: deleted the two stale `floor_media` rows where `variant='flachdach'` (they pointed at the Walmdach plans; the actual Flachdach version is now the standalone `Kubus 0-140`)

### Still outstanding (floor plans for the new Kubus rows)

- `Kubus 0-140` has no floor plans in `floor_media` yet
- `Kubus 0-173` has no floor plans in `floor_media` yet

Use the `add-house-model` workflow (or a manual `floor_media` seed) when the architect supplies them.

## Frontend changes applied 2026-05-28

- New `src/features/model-overview/components/RoofCapsule.vue` — SwiftUI-style pill that renders roof icon + roof type label + pitch as a capsule. API: `entries: RoofEntry[]` where `RoofEntry = { type: string; pitch?: number | null }`. Renders one capsule per entry; two entries render two capsules side-by-side. Flat-roof entries (no pitch) render icon + label only.
- `src/features/model-overview/components/ModelCard.vue` — replaced the bare degree-only display in the `.price-rooms` block with `<RoofCapsule>`. Today every card passes one entry; the array shape is in place for future dual-roof models.
- Uses `lucide-vue-next`'s `TriangleRight` glyph (same as `DetailsGrid.vue`'s pitch row), `--clr-surface-secondary` fill, `--radius-full`, and `tabular-nums` on the pitch.

---

## Standing notes & ambiguities

- **`Generationenhaus 22-280`** — `Gesamtwohnfläche WoFlV` still missing in source PDF (Netto DIN = 268,90 m² is present). Confirm with client. Also: PDF puts this in the Generationenhaus category but DB keeps it as Zweifamilienhaus per 2026-05-28 client decision.
- **`Kubus 0-173`** — anomalous Dachform/Dachneigung in PDF (see ⚠ on Kubus table). Verify before backfilling DB.
- **`Pultdachhaus 21-349-225`** — PDF shows `225` in Kniestock column without a unit; transcribed as `225 cm` for consistency with siblings.
- **`Bestseller Famiy 150`** — source PDF typo; DB has the corrected `Bestseller Family 150`.
- **Bestseller series Kniestock** — not provided in source PDF; rendered as blank above. The structural rows (e.g. `Bestseller Plus 223` is fundamentally a Generationenhaus) likely do have a kniestock value the architect didn't surface in this marketing sheet.
- **Flachdach + Attika rows** — Dachneigung is intentionally blank (flat roofs have no pitch). Applies to Kubus 0-140, 0-166, 0-190, 0-278.
- **Anbau column** — only five rows carry values: `Erker 38°` (Einfamilienhaus 45-139-75), `Garage` (Stadtvilla 22-157, Stadtvilla 22-166, Kubus 0-166). DB matches.

---

## Category-to-DB mapping

| Hauptkategorie (PDF) | DB category slug | Notes |
| --- | --- | --- |
| Einfamilienhaus | `einfamilienhaus` | |
| Stadtvilla | `stadtvilla` | |
| Kubus | `kubus` | |
| Generationenhaus | `generationenhaus` | PDF row `Generationenhaus 22-280` is intentionally stored under `zweifamilienhaus` in the DB; the rest live here. |
| Pultdachhaus | `pultdachhaus` | |
| Doppelhaus | `doppelhaus` | |
| Bungalow | `bungalow` | |
| Bestseller | virtual (filter on `isFeatured`) | Each Bestseller row's structural category is preserved in `category_id`. |

Categories that exist in the DB but are not present in this PDF:

- `zweifamilienhaus` — kept per client (only member: `Zweifamilienhaus 22-280`)
- `mehrfamilienhaus` — separate landing page, not part of the homepage filter

## Homepage UX grouping (from 2026-05-28 client decision, still active)

For the homepage filter chips:

1. **Einfamilienhaus**
2. **Stadtvilla**
3. **Generationenhaus / Pultdachhaus / Doppelhaus** — single chip, OR-filters all three DB categories
4. **Kubus**
5. **Bungalow**

Mehrfamilienhaus and Zweifamilienhaus stay off the homepage filter. Bestseller is the virtual `isFeatured` view.

---

## Field availability for filters (after backfilling Kubus 0-140/0-173)

| Field | Populated | Filter viability |
| --- | ---: | --- |
| `roof_type` (Dachform) | 39/39 | ★ excellent |
| `floor_count` (Geschosse) | 39/39 | ★ excellent |
| `living_area` (Wohnfläche) | 39/39 | ★ excellent (threshold or range) |
| `roof_pitch` (Dachneigung) | 33/39 after backfill of Kubus 0-173 (flat roofs legitimately have no pitch) | secondary filter |
| `kniestock` | 13/39 (only on 1.5-storey models — semantically correct) | conditional filter when Geschosse = 1.5 |
| `allows_granny_flat` (ELW) | 8 = true after Kubus 0-173 fix | ★ great toggle |
| `extension_description` (Anbau) | 5 (Erker × 1, Garage × 4 after Kubus 0-140 fixes) | nice-to-have toggle |
| `net_floor_area_din` | 35/39 after Kubus backfill | reporting only |
| `total_living_area_woflv` | 35/39 after Kubus backfill | reporting only |
| `is_featured` | 6 | drives the virtual Bestseller view |
