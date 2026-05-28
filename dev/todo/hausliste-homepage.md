# Hausliste Homepage

Source: `Liste Homepage.pdf` (client-supplied master list of house models that
should be surfaced on the homepage / catalogue). Converted verbatim — do not
edit values without checking the PDF.

Column meanings:

- **Wohnfläche** — marketing/round living-area figure used in the model name
- **Geschosse** — number of full storeys (1, 1.5, 2)
- **Dachform** — roof type (Satteldach = gable, Walmdach = hip, Pultdach = mono-pitch, Flachdach = flat, "Attika" = parapet)
- **Dachneigung** — roof pitch in degrees
- **Kniestock** — knee-wall height; `nein` for full 2-storey houses, blank for Bestseller series (not specified in source)
- **Netto-Grundfläche nach DIN** — net floor area per DIN
- **Gesamtwohnfläche nach WoFlV** — total living area per German Wohnflächenverordnung
- **Anbau** — optional extension (Erker = bay window, Garage)
- **Einliegerwohnung möglich** — granny-flat option (`ja` if available)

Naming convention for non-Bestseller models: `<Typ> <Dachneigung>-<Wohnfläche>-<Kniestock>` (e.g. `Einfamilienhaus 38-115-125` = 38° pitch, 115 m², 125 cm knee wall).

## Master table

| Hausname | Wohnfläche | Geschosse | Dachform | Dachneigung | Kniestock | Netto-Grundfläche (DIN) | Gesamtwohnfläche (WoFlV) | Anbau | Einliegerwohnung |
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
| Stadtvilla 18-140 | 140 | 2 | Walmdach | 18° | nein | 139,90 m² | 136,25 m² | | |
| Stadtvilla 18-140 | 140 | 2 | Flachdach, Attika | | nein | 139,90 m² | 136,25 m² | | |
| Stadtvilla 22-157 | 157 | 2 | Walmdach | 22° | nein | 156,91 m² | 154,96 m² | Garage | |
| Stadtvilla 22-166 | 166 | 2 | Walmdach | 22° | nein | 166,36 m² | 164,54 m² | Garage | |
| Stadtvilla 22-173 | 173 | 2 | Walmdach | 22° | nein | 172,58 m² | 170,85 m² | | ja |
| Stadtvilla 22-173 | 173 | 2 | Flachdach | 22° | nein | 172,58 m² | 170,85 m² | | ja |
| Generationenhaus 28-264-160 | 264 | 1,5 | Satteldach | 28° | 160 cm | 263,89 m² | 244,71 m² | | ja |
| Generationenhaus 22-280 | 280 | 2 | Walmdach | 22° | nein | 268,90 m² | — | | |
| Pultdachhaus 21-349-225 | 349 | 1,5 | Pultdach | 21° | 225 cm | 348,66 m² | 280,60 m² | | ja |
| Doppelhaus 38-238-125 | 238 | 1,5 | Satteldach | 38° | 125 cm | 237,78 m² | 226,87 m² | | |
| Doppelhaus 28-299 | 299 | 2 | Walmdach | 28° | nein | 299,04 m² | 295,17 m² | | |
| Kubus 0-166 | 166 | 2 | Flachdach, Attika | | nein | 166,36 m² | 164,54 m² | Garage | |
| Kubus 0-190 | 190 | 2 | Flachdach, Attika | | nein | 189,68 m² | 176,30 m² | | |
| Kubus 0-278 | 278 | 2 | Flachdach, Attika | | nein | 278,01 m² | 245,22 m² | | |
| Bungalow 22-117 | 117 | 1 | Walmdach | 22° | nein | 116,58 m² | 111,74 m² | | |
| Bungalow 22-134 | 134 | 1 | Walmdach | 22° | nein | 134,18 m² | 134,18 m² | | ja |
| Bungalow 22-149 | 149 | 1 | Walmdach | 22° | nein | 149,18 m² | 134,54 m² | | |
| Bungalow 22-149 | 149 | 1 | Flachdach, Attika | | nein | 149,18 m² | 134,54 m² | | |
| Bestseller Famiy 150 | 150 | 1,5 | Satteldach | 32° | — | 150,15 m² | 139,52 m² | | |
| Bestseller Komfort 116 | 116 | 1 | Walmdach | 22° | — | 116,20 m² | 106,77 m² | | |
| Bestseller Weitblick 140 | 140 | 2 | Walmdach | 22° | — | 139,61 m² | 137,95 m² | | |
| Bestseller Plus 223 | 223 | 1,5 | Satteldach | 30° | — | 223,39 m² | 209,90 m² | | |
| Bestseller Twin 138 | 138 | 1,5 | Satteldach | 25° | — | 137,50 m² | 134,76 m² | | |
| Bestseller Freiraum 167 | 167 | 1,5 | Satteldach | 30° | — | 167,48 m² | 156,96 m² | | |

## Notes & ambiguities to confirm with client

- **`Generationenhaus 22-280`** — `Gesamtwohnfläche nach WoFlV` is missing in the source PDF (Netto = 268,90 m² is present). Confirm value. The DB previously stored this model under category `zweifamilienhaus` (slug `zfh-280-22-0`); since the PDF is the source of truth, it is being moved to `generationenhaus` and the `zweifamilienhaus` category will be retired.
- **Duplicate names with roof variants** — `Stadtvilla 18-140`, `Stadtvilla 22-173`, `Bungalow 22-149` each appear twice with the same name but different `Dachform` (Walmdach vs. Flachdach Attika). Decide whether these are separate models, configurable options on one model, or need disambiguated slugs.
- **`Pultdachhaus 21-349-225`** — Source PDF shows `225` in the Kniestock column without a unit; transcribed as `225 cm` for consistency with sibling rows. Confirm.
- **`Bestseller Famiy 150`** — Source spelling is `Famiy` (likely a typo for `Family`). DB has the corrected `Bestseller Family 150`.
- **Bestseller series Kniestock** — Not provided in source; rendered as `—`.
- **Flachdach + Attika rows** — `Dachneigung` is intentionally blank in source (flat roof has no pitch). Kubus 0-166/190/278 and Stadtvilla/Bungalow Flachdach variants.
- **Anbau column** — Only three rows carry values: `Erker 38°` (Einfamilienhaus 45-139-75), `Garage` (Stadtvilla 22-157, Stadtvilla 22-166, Kubus 0-166).

## UX category grouping (client decision, 2026-05-28)

The DB carries ~10 categories (Einfamilienhaus, Stadtvilla, Bungalow, Doppelhaus, Generationenhaus, Pultdachhaus, Kubus, Mehrfamilienhaus, plus the virtual Bestseller and the retired Zweifamilienhaus). Surfacing all of them as filter chips on the homepage is overwhelming and the boundaries between Generationenhaus / Pultdachhaus / Doppelhaus aren't legible to a non-architect buyer.

**Agreed homepage filter buckets** (5 user-facing chips, in this order):

1. **Einfamilienhaus**
2. **Stadtvilla**
3. **Generationenhaus / Pultdachhaus / Doppelhaus** — single chip, queries all three DB categories
4. **Kubus**
5. **Bungalow**

Mehrfamilienhaus lives on its own dedicated landing page (`mehrfamilien.content.ts`) and stays out of the homepage filter. Bestseller remains the virtual `isFeatured` view.

Implementation note: the grouped chip is a UI-level OR-filter across three category IDs, not a DB merge — the underlying categories stay distinct so model pages, slugs, and the existing `CATEGORY_ORDER` in `src/db/loaders.ts` are unaffected.

## Floor-plan variant terminology (`floor_media.variant`)

The `floor_media.variant` column currently overloads three independent axes — roof type, layout, and granny-flat option — into one string. Known values and what they actually mean:

| variant         | Axis        | Meaning                                                                                  |
| --------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `NULL`          | default     | The standard floor plan for the model (often Walmdach + standard interior + no ELW).     |
| `flachdach`     | **roof**    | Same model, alternate plan because the roof type differs (Flachdach vs. pitched).        |
| `alternative`   | **layout**  | Same model, same roof, alternate interior partition (different room layout).             |
| `elw`           | **granny**  | Same model with the optional Einliegerwohnung floor plan.                                |
| `elw_alternative` | granny + layout | ELW variant with an alternate room layout.                                          |

**Open issue:** for some dual-roof PDF rows (`Stadtvilla 22-173`, `Bungalow 22-149`) the DB carries `alternative` or ELW variants but **not** a `flachdach` row, so the roof-variant floor plans are missing entirely. Whether the existing `alternative` plan corresponds to the Flachdach version or is genuinely a different interior is unclear from filenames — needs visual inspection of the images or client confirmation.

## Mapping to DB / site

Categories in `boholz.house_categories` that map to the PDF groupings:

| PDF group | Likely category slug |
| --- | --- |
| Einfamilienhaus | `einfamilienhaus` |
| Stadtvilla | `stadtvilla` |
| Generationenhaus | `generationenhaus` |
| Pultdachhaus | (no dedicated category — verify; may live under Einfamilienhaus) |
| Doppelhaus | `doppelhaus` |
| Kubus | `kubus` |
| Bungalow | `bungalow` |
| Bestseller \* | virtual `BESTSELLER_CATEGORY` (filter `houseModels.isFeatured`) |

The `Bestseller` rows are not a real category in the DB — they are the
`isFeatured=true` set surfaced via `src/lib/constants.ts → BESTSELLER_CATEGORY`.
When importing, set `isFeatured` on the source model rather than creating a
separate `Bestseller` row.
