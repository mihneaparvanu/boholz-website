# Mehrfamilienhaus — outstanding data needs

What's still missing to bring the four MFH models in line with the rest of
the catalogue (e.g. Bestseller models, EFH, Stadtvilla).

## Per-model field gaps

Legend: ✓ filled · ✗ empty · — n/a

| Field | Dombühl | Ilshofen | Satteldorf | Schechingen | Notes |
|---|---|---|---|---|---|
| `title` | ✓ | ✓ | ✓ | ✓ | |
| `description` (long copy) | ✓ | ✓ | ✓ | **✗** | Schechingen has no PDF yet |
| `living_area` (m²) | ✓ 1440 | ✓ 1440 | ✓ 1632 | ✓ 1440 | Computed as max-unit × 12 |
| `total_area` (m²) | ✗ | ✗ | ✗ | ✗ | Grundstück / Gesamtfläche unknown |
| `price` (€) | ✗ | ✗ | ✗ | ✗ | Per-project; may stay null on purpose |
| `roof_pitch` (°) | ✗ | ✗ | ✗ | ✗ | All 4 look flat — confirm 0° vs Satteldach |
| `roof_type` | _Satteldach_ (default) | _Satteldach_ (default) | _Satteldach_ (default) | _Satteldach_ (default) | Renders look like Flachdach — please verify |
| `level_count` | ✓ 3 | ✓ 3 | ✓ 3 | ✓ 3 | |
| `floor_count` | ✓ 3 | ✓ 3 | ✓ 3 | ✓ 3 | |
| `families_count` | ✓ 12 | ✓ 12 | ✓ 12 | ✓ 12 | |
| `bedroom_count` | ✗ | ✗ | ✗ | ✗ | Total bedrooms across all units |
| `bathroom_count` | ✗ | ✗ | ✗ | ✗ | Total bathrooms across all units |
| `width` (m) | ✗ | ✗ | ✗ | ✗ | Building footprint |
| `length` (m) | ✗ | ✗ | ✗ | ✗ | Building footprint |
| `height` (m) | ✗ | ✗ | ✗ | ✗ | Building height |
| `kniestock` (cm) | ✗ | ✗ | ✗ | ✗ | |
| `net_floor_area_din` (m²) | ✗ | ✗ | ✗ | ✗ | DIN 277 net floor area |
| `total_living_area_woflv` (m²) | ✗ | ✗ | ✗ | ✗ | WoFlV total |
| `has_garage` | ✓ | ✓ | ✓ | ✓ | Tiefgarage |
| `is_barrier_free` | ✓ | ✓ | ✓ | ✓ | |
| `allows_granny_flat` | ✗ | ✗ | ✗ | ✗ | |
| `has_children_room` | ✗ | ✗ | ✗ | ✗ | |
| `extension_description` | ✗ | ✗ | ✗ | ✗ | Optional |

## Media gaps

| Asset | Dombühl | Ilshofen | Satteldorf | Schechingen |
|---|---|---|---|---|
| Hero photo | ✓ start.webp | ✓ start.webp | ✓ start.webp | ✓ start.webp |
| Alt exterior | ✓ start-2.webp | ✗ | ✗ | ✗ |
| Gallery (other models have 5–10 photos) | only 2 | only 1 | only 1 | only 1 |
| Floor plans on R2 | EG ✓, OG1 broken, OG2 broken | EG broken, OG1 broken, OG2 broken | EG broken, OG broken, DG broken | EG broken, OG1 broken, OG2 broken |

**Gallery**: every other house in the catalogue has at least 5 exterior +
interior photos. The MFH set currently shows only one or two hero shots.

## Suggested improvements to flag to the client

1. **Hero aspect ratio.** The current `start.webp` files are 1920 × 640
   (~3:1 panoramic). Cropped into the card/circle/16:9 gallery layouts they
   read as zoomed-in slices of the building instead of full elevations.
   Ideal: a 4:3 or 3:2 exterior shot (≈ 2400 × 1600) per house, like
   Dombühl's `start-2.webp`.

2. **Floor-plan uploads are incomplete.** 10 of 12 MFH floor-plan files
   landed as 0-byte placeholders in the bucket. Need to re-upload via the
   S3 alias. Same issue on `stadtvilla-18-140-floor-plan-flachdach`.

3. **Roof type appears wrong.** All four were defaulted to `Satteldach` but
   the renders look like flat roofs (Flachdach). Confirm and update.

4. **No Schechingen PDF.** Means no description, and the structured fields
   we filled in (12 units, barrier-free, garage, 3 floors) are inferred
   from the other three — they should be confirmed.

5. **Per-apartment size range vs. building total.** The brochures say
   "Wohnungsgrößen von 40 m² bis 120 m²" — useful information that we
   currently bury in the description text. Worth adding two columns
   (`unit_area_min_m2`, `unit_area_max_m2`) and surfacing in the stats
   grid alongside the building total.

6. **Pricing.** Other house models surface a starting price; MFH currently
   shows nothing. Either a "from €X" indicative price per unit or an
   explicit "Projektpreis auf Anfrage" line so the absence reads as
   intentional, not missing.

7. **KfW-40 standard, Tiefgarage, Aufzug** are mentioned in the PDFs but
   not surfaced as their own badges/tiles on the page. Worth promoting to
   icon-tiles next to `Garage` / `Barrierefrei`.
