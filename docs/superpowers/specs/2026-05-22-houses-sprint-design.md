# Houses Sprint — Design (2026-05-22)

> Status: **approved** in chat (2026-05-22). Scope is strictly what the client requested in `todo/houses.md` and `todo/houses-to-add/brief.md`, plus two user-requested sort features. The reference doc `dev/planning/houses-table.md` is informational only — its broader scope (roof variants, multi-column backfill, Geschosse filter, `Flachdach, Attika` enum) is **not** in this sprint.

## 1. Goals

1. **Bestsellers-first** default ordering — featured models lead within any category when no explicit sort is selected. *(User request, not client.)*
2. **Alphabetical sort** — new `Name ↑` / `Name ↓` sort options. *(User request, not client.)*
3. **Wohnfläche threshold filter** — `<150 / <170 / <200 / >200`, cumulative semantics. *(Client.)*
4. **Einliegerwohnung filter** — boolean, true = floor plan supports a granny-flat layout. *(Client.)*
5. **Backfill `allowsGrannyFlat`** on the 32 existing models from the planning-doc spreadsheet — required for goal 4 to match any rows. *(Implied by client request 4.)*
6. **Add new content** — 2 new models in the existing Kubus category (`Kubus 0-140`, `Kubus 0-173`), 1 new category (`Zweifamilienhaus`) with 1 model (`ZFH 282-22-0`). *(Client.)*
7. **Repo skill** — `.claude/skills/add-house-model/` codifies the local-folder → R2 → DB → cleanup pipeline. CLAUDE.md gets a one-line pointer. *(Client.)*

## 2. Explicit non-goals (planning-doc items the client did not request)

- Roof variants pivot table or any second-roof-variant representation.
- Geschosse (1 / 1.5 / 2) filter — the client only confirmed the *meaning* of 1,5.
- `Flachdach, Attika` enum addition.
- Backfilling `netFloorAreaDin`, `totalLivingAreaWoflv`, `floorCount` on existing models (the client said "don't add the area values, display as I sent" — read narrowly, that means leave them as-is for now).
- Generationenhaus 22-280 insert — client said they'd send the missing WoFlV value separately.
- Anbau / Garage filter rework — client explicitly deferred.

## 3. Constraints

- The DB schema already has the column we need (`house_details.allowsGrannyFlat boolean`). **No schema migrations.**
- Client components must receive fully-resolved media URLs from loaders.
- URL state must continue to round-trip cleanly for `?category` / `?sort` / `?filter`.
- Ad-hoc scripts live under `scripts/`; the folder is deleted after the script's output is captured.
- German umlauts normalized in slugs and asset filenames (`ä → ae`, `ö → oe`, `ü → ue`, `ß → ss`).

## 4. Stream-by-stream design

### Stream A — Sort changes (frontend only)

**Files touched**

- `src/features/FilterPanel/filter-panel.options.ts` — add `title` to `sortFields`.
- `src/features/HousesPage/HousesPage.vue` — partition by `isFeatured` in the default-sort branch.

**Behavior**

- New sort field:
  ```ts
  { value: "title", label: "Name", resolve: (m) => m.title }
  ```
  Produces `Name ↑` (`title-asc`) and `Name ↓` (`title-desc`). The existing comparator uses `localeCompare("de", { numeric: true })` for string keys — handles `Bestseller Plus 223` vs `Bestseller Twin 138` correctly.
- **Bestsellers-first** is active only when `activeSort === null`. In that branch, split `models` into `[featured, rest]` using `m.isFeatured`, run the existing default comparator (`parseLivingArea` asc, stable) on each side, concat. With any explicit sort selected, no pinning — featured models compete on the chosen key.
- In the Bestseller category every model is featured, so the partition is a no-op.

### Stream B — Filter additions (frontend only)

**Files touched**

- `src/features/FilterPanel/filter-panel.types.ts` — add `ThresholdFilter` kind.
- `src/features/FilterPanel/filter-panel.options.ts` — add two new filter definitions.
- `src/features/HousesPage/HousesPage.vue` — extend the `filterModels` switch with a `threshold` case.
- `src/features/FilterPanel/FilterPanel.vue` — render `threshold` options the same way `enum` options render.

**New type**

```ts
export type ThresholdFilter = {
  id: string;
  kind: "threshold";
  label: string;
  options: Array<{ label: string; predicate: (m: HouseModel) => boolean }>;
};

export type FilterOption =
  | BooleanFilter
  | EnumFilter
  | CountFilter
  | ThresholdFilter;
```

**New filter options**

| ID | Kind | Label | Source / values |
|---|---|---|---|
| `livingArea` | `threshold` | Wohnfläche | `<150`, `<170`, `<200`, `>200`. Predicates use `parseLivingArea(m.livingArea)`; null → exclude. |
| `allowsGrannyFlat` | `boolean` | Einliegerwohnung | Resolves `m.details?.allowsGrannyFlat ?? null`. |

**URL serialization**

Existing format `?filter=<id>:<value>` preserved. For `threshold`, the value is the option `label` (URL-encoded): `?filter=livingArea:%3C150`. The parser looks up the label in the option's `options` array; unknown labels are dropped silently (consistent with the existing parser's handling of unknown enum values).

**Filter execution**

```ts
case "threshold":
  return models.filter((m) => {
    const opt = f.option.options.find((o) => o.label === f.value);
    return opt ? opt.predicate(m) : false;
  });
```

### Stream D-lite — Backfill `allowsGrannyFlat` (data only)

**File** `scripts/seed-allows-granny-flat-2026-05-22.ts`. Single-purpose, idempotent. One transaction.

**Source** Rows with `ja` in the Einliegerwohnung column of `dev/planning/houses-table.md`:

| Slug | `allowsGrannyFlat` |
|---|---|
| `einfamilienhaus-35-181-150` | true |
| `einfamilienhaus-22-173-190` | true |
| `einfamilienhaus-28-194-170` | true |
| `stadtvilla-22-173` | true |
| `generationenhaus-28-264-160` | true |
| `pultdachhaus-21-349-225` | true |
| `bungalow-22-134` | true |

All other existing models keep the schema default (`false`). Verify count = 7 updates; throw and rollback otherwise.

The script is deleted after a successful run.

### Stream E — New content (assets + DB)

**Phase 2 only.** Depends on Stream F's skill content.

**Per-model procedure** (codified in Stream F):

1. Inventory the local `todo/houses-to-add/<Category>/<NAME>/` folder.
2. Normalize filenames to `{category}_{slug}_{type}_{dimensions}.{ext}` — strip the WordPress export suffixes (`BODENPLATTE EXPOSE-Grundrisse300dpi - NEU - WEBSITE - Erdgeschoss.png` → `kubus_kubus-0-140_floor-eg.png`).
3. Hand off to **r2-image-curator** for dedup + upload; receive canonical URL manifest.
4. Generate a per-model seed script that inserts `house_models` + `house_details` + `media` + `model_media` (one with `isHero` and `isThumbnail`) + `floor_media` (EG + OG rows, `variant: null`).
5. Apply in one transaction.
6. `rm -rf todo/houses-to-add/<Category>/<NAME>/`.

**Per-model specifics**

| Model | Category | Source folder | Notes |
|---|---|---|---|
| Kubus 0-140 | kubus | `todo/houses-to-add/Kubus/KUBUS ´0-145/` | Folder name was wrong; files (`KUBUS 140-0-0.*`) are authoritative. 2 storeys, flat roof, `modelCode: 0-140-0`. |
| Kubus 0-173 | kubus | `todo/houses-to-add/Kubus/KUBUS 0-173/` | 2 storeys, flat roof, `modelCode: 0-173-0`. Exterior render named `Kubus_173-0-0.png`. |
| ZFH 282-22-0 | (new) zweifamilienhaus | `todo/houses-to-add/Zweifamilienhäuser/ZFH 282-22-0/` | 282 m², roof pitch 22°, full upper storey. New category insert precedes this model. |

**New category insert**

```sql
INSERT INTO boholz.house_categories (name, slug, description)
VALUES ('Zweifamilienhaus', 'zweifamilienhaus', null);
```

Thumbnail for the category: reuse the ZFH 282-22-0 exterior render via `category_media` until the client supplies a dedicated category image. Flag this in the closing report.

After E completes, `todo/houses-to-add/` is empty and gets removed; `todo/houses.md` stays as a record of the client conversation (or also gets removed if the user prefers — left as a separate cleanup decision).

### Stream F — Skill + CLAUDE.md pointer

**New file** `.claude/skills/add-house-model/SKILL.md` with frontmatter:

```yaml
---
name: add-house-model
description: Add a new house model to the BoHolz site — inventories local assets in todo/houses-to-add/, uploads to R2 via r2-image-curator, writes the DB seed, then cleans up the source folder.
---
```

Body covers: prerequisites (env, R2 access), the local-folder convention, normalization rules, the `r2-image-curator` call, the seed-script template (house_models + house_details + media + model_media + floor_media), the cleanup step (delete source folder, delete the one-shot script), and the rule that brand-new categories require an `INSERT INTO house_categories` first.

**CLAUDE.md amendment** — one-line pointer under "Conventions specific to this repo":

> **Adding a new house model:** drop the source folder into `todo/houses-to-add/<Category>/<NAME>/` and invoke the `add-house-model` skill — it covers the R2-upload → DB-seed → cleanup pipeline.

## 5. Parallelization

**Phase 1 — three agents in parallel:**

| Agent | Streams | Files touched | Notes |
|---|---|---|---|
| `agent-sort-and-filter` | A + B | `filter-panel.types.ts`, `filter-panel.options.ts`, `FilterPanel.vue`, `HousesPage.vue` | Bundled — both touch `filter-panel.options.ts` and `HousesPage.vue`. One agent, two passes. |
| `agent-seed` | D-lite | `scripts/seed-allows-granny-flat-2026-05-22.ts` | Independent. Output enables Stream B's Einliegerwohnung filter to match. |
| `agent-skill-doc` | F | `.claude/skills/add-house-model/SKILL.md`, `CLAUDE.md` | Independent. Output is referenced by Stream E. |

**Phase 2 — one agent, sequential:**

| Agent | Streams | Depends on |
|---|---|---|
| `agent-new-houses` | E | Phase 1 complete. Uses the skill from Stream F. |

## 6. Acceptance criteria

- **A.** `Name ↑` and `Name ↓` appear in the sort dropdown; selecting them reorders the grid alphabetically (de-locale, numeric-aware — verify the six Bestseller-prefixed models sort by their suffix number). With no sort selected and on any non-Bestseller category, every featured model appears before every non-featured one. URL serializes `sort=title-asc` / `title-desc`.
- **B.** Wohnfläche and Einliegerwohnung filters appear in the panel under their own sections; selecting a Wohnfläche threshold narrows the grid to matching models; selecting Einliegerwohnung narrows the grid to the 7 Stream-D-lite models; chips work; clearing works; URL serializes correctly (`?filter=livingArea:%3C150` and `?filter=allowsGrannyFlat:true`).
- **D-lite.** Spot-check three rows post-seed:
  - `einfamilienhaus-35-181-150`: `allowsGrannyFlat = true`
  - `bungalow-22-134`: `allowsGrannyFlat = true`
  - `stadtvilla-18-140`: `allowsGrannyFlat = false` (not in the list)
  Total `true` rows across the table = 7.
- **E.** `/haus/kubus-0-140`, `/haus/kubus-0-173`, `/haus/zfh-282-22-0` render with hero + thumbnail + EG/OG floor plans. Zweifamilienhaus category appears in the navbar dropdown and on `/hauser`. `todo/houses-to-add/` is removed. R2 contains the new media keyed under the project's naming convention.
- **F.** Skill file exists at `.claude/skills/add-house-model/SKILL.md`; CLAUDE.md has the one-line pointer.

## 7. Risks and mitigations

- **Threshold filter URL encoding.** `<` and `>` must round-trip. The existing serializer already wraps `encodeURIComponent` around the value, so `<150` → `%3C150`. Parser uses the inverse. Verified inline.
- **`allowsGrannyFlat` schema default vs nullable.** Schema declares `boolean("allows_granny_flat").default(false)`. New rows are `false` by default; the script `UPDATE`s the 7 to `true`. No null surprises.
- **`Bungalow 22-149` ambiguity.** Planning doc rows 29 + 30 share that slug as two roof variants — but the Einliegerwohnung column is empty for both. So it stays `false`. No conflict with this sprint.
- **ZFH 282-22-0 as first member of a brand-new category.** If the category insert fails for any reason, the model insert in the same transaction also rolls back. Single transaction wraps both.

## 8. Implementation handoff

After this spec is approved by the user, the next step is `writing-plans` to produce the executable plan that `dispatching-parallel-agents` will consume.
