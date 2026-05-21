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
