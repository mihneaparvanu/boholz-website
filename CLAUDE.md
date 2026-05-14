# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BoHolz is a premium prefab home manufacturer from Germany. This is the public-facing marketing site, served by Astro in SSR mode (Node standalone adapter). Aesthetic is minimalist, high-end, precision-focused — keep that in mind when writing or styling UI.

## Commands

- `npm run dev` — start dev server at `localhost:4321` (sets `NODE_TLS_REJECT_UNAUTHORIZED=0` so Drizzle can hit the dev DB)
- `npm run build` — production build to `./dist/`
- `npm run preview` — preview the production build
- `npm run start` — run the production build on `0.0.0.0`
- `npx tsx scripts/<script>.ts` — run one-off DB inspection / seed scripts against the live DB (delete the script when done, per repo rules)
- `npx drizzle-kit generate` / `migrate` — manage migrations against the `boholz` Postgres schema (config in `drizzle.config.ts`)

Node ≥ 22.12 is required (`.node-version`).

## Architecture

### Rendering model

Astro pages (`src/pages/`) run on the server with `output: "server"` and the `@astrojs/node` standalone adapter. Pages load data inside the frontmatter using async loaders, then pass it as props to **Vue islands** (`@astrojs/vue`) hydrated with `client:load`/`client:visible`. Vue is the only interactive framework — there are no React components.

`maplibre-gl` is the one library Vite must bundle for SSR (`noExternal: ["maplibre-gl"]` in `astro.config.mjs`) because it touches `window`/`Worker`/WebGL.

### Data layer

- **Postgres + Drizzle ORM.** Schema lives in `src/db/schema.ts` under a dedicated `boholz` Postgres schema (`pgSchema("boholz")`). All tables go through `boholzSchema.table(...)`.
- **Single source of truth for images:** the `media` table. Every entity (categories, models, floors, agents, news) joins to `media` via a pivot table (`category_media`, `model_media`, `floor_media`, `agent_media`, `news_media`) carrying flags like `isThumbnail`, `isHero`, `sortOrder`. When a thumbnail or hero fails to render, look at the pivot row, not the `media` row.
- **DB client** in `src/db/db.ts` is a lazy Proxy singleton — no connection is opened at build time, only on first query. Works under both Astro's `import.meta.env` and Node's `process.env`.
- **All loaders live in `src/data/loaders.ts`.** They use Drizzle's `db.query.*` with nested `with:` and resolve every `media.path` through `getMediaURL()` (which prepends `PUBLIC_ASSETS_URL`) before returning. Client components must always receive fully-resolved URLs — they don't have access to env vars.
- **Virtual `BESTSELLER_CATEGORY`** (`src/data/loaders.ts`) is not in the DB; it's appended client-side and resolved by filtering `houseModels.isFeatured`. Keep this contract intact when changing category logic.

### Media / assets

Media files live in Cloudflare R2 (S3-compatible). `PUBLIC_ASSETS_URL` in `.env` is the R2 bucket base URL. Use the AWS CLI pointed at `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` with the dev `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` for bucket operations. The DB stores only the path; `getMediaURL()` joins them.

### Routing

File-based via `src/pages/`. German-language slugs (e.g. `hauser.astro`, `vor-ort-beratung.astro`, `uber-uns.astro`). Dynamic detail pages: `haus/[slug].astro` and `news/[slug].astro`. The shared `layouts/Layout.astro` fetches `getCategories()` and `getShowhouses()` for the global nav on every page; pass `categories` as a prop to avoid the extra query when the page already has them.

### Features

`src/features/<Feature>/` for self-contained, mostly-Vue feature areas (e.g. `Locations`, `HousePage`, `HousesPage`, `CategorySlider`, `FilterPanel`, `NewsPage`). `src/layouts/Navbar` and `src/layouts/Footer` are likewise feature-shaped.

`src/components/` holds cross-feature primitives, grouped by intent:
- `components/ui/` — reusable UI atoms (`Card`, `SortButton`, `ImagePlaceholder`). No business logic, no feature coupling.
- `components/brand/` — brand-specific marks (`BoholzLogo`).

Single-caller components live next to their consumer (e.g. `TitleLinks` in `layouts/Navbar/`), not under `components/`. Promote to `components/ui/` only when a second feature needs it.

### Styling

Two layered systems — do not mix them inside one file:

1. **Global CSS** in `src/style/` (`reset.css`, `design-system.css`, `wrapper.css`, `fonts.css`, `breakpoints.css`, `content-page.css`, `legal.css`). The design tokens — colors, typography scale — live as CSS custom properties in `design-system.css`. Use these tokens directly in `.astro` / `.vue` `<style>` blocks for page-level styling.
2. **Vanilla Extract** (`.css.ts` files, co-located with the component) for component styling per `development.md`. Use `recipe()` for variants and extract prop types with `RecipeVariants<typeof myRecipe>`. Never hardcode a token value that exists in the theme contract.

For accessible interactive primitives (dialogs, dropdowns, navigation menus, etc.) use **Reka UI** (`reka-ui`) for behavior and style it with Vanilla Extract — Reka is headless and ships no visuals.

Animation: GSAP (in-viewport reveals) + Lenis (smooth scroll). Keep easings minimal; the brand is precision, not bounce.

## Conventions specific to this repo

- **Workspace hygiene:** ad-hoc `npx tsx` scripts created to inspect or fix DB state must be deleted (`rm -f`) once their output is captured. Do not leave `test-db.ts`, `fix-foo.ts`, etc. behind. The kept scripts live in `scripts/` (`inspect-db.ts`, `seed-showhouses.ts`).
- **TypeScript:** no `any`. Derive row types via `InferSelectModel<typeof table>` (see `src/types/models.ts` for the established pattern of base types + enriched composite types).
- **German umlauts in identifiers:** replace `ü → ue`, `ö → oe`, `ä → ae`, `ß → ss` in slugs and asset filenames.
- **Image assets:** prefer WebP; minimum 1200px on shortest side; strip EXIF GPS but preserve ICC color profiles. Naming pattern when creating/renaming assets: `{category}_{house-slug}_{type}_{dimensions}.{ext}` (see `agent.md` for the full asset pipeline).
- **SVGs:** logos and icons are implemented as components, not raw `<img>` references.

## Reference files

- `development.md` — fuller tech-stack brief and styling rules
- `agent.md` — asset pipeline (WordPress export → sorted R2 library), house categories, naming standard
- `maps-masterclass.md`, `reka-select.md`, `fouc-layout-masterclass.md` — deeper notes on specific subsystems
- `drizzle/` — generated SQL migrations; the schema source is `src/db/schema.ts`