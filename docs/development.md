# BoHolz Development Brief: High-End Premium Prefab House Manufacturer from Germany

## 1. Technical Stack

- **Package manager / runtime:** **Bun** (lockfile: `bun.lock`). Use `bun install`, `bun run dev`, `bun x <cmd>`. Do not regenerate the lockfile with npm/pnpm/yarn.
- **First-time setup:** run `git config core.hooksPath .githooks` to enable the `pre-push` hook that blocks `/dev/**` paths from being pushed to `main`.
- **Framework:** Astro (SSR Mode)
- **Frontend:** Vue.js (for interactive components)
- **Database:** Postgres 18 (External via Dokploy)
- **ORM:** Drizzle ORM
- **Animation:** GSAP + Lenis (Smooth Scroll)
- **Styling:** Vanilla Extract (CSS-in-TypeScript, zero runtime) + PostCSS for global resets/base
- **Component Primitives:** Reka UI (Vue port of Radix UI — headless, fully accessible)

## 2. Core Implementation Phases

### Phase 1: The Data Layer (Drizzle)

- **Task:** Establish connection to `boholz-db` using the `DATABASE_URL`.
- **Standard:** Create a strictly typed schema in `src/db/schema.ts` that maps to the existing 18 house models.
- **Precision:** Ensure the `media` table points to the new `sorted-assets/` folder structure.

_Database Media Workflow Update:_
We utilize a pivot table structure (`category_media`, `model_media`, etc.) joining to a single `media` table via Drizzle ORM.
**Important Issue Noted:** Doppelhaus and Mehrfamilienhaus are missing `isThumbnail: true` mappings in the `category_media` table, which causes their pictures not to render. The mapping needs to be added (both are either lacking thumbnail relationships or missing completely from the join table like Mehrfamilienhaus).
To query media manually in AWS CloudFlare R2, utilize standard S3 CLI configurations providing the Account ID endpoint to list the bucket contents and ensure the category pictures natively exist in remote storage.

### Phase 2: The UX Layer (Lenis + GSAP)

- **Vibe:** Minimalist transitions. No aggressive easing.
- **Lenis:** Implement global smooth scrolling to ensure a premium, weighted feel.
- **GSAP:** Create "reveal" animations for house renders as they enter the viewport.

### Phase 3: Identity & Auth

- **Requirement:** Setup a secure admin area for BoHolz staff to edit house details.
- **Tool:** [Insert preferred choice, e.g., Lucia Auth or Auth.js].

## 3. Workflow Specifications: S3 / Cloudflare R2 & Database

- **Public Assets URL:** Defined as `PUBLIC_ASSETS_URL` in `.env` mapped to a Cloudflare R2 Dev bucket.
- **AWS CLI setup:** Since Cloudflare R2 is S3-compatible, point the AWS CLI (or SDK) endpoint URL directly to the R2 endpoint (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`) and use the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from the dev `.env`.
- **Database Modularity:** Separation of Database vs Media assets environments ensures we can swap buckets easily or use unmanaged CDNs if appropriate.
- **Workspace Cleanliness:** Temporary scripts created during development / database inspection (e.g., using `npx tsx`) must be immediately deleted after execution to maintain a clean directory structure.
- **Screenshots stay out of the tree.** Verification / debug screenshots from Playwright, MCP browser tools, or manual captures must be written to `/tmp/` (or an `mktemp -d` directory) — never to the repo root or any tracked path. The only images that belong in the project are real site assets under `public/` and icon SVGs under `src/ui/icons/`. Root-level `*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.webp`, and `*.avif` are git-ignored as a backstop; do not work around the rule by nesting them in a subdir. See `CLAUDE.md` for the canonical statement of this rule.

## 4. Guiding Principles

- **Code Quality:** Use TypeScript for everything. No `any` types.
- **Performance:** Optimize for Largest Contentful Paint (LCP). Use the sorted WebP assets.
- **Aesthetics:** Maintain the high-precision German engineering aesthetic in the UI components.
  SVG Protocol: All logos and icons must be implemented as functional components.

## 5. Styling Architecture (Vanilla Extract)

All component styles are written in `.css.ts` files co-located with their component.

**File convention:**

- `src/style/theme.css.ts` — token contract (`createThemeContract`) + default theme (`createTheme`)
- `ComponentName/ComponentName.css.ts` — component styles using `recipe()` or `style()`
- `.vue` files import **only the resulting class name strings** from `.css.ts` files — never write inline styles or hardcode values

**Rules:**

- Never hardcode a color, spacing, or radius value that exists in `theme.css.ts`. Always use `vars`.
- All variant logic lives in `recipe()` — never conditional class strings in template logic.
- Extract component props types with `RecipeVariants<typeof myRecipe>`.

**Reka UI (headless component primitives):**

- Use Reka UI for any interactive element that requires accessibility: dialogs, dropdowns, checkboxes, sliders, navigation.
- Reka provides behavior only — all visual styling is done via Vanilla Extract.
- Import from `reka-ui`. See: https://reka-ui.com
