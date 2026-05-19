---
name: project-design-system
description: BoHolz design system token names, spacing scale, fonts, color palette, accent rules, and naming conventions
type: project
---

BoHolz tokens live in `src/style/design-system.css` and breakpoints in `src/style/breakpoints.css`.

**Spacing:** `--spacing-0` (3-5px) through `--spacing-8` (165-275px), fluid Fibonacci. `--spacing-4` is the workhorse (24-40px). Mobile overrides clamp the larger steps.

**Radii:** `--radius-sm/md/lg/xl/full`. Derived from spacing-unit.

**Colors:**

- Surface: `--clr-surface-primary` (off-white), `-secondary` (slightly grayer off-white), `-tertiary`, `-quaternary` (pastell-bg)
- Content: `-primary` (near-black), `-secondary`, `-tertiary`, `-quaternary` (UI only — never body text)
- Border: `-primary` (lightest) through `-quaternary` (darkest)
- Accent: `--clr-accent-primary` (boholz-blau-alt rgba(10,120,194,1)), `--clr-accent-secondary` (deeper)
- Photographic overlays: `--clr-pure-white`, `--clr-pure-white-soft` (rgba 255/255/255/0.85)
- Overlays: `--clr-overlay` (rgba 0/0/0/0.2), `--clr-overlay-strong` (rgba 0/0/0/0.5)

**Typography:**

- `--font-primary`: DIN (sans)
- `--font-secondary`: Instrument Serif italic — used ONLY as "highlight" span at end of headings (style with `font-style: italic`)
- Sizes: `--fs-h1` … `--fs-h6`, `--fs-body-sm/-body/-body-lg` (clamp-based, viewport-fluid)
- Headings: `font-weight: var(--font-weight-regular)` is the default Section/EyebrowHeadingLede pattern; PageHero uses `--font-weight-light` for the H1 only

**Wrapper grid:** `.wrapper` defines three column rails — `content` (default), `popout`, `full-width`. Children attach to `content` automatically. Section.astro uses `tone="secondary"` to escape to full-width for tinted edge-to-edge backgrounds, then re-pads internally.

**Eyebrow rhythm:** small-caps tracking is `--tracking-eyebrow` (0.12em); the eyebrow→heading gap is `var(--spacing-3)` (Section.astro convention) or `calc(var(--spacing-4) - var(--spacing-3))` (PageHero/CTASection). Either is acceptable.

**Highlight pattern:** italic serif accent appended to a heading. Example:

```html
<h2>Mehr Raum <span class="highlight">für Familien</span></h2>
```

With `.highlight { font-family: var(--font-secondary); font-style: italic; font-weight: var(--font-weight-regular); }`

**Breakpoints (postcss @custom-media):** `--mobile` (<500px), `--tablet` (500-1023), `--desktop` (1024-1439), `--wide` (>=1440), and the `--from-tablet` / `--from-desktop` / `--from-wide` / `--below-desktop` shortcuts. NEVER hardcode pixel queries.

**Naming:** short, semantic, file-scoped — `.head`, `.media`, `.copy`. NO BEM, no `--modifier` suffixes; state via `[data-state]` attributes or chained class selectors.
