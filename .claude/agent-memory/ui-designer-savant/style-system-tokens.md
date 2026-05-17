---
name: style-system-tokens
description: BoHolz src/style/ token inventory — colors, spacing, type scale, radii, control heights, fonts, breakpoints — so I don't re-read the system every session
metadata:
  type: project
---

`src/style/design-system.css` is the authority. Other style files: `reset.css`, `breakpoints.css`,
`fonts.css`, `wrapper.css`, `view-transitions.css`, `content-page.css`, `legal.css`, `form.css`.

## Colors
- Brand: `--boholz-blau`, `--boholz-grun`, `--boholz-blau-alt`, `--boholz-blau-alt-deep`, `--pastell-bg`, plus pastell-* and stone variants.
- Neutral gray: `--neutral-gray-100..900`, `--warm-gray-100..900`, `--cold-gray-100..900` (each is full range light→dark). **`--cold-gray-350`** (added 2026-05-17) sits between 300 and 400 specifically to give `--clr-content-tertiary` an AA-text-passing value — keep the cool-blue hue tilt consistent with the rest of the cold-gray ramp if extending.
- **Semantic surface:** `--clr-surface-primary` (off-white #FCFCFC), `--clr-surface-secondary`, `--clr-surface-tertiary`, `--clr-surface-quaternary` (pastell-bg).
- `--clr-pure-white` for true #fff over imagery; `--clr-pure-white-soft` 85% alpha.
- **Content (post-2026-05-17 contrast fix):**
  - `--clr-content-primary` = `--neutral-gray-100` (#1A1A1A) — body, headings; 14–17:1 on every surface.
  - `--clr-content-secondary` = `--cold-gray-300` (#4C5459) — captions/eyebrows; 6.45–7.46:1.
  - `--clr-content-tertiary` = `--cold-gray-350` (#5E666C) — de-emphasized text; 4.85–5.68:1, passes AA text everywhere.
  - `--clr-content-quaternary` = `--cold-gray-400` (#7E878C) — **UI-only tier** (3.08–3.57:1). Dividers, disabled affordances, decorative-only. Never body text.
  - Inactive/UI states may use tertiary or quaternary depending on whether the element conveys text or affordance.
- **Border:** `--clr-border-primary..quaternary`.
- **Accent:** `--clr-accent-primary` = `--boholz-blau-alt` (#0a78c2), `--clr-accent-secondary` deeper blue (#0F598A).
  - **ONE accent across the site** — confirmed Q4 of Phase 1.
  - **Project rule (confirmed):** **primary accent on larger elements**, **secondary accent on smaller elements**. Reason: primary's contrast against white is comfortable at large sizes but borderline at ≤13px text on saturated fills; secondary (deeper blue) holds up at small sizes (verified 7.46:1 contrast for white on accent-secondary).
- **Status:** `--clr-status-info/success/warning/error`.
- Overlays: `--clr-overlay`, `--clr-overlay-strong`.

## Spacing — fluid Fibonacci
`--spacing-unit: clamp(3px, 0.2vw + 2.14px, 5px)` (3px @ 320 → 5px @ 1440).
- `--spacing-0` (3→5) · `-1` (6→10) · `-2` (9→15) · `-3` (15→25) · `-4` (24→40, workhorse padding) · `-5` (39→65) · `-6` (63→105) · `-7` (102→170) · `-8` (165→275).
- Mobile (`--mobile`) overrides: `--spacing-5: 40`, `-6: 64`, `-7: 96`, `-8: 144`, `--padding-inline: 20`, `--navbar-height: 64`, `--control-height-md: 44`, `--control-height-lg: 52`.

## Control heights
`--control-height-sm` (7×unit) · `--control-height-md` (9×) · `--control-height-lg` (13×).

## Radii
`--radius-sm` (1×unit) · `-md` (2×) · `-lg` (3×) · `-xl` (5×) · `--radius-full: 9999px`.

## Type
- Fonts: `--font-din` (primary sans, 300/400/500/700/900), `--font-josefin`, `--font-instrument-serif` (secondary, italics-led).
- Aliases: `--font-primary` (DIN), `--font-secondary` (Instrument Serif).
- Scale: `--fs-base: 0.875rem`, `--fs-scale: 1.33333` (1.25 below-desktop, 1.2 mobile).
- `--fs-body: clamp(0.75rem, --fs-base + 0.35vw, 1.05rem)`. Derived `--fs-body-sm`, `--fs-body-lg`.
- Headings: `--fs-h1..h6` derived by `--fs-scale` powers from body.
- Sizes (`em` based): `--sz-xs..3xl`.
- Line heights: `--lh-tight: 1`, `--lh-heading: 1.1`, `--lh-body: 1.5`.
- Letter spacing: `--ls-heading: -0.05em`.
- **`--tracking-eyebrow: 0.12em`** — added 2026-05-17 for SectionNavigator + future Eyebrow component (codifies the inline value PageHero.astro already used).
- **Font-weight tokens (added 2026-05-17):** `--font-weight-light` (300), `--font-weight-regular` (400), `--font-weight-medium` (500), `--font-weight-bold` (700). DIN faces match these weights in `fonts.css`.
- Body defaults: `font: 300 var(--fs-body)/var(--lh-body) var(--font-primary)`.

## Layout
`--padding-inline: var(--spacing-5)` (20px on mobile), `--content-max-width: 1600px`, `--popout-max-width: 1800px`. `.wrapper` grid uses three columns: full-width / popout / content.
`--navbar-height: var(--spacing-6)` (64px mobile, 84px override).
`--navbar-logo: var(--sz-3xl)` (desktop, scales with type), `--navbar-logo-mobile: 40px` (fixed, added 2026-05-17 so the mark feels present at 360–430px without dominating the bar).

## Breakpoints (`@custom-media`, postcss-global-data)
- Ranges: `--mobile` (<500), `--tablet` (500–1024), `--desktop` (1024–1440), `--wide` (>=1440).
- From: `--from-tablet`, `--from-desktop`, `--from-wide`. Convenience: `--below-desktop`.
- **Always** use these tokens; never raw pixel values in `@media`.

## Notable absences (need to ask before adding)
- No motion duration / easing tokens (relies on `view-transitions.css` for view transitions only).
- No icon-size tokens (use Lucide `:size` prop directly).
- No shadow tokens at all — `style/` has no `--shadow-*`. If a component needs elevation, propose tokens before inlining.
- No `--lh-display` (1.0 line-height for ≥ 60px display type). Will propose when a typographic hero component actually needs it.

## Icon sizing & stroke-width convention (Phase 2 build, 2026-05-17)
- Inline list-item icons next to body text: 18px @ stroke-width 1.75 — softer reads next to type than the default 2.0.
- Inline eyebrow icons: 14px @ stroke-width 2.0.
- StatBlock anchor icon: 20px @ stroke-width 1.75.
- Callout tone icon: 18px @ stroke-width 2.0.
- VideoPlaceholder hero icon: 56–64px @ stroke-width 1.25 (large, low-emphasis idle state).
- Comparison check/X markers: 16px @ stroke-width 2.0.
- Accordion +/- indicator: 18px @ stroke-width 2.0.
- **Existing IconButton uses stroke-width 1.5** — predates this convention. Acceptable variant, do not retroactively change.

## Cross-island prop pattern (Astro → Vue) — IMPORTANT
Passing a Vue functional component (e.g. a Lucide icon) directly as a Vue prop from an `.astro` page **causes hydration mismatches**. The component reference doesn't survive the SSR → client serialization cleanly.

**Pattern:** Vue components that need icons accept them via **string name**, then resolve internally with `getIcon(name)` from `src/utils/icons.ts`. This works for Astro → Vue and Vue → Vue with no hydration warnings.

```ts
// In a Vue island that accepts an icon prop:
import { getIcon, type IconName } from '@/utils/icons';
const props = defineProps<{ icon?: IconName }>();
const IconComponent = computed(() => props.icon ? getIcon(props.icon) : null);
```

Used by: `StatBlock.vue`, `IconList.vue`, `StepCard.vue`. To add a new icon: extend the `IconName` union and `iconMap` in `src/utils/icons.ts`.

For `.astro` → Lucide direct (no Vue boundary), import the Lucide component directly — that works fine. The hydration issue is only at the Astro→Vue prop boundary.

## Other context
- Astro SSR + Vue islands; Vue is the only interactive framework.
- Component styles: `<style scoped>` in `.vue` / `.astro` OR Vanilla Extract `.css.ts` co-located.
- **No BEM.** Short semantic class names; the file is the namespace. Modifier classes are separate (`class="pill active"`, not `class="pill pill--active"`).
- Reka UI (`reka-ui`) for headless behaviour. Lucide via `lucide-vue-next`. Motion via `motion-v` (declarative). Animation otherwise GSAP + Lenis.
- TypeScript strict — no `any`. Entity types via `InferSelectModel`.
- German umlauts in identifiers/slugs: `ü→ue`, `ö→oe`, `ä→ae`, `ß→ss`.
- The navbar (`src/layouts/Navbar/Navbar.vue`) flips transparent → solid via `useScrolledPast(10)`. Components that coordinate with the navbar should use this composable or align their thresholds with it.
- The `data-hero` attribute on `<html>` is set by `Layout.astro` based on its `isHero` prop; `useIsHeroPage()` composable surfaces it reactively (survives Astro view transitions).
- Sandbox pages: `src/pages/sandbox/section-navigator.astro` and `src/pages/sandbox/components.astro` (Phase 2 aggregate kit). Both bypass `Layout.astro` to avoid DB calls.
