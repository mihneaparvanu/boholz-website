# Homepage changes — client PDF (2026-05-18)

Four of the eleven PDF items required code. The other seven are image swaps
the parent agent is handling out-of-band.

## What changed

### 1. PDF #2 — TrustBadges band on the homepage
- `src/pages/index.astro`
  - Imported `TrustBadges`, `trustBadges`, and `homeSections` from the
    existing kit.
  - Inserted a full-bleed `.band.full-width` between `<ProofSection/>`
    and the Vorteile section, holding an `<EyebrowHeadingLede>` (eyebrow
    `Vertrauen`, heading `Ihr Vertrauen`, highlight `fest verankert.`,
    lede from `homeSections.trust.subheading`) and the existing
    `<TrustBadges>` Vue island (3 stats, GSAP count-up baked in).
  - Added `.band` / `.band-inner` styles mirroring the rhythm used on
    `unser-versprechen.astro`.

### 2. PDF #3 + #4 — Bestseller in NavbarDrop
- `src/layouts/Layout.astro` — call `getHeroSlides(1)` and pass the first
  featured model's hero URL as `bestsellerHero` into `<Navbar>`. Adds one
  cheap DB query per page render.
- `src/layouts/Navbar/Navbar.vue` — accept and thread `bestsellerHero` to
  the desktop variant component.
- `src/layouts/Navbar/NavbarDesktopSolid.vue` and
  `src/layouts/Navbar/NavbarDesktopTransparent.vue` — accept and forward
  `bestsellerHero` to `<NavbarLinks>`.
- `src/layouts/Navbar/parts/NavbarLinks.vue` — accept and forward
  `bestsellerHero` to `<NavbarDrop>`.
- `src/layouts/Navbar/NavbarDrop.vue` — removed the `BESTSELLER_CATEGORY_ID`
  filter; Bestseller now renders in the left column. Added a
  `showcaseImage` computed that returns the bestseller fallback when the
  selected category is the virtual Bestseller, otherwise falls back to the
  category's own `isHero` media as before.

### 3. PDF #8 — `/vorschau-anspruch` preview route
- `src/pages/vorschau-anspruch.astro` (new) — identical to `index.astro`
  except the PageHero title becomes
  `Fertighäuser in Zimmermannsqualität für Menschen mit` with the
  italic-blue highlight `Anspruch.`. A thin `.preview-banner.full-width`
  sits above the hero with `Vorschau · Alternative Hero-Headline` and a
  link back to `/`. Page is not added to the navbar.

## Tokens / patterns used
- Spacing: `--spacing-1`, `--spacing-2`, `--spacing-3`, `--spacing-5`,
  `--spacing-6`; never raw px.
- Color: `--clr-surface-secondary`, `--clr-content-secondary`,
  `--clr-content-tertiary`, `--clr-accent-secondary`,
  `--clr-border-secondary`.
- Type: `--fs-body`, `--fs-body-sm`, `--tracking-eyebrow`,
  `--font-weight-medium`.
- Layout: `.full-width` for grid-escape, `--padding-inline`,
  `--content-max-width`, `--navbar-height`.
- Breakpoints: none added — everything reuses the existing
  `@custom-media` tokens via the components it composes.

## What to verify

- `/` — homepage:
  - `<ProofSection>` immediately followed by a full-bleed surface-secondary
    band; band heading `Ihr Vertrauen *fest verankert.*`, three stats
    (`100%` / `18` / `5`) with count-up on scroll-in.
  - Hover the desktop navbar `Häuser` link → dropdown panel:
    `Einfamilienhaus, Stadtvilla, Generationenhaus, Pultdachhaus,
    Doppelhaus, Kubus, Bungalow, **Bestseller**` (Bestseller appended
    last). Hovering Bestseller shows the first featured model's hero in
    the right showcase rather than rendering empty.
  - Bestseller link target: `/hauser?category=bestseller`.

- `/vorschau-anspruch`:
  - Thin grey preview banner at the very top with the link back to `/`.
  - Hero headline reads
    `Fertighäuser in Zimmermannsqualität für Menschen mit *Anspruch.*`
    with `Anspruch.` in italic-blue serif highlight.
  - Every other section identical to `/`.
  - Page does NOT appear in the navbar.

## Build
`bun run build` — clean. Pre-existing `useIntervalFn` and `@vueuse`
rollup-comment warnings are unrelated to this work.

## Out of scope (handled by parent)
PDF #1 is the same band as #2 (one was old, one is new); #5/#6/#10/#11
are Stadtvilla and Bungalow image swaps; #7 is the price hint removal
inside HouseModelCard; #9 is a category-thumbnail/image swap. No DB or
media writes were performed.
