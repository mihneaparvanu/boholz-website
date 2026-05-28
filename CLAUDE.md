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

## Source structure

```
src/
├── db/           schema, client, loaders, model types
├── features/     domain slices (own state, data, business logic)
├── layouts/      Layout.astro (page shell)
├── lib/          cross-feature utilities (≤8 files)
├── pages/        Astro routes
└── ui/           design system (no domain knowledge)
    ├── style/    CSS tokens, resets, breakpoints
    ├── primitives/  atoms (Button, Card, FAQAccordion…)
    ├── sections/    section bands (PageHero, Block, ZigZag, Section…)
    └── icons/       icon components (BoholzLogo, GermanyFlag…)
```

**6 top-level dirs.** Each has a one-line rule. No `utils/`, no `components/`, no `composables/`.

### The features-vs-ui test

- **Owns state, fetches data, or has domain knowledge** → `features/<name>/`
- **Pure presentational primitive (no domain)** → `ui/primitives/`
- **Pure presentational section band (composes into a page)** → `ui/sections/`
- If a component starts in `ui/` but grows domain logic, promote it to a feature.

### Naming

- **Folders:** kebab-case always. `house-page`, not `HousePage`.
- **Files:** kebab-case for `.ts`; PascalCase for component files (`.vue`, `.astro`).
- **No `utils`, `helpers`, `misc`, `common`, `shared`.** Each file is named for its domain.

### Co-location

- A file lives next to its single consumer. Only when a second consumer appears does it graduate to a shared location (`lib/` or `ui/`).
- Single-page content → next to the page: `pages/karriere.content.ts`.
- Feature-scoped content → inside the feature: `features/bauphasen/bauphasen.content.ts`.
- Cross-feature content → `features/<shared-feature>/` or a dedicated content module.

## Architecture

### Rendering model

Astro pages (`src/pages/`) run on the server with `output: "server"` and the `@astrojs/node` standalone adapter. Pages load data inside the frontmatter using async loaders, then pass it as props to **Vue islands** (`@astrojs/vue`) hydrated with `client:load`/`client:visible`. Vue is the only interactive framework — there are no React components.

`maplibre-gl` is the one library Vite must bundle for SSR (`noExternal: ["maplibre-gl"]` in `astro.config.mjs`) because it touches `window`/`Worker`/WebGL.

### Data layer

- **Postgres + Drizzle ORM.** Schema lives in `src/db/schema.ts` under a dedicated `boholz` Postgres schema (`pgSchema("boholz")`). All tables go through `boholzSchema.table(...)`.
- **Single source of truth for images:** the `media` table. Every entity joins to `media` via a pivot table (`category_media`, `model_media`, `floor_media`, `agent_media`, `news_media`) carrying flags like `isThumbnail`, `isHero`, `sortOrder`. When a thumbnail or hero fails to render, look at the pivot row, not the `media` row.
- **DB client** in `src/db/db.ts` is a lazy Proxy singleton — no connection at build time, only on first query.
- **All loaders live in `src/db/loaders.ts`.** They use Drizzle's `db.query.*` with nested `with:` and resolve every `media.path` through `getMediaURL()` (from `src/lib/media.ts`) before returning. Client components must always receive fully-resolved URLs.
- **Entity types** live in `src/db/models.ts`, inferred from the schema.
- **Virtual `BESTSELLER_CATEGORY`** is not in the DB; it's resolved client-side by filtering `houseModels.isFeatured`. The constant lives in `src/lib/constants.ts`.

### Media / assets

Media files live in Cloudflare R2 (S3-compatible). `PUBLIC_ASSETS_URL` in `.env` is the R2 bucket base URL. The DB stores only the path; `getMediaURL()` (in `src/lib/media.ts`) joins them.

### Routing

File-based via `src/pages/`. German-language slugs (e.g. `hauser.astro`, `vor-ort-beratung.astro`, `uber-uns.astro`). Dynamic detail pages: `haus/[slug].astro` and `news/[slug].astro`. Route constants live in `src/features/navigation/routes.ts`. The shared `layouts/Layout.astro` fetches `getCategories()` and `getShowhouses()` for the global nav on every page.

### Features

`src/features/<feature>/` for self-contained, kebab-case feature areas. Key features:

- `navigation/` — navbar, footer, `routes.ts`
- `house-page/`, `houses-page/`, `news-page/` — page-backing features
- `home/` — homepage components (TrustBadges, BuildingStages, Overview — multi-page)
- `landing/` — shared landing page template content (types + per-variant `.content.ts`)
- `section-navigator/` — scroll spy, click-lock, navbar-sync rail
- `locations/`, `filter-panel/`, `category-slider/`, `faq/`, `contact-forms/`, etc.

### Styling

Two layered systems — do not mix them inside one file:

1. **Global CSS** in `src/ui/style/` (`reset.css`, `design-system.css`, `wrapper.css`, `fonts.css`, `breakpoints.css`, `legal.css`). Design tokens live as CSS custom properties in `design-system.css`.
2. **Vanilla Extract** (`.css.ts` files, co-located with the component) for component styling.

**No BEM, ever.** Class names must be short, semantic, local — `.head`, `.title`, `.cell`, `.muted`, `.active`. Vue `<style scoped>` and Vanilla Extract already give you the namespacing. Modifiers are separate classes toggled with `:class="{ active }"`. Style state via attributes (`[data-state="open"]`) or chained selectors (`.pin.active .body`).

**Breakpoints — always use the `@custom-media` tokens from `src/ui/style/breakpoints.css`.** Never hardcode pixel values in `@media` queries. The tokens are registered globally via `postcss-global-data` and work inside `<style scoped>` blocks.

| When you want…                 | Use                        |
| ------------------------------ | -------------------------- |
| Mobile only (< 500px)          | `@media (--mobile)`        |
| Tablet only (500–1023px)       | `@media (--tablet)`        |
| Desktop only (1024–1439px)     | `@media (--desktop)`       |
| Wide only (≥ 1440px)           | `@media (--wide)`          |
| Tablet and up                  | `@media (--from-tablet)`   |
| Desktop and up                 | `@media (--from-desktop)`  |
| Anything narrower than desktop | `@media (--below-desktop)` |

If a layout needs a breakpoint not covered by these tokens, **add a new `@custom-media` to `breakpoints.css`** rather than inlining a pixel value.

For accessible interactive primitives (dialogs, dropdowns, navigation menus, etc.) use **Reka UI** (`reka-ui`) for behavior and style it with Vanilla Extract.

Animation: `motion-v` (Vue port of Framer Motion) for transitions; native scroll with `position: sticky` and custom intersection-observer composables (`useScrollSpy`, `useScrollDirection`) for scroll-driven UI. Keep easings minimal; the brand is precision, not bounce.

## Conventions

- **Workspace hygiene:** ad-hoc `bun x tsx` scripts must be deleted once their output is captured. Ad-hoc scripts go in `scripts/` (folder is created when needed) and the folder is removed when empty.
- **Screenshots — NEVER add them to the project tree.** Verification screenshots (Playwright, browser captures, debug snapshots, "hero-*.png" comparison stacks, etc.) must be written to a system tempdir (`/tmp/boholz-screenshots/` or `mktemp -d`) and referenced by absolute path — never to the repo root, `dev/`, `docs/`, `.claude/`, or any other tracked location. The only PNG/JPG/WebP/GIF/AVIF files allowed in the tree are real site assets under `public/` and icon SVGs in `src/ui/icons/`. `.gitignore` blocks root-level images as a defensive backstop, but the rule is upstream: don't write them in the first place. Past incident: 13 root-level `hero-*.png` debug captures plus a legacy `.claude/screenshots/` dump had to be manually purged on 2026-05-28.
- **Adding a new house model:** drop the source folder into `todo/houses-to-add/<Category>/<NAME>/` and invoke the `add-house-model` skill.
- **Dev-only content lives in `/dev/`** (planning docs, sandbox routes). Never put experiments in `src/`. Never commit `/dev/` paths in a `main`-targeted push — `.githooks/pre-push` blocks it. Enable the hook once per clone: `git config core.hooksPath .githooks`.
- **TypeScript:** no `any`. Entity types in `src/db/models.ts` (inferred from schema). View models derived via `Pick`/`Omit`/`Awaited<ReturnType<>>`, co-located in `features/<feature>/types.ts`. Name a type when its name communicates intent that the structure doesn't.
- **German umlauts in identifiers:** replace `ue/oe/ae/ss` in slugs and asset filenames.
- **Image assets:** prefer WebP; minimum 1200px on shortest side; strip EXIF GPS but preserve ICC color profiles.
- **SVGs:** logos and icons are implemented as components in `ui/icons/`, not raw `<img>` references.

## How to add a new page

1. Create `src/pages/<slug>.astro`. Import `Layout` from `@/layouts/Layout.astro`.
2. If the page has static content, create `src/pages/<slug>.content.ts` next to it.
3. Use section components from `@/ui/sections/` and primitives from `@/ui/primitives/`.

## How to add a new feature

1. Create `src/features/<kebab-name>/` with the main component and a `.types.ts` if needed.
2. Keep content, composables, and sub-components inside the feature folder.
3. Only graduate shared utilities to `lib/` when a second feature needs them.

## Reference files

- `docs/development.md` — fuller tech-stack brief and styling rules
- `docs/agent.md` — asset pipeline, house categories, naming standard
- `drizzle/` — generated SQL migrations; the schema source is `src/db/schema.ts`
