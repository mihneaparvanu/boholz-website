# Refactor notes — 2026-05-18

Post-design-pass tidy of the section, card, loader, and category-gallery
duplication that had crept across the marketing pages. No copy or visual
changes intended; all four target areas were collapsed onto single sources
of truth.

`bun run build` and `bun x astro check`: clean (0 errors / 0 warnings).

## What got extracted

### 1. `<Block>` — section primitive
- New: `src/components/sections/Block.astro`.
- Absorbs the repeated `<section class="block">…</section>` and the
  `<div class="band full-width"><section class="block band-inner">…</section></div>`
  patterns. Props: `id?`, `eyebrow?`, `heading?`, `highlight?`, `lede?`,
  `tone="default"|"band"`, `align="start"|"center"`, plus `actions` named slot.
- One source of truth for the `.block`, `.band`, `.band-inner`, `.actions`
  styles + the mobile rhythm override.
- Migrated call-sites: `index.astro`, `unser-versprechen.astro`,
  `dein-zuhause.astro`, `landing/bungalow.astro`, `landing/mehrfamilien.astro`,
  `vorschau-anspruch.astro`.

### 2. `useCategoryGallery` composable
- New: `src/composables/useCategoryGallery.ts`. Exposes
  `{ selected, select(category), showcaseImage }`. `showcaseImage` returns
  `{ path, alt } | null`, honouring an optional `bestsellerHero` fallback
  for the virtual Bestseller category.
- Consumed by `CategorySlider.vue` (no bestseller fallback) and
  `NavbarDrop.vue` (passes its `bestsellerHero` prop through). Each
  component keeps its own visual layer; only the selection + hero
  resolution is shared.

### 3. `<EditorialCard>` — card primitive
- New: `src/components/ui/EditorialCard.vue` consolidates the old
  `StepCard` + the inner card of `FeatureCardPair`. Props match the brief:
  `title`, `eyebrow?`, `icon?`, `description?`, `image?`, `step?`,
  `bullets?`, `accent?`. The `step` ordinal renders the italic-serif numeral;
  the eyebrow path renders the icon next to small caps. `accent` triggers
  the "recommended upgrade" treatment.
- `FeatureCardPair.vue` is now a thin layout wrapper that grids two
  `EditorialCard`s (used by `unser-versprechen` Holzfaserdämmung and
  Wandaufbau beats — two callers, kept as a layout helper).
- `StepCard.vue` deleted; all call-sites ported (dein-zuhause, unser-versprechen,
  sandbox/components).

### 4. `toHouseModelCard` deriver
- New: `src/data/derive.ts` — `toHouseModelCard(m: HouseModel)` returns
  `HouseModelCardProps`. Absorbs the `specsFor` / `priceHintFor` / `imageFor`
  triad inlined on each landing page.
- Migrated call-sites: `index.astro`, `vorschau-anspruch.astro`,
  `landing/bungalow.astro`, `landing/mehrfamilien.astro`.

## What got deleted

- `src/components/ui/StepCard.vue` — superseded by `EditorialCard`.
- `BESTSELLER_CATEGORY_ID` re-export from `src/data/loaders.ts` (no
  consumer imported it from there; everyone already pulls from
  `@/data/constants`).
- Inline `specsFor` / `priceHintFor` / `imageFor` / `houseCards` triads on
  four pages (collapsed into `toHouseModelCard`).
- Inline `BESTSELLER_CATEGORY_ID` + `selected`/`showcaseImage` plumbing in
  `NavbarDrop.vue` (now in `useCategoryGallery`).
- Per-page `.block` / `.band` / `.band-inner` / `.audience-actions` CSS
  duplicates on five pages.
- Inner card markup + styles on `FeatureCardPair.vue` (~130 lines).
- The `proof-band` padding override on `unser-versprechen.astro` —
  reverted to the default Block rhythm because the page-level override
  needed `!important` or a scoping hack to win over the scoped child
  styles; the visible delta (`--spacing-5` vs `--spacing-6`) is small
  enough that one band rhythm beats one-off plumbing.

## Loader simplification

`resolveMediaPaths<T>` in `src/data/loaders.ts` was using `any` to handle
two shapes — direct `{ media: { path }[] }` and pivot
`{ media: { media: { path } }[] }`. Inspection showed every caller uses
the pivot shape, so the direct branch was dead. Function now takes a
constrained generic over `{ media: { media: { path: string } } }[]` —
no `any`, shorter, type-safe.

## `git diff --stat` summary (vs HEAD e8e4f68)

```
 19 files changed, 422 insertions(+), 1077 deletions(-)
```

Net deletion of ~655 lines across modified files. Adding the five new
files (Block ~120, EditorialCard ~210, useCategoryGallery ~60,
derive ~80, refactored vorschau-anspruch ~325), the project net is still
firmly negative — every page got shorter because the shared shapes lifted
out cleanly.

## Judgment calls

- **`FeatureCardPair` kept as a wrapper**: spec said inline the grid if
  only one page needs the pairing. `unser-versprechen.astro` uses it for
  Holzfaserdämmung (Sommer/Winter) AND Wandaufbau (ECO/ECO Plus) — two
  beats on the same page. Keeping the wrapper since it semantically
  represents "two-card comparison".
- **`StatBlock` left alone**: distinct from `EditorialCard` (numeric +
  count-up role per the spec brief, different visual rhythm). Not merged.
- **`Block.astro` ternary, not Fragment**: a `tone="band"` Block needs the
  outer `<div class="band full-width">` to escape the wrapper grid. That
  can't be expressed as a sibling without a wrapping element, so the two
  render branches stay. ~10 lines of repetition is the price; the public
  API is clean.
- **`is:global` / `:global()` not used**: dropped the proof-band padding
  override rather than wrestle Astro scoped-style specificity for a 1-step
  spacing delta.
- **Loader call-site `as unknown as HouseCategory[]` casts left in place**:
  Drizzle's inferred relational return type still doesn't quite line up
  with the project's `HouseCategory` shape (`media.alt` nullability, etc).
  Untangling those would be its own pass.
