# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BoHolz is a premium prefab home manufacturer from Germany. This is the public-facing marketing site, served by Astro in SSR mode (Node standalone adapter). Aesthetic is minimalist, high-end, precision-focused — keep that in mind when writing or styling UI.

## Project documentation

Detailed guides live in `docs/`. Read the relevant one before starting
work in that area:

- `docs/agent.md` — how agents in this project are structured
- `docs/development.md` — local development setup, conventions
- `docs/architecture.md` — high-level system design

## Commands

> **Package manager / runtime: Bun.** Use `bun install`, `bun run dev`, `bun run build`, `bun x <cmd>`. The lockfile is `bun.lock`; do not regenerate it with npm/pnpm/yarn. Vite's esbuild dep resolves under `node_modules/.bun/esbuild@*/` — keep that in mind when chasing stack traces.

- `bun run dev` — start dev server at `localhost:4321` (sets `NODE_TLS_REJECT_UNAUTHORIZED=0` so Drizzle can hit the dev DB)
- `bun run build` — production build to `./dist/`
- `bun run preview` — preview the production build
- `bun run start` — run the production build on `0.0.0.0`
- `bun x tsx scripts/<script>.ts` — run one-off DB inspection scripts against the live DB (folder is created when needed and deleted after, per repo rules)
- `bun x drizzle-kit generate` / `migrate` — manage migrations against the `boholz` Postgres schema (config in `drizzle.config.ts`)

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

### Content / data placement

Three tiers — pick the smallest that still fits. The content file lives as close to its only consumer as possible; the moment a second consumer appears, it graduates to `src/content/`.

- **Single page, no feature folder** → next to the page as `<page>.content.ts` (e.g. `src/pages/karriere.content.ts`, `src/pages/vor-ort-beratung.content.ts`).
- **Inside a feature folder** → next to the component as `<feature>.content.ts` and `<feature>.types.ts` (e.g. `features/Home/home.content.ts`, `features/Home/BuildingStages/building-stages.content.ts`).
- **Shared by 2+ pages or features** → `src/content/<topic>.ts` with the types declared in the same file (e.g. `content/qa.ts` exports `Question`, `QuestionCategory`, `qaCategories`). When this content eventually moves to the DB, the file becomes the seed shape.

Naming is kebab-case, suffix `.content.ts` (or just `.ts` inside `src/content/` since the folder name already signals intent). DB entity types stay in `src/types/models.ts`. Don't pre-emptively split content into `models/` + `data/` folders — types live next to the data they describe.

### Styling

Two layered systems — do not mix them inside one file:

1. **Global CSS** in `src/style/` (`reset.css`, `design-system.css`, `wrapper.css`, `fonts.css`, `breakpoints.css`, `content-page.css`, `legal.css`). The design tokens — colors, typography scale — live as CSS custom properties in `design-system.css`. Use these tokens directly in `.astro` / `.vue` `<style>` blocks for page-level styling.
2. **Vanilla Extract** (`.css.ts` files, co-located with the component) for component styling per `development.md`. Use `recipe()` for variants and extract prop types with `RecipeVariants<typeof myRecipe>`. Never hardcode a token value that exists in the theme contract.

**No BEM, ever.** Class names must be short, semantic, local — `.head`, `.title`, `.cell`, `.muted`, `.active`. Never `.card__head`, `.card__title--muted`, `.cell--hero`. Vue `<style scoped>` and Vanilla Extract already give you the namespacing — the _file_ is the namespace. Repeating the component name inside class names is dead weight. Modifiers are separate classes (`class="pin active"`, not `class="pin pin--active"`) toggled with `:class="{ active }"`. Style state via attributes (`[data-state="open"]`) or chained selectors (`.pin.active .body`), never via `--modifier` suffixes.

**Breakpoints — always use the `@custom-media` tokens from `src/style/breakpoints.css`.** Never hardcode pixel values in `@media` queries. The tokens are registered globally via `postcss-global-data` and work inside `<style scoped>` blocks.

| When you want…                 | Use                        |
| ------------------------------ | -------------------------- |
| Mobile only (< 500px)          | `@media (--mobile)`        |
| Tablet only (500–1023px)       | `@media (--tablet)`        |
| Desktop only (1024–1439px)     | `@media (--desktop)`       |
| Wide only (≥ 1440px)           | `@media (--wide)`          |
| Tablet and up                  | `@media (--from-tablet)`   |
| Desktop and up                 | `@media (--from-desktop)`  |
| Anything narrower than desktop | `@media (--below-desktop)` |

If a layout needs a breakpoint not covered by these tokens, **add a new `@custom-media` to `breakpoints.css`** rather than inlining a pixel value. The point is one source of truth — refactoring breakpoints should be a one-file change.

For accessible interactive primitives (dialogs, dropdowns, navigation menus, etc.) use **Reka UI** (`reka-ui`) for behavior and style it with Vanilla Extract — Reka is headless and ships no visuals.

Animation: GSAP (in-viewport reveals) + Lenis (smooth scroll). Keep easings minimal; the brand is precision, not bounce.

## Conventions specific to this repo

- **Workspace hygiene:** ad-hoc `bun x tsx` scripts created to inspect or fix DB state must be deleted (`rm -f`) once their output is captured. Do not leave `test-db.ts`, `fix-foo.ts`, etc. behind. Ad-hoc scripts go in `scripts/` (folder is created when needed) and the folder is removed when empty.
- **Dev-only content lives in `/dev/`** (planning docs, sandbox routes, migration guides). Never put experiments in `src/`. Never commit `/dev/` paths in a `main`-targeted push — `.githooks/pre-push` blocks it. Enable the hook once per clone: `git config core.hooksPath .githooks`.
- **TypeScript:** no `any`. Three-layer model hierarchy (see `types-masterclass.md` for the full reasoning):
  1. **Entity types** — inferred via `InferSelectModel<typeof table>`, live in `src/types/models.ts`. One per DB table. Never hand-written.
  2. **Composite types** — entity + relations (e.g. `HouseModel & { media: Media[] }`). Named at the project level when reused; declared at the feature level otherwise.
  3. **View models** — per-feature display shapes derived via `Pick` / `Omit` / `Awaited<ReturnType<typeof loader>>[number]`. Co-located in `src/features/<Feature>/types.ts`. Loaders' return shape _is_ the view model — derive, don't duplicate.

  Rule: **name a type when its name communicates intent that the structure doesn't.** Use `Pick`/`Omit`/`Partial`/`Record` aggressively; let TS infer one-off local shapes. Brand IDs (`Brand<string, "UserId">`) only where confusing two ID types would be a real bug. Zod schemas at trust boundaries (forms, API, env); not for internal data.

- **German umlauts in identifiers:** replace `ü → ue`, `ö → oe`, `ä → ae`, `ß → ss` in slugs and asset filenames.
- **Image assets:** prefer WebP; minimum 1200px on shortest side; strip EXIF GPS but preserve ICC color profiles. Naming pattern when creating/renaming assets: `{category}_{house-slug}_{type}_{dimensions}.{ext}` (see `agent.md` for the full asset pipeline).
- **SVGs:** logos and icons are implemented as components, not raw `<img>` references.

## Reference files

- `development.md` — fuller tech-stack brief and styling rules
- `agent.md` — asset pipeline (WordPress export → sorted R2 library), house categories, naming standard
- `types-masterclass.md` — comprehensive TS type-modeling guide (vs Swift/SwiftUI). Read once when working on type-heavy refactors; the conventions above are the TL;DR.
- `maps-masterclass.md`, `reka-select.md`, `fouc-layout-masterclass.md` — deeper notes on specific subsystems
- `drizzle/` — generated SQL migrations; the schema source is `src/db/schema.ts`
