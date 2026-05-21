# Houses Sprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the client-requested filter additions (Wohnfläche threshold + Einliegerwohnung), the user-requested sort additions (bestsellers-first + alphabetical), and the new house content (3 new models + 1 new category), plus codify the asset pipeline as a repo skill.

**Architecture:** Frontend changes in Vue 3 components and TypeScript filter-option modules; one-shot DB seed script for `allowsGrannyFlat` backfill; per-model R2 upload + DB seed scripts for new content; new repo skill documenting the pipeline. No schema migrations — all required columns already exist.

**Tech Stack:** Vue 3 islands hydrated under Astro SSR, Drizzle ORM against Postgres, Cloudflare R2 over the AWS S3 CLI, Bun as the package manager and runtime, Sharp for image optimization.

**Testing approach:** Project has no test harness. Verification is `bun run build` (type-checks via vue-tsc + astro check) and manual smoke in `bun run dev`, plus row-count assertions in seed scripts.

**Spec:** `docs/superpowers/specs/2026-05-22-houses-sprint-design.md`.

---

## File map

**Created:**
- `scripts/seed-allows-granny-flat-2026-05-22.ts` (deleted after run)
- `scripts/add-kubus-0-140.ts` (deleted after run)
- `scripts/add-kubus-0-173.ts` (deleted after run)
- `scripts/add-zfh-282-22-0.ts` (deleted after run)
- `scripts/add-zweifamilienhaus-category.ts` (deleted after run)
- `.claude/skills/add-house-model/SKILL.md`

**Modified:**
- `src/features/FilterPanel/filter-panel.types.ts` — add `ThresholdFilter` to the discriminated union.
- `src/features/FilterPanel/filter-panel.options.ts` — add `title` sort field; add Wohnfläche threshold + Einliegerwohnung filter options.
- `src/features/FilterPanel/FilterPanel.vue` — render `threshold` options inside `FilterSection`.
- `src/features/HousesPage/HousesPage.vue` — extend the default-sort branch with bestsellers-first partition; extend the `filterModels` switch with a `threshold` case; extend URL parser for `threshold`.
- `CLAUDE.md` — one-line pointer to the new skill.

**Deleted (post-execution):**
- All of `todo/houses-to-add/` (after Phase 2 completes).

---

## Phase 1 — parallel-safe tasks (3 agents)

These three tasks do not share writes. Dispatch in parallel:
1. **Task 1** (sort + filter — bundled because both touch `filter-panel.options.ts` and `HousesPage.vue`).
2. **Task 2** (seed allowsGrannyFlat — independent, only writes to a new file in `scripts/`).
3. **Task 3** (skill + CLAUDE.md pointer — independent, only writes to `.claude/skills/` and a single `CLAUDE.md` line).

---

### Task 1: Sort changes + filter additions

**Files:**
- Modify: `src/features/FilterPanel/filter-panel.types.ts`
- Modify: `src/features/FilterPanel/filter-panel.options.ts`
- Modify: `src/features/FilterPanel/FilterPanel.vue`
- Modify: `src/features/HousesPage/HousesPage.vue`

- [ ] **Step 1.1: Add `ThresholdFilter` to the type union**

Edit `src/features/FilterPanel/filter-panel.types.ts`. After the existing `CountFilter` declaration (around line 37), add:

```ts
export type ThresholdFilter = {
  id: string;
  kind: "threshold";
  label: string;
  // Each option carries its own predicate so the URL can serialize a
  // human-readable label ("<150") without needing range encoding.
  options: Array<{ label: string; predicate: (m: HouseModel) => boolean }>;
};
```

Then update the `FilterOption` union (around line 45) to:

```ts
export type FilterOption =
  | BooleanFilter
  | EnumFilter
  | CountFilter
  | ThresholdFilter;
```

And extend the `ValueFor<F>` helper at the bottom of the file so `threshold` values map to `string`:

```ts
//prettier-ignore
type ValueFor<F> =
    F extends BooleanFilter   ? boolean :
    F extends CountFilter     ? number  :
    F extends EnumFilter      ? string  :
    F extends ThresholdFilter ? string  :
    never;
```

- [ ] **Step 1.2: Add the `title` sort field**

Edit `src/features/FilterPanel/filter-panel.options.ts`. Append to the `sortFields` array (after the `bedroomCount` entry, around line 41):

```ts
{
  value: "title",
  label: "Name",
  resolve: (m) => m.title,
},
```

No other change is needed for sorting — `generateSortOptions` will produce `title-asc` (`Name ↑`) and `title-desc` (`Name ↓`) automatically.

- [ ] **Step 1.3: Add the Wohnfläche threshold filter**

Still in `filter-panel.options.ts`. Below the existing filter constants (after `roofType`, before the `filterOptions` array), add:

```ts
import type { ThresholdFilter } from "./filter-panel.types";
// (if ThresholdFilter isn't already imported)

const livingAreaThreshold: ThresholdFilter = {
  id: "livingArea",
  kind: "threshold",
  label: "Wohnfläche",
  options: [
    {
      label: "<150",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a < 150;
      },
    },
    {
      label: "<170",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a < 170;
      },
    },
    {
      label: "<200",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a < 200;
      },
    },
    {
      label: ">200",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a > 200;
      },
    },
  ],
};
```

Add the import for `ThresholdFilter` at the top of the file (extend the existing `import type` line from `./filter-panel.types`):

```ts
import type {
  SortField,
  SortOption,
  BooleanFilter,
  EnumFilter,
  CountFilter,
  FilterOption,
  ThresholdFilter,
} from "./filter-panel.types";
```

- [ ] **Step 1.4: Add the Einliegerwohnung boolean filter**

Still in `filter-panel.options.ts`. After the new `livingAreaThreshold` const, add:

```ts
const allowsGrannyFlat: BooleanFilter = {
  id: "allowsGrannyFlat",
  kind: "boolean",
  label: "Einliegerwohnung",
  resolve: (m) => m.details?.allowsGrannyFlat ?? null,
};
```

- [ ] **Step 1.5: Wire both new filters into the exported `filterOptions` array**

Replace the existing `filterOptions` array with this ordering (Wohnfläche at the top because it's the most common filter, Einliegerwohnung directly under it because it's the other new addition):

```ts
export const filterOptions: FilterOption[] = [
  livingAreaThreshold,
  allowsGrannyFlat,
  hasGarage,
  hasKniestock,
  roofType,
  bedroomNumber,
  bathroomCount,
];
```

- [ ] **Step 1.6: Render `threshold` options in `FilterPanel.vue`**

Edit `src/features/FilterPanel/FilterPanel.vue`. Inside the `<FilterSection>` block (around lines 161-184), add a fourth `<template>` after the existing `enum` template:

```vue
<template v-if="option.kind === 'threshold'">
  <OptionsButton
    v-for="opt in option.options"
    :key="opt.label"
    :title="opt.label"
    :selected="isSelected(option, opt.label)"
    @click="handleOptionSelect(option, opt.label)"
  />
</template>
```

- [ ] **Step 1.7: Extend `filterModels` switch in `HousesPage.vue` to handle `threshold`**

Edit `src/features/HousesPage/HousesPage.vue`. In the `filterModels` function (around lines 81-101), add a `threshold` case before the `default` branch:

```ts
case "threshold": {
  const matchedOption = option.options.find((o) => o.label === (value as string));
  if (!matchedOption) return models;
  return models.filter((m) => matchedOption.predicate(m));
}
```

- [ ] **Step 1.8: Extend the URL parser for `threshold`**

In the same file, inside `parseFilters` (around lines 220-249), add a `threshold` case to the switch:

```ts
case "threshold":
  if (!option.options.some((o) => o.label === rawValue)) return null;
  return { option, value: rawValue } as ActiveFilter;
```

- [ ] **Step 1.9: Implement bestsellers-first default sort**

In the same file, replace the `displayModels` computed (around lines 64-74) so the no-sort branch partitions by `isFeatured`:

```ts
const displayModels = computed(() => {
  const base =
    filterState.value.status === "confirmed"
      ? filteredModels.value
      : categoryModels.value;

  if (activeSortOption.value !== null) {
    return sortModels(base, activeSortOption.value);
  }

  // No explicit sort: featured models lead, then the rest.
  // Each partition still goes through the default sort (livingArea asc).
  const featured = base.filter((m) => m.isFeatured);
  const rest = base.filter((m) => !m.isFeatured);
  return [
    ...sortModels(featured, null),
    ...sortModels(rest, null),
  ];
});
```

- [ ] **Step 1.10: Type-check the changes**

Run:

```bash
bun run build
```

Expected: build succeeds, no TypeScript errors. If the build complains about an `option.kind === "threshold"` exhaustiveness check anywhere outside the files modified, that's a bug — find and fix.

- [ ] **Step 1.11: Smoke-test in the browser**

Run `bun run dev`, open `http://localhost:4321/hauser`.

Verify:
1. The sort dropdown shows `Name ↑` and `Name ↓` at the bottom of the options list. Selecting `Name ↑` reorders the grid alphabetically (compare to alphabetic listing — Bestseller models should sort before non-Bestseller in any category because "B" < "E", "S", etc.).
2. With the sort cleared and a non-Bestseller category selected (e.g. `Einfamilienhaus`), the featured models appear before the non-featured ones (look for the star badge — featured models have it).
3. Open the filter panel. Verify two new sections appear at the top: `Wohnfläche` (with 4 chips: `<150`, `<170`, `<200`, `>200`) and `Einliegerwohnung` (with one toggle).
4. Pick `<150`, hit "Häuser anzeigen". URL contains `?filter=livingArea:%3C150`. Grid shrinks to ≤149m² models only.
5. Pick `Einliegerwohnung`. Grid shrinks further — but **expected to be empty until Task 2 seeds the data**. Note this in the report.
6. Reload the page with the URL still containing `?filter=livingArea:%3C150` — the filter chip rehydrates.

- [ ] **Step 1.12: Commit**

```bash
git add src/features/FilterPanel/filter-panel.types.ts \
        src/features/FilterPanel/filter-panel.options.ts \
        src/features/FilterPanel/FilterPanel.vue \
        src/features/HousesPage/HousesPage.vue
git -c core.hooksPath=.githooks commit -m "$(cat <<'EOF'
feat(houses): add Name sort + bestsellers-first + Wohnfläche/Einliegerwohnung filters

- Name ↑ / Name ↓ added to sort options
- Bestsellers pinned to the top when no explicit sort is selected
- New ThresholdFilter kind, with Wohnfläche cumulative thresholds (<150/<170/<200/>200)
- New Einliegerwohnung boolean filter
EOF
)"
```

---

### Task 2: Backfill `allowsGrannyFlat` on 32 existing models

**Files:**
- Create: `scripts/seed-allows-granny-flat-2026-05-22.ts` (deleted after run)

- [ ] **Step 2.1: Write the seed script**

Create `scripts/seed-allows-granny-flat-2026-05-22.ts`:

```ts
// One-shot backfill of house_details.allowsGrannyFlat for the 7 models
// the planning-doc spreadsheet marks with "ja". Idempotent: re-running
// sets the same 7 rows to true and updates nothing else.
//
// Source: dev/planning/houses-table.md, Einliegerwohnung column.

import { db } from "@/db/db";
import { houseModels, houseDetails } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const SLUGS_WITH_GRANNY_FLAT = [
  "einfamilienhaus-35-181-150",
  "einfamilienhaus-22-173-190",
  "einfamilienhaus-28-194-170",
  "stadtvilla-22-173",
  "generationenhaus-28-264-160",
  "pultdachhaus-21-349-225",
  "bungalow-22-134",
] as const;

const rows = await db.query.houseModels.findMany({
  where: inArray(houseModels.slug, SLUGS_WITH_GRANNY_FLAT as unknown as string[]),
  columns: { id: true, slug: true },
});

if (rows.length !== SLUGS_WITH_GRANNY_FLAT.length) {
  const found = new Set(rows.map((r) => r.slug));
  const missing = SLUGS_WITH_GRANNY_FLAT.filter((s) => !found.has(s));
  throw new Error(
    `Expected ${SLUGS_WITH_GRANNY_FLAT.length} slugs, found ${rows.length}. Missing: ${missing.join(", ")}`,
  );
}

const ids = rows.map((r) => r.id);
const result = await db
  .update(houseDetails)
  .set({ allowsGrannyFlat: true })
  .where(inArray(houseDetails.id, ids))
  .returning({ id: houseDetails.id });

if (result.length !== SLUGS_WITH_GRANNY_FLAT.length) {
  throw new Error(
    `Updated ${result.length} rows but expected ${SLUGS_WITH_GRANNY_FLAT.length}. Aborting.`,
  );
}

console.log(`✅ allowsGrannyFlat=true on ${result.length} rows`);
for (const r of rows) console.log(`   - ${r.slug}`);
```

- [ ] **Step 2.2: Run the script**

```bash
bun x tsx scripts/seed-allows-granny-flat-2026-05-22.ts
```

Expected output:
```
✅ allowsGrannyFlat=true on 7 rows
   - einfamilienhaus-35-181-150
   - einfamilienhaus-22-173-190
   - einfamilienhaus-28-194-170
   - stadtvilla-22-173
   - generationenhaus-28-264-160
   - pultdachhaus-21-349-225
   - bungalow-22-134
```

If output shows fewer than 7 rows or any "Missing" error, **stop**, report the missing slugs, and check whether the slug naming in DB differs from the planning doc.

- [ ] **Step 2.3: Spot-check a single row via a one-liner**

```bash
bun -e "const {db}=await import('./src/db/db.ts');const {houseDetails,houseModels}=await import('./src/db/schema.ts');const {eq}=await import('drizzle-orm');const r=await db.select({s:houseModels.slug,g:houseDetails.allowsGrannyFlat}).from(houseModels).innerJoin(houseDetails,eq(houseModels.id,houseDetails.id)).where(eq(houseModels.slug,'bungalow-22-134'));console.log(r);"
```

Expected: prints `[ { s: 'bungalow-22-134', g: true } ]`.

- [ ] **Step 2.4: Delete the seed script**

```bash
rm scripts/seed-allows-granny-flat-2026-05-22.ts
```

If `scripts/` is now empty other than the existing `asset-pipeline/` directory, leave the directory in place.

- [ ] **Step 2.5: Commit**

```bash
git add scripts/
git -c core.hooksPath=.githooks commit -m "$(cat <<'EOF'
chore(db): backfill allowsGrannyFlat on 7 existing models

One-shot seed (script deleted after run). Source: dev/planning/houses-table.md
Einliegerwohnung column. Enables the new Einliegerwohnung filter from the
parallel Task 1.
EOF
)"
```

(Note: the commit will be empty under `scripts/` because the file was added and removed in the working tree, so this commit only captures the deletion — that's fine; the audit trail is the commit message describing what ran.)

If `git status` is clean, skip this commit step — there's nothing to commit. The seed ran successfully and produced no tracked artifact, which is the intended convention.

---

### Task 3: `add-house-model` skill + CLAUDE.md pointer

**Files:**
- Create: `.claude/skills/add-house-model/SKILL.md`
- Modify: `CLAUDE.md`

- [ ] **Step 3.1: Create the skill directory and file**

```bash
mkdir -p .claude/skills/add-house-model
```

Create `.claude/skills/add-house-model/SKILL.md`:

```markdown
---
name: add-house-model
description: Use when adding a new BoHolz house model from a source folder dropped under `todo/houses-to-add/`. Handles asset inventory, R2 upload via `r2-image-curator`, DB seed for `house_models` / `house_details` / `media` / `model_media` / `floor_media`, and cleans up the source folder when done. Also use when adding a brand-new category (e.g. Zweifamilienhaus) — insert the `house_categories` row before the model.
---

# Adding a new house model

The user drops one folder per model under `todo/houses-to-add/<Category>/<MODEL_NAME>/`. This skill turns each folder into a live `/haus/<slug>` URL.

## Preconditions

- `.env` has `R2_ACCOUNT_ID`, `R2_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `PUBLIC_ASSETS_URL`.
- The category exists in `boholz.house_categories`. If not, insert it FIRST (see "Brand-new category" below).
- `bun install` has been run.

## Procedure

### 1. Inventory the source folder

```bash
ls "todo/houses-to-add/<Category>/<MODEL_NAME>/"
```

Identify:
- **Exterior render** — usually one JPG/PNG, the photographic shot.
- **Floor plans** — typically two files matching `*Erdgeschoss*` (EG / ground floor) and `*Obergeschoss*` (OG / upper floor). Strip the WordPress export suffixes (`BODENPLATTE EXPOSE-Grundrisse300dpi - NEU - WEBSITE -`) when renaming.

### 2. Derive the model identifier

The naming convention is `<category>_<slug>_<type>_<dimensions>.<ext>`:
- `<category>` is the lowercased German category name with umlaut normalization (`ä → ae`, `ö → oe`, `ü → ue`, `ß → ss`).
- `<slug>` is the lowercased model code (e.g. `kubus-0-140`, `zfh-282-22-0`).
- `<type>` is one of `hero`, `gallery`, `floor-eg`, `floor-og`, `floor-dg`.
- `<dimensions>` is `<width>x<height>` in pixels of the optimized output.

### 3. Hand off to `r2-image-curator`

Invoke the agent with a brief:
> "Take the files in `todo/houses-to-add/<Category>/<MODEL_NAME>/`, normalize the filenames to the BoHolz convention (above), optimize to WebP (min 1200px on shortest side, EXIF GPS stripped, ICC preserved), check R2 for the target keys, upload missing ones, and return a manifest mapping `<role>` (hero / floor-eg / floor-og) → R2 key + public URL."

The agent uses Sharp + `aws s3 cp --endpoint-url https://<account>.r2.cloudflarestorage.com`. See `scripts/asset-pipeline/04-optimize.ts` and `06-r2-sync.ts` for the reference implementation.

### 4. Generate the DB seed script

Write `scripts/add-<slug>.ts` that, in one transaction:
1. Inserts a `house_models` row (`categoryId` from category lookup, `title`, `slug`, `modelCode`, `livingArea`, `roofPitch`, optional `description`, `isFeatured: false`).
2. Inserts a `house_details` row keyed on the model id.
3. Inserts one `media` row per uploaded asset.
4. Inserts `model_media` rows linking each `media` to the model; mark the exterior render with `isHero: true` and `isThumbnail: true`.
5. Inserts `floor_media` rows for EG / OG / DG plans, ordered via `sortOrder` (10, 20, 30), `variant: null`.

Reference shape (replace placeholders):

```ts
import { db } from "@/db/db";
import {
  houseModels, houseDetails, houseCategories,
  media, modelMedia, floorMedia,
} from "@/db/schema";
import { eq } from "drizzle-orm";

await db.transaction(async (tx) => {
  const [cat] = await tx
    .select({ id: houseCategories.id })
    .from(houseCategories)
    .where(eq(houseCategories.slug, "<category-slug>"));
  if (!cat) throw new Error("Category not found");

  const [model] = await tx
    .insert(houseModels)
    .values({
      categoryId: cat.id,
      title: "<Title>",
      slug: "<slug>",
      modelCode: "<code>",
      livingArea: "<m²>",
      roofPitch: <pitch>,
      isFeatured: false,
    })
    .returning({ id: houseModels.id });

  await tx.insert(houseDetails).values({
    id: model.id,
    floorCount: <1 | 1.5 | 2>,
    bedroomCount: <n>,
    bathroomCount: <n>,
    hasGarage: false,
    roofType: "<Walmdach | Satteldach | Flachdach | Flachdach, Attika | Pultdach>",
    // kniestock, netFloorAreaDin, totalLivingAreaWoflv, allowsGrannyFlat as known
  });

  const [hero] = await tx
    .insert(media)
    .values({ path: "<r2-key>", alt: "<alt>", width: <w>, height: <h> })
    .returning({ id: media.id });

  await tx.insert(modelMedia).values({
    modelId: model.id,
    mediaId: hero.id,
    isHero: true,
    isThumbnail: true,
    sortOrder: 0,
  });

  // Repeat insert(media) → insert(floorMedia { variant: null, sortOrder: 10 / 20 }) for EG / OG.
});
```

### 5. Run + verify

```bash
bun x tsx scripts/add-<slug>.ts
```

Open `http://localhost:4321/haus/<slug>` in dev — verify hero, thumbnail, and EG/OG plans render.

### 6. Clean up

```bash
rm scripts/add-<slug>.ts
rm -rf "todo/houses-to-add/<Category>/<MODEL_NAME>/"
```

If `todo/houses-to-add/<Category>/` is now empty, remove it too. If `todo/houses-to-add/` is now empty, remove it.

## Brand-new category

If `<Category>` is not yet in `house_categories`, run this first (one-off script under `scripts/`, deleted after):

```ts
import { db } from "@/db/db";
import { houseCategories } from "@/db/schema";
await db.insert(houseCategories).values({
  name: "<German name>",
  slug: "<slug>",
  description: null,
});
```

Then either upload a dedicated category thumbnail to R2 + insert a `category_media` row with `isThumbnail: true`, or reuse the first model's exterior render via `category_media` until the client provides a category-specific image.

## What to flag in the closing report

- Any field that defaulted because the source folder didn't disclose it (typically `bedroomCount`, `bathroomCount`, `kniestock`).
- Missing imagery (e.g. no exterior render in the folder).
- Categories whose thumbnail was reused from the first model.
```

- [ ] **Step 3.2: Add the CLAUDE.md pointer**

Edit `CLAUDE.md`. Under the "Conventions specific to this repo" section (find the heading at line 84-ish), add a new bullet right after the **Workspace hygiene** bullet:

```markdown
- **Adding a new house model:** drop the source folder into `todo/houses-to-add/<Category>/<NAME>/` and invoke the `add-house-model` skill — it covers the R2-upload → DB-seed → cleanup pipeline.
```

- [ ] **Step 3.3: Commit**

```bash
git add .claude/skills/add-house-model/SKILL.md CLAUDE.md
git -c core.hooksPath=.githooks commit -m "$(cat <<'EOF'
chore: add-house-model skill + CLAUDE.md pointer

Codifies the local-folder → R2-upload → DB-seed → cleanup pipeline for
adding a new BoHolz house model. Also covers brand-new category inserts.
EOF
)"
```

---

## Phase 2 — sequential tasks (1 agent)

Phase 2 depends on Phase 1's skill content (Task 3). Run after all Phase-1 tasks are committed.

### Task 4: Insert Zweifamilienhaus category + ZFH 282-22-0 model

**Files:**
- Create: `scripts/add-zweifamilienhaus-category.ts` (deleted after run)
- Create: `scripts/add-zfh-282-22-0.ts` (deleted after run)

- [ ] **Step 4.1: Inspect the source assets**

```bash
ls "todo/houses-to-add/Zweifamilienhäuser/ZFH 282-22-0/"
```

Expect: `ZFH 282-22-0.jpg` (exterior), `ZFH 282-22-0 - EG - NEU.png` (ground floor), `ZFH 282-22-0 - OG - NEU.png` (upper floor).

- [ ] **Step 4.2: Insert the Zweifamilienhaus category**

Create `scripts/add-zweifamilienhaus-category.ts`:

```ts
import { db } from "@/db/db";
import { houseCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

const existing = await db
  .select({ id: houseCategories.id })
  .from(houseCategories)
  .where(eq(houseCategories.slug, "zweifamilienhaus"));

if (existing.length > 0) {
  console.log("Category already exists, skipping");
  process.exit(0);
}

const [row] = await db
  .insert(houseCategories)
  .values({
    name: "Zweifamilienhaus",
    slug: "zweifamilienhaus",
    description: null,
  })
  .returning({ id: houseCategories.id });

console.log(`✅ Inserted Zweifamilienhaus category: ${row.id}`);
```

Run:

```bash
bun x tsx scripts/add-zweifamilienhaus-category.ts
```

Expected: `✅ Inserted Zweifamilienhaus category: <uuid>`.

- [ ] **Step 4.3: Hand off the ZFH assets to `r2-image-curator`**

Invoke the `r2-image-curator` subagent with:

> "Source folder: `todo/houses-to-add/Zweifamilienhäuser/ZFH 282-22-0/`. Target normalization: `zweifamilienhaus_zfh-282-22-0_<role>_<dimensions>.webp` where role is `hero` for the JPG and `floor-eg` / `floor-og` for the EG / OG PNGs. Optimize to WebP, min 1200px shortest side, EXIF GPS stripped, ICC preserved. Floor plans use lossless WebP; the exterior render uses q=82 lossy. Check R2 for the target keys before uploading. Return a manifest mapping role → R2 key + width + height."

Capture the returned manifest. It must contain three entries: `hero`, `floor-eg`, `floor-og`. Use the category thumbnail decision: also upload the hero render as the category thumbnail (`category_media`) since the client hasn't supplied a dedicated category image — flag this in the closing report.

- [ ] **Step 4.4: Write and run the ZFH model insert**

Create `scripts/add-zfh-282-22-0.ts`. Replace `<r2-key>`, `<width>`, `<height>` placeholders with values from the manifest:

```ts
import { db } from "@/db/db";
import {
  houseCategories, houseModels, houseDetails,
  media, modelMedia, floorMedia, categoryMedia,
} from "@/db/schema";
import { eq } from "drizzle-orm";

await db.transaction(async (tx) => {
  const [cat] = await tx
    .select({ id: houseCategories.id })
    .from(houseCategories)
    .where(eq(houseCategories.slug, "zweifamilienhaus"));
  if (!cat) throw new Error("Zweifamilienhaus category missing — run add-zweifamilienhaus-category.ts first");

  const [model] = await tx
    .insert(houseModels)
    .values({
      categoryId: cat.id,
      title: "Zweifamilienhaus 22-282",
      slug: "zfh-282-22-0",
      modelCode: "22-282-0",
      livingArea: "282",
      roofPitch: 22,
      isFeatured: false,
    })
    .returning({ id: houseModels.id });

  await tx.insert(houseDetails).values({
    id: model.id,
    floorCount: "2",
    familiesCount: 2,
    hasGarage: false,
    roofType: "Walmdach",
    // bedroomCount / bathroomCount / kniestock unknown — flagged for client
  });

  // Hero
  const [heroMedia] = await tx
    .insert(media)
    .values({
      path: "<r2-key-for-hero>",
      alt: "Zweifamilienhaus 22-282 Außenansicht",
      width: <hero-width>,
      height: <hero-height>,
    })
    .returning({ id: media.id });

  await tx.insert(modelMedia).values({
    modelId: model.id,
    mediaId: heroMedia.id,
    isHero: true,
    isThumbnail: true,
    sortOrder: 0,
  });

  // Category thumbnail (reusing the hero render)
  await tx.insert(categoryMedia).values({
    categoryId: cat.id,
    mediaId: heroMedia.id,
    isThumbnail: true,
    sortOrder: 0,
  });

  // Floor EG
  const [egMedia] = await tx
    .insert(media)
    .values({
      path: "<r2-key-for-floor-eg>",
      alt: "Zweifamilienhaus 22-282 Erdgeschoss Grundriss",
      width: <eg-width>,
      height: <eg-height>,
    })
    .returning({ id: media.id });

  await tx.insert(floorMedia).values({
    modelId: model.id,
    mediaId: egMedia.id,
    title: "Erdgeschoss",
    variant: null,
    sortOrder: 10,
  });

  // Floor OG
  const [ogMedia] = await tx
    .insert(media)
    .values({
      path: "<r2-key-for-floor-og>",
      alt: "Zweifamilienhaus 22-282 Obergeschoss Grundriss",
      width: <og-width>,
      height: <og-height>,
    })
    .returning({ id: media.id });

  await tx.insert(floorMedia).values({
    modelId: model.id,
    mediaId: ogMedia.id,
    title: "Obergeschoss",
    variant: null,
    sortOrder: 20,
  });

  console.log(`✅ Inserted ZFH 282-22-0 (model id: ${model.id})`);
});
```

Run:

```bash
bun x tsx scripts/add-zfh-282-22-0.ts
```

- [ ] **Step 4.5: Verify in the browser**

With `bun run dev` running, open `http://localhost:4321/haus/zfh-282-22-0`. Verify: page renders, hero image displays, both floor plans appear in the floor switcher. Open `http://localhost:4321/hauser` and confirm Zweifamilienhaus appears as a category circle.

- [ ] **Step 4.6: Clean up and commit**

```bash
rm "todo/houses-to-add/Zweifamilienhäuser/ZFH 282-22-0/.DS_Store" 2>/dev/null
rm -rf "todo/houses-to-add/Zweifamilienhäuser/ZFH 282-22-0/"
rmdir "todo/houses-to-add/Zweifamilienhäuser/" 2>/dev/null
rm scripts/add-zweifamilienhaus-category.ts scripts/add-zfh-282-22-0.ts

git add todo/
git -c core.hooksPath=.githooks commit -m "$(cat <<'EOF'
content: add Zweifamilienhaus category + ZFH 282-22-0 model

New category 'zweifamilienhaus' inserted. ZFH 282-22-0 added with hero +
EG/OG floor plans, R2-uploaded. Category thumbnail reuses the hero render
pending a client-supplied category image.
EOF
)"
```

---

### Task 5: Add Kubus 0-140

**Files:**
- Create: `scripts/add-kubus-0-140.ts` (deleted after run)

- [ ] **Step 5.1: Inspect the source assets**

```bash
ls "todo/houses-to-add/Kubus/KUBUS ´0-145/"
```

Expect three files; filenames begin with `KUBUS 140-0-0` (folder name is wrong — confirmed by user).

- [ ] **Step 5.2: Hand off to `r2-image-curator`**

> "Source folder: `todo/houses-to-add/Kubus/KUBUS ´0-145/`. Target normalization: `kubus_kubus-0-140_<role>_<dimensions>.webp` (hero / floor-eg / floor-og). Optimize as in Task 4. Return the manifest."

- [ ] **Step 5.3: Write and run the model insert**

Create `scripts/add-kubus-0-140.ts` based on the ZFH template, with these fields:

- `categoryId`: lookup `kubus` slug.
- `title`: `Kubus 0-140`
- `slug`: `kubus-0-140`
- `modelCode`: `0-140-0`
- `livingArea`: `"140"`
- `roofPitch`: `null` (flat roof)
- `roofType`: `"Flachdach, Attika"`
- `floorCount`: `"2"`
- `isFeatured`: `false`

Run:

```bash
bun x tsx scripts/add-kubus-0-140.ts
```

- [ ] **Step 5.4: Verify**

Open `http://localhost:4321/haus/kubus-0-140`. Verify rendering as in Step 4.5.

- [ ] **Step 5.5: Clean up and commit**

```bash
rm -rf "todo/houses-to-add/Kubus/KUBUS ´0-145/"
rm scripts/add-kubus-0-140.ts

git add todo/
git -c core.hooksPath=.githooks commit -m "$(cat <<'EOF'
content: add Kubus 0-140 model

Flat-roof 2-storey, 140 m². R2-uploaded. Source folder name was wrong
('0-145'); filenames inside ('140-0-0') are authoritative per client.
EOF
)"
```

---

### Task 6: Add Kubus 0-173

**Files:**
- Create: `scripts/add-kubus-0-173.ts` (deleted after run)

- [ ] **Step 6.1: Inspect**

```bash
ls "todo/houses-to-add/Kubus/KUBUS 0-173/"
```

- [ ] **Step 6.2: Hand off to `r2-image-curator`**

> "Source folder: `todo/houses-to-add/Kubus/KUBUS 0-173/`. Target normalization: `kubus_kubus-0-173_<role>_<dimensions>.webp`. Same optimization as Task 4."

- [ ] **Step 6.3: Write and run the model insert**

Create `scripts/add-kubus-0-173.ts` with:

- `title`: `Kubus 0-173`
- `slug`: `kubus-0-173`
- `modelCode`: `0-173-0`
- `livingArea`: `"173"`
- `roofPitch`: `null`
- `roofType`: `"Flachdach, Attika"`
- `floorCount`: `"2"`
- `isFeatured`: `false`

Run and verify as Task 5.

- [ ] **Step 6.4: Clean up and commit**

```bash
rm -rf "todo/houses-to-add/Kubus/KUBUS 0-173/"
rmdir "todo/houses-to-add/Kubus/" 2>/dev/null
rm scripts/add-kubus-0-173.ts

git add todo/
git -c core.hooksPath=.githooks commit -m "$(cat <<'EOF'
content: add Kubus 0-173 model

Flat-roof 2-storey, 173 m². R2-uploaded.
EOF
)"
```

---

### Task 7: Final cleanup + end-to-end smoke

- [ ] **Step 7.1: Remove the `todo/houses-to-add/` directory if now empty**

```bash
rmdir todo/houses-to-add 2>/dev/null && echo "Removed" || echo "Not empty, inspect: $(ls todo/houses-to-add)"
```

If something remains, investigate before forcing removal.

- [ ] **Step 7.2: Final type-check**

```bash
bun run build
```

Expected: clean build.

- [ ] **Step 7.3: End-to-end browser smoke**

With `bun run dev`:

1. `/hauser` — Zweifamilienhaus, Kubus categories both reachable.
2. `/haus/kubus-0-140`, `/haus/kubus-0-173`, `/haus/zfh-282-22-0` — render.
3. Filter panel: pick `<150` Wohnfläche on the Kubus category → Kubus 0-140 included, Kubus 0-173 excluded.
4. Filter panel: pick `Einliegerwohnung` on Einfamilienhaus category → expect 3 models (EFH 35-181-150, 22-173-190, 28-194-170).
5. Sort: pick `Name ↑` on any category → alphabetical order.
6. Clear sort, return to `Einfamilienhaus` → featured model (Bestseller Freiraum 167) leads.

- [ ] **Step 7.4: Commit any leftover cleanup**

```bash
git add -A
git status
# If anything is staged:
git -c core.hooksPath=.githooks commit -m "$(cat <<'EOF'
chore: remove drained todo/houses-to-add/

End of houses sprint. todo/houses.md kept for the chat record.
EOF
)"
```

---

## Closing report

After all tasks, post a closing summary to the user covering:

- Per-task commit SHA.
- Any field on the new models that was a best-effort default (e.g. `bedroomCount`, `bathroomCount`, `kniestock`) and needs client confirmation.
- Generationenhaus 22-280 — still pending: client owes WoFlV value + imagery.
- Zweifamilienhaus category thumbnail — currently the ZFH hero; pending a dedicated category image.
