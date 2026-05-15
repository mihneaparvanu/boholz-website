---
name: Missing and Placeholder Images Inventory
description: All brand/static image slots that are null, empty, or unmapped — recorded after 2026-05-15 audit
type: project
---

All page-level images (dein-zuhause, unser-versprechen, uber-uns) are confirmed live in R2 as of 2026-05-15.

**Missing / placeholder image slots:**

1. **BuildingStages** — 4 slots, all `imageURL: null`
   - `building-stages.content.ts` lines 9, 16, 23, 30
   - Slugs: `ausbauhaus`, `technikfertig`, `fast-fertig`, `schluesselfertig`
   - No local source files exist in `1-Branding/` for any of these
   - Component renders `<ImagePlaceholder />` when null — visually broken

2. **OverviewCard images** — optional `image` field on all 5 cards, none supplied
   - `overview.content.ts` has no image properties at all
   - Component conditionally renders the image wrapper — silently absent (not broken)

3. **CatalogCard** — `<img src="" alt="" />` — empty src, hardcoded stub
   - `src/features/CatalogCard/CatalogCard.vue` line 9
   - No local source file, no R2 path

**Local brand library files not yet uploaded to R2 (as of 2026-05-15):**
- `1-Branding/Images/`: 14 webp files (bungalow-hero, bungalow-gallery-1..4, mehrgenerationen-gallery-1..4, ubersicht-gallery-1..4, ubsersicht-hero), 1 PNG (21MB, skip)
- `1-Branding/Images/ mehrfamilien-hero.webp` — LEADING SPACE in filename, needs rename before upload
- `1-Branding/Certificates/Received/`: 7 cert images
- `1-Branding/Icons/`: 6 SVGs + 1 PNG at top level; `Mission Holz Logos/` subdirectory has 4 more (2 PNG, 2 SVG — different hashes from top-level copy)

**How to apply:** On next sync run, building stages remain blocked (no local source). CatalogCard and OverviewCard images also need new photography — flag as NEEDS HUMAN.
