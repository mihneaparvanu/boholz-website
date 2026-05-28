# Spec ↔ DB diff

Generated against `dev/todo/houses/hausliste-homepage.md` and the live DB.

- ✓ matches: **33**
- ✗ diffs: **0**
- ⚠ missing in DB: **2**
- 🔸 DB rows not in spec (excluding MFH): **2**

Compared fields: Wohnfläche, Geschosse, Dachform, Dachneigung,
Kniestock, Netto DIN, WoFlV, Anbau, Einliegerwohnung.

Numerical tolerance: ±0,51 (lets the rounded PDF marketing figure
equal the precise DB number).

## Einfamilienhaus

✓ all 12 rows match

## Stadtvilla

✓ all 4 rows match

## Kubus

✓ all 5 rows match

## Generationenhaus

- ✓ Generationenhaus 28-264-160
- ⚠ **Generationenhaus 22-280** — spec row, no matching DB title

## Pultdachhaus

✓ all 1 rows match

## Doppelhaus

✓ all 2 rows match

## Bungalow

✓ all 3 rows match

## Bestseller

- ⚠ **Bestseller Famiy 150 ⚠** — spec row, no matching DB title
- ✓ Bestseller Komfort 116
- ✓ Bestseller Weitblick 140
- ✓ Bestseller Plus 223
- ✓ Bestseller Twin 138
- ✓ Bestseller Freiraum 167

## 🔸 DB models not in the spec (excluding mehrfamilienhaus)

- Zweifamilienhaus 22-280 (slug: `zfh-280-22-0`, category: `zweifamilienhaus`)
- Bestseller Family 150 (slug: `bestseller-family-150`, category: `einfamilienhaus`)
