# Houses Sprint — Design (2026-05-22)

> Status: **approved** in chat (2026-05-22). Source feedback: `todo/houses.md`, `todo/houses-to-add/brief.md`, reference `dev/planning/houses-table.md`.

## 1. Goals

Ship in one sprint:

1. **Bestsellers-first** default ordering — featured models lead within any category when no explicit sort is selected.
2. **Alphabetical sort** — new `Name ↑` / `Name ↓` sort options.
3. **Filter additions** — Wohnfläche threshold (`<150 / <170 / <200 / >200`), Geschosse (1 / 1.5 / 2), Einliegerwohnung möglich, plus the missing `Flachdach, Attika` roof type.
4. **Roof variants** — represent the second roof option for Stadtvilla 18-140, Stadtvilla 22-173, Bungalow 22-149.
5. **Seed updates** — populate `house_details` columns (`floorCount`, `netFloorAreaDin`, `totalLivingAreaWoflv`, `allowsGrannyFlat`) for all 32 existing models from the planning-doc spreadsheet.
6. **New content** — 1 new category (`Zweifamilienhaus`), 4 new models (`Kubus 0-140`, `Kubus 0-173`, `ZFH 282-22-0`, `Generationenhaus 22-280`), with R2 asset upload for 3 of them.
7. **Repo skill** — `.claude/skills/add-house-model/` codifies the local-folder → R2 → DB → cleanup pipeline so future house additions are one command.

Out of scope (client deferred):

- Anbau / Garage rework. The DB column (`extensionDescription`) exists; the filter does not change.
- Generationenhaus 22-280 imagery — client will send separately; DB row is inserted now with no media.

## 2. Constraints

- The DB schema already has every column the planning doc flagged as "missing": `floorCount` (numeric, supports 1.5), `extensionDescription`, `netFloorAreaDin`, `totalLivingAreaWoflv`, `allowsGrannyFlat`. **No schema migration is needed except for the new `roof_variants` table.**
- Frontend rule: client components must receive fully-resolved URLs from loaders, not env vars.
- URL state must continue to round-trip cleanly for `?category` / `?sort` / `?filter`.
- Repo conventions: kebab-case content files, no BEM, breakpoints via `@custom-media`, German umlauts normalized in slugs and asset filenames, ad-hoc scripts go in `scripts/` and the folder is deleted after.

## 3. Stream-by-stream design

### Stream A — Sort changes (frontend only)

**Files touched**

- `src/features/FilterPanel/filter-panel.options.ts` — add `title` to `sortFields`.
- `src/features/HousesPage/HousesPage.vue` — modify default-sort branch in `sortModels` and `displayModels` to partition by `isFeatured`.

**Behavior**

- New sort field:
  ```ts
  { value: "title", label: "Name", resolve: (m) => m.title }
  ```
  Generated options: `title-asc` (`Name ↑`) and `title-desc` (`Name ↓`). Comparator already does `localeCompare("de", { numeric: true })` for string keys, which handles `Bestseller Plus 223` vs `Bestseller Twin 138` correctly.
- Bestseller pinning is **only active when `activeSort === null`**. In that branch, split `models` into `[featured, rest]` using `m.isFeatured`, run the existing default comparator (livingArea asc, stable) on each side independently, concat. Within the Bestseller category every model is featured, so the partition is a no-op.
- When the user picks any sort, no pinning — featured models compete on the chosen key with the rest.

### Stream B — Filter additions (frontend only)

**Files touched**

- `src/features/FilterPanel/filter-panel.types.ts` — introduce `ThresholdFilter` kind; add `op?: "eq" | "gte"` (default `gte`) to `CountFilter`.
- `src/features/FilterPanel/filter-panel.options.ts` — add four new filter definitions, extend roof enum.
- `src/features/HousesPage/HousesPage.vue` — extend the `filterModels` switch to handle `threshold` and the new `count.op`.
- `src/features/FilterPanel/FilterPanel.vue` — render `threshold` options the same way `enum` options render.

**New types**

```ts
export type ThresholdFilter = {
  id: string;
  kind: "threshold";
  label: string;
  options: Array<{ label: string; predicate: (m: HouseModel) => boolean }>;
};

export type CountFilter = {
  id: string;
  kind: "count";
  label: string;
  values: number[];
  op?: "eq" | "gte"; // default "gte" for back-compat
  resolve: (m: HouseModel) => number | null;
};

export type FilterOption = BooleanFilter | EnumFilter | CountFilter | ThresholdFilter;
```

**New filter options**

| ID | Kind | Label | Source / values |
|---|---|---|---|
| `livingArea` | `threshold` | Wohnfläche | `<150`, `<170`, `<200`, `>200` — predicate uses `parseLivingArea(m.livingArea)`; null → exclude. |
| `floorCount` | `count` (op: `eq`) | Geschosse | `1`, `1.5`, `2`. Resolves `m.details?.floorCount`; if floorCount is null falls back to `levelCount`. |
| `allowsGrannyFlat` | `boolean` | Einliegerwohnung | Resolves `m.details?.allowsGrannyFlat ?? null`. |
| `roofType` | `enum` (extend) | Dachtyp | Add `"Flachdach, Attika"`. Existing resolver works. |

**URL serialization**

Existing format `?filter=<id>:<value>` is preserved. For `threshold`, the value is the option `label` (URL-encoded): `?filter=livingArea:%3C150`. The parser looks up the label in the option's `options` array.

**Filter execution**

```ts
case "threshold":
  return models.filter((m) =>
    f.option.options.find((o) => o.label === f.value)?.predicate(m) ?? false,
  );
case "count":
  return models.filter((m) => {
    const r = f.option.resolve(m);
    if (r === null) return false;
    return f.option.op === "eq" ? r === f.value : r >= f.value;
  });
```

### Stream C — Roof variants (DB + types + loader + UI)

**Schema**

```ts
export const roofVariants = boholzSchema.table("roof_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id").references(() => houseModels.id).notNull(),
  type: varchar("type").notNull(),
  pitch: integer("pitch"),
  sortOrder: smallint("sort_order").default(0),
});

export const roofVariantsRelations = relations(roofVariants, ({ one }) => ({
  model: one(houseModels, { fields: [roofVariants.modelId], references: [houseModels.id] }),
}));
// And add `roofVariants: many(roofVariants)` to houseModelsRelations.
```

**Migration** generated via `bun x drizzle-kit generate`, committed under `drizzle/`.

**Loaders** `getModels` and `getModelBySlug` add `roofVariants: { orderBy: asc(sort_order) }` to their `with:` clause. `HouseModel` composite type gains `roofVariants: RoofVariant[]`.

**UI** A new row under the house page spec block:
```
Auch erhältlich mit: Flachdach, Attika
```
Only renders when `roofVariants.length > 0`. Filter logic is **not** extended to consider variants in this sprint; primary `roofType` still drives filter matching.

**Seed** (rows inserted in Stream C, not D — they require the new table):

| Model slug | Variant type | Pitch |
|---|---|---|
| `stadtvilla-18-140` | `Flachdach, Attika` | null |
| `stadtvilla-22-173` | `Flachdach` | 22 |
| `bungalow-22-149` | `Flachdach, Attika` | null |

### Stream D — Seed updates for 32 existing models

**File** `scripts/seed-house-details-2026-05-22.ts`. Runs in **one transaction**, idempotent (uses `UPDATE` keyed on `house_models.slug` → `house_details.id`). Reads values from a const map transcribed directly from the planning-doc table.

**Fields updated per row**

- `floorCount` (numeric — 1, 1.5, 2)
- `netFloorAreaDin` (numeric m²)
- `totalLivingAreaWoflv` (numeric m²)
- `allowsGrannyFlat` (boolean — `true` only where the spreadsheet has `ja`)

`kniestock` is already populated and only spot-checked. `roofType` and `roofPitch` are already populated.

**Validation step inside the script:** count of updated rows must equal 32 — if it doesn't, throw and rollback. The 6 Bestseller rows leave `kniestock` null (the spreadsheet doesn't publish it for them); all 32 rows have a WoFlV value to populate. The new Generationenhaus 22-280 is *not* part of this seed — it is inserted in Stream E and currently has no WoFlV value (client to supply).

After the script runs successfully, **the file is deleted** per repo convention.

### Stream E — New houses + category

**Phase 2 only.** Depends on:
- Stream C's roof_variants table existing (Generationenhaus 22-280 will likely have no variants but the field must exist).
- Stream F's skill documenting the procedure.

**Per-model procedure** (codified in Stream F):

1. Inventory the local `todo/houses-to-add/<Category>/<NAME>/` folder.
2. Normalize filenames to `{category}_{slug}_{type}_{dimensions}.{ext}`. Strip the timestamp/dpi suffix from `BODENPLATTE EXPOSE-Grundrisse300dpi - NEU - WEBSITE - Erdgeschoss.png` → `kubus_kubus-0-140_floor-eg.png`.
3. Hand off to **r2-image-curator** agent — it inventories R2, dedupes against existing keys, uploads new files, returns the canonical URL manifest.
4. Generate a per-model seed script:
   - `house_models` row (title, slug, modelCode, categoryId, isFeatured: false, livingArea, roofPitch, basic description).
   - `house_details` row (floorCount, bedroomCount, bathroomCount, hasGarage, roofType, kniestock, etc. — best-effort from filename / floor-plan inspection; flag fields needing client confirmation).
   - `media` rows for each uploaded asset.
   - `model_media` rows linking media → model (one with `isHero: true` + `isThumbnail: true` = exterior render).
   - `floor_media` rows for EG + OG (variant: null).
5. Apply in one transaction.
6. `rm -rf todo/houses-to-add/<Category>/<NAME>/`.

**Per-model specifics**

| Model | Category | Source folder | Notes |
|---|---|---|---|
| Kubus 0-140 | kubus | `todo/houses-to-add/Kubus/KUBUS ´0-145/` | Folder name was wrong; files (`KUBUS 140-0-0.*`) are authoritative. 2 storeys, flat roof, modelCode `0-140-0`. |
| Kubus 0-173 | kubus | `todo/houses-to-add/Kubus/KUBUS 0-173/` | 2 storeys, flat roof, modelCode `0-173-0`. Exterior render named `Kubus_173-0-0.png`. |
| ZFH 282-22-0 | (new) zweifamilienhaus | `todo/houses-to-add/Zweifamilienhäuser/ZFH 282-22-0/` | 282 m², roof pitch 22°, full upper storey. New category insert precedes this model. |
| Generationenhaus 22-280 | generationenhaus | (no folder — client will send) | DB row only. Surface to client as awaiting imagery. |

**New category insert**

```sql
INSERT INTO boholz.house_categories (name, slug, description)
VALUES ('Zweifamilienhaus', 'zweifamilienhaus', null);
```

Thumbnail: reuse the ZFH 282-22-0 exterior render via `category_media` until the client supplies a dedicated category image.

### Stream F — Skill + CLAUDE.md pointer

**New file** `.claude/skills/add-house-model/SKILL.md` with frontmatter:

```yaml
---
name: add-house-model
description: Add a new house model to the BoHolz site — inventories local assets in todo/houses-to-add/, uploads to R2 via r2-image-curator, writes the DB seed, then cleans up the source folder.
---
```

Body covers: prerequisites (env vars, R2 access), the local-folder convention, the call to `r2-image-curator`, the seed-script template, the cleanup step, and the rule that the script + source folder are deleted after success.

**CLAUDE.md amendment** — one-line pointer under "Conventions specific to this repo":

> **Adding a new house model:** drop the source folder into `todo/houses-to-add/<Category>/<NAME>/` and invoke the `add-house-model` skill — it covers the R2-upload → DB-seed → cleanup pipeline.

## 4. Parallelization

**Phase 1 — four agents in parallel:**

| Agent | Streams | Files touched | Notes |
|---|---|---|---|
| `agent-sort-and-filter` | A + B | `filter-panel.types.ts`, `filter-panel.options.ts`, `FilterPanel.vue`, `HousesPage.vue` | Bundled because A and B share `filter-panel.options.ts` (sortFields vs filterOptions exports). One agent, two passes. |
| `agent-roof-variants` | C | `schema.ts`, new migration in `drizzle/`, `loaders.ts`, `types/models.ts`, house-page UI, seed for 3 models | Independent. |
| `agent-seed` | D | `scripts/seed-house-details-2026-05-22.ts` | Independent. Validates Stream B by populating the data Stream B filters on. |
| `agent-skill-doc` | F | `.claude/skills/add-house-model/SKILL.md`, `CLAUDE.md` | Independent. Output is referenced by Stream E. |

**Phase 2 — one agent, sequential:**

| Agent | Streams | Depends on |
|---|---|---|
| `agent-new-houses` | E | Phase 1 complete. Uses the skill from Stream F, the table from Stream C. |

## 5. Acceptance criteria

- **A.** `Name ↑` and `Name ↓` appear in the sort dropdown; selecting them reorders the grid alphabetically (de-locale, numeric-aware). With no sort selected and on any non-Bestseller category, every featured model appears before every non-featured one. URL serializes `sort=title-asc`.
- **B.** All four new filters appear in the panel; chips work; clearing works; URL serializes correctly; AND-combining filters narrows results. `Flachdach, Attika` selects the 3 Kubus models whose primary `roofType` is already that value (verified by DB read). Filter does **not** match a model whose only "Flachdach, Attika" association is via the new `roof_variants` table — that's a deliberate scope cut documented in Stream C.
- **C.** Drizzle migration applied; `boholz.roof_variants` table exists; `getModels()` and `getModelBySlug()` return a `roofVariants` array; the 3 affected models render the "Auch erhältlich mit:" hint on `/haus/[slug]`.
- **D.** All 32 existing models have non-null values for `floorCount`, `netFloorAreaDin`, `totalLivingAreaWoflv` where the spreadsheet provides them. `allowsGrannyFlat` is `true` for the 7 rows marked `ja` in the spreadsheet. Spot-check Bestseller Plus 223 (floorCount=1.5), Stadtvilla 18-140 (floorCount=2, no Einliegerwohnung), Pultdachhaus 21-349-225 (floorCount=1.5, allowsGrannyFlat=true).
- **E.** `/haus/kubus-0-140`, `/haus/kubus-0-173`, `/haus/zfh-282-22-0`, `/haus/generationenhaus-22-280` render. Zweifamilienhaus category appears in navbar dropdown and on `/hauser`. `todo/houses-to-add/` deleted. R2 contains the new media.
- **F.** Skill is invokable; running it on a fresh folder produces a valid seed plan; CLAUDE.md updated.

## 6. Risks and mitigations

- **`agent-seed` races `agent-roof-variants`** — both run UPDATEs, but on different tables. No overlap.
- **Filter URL parsing breaks for thresholds** — the option label can contain `<`, `>`. Already URL-encoded by the existing serializer; verified inline.
- **`floorCount` vs `levelCount`** — `levelCount` is still nullable smallint in the schema and may be the only value populated for some rows. Seed script writes `floorCount`; filter resolver reads `floorCount ?? levelCount`.
- **Generationenhaus 22-280 has no imagery** — model is inserted DB-only; thumbnail falls back to category placeholder. Flagged in the closing report so the client knows what's pending.

## 7. Implementation handoff

After this spec is approved by the user, the next step is `writing-plans` to produce the executable plan that `dispatching-parallel-agents` will consume.
