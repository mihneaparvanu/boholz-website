# BoHolz Static-Pages IA & Section Navigator — Plan

**Date:** 2026-05-16
**Author:** ui-designer-savant (subagent)
**Scope:** Diagnose handed-off design comps, study Air NZ SkyNest + DanWood, propose a
site-wide on-page navigator and an information-density toolkit, restructure the static pages.

---

## 0. Preflight — what was read

- `CLAUDE.md` — full project conventions (Astro SSR + Vue islands, Vanilla CSS via `src/style/`
  global tokens *or* Vanilla Extract co-located; **no BEM**; `@custom-media` breakpoint tokens;
  Reka UI for headless behaviour; GSAP + Lenis already in repo; German umlaut → ASCII).
- `src/style/` — `reset.css`, `design-system.css`, `breakpoints.css`, `fonts.css`,
  `wrapper.css`, `view-transitions.css`, `content-page.css`, `legal.css`, `form.css`.
- `package.json` — confirmed **`motion-v` 2.2.1 is installed** (the brief's "Motion for Vue"),
  **`lucide-vue-next` 1.0.0 is installed**, `reka-ui` 2.9.7, `@vueuse/core` 14.3.0, GSAP, Lenis.
  **No silent dependency additions required.**
- Existing components — `Section.astro`, `Button.vue`, `PageHero.astro`, `FeatureGrid.astro`,
  `CTASection.astro`, `Card.vue`, `IconButton.vue`, navbar, footer, current static pages
  (`uber-uns`, `unser-versprechen`, `dein-zuhause`, `kontakt`, `vor-ort-beratung`, `karriere`).
- Original mocks — `old-design/` (not `/design/`); 3 desktop JPEGs only.
- References — Air NZ SkyNest + DanWood detail page, mobile (390) and desktop (1440).

### About the "11 Commandments"

The agent definition references "the 11 Commandments" as the taste rule set, but enumerates
exactly **11 numbered rules in the system prompt** (Accent is Sacred, Spacing is a Scale, Border
Radii Nest Correctly, Padding is Asymmetric, Type is a System, Shadows are Light/Layered/Earned,
Borders are 1px, Motion is Fast/Springy/Purposeful, Interactive States are Four, Empty States
Are Designed, Dark Mode is Not Inverted Light Mode). I'm applying those 11 — they are the
canonical list. If your team has a different "11 Commandments" doc, share it and I'll re-audit.

### Hard constraints applied throughout

- `src/style/` tokens are the only legal source of colour, spacing, radii, type. Two missing
  tokens are flagged at the end of §1.5 with proposed additions; none are silently invented.
- Mobile-first. Every component designed for 390 px first.
- No new dependencies. No Tailwind. No BEM. `@custom-media` breakpoints only.
- Lucide icons via named imports from `lucide-vue-next`.
- `motion-v` declarative only.

---

## 1.1 — Audit of the handed-off comps (`old-design/`)

Three desktop JPEGs were delivered: `Page 1 - Übersicht`, `Page 2 - Kampagne Mehrfamilien`,
`Page 3 - Kampagne Bungalow`. They are the same template recoloured per audience segment.
Copies live at `./screenshots/existing/`.

### Common verdict — all three: **Reworks needed**

The template is a competent but generic 2018-era prefab marketing layout. It will not embarrass
the brand, but it does not project "premium $1M+ German manufacturer." Critique below is
ordered by impact. Commandment numbers reference the canonical list in §0.

---

### Page 1 — Übersicht (`page-1-ubersicht.jpg`)

**Verdict:** Reworks needed. Mobile readiness: **desktop-only comp, no mobile artboard
delivered — critical gap.**

**Issues**

1. **Accent overuse (Commandment 1 violated).** The pastel sage/petrol palette is applied to:
   the active TOC chip, the four "Ihre Vorteile" cards (each in a different pastel), the brown
   centre band, the avatar pills, the testimonial strip, the footer CTA strip, the footer
   itself. Every section is on a different background. The eye has no anchor; nothing reads as
   *the* primary action. `src/style/design-system.css` defines a single
   `--clr-accent-primary` (`--boholz-blau-alt`) — the comp does not use it once.
2. **Shadows are not earned (Commandment 6).** Cards in "Ihre Vorteile" and "Für wen geeignet?"
   are flat with no elevation rationale — they look like sticker-pasted blocks. No `--shadow-*`
   token used because none of these would meet `style/` conventions.
3. **Border-radius drift (Commandment 3).** Card radius ≈ 12 px; image radius ≈ 14 px; button
   radius ≈ 6 px; testimonial cards ≈ 16 px. `style/` only defines `--radius-sm/md/lg/xl/full`
   (5/10/15/25 px at desktop midpoint). Multiple radii present do not nest with their parents.
4. **Type lacks a system (Commandment 5).** Section headings, lede, body, eyebrow, stat
   captions all sit in a narrow range around 22 / 16 / 14 px — there is no display tier doing
   the heavy lifting the brief explicitly asks of typography. The brand has a beautiful serif
   `Instrument Serif` defined in `style/fonts.css` and the comp never uses it.
5. **One TOC pill — chrome, no payload.** The "Häuser / Ihr neues Zuhause / Bauen mit
   BoHolz-Haus / Musterhäuser / News / Über uns" strip sits in the nav, not at the start of the
   page. It does not jump-link. It is not the on-page wayfinder we need.
6. **Faux-photoreal hero with overlapping text.** The hero family-and-house lifestyle photo with
   text laid on top is the visual cliché of the category. DanWood and Baufritz use this exact
   shot. There is no differentiator.
7. **Footer testimonials.** Three star-rated quote cards crammed beside an emerald CTA band.
   This is real-estate-listing aesthetic, not premium-manufacturer.

**What is salvageable**
- The page contains the right *content beats* (value props, house typologies, audience fit,
  KfW/quality story, FAQ, contact). The IA is broadly correct.
- The "Für wen geeignet?" list (Familien / Senioren / Mehrgenerationen / Investoren) — icon-led
  rows — is the closest thing to my proposed Information Density toolkit and can be lifted
  with much better typography.
- The "16 gute Gründe" numerical hook is strong.

**The "premium gap"**
The comp is *cluttered*. Nothing breathes. Premium reads as confidence and restraint —
generous whitespace, one accent doing one job, monochrome neutrals carrying the visual weight
and serif italics earning attention through scarcity. The comp does the opposite: every
section is given its own colour to signify "we tried."

**Mobile readiness:** **Not delivered.** The grid will collapse to long unbroken blocks. The
TOC strip will not fit and there is no fallback. This is the headline reason we are rebuilding.

---

### Page 2 — Kampagne Mehrfamilien (`page-2-mehrfamilien.jpg`)

**Verdict:** Reworks needed. Mobile readiness: not delivered.

**Issues** — inherits all the structural problems of Page 1. Additional:

- The pastel-pink "Bereit für Ihr Traumhaus?" footer band is the third footer-band style in
  the set and the third pastel; no chance of a unified palette across the site.
- Three featured houses are shown as flat cards with KfW / area / room badges in tan blocks,
  again radius- and shadow-inconsistent with each other.
- The campaign-page distinction (audience targeting: families/multi-generation) is not done
  through copy or layout shifts — only through which photos and headline appear. The page does
  not feel campaign-specific; it feels recoloured.

**Salvageable:** the lifestyle photo (couple in front of multi-unit building) is genuinely
strong and on-brand.

---

### Page 3 — Kampagne Bungalow (`page-3-bungalow.jpg`)

**Verdict:** Reworks needed. Mobile readiness: not delivered.

**Issues** — same structural problems plus:

- Hero is now light teal; "Mehr Komfort" band is pastel sage; "Bereit für Ihr Traumhaus?"
  band is a near-black green. Four background colours in one page reinforce the lack of
  hierarchy.
- The "Ein Zuhause, das sich Ihnen anpasst" three-card row uses tablet-screen and bedroom
  interior shots that look like stock — they pull more than they pay.

**Salvageable:** the senior-couple-by-the-pool photo is the best lifestyle frame in the set
and can be reused for the accessibility/lifecycle narrative.

---

### Aggregate verdict
**Two reworks of the IA, one rewrite of the visual language.** Do not extend this template.
The content beats are usable; the layout, palette, typography, and component library are not.

---

## 1.2 — Reference site teardown

### Air NZ SkyNest — primary reference

**Live URL:** `https://www.airnewzealand.com/economy-skynest`
**Screenshots:** `./screenshots/references/airnz/`
  (`airnz-mobile-fold.png`, `airnz-mobile-toc.png`, `airnz-mobile-full.png`,
   `airnz-desktop-fold.png`, `airnz-desktop-full.png`)

#### The TOC component (`.cms-in-page-nav` / `.pw-InPageNav`)

The most important finding: **it is not a sticky sidebar. It is a static "On this page" block
that sits between the hero and the first content section.** This makes it cheap, accessible by
default, and surprisingly elegant. Anatomy (mobile 390 px, computed values):

| Part        | Value                                                                |
| ----------- | -------------------------------------------------------------------- |
| Container   | block, no bg, no border, full content width                          |
| Prefix      | `<p class="...prefix">On this page</p>` — 17 px, weight 700, black, mb 6 px |
| Layout      | flex column on mobile, **flex row with 2 sub-sections on desktop** (~420 px each) |
| Item        | `<a>` 17 px / weight 400, color `#008392` (teal accent), 25.5 px line-height |
| Icon        | inline 16 px down-arrow SVG, left of label, 24 px padding-left used as gutter |
| Item state  | **No active highlighting.** No scroll-spy. Native `:target` + `scroll-behavior: smooth`. |
| Item count  | 6 items, grouped into 2 visual sections of 3                          |

It does not animate. It does not stick. It is honest about being a wayfinder. The
sophistication is in: (a) the consistent leading icon establishing rhythm, (b) the visual
column split on desktop, (c) the "On this page" label treated as content rather than chrome.

#### Section structure & rhythm

The page breaks into **8 major content blocks**: hero → on-this-page → what is Skynest →
how Skynest works (with 4 H3 sub-blocks) → rest in your nest → nesting guide → explore the
nest (with 7 amenity H3s) → access requirements → travelling with children.

- `padding-block: 48px / 48px` on the heavy content blocks, `24/24` on intermediate, `0/40`
  on first-after-hero. Two-tier vertical rhythm.
- No alternating background colours — surfaces are `#fff` and occasional `transparent`.
  Rhythm is achieved purely through padding and section headings.
- **Longest unbroken text block is ~110 words.** Sections are aggressively chunked.
- Every section that introduces a new idea opens with H2 (24 px / weight 700, line-height
  28.8 — a tight 1.2 ratio).

#### Type system mapping vs `src/style/`

| Air NZ                              | px      | BoHolz `style/`                       |
| ----------------------------------- | ------- | ------------------------------------- |
| H1 hero                             | 41/61.5 | `--fs-h1` (≈ 50 px at mobile midpoint — close) |
| H2 section heading                  | 24/28.8 | `--fs-h3` (≈ 24 px at 500 px viewport — exact match) |
| H3 sub-block                        | 20/24   | `--fs-h5` (≈ 19 px at 500 px viewport — close) |
| Body                                | 17/25.5 | `--fs-body` (clamps 16→17 px — match) |
| TOC item                            | 17/25.5 | `--fs-body`                            |
| TOC prefix "On this page"           | 17/700  | `--fs-body` at weight 700              |

**Gap:** Air NZ uses one font (their custom sans) — they get away with weight contrast (400
vs 700) instead of family contrast. We have *better* leverage: DIN sans + Instrument Serif
italic for accent. Use it.

#### Spacing

- Page-block padding: 24 / 48 / 80 px on mobile, larger on desktop.
- Tokens hit cleanly: `--spacing-3` (≈ 25 px) for intra-section gaps, `--spacing-5` (≈ 65 px at
  desktop) for section padding, `--spacing-6` (≈ 105 px at desktop) for hero-to-content gap.
  No new tokens required.

#### Colour restraint

- White surface + black text + one teal accent (`#008392`) for links/CTAs. Nothing else.
- The accent appears in: TOC items, primary CTAs, inline links, the "More" affordance in the
  sub-nav. Maybe 8–10 visible uses on the full mobile page. Restraint is the look.

#### Imagery strategy

- A handful of high-production interior renders (5 photographs total) and one schematic
  diagram. **Roughly 60% of vertical real estate is type-only, 40% is media.** This is the
  insight you flagged: type can carry premium when used at scale.

#### Motion

- Almost none. The page loads with no scroll reveals. Smooth-scroll on anchor jump is the
  only animation. Premium = restraint.

#### The "premium signal" in one paragraph

Air NZ projects premium by *refusing the visual tropes of a category in transition*. Most
airlines use motion to feel modern. Air NZ uses **white space and confident typography**.
There is one accent colour, doing one job. Lifestyle photography is high-craft and sparing —
each shot is paid for by the empty space around it. The TOC is the only "feature
component" on the page and it is the simplest thing in the world: a heading, six links, two
columns at desktop. The page does not perform — it just *tells you what you came to find*.
This is what we are stealing.

---

### DanWood — secondary reference (product/service)

**Live URL:** `https://www.dan-wood.eu/house-designs/bungalows/perfect-101`
**Screenshots:** `./screenshots/references/danwood/`

#### What's transferable

1. **Horizontal pill TOC pattern.** `Projects · Information · Plans · Interiors · Range` —
   a segmented-button bar that sticks under the navbar on scroll. Dark theme: `#38383d` base
   pill, `#6f6f77` active pill (a *lighter* gray for active — counterintuitive but it works
   against the dark base), 16 px / weight 500 labels, 50 px height. **This is the mobile
   pattern I'm proposing as Variant 2 below.** Horizontal scroll with a right chevron
   indicator when items overflow.
2. **Stat-card mini-grid.** 2 × 2 grid of stat cards under the hero — Area / Storeys /
   Bedrooms / Bathrooms — each with a Lucide-style icon, a label, a value. This is a *direct*
   answer to the "limited media" problem: numbers + icons replace photos.
3. **Accordion content sections.** Below the stat grid, the long-form content (Details,
   Description, Scope of work, Room list) is collapsed by default in accordions. The whole
   page reads as ~5 screens of content before you expand anything.
4. **Section alternation.** `bg: #ffffff` ↔ `bg: #f4f4f4` blocks, all with the same 40 / 40
   padding-block. Maintains rhythm without colour.

#### What is specific to DanWood and we should NOT copy
- Dark TOC in a light-theme page reads as a leftover dark mode rather than a decision.
- Their breadcrumb-on-product-page is too small (12 px) and looks like an oversight.
- Their photography is *very* clean Scandinavian — we have a different audience (German
  Mittelstand) and the cosier Bavarian / Rhön visual the BoHolz brand actually has should
  drive our photo direction.

#### Type system (DanWood)

`Geist` 16 px body, weight 500 with **letter-spacing −1.1 px** on the biggest headings
(`Interior Designs` H3 at 22 px). The aggressive negative tracking on display type is a
shared signal of premium across DanWood, Linear, Vercel. **Our `--ls-heading: -0.05em` token
already does this; we just need to lean on it harder.**

---

## 1.3 — Section Navigator (TOC) design proposals

All three variants assume the same TS API and accessibility behaviour. Differences are
visual/behavioural. I have a strong preference (Variant 2), explained at the end.

### Shared contract

```ts
// One section descriptor.
type SectionLink = {
  id: string;          // anchor id, German-umlaut-normalised slug
  label: string;       // visible label (German)
  icon?: keyof typeof LucideIcons; // optional override; default = ArrowDown
};

// Props for <SectionNavigator>
type Props = {
  sections: SectionLink[];
  variant?: 'sidebar' | 'pill-row' | 'inline-grid'; // see below
  showProgress?: boolean;  // default true on sidebar, false elsewhere
};
```

Active-section detection: `IntersectionObserver` (or `@vueuse/core` `useIntersectionObserver`)
inside a `useActiveSection` composable. Keyboard: each link is a native `<a href="#id">`;
focus follows page anchor; `aria-current="location"` set on the active link. Reduced motion:
honoured via `useReducedMotion()` from `motion-v` and the global `prefers-reduced-motion`
rule already in `reset.css`.

---

### Variant 1 — **"AirNZ-faithful inline block"**

**Description.** A static, non-sticky block placed between hero and first content section.
Mirrors Air NZ exactly but in our type/colour system.

**Desktop sketch (≥ 1024 px)**
```
┌────────────────────────────────────────────────────────────────┐
│  AUF DIESER SEITE                                              │
│  ────────────────────────────────────────────────────────────  │
│  ↓  Unser Versprechen        ↓  Nachhaltigkeit                 │
│  ↓  16 gute Gründe           ↓  Wandaufbau                     │
│  ↓  Qualität & Zertifikate   ↓  Haus- & Energietechnik         │
└────────────────────────────────────────────────────────────────┘
```
Two-column flex layout, ~50/50 split, items stacked vertically per column.

**Mobile sketch (390 px)**
```
┌──────────────────────────────────────┐
│  AUF DIESER SEITE                    │
│  ──────────────────────────────────  │
│  ↓  Unser Versprechen                │
│  ↓  16 gute Gründe                   │
│  ↓  Qualität & Zertifikate           │
│  ↓  Nachhaltigkeit                   │
│  ↓  Wandaufbau                       │
│  ↓  Haus- & Energietechnik           │
└──────────────────────────────────────┘
```
Single column, full width inside `.wrapper` content column.

**Motion behaviour.** None. Native smooth-scroll on click. Hover: link colour fades from
`--clr-content-primary` to `--clr-accent-primary` over `160 ms ease`.

**Inspiration source.** Air NZ SkyNest (direct).

**Tokens used from `style/`**
`--fs-body`, `--clr-content-primary`, `--clr-accent-primary`, `--clr-border-secondary` (for
the top/bottom rule), `--spacing-2`, `--spacing-3`, `--spacing-4`, `--spacing-5`.

**Lucide icons used** — `ArrowDown` (one icon, leading every item; 14 px / size sm).

**Pros**
- Cheapest to build. Zero scroll-state. Zero scroll-spy bugs. Most accessible by default.
- Cannot collide with the sticky navbar.
- Pixel-faithful to the reference you specifically called out.

**Cons**
- Once the user scrolls past it, it is gone. They cannot re-jump without scrolling back to
  the top.
- No active-section feedback — the user does not know "where am I" mid-page.
- Asks the type-and-spacing to do all the work. If we do it well, great. If we cut a corner,
  it looks bland.

**When to pick this.** When the static pages are short (≤ 5 sections) and the audience is
patient. Lowest-risk option.

---

### Variant 2 — **"Sticky pill rail (DanWood-inspired) with inline overview"** ← my recommendation

**Description.** Two coordinated parts:
1. **Inline overview block** at the top of the page (Variant 1's exact static layout) so the
   page has a clear "table of contents" moment before content starts.
2. **A sticky horizontal pill rail** that appears under the navbar after the user scrolls
   past the hero, providing always-on jump access *and* active-section feedback.

This is the "AirNZ + DanWood" hybrid. The inline block gives the calm "here is your map"
moment; the pill rail gives continuous wayfinding without a sidebar (which would compete
with the centred content max-width of 1600 px the wrapper already enforces).

**Desktop sketch (≥ 1024 px)**

Top of page (after hero):
```
┌────────────────────────────────────────────────────────────────┐
│  AUF DIESER SEITE                                              │
│  ↓  Unser Versprechen        ↓  Nachhaltigkeit                 │
│  ↓  16 gute Gründe           ↓  Wandaufbau                     │
│  ↓  Qualität & Zertifikate   ↓  Haus- & Energietechnik         │
└────────────────────────────────────────────────────────────────┘
```

Mid-scroll (sticky, slides down from under navbar):
```
┌──────────────────────────────────────────────────────────────────┐
│  Versprechen · 16 Gründe · ‹Qualität› · Nachhaltigkeit · Wand…  → │   ← progress strip below
│ ════════════ 60% ────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────┘
```
- Pills are text-only (no icons in the rail; the inline block carries the icons).
- Active pill: `background: var(--clr-surface-secondary)`, text in
  `--clr-content-primary`. Inactive: `transparent`, text in `--clr-content-tertiary`.
- 2 px hairline `--clr-border-primary` under the rail; the progress bar is a
  `transform: scaleX()` line in `--clr-accent-primary`, animated by `motion-v`.

**Mobile sketch (390 px)**

Top of page (inline overview) — identical to Variant 1's mobile sketch.

Sticky rail when scrolled:
```
┌────────────────────────────────────────────┐
│ ‹Qualität› · Nachhaltigk… · Wandaufb… ▸    │   ← horizontally scrollable
│ ════════ 45% ───────────────────────────── │
└────────────────────────────────────────────┘
```
- Horizontal scroll with `scroll-snap-type: x mandatory`.
- When the user clicks a pill, the rail auto-scrolls the active pill into view
  (`scrollIntoView({ inline: 'center', behavior: 'smooth' })`).
- A subtle right-edge fade mask (`mask-image: linear-gradient(...)`) signals overflow.

**Motion behaviour**
- Sticky rail: enters from `y: -100%` to `y: 0` when the inline block leaves the viewport.
  Spring `stiffness: 350, damping: 30` via `motion-v`.
- Progress bar: `motion-v` animates `scaleX` driven by a reactive computed
  (scrollY / max — exposed by `useScroll` from `@vueuse/core`, no GSAP needed).
- Active-pill change: 160 ms colour transition + a 240 ms underline-grow (`motion-v` shared
  layout if practical, otherwise `scaleX`).
- All motion respects `useReducedMotion()` → instant transitions, no spring, no slide-in.

**Inspiration source.** DanWood pill TOC (mobile pattern), Air NZ inline block (top-of-page
moment), Linear/Vercel docs (progress strip).

**Tokens used from `style/`**
`--fs-body`, `--fs-body-sm`, `--clr-surface-primary`, `--clr-surface-secondary`,
`--clr-content-primary`, `--clr-content-tertiary`, `--clr-accent-primary`,
`--clr-border-primary`, `--clr-border-secondary`, `--spacing-1`, `--spacing-2`,
`--spacing-3`, `--radius-sm`, `--radius-full`, `--navbar-height`, `--control-height-sm`.

**Lucide icons used** — `ArrowDown` (inline overview only), `ChevronRight` (overflow
indicator on mobile rail), nothing in the pills themselves.

**Pros**
- Two patterns in one: calm top-of-page moment + persistent wayfinder.
- Active state + progress bar give the "I know where I am" feedback Variant 1 lacks.
- The sticky rail solves the "user scrolls past the TOC and is stranded" problem.
- The horizontal scroll on mobile is the right shape for a phone — vertical real estate is
  scarce.
- Both parts use the same `<SectionNavigator>` component and the same data, so authors only
  declare sections once.

**Cons**
- More moving parts → more to get right (sticky offset, scroll-spy debounce, scroll-into-view
  on the rail).
- The progress bar is a "you might not need it" — I default it ON but it can be a prop.
- Two visual treatments of the same data is a discipline tax — the rail must not steal
  attention.

**When to pick this.** This is the right pick if you want the site to feel like a current
top-tier product page (Linear docs, Vercel docs, modern Apple support pages). It is the
*signature* version of the brief.

---

### Variant 3 — **"Sidebar with numbered sections" (desktop) + collapsible overview (mobile)**

**Description.** A traditional left-aligned sticky sidebar on desktop, ~220 px wide, with
numbered (01, 02, 03…) section labels. On mobile, the sidebar collapses to a "summary +
disclosure" block at the top: tap "Auf dieser Seite (6)" → list expands.

**Desktop sketch (≥ 1024 px)**
```
┌──────────────────┬──────────────────────────────────────────────┐
│                  │                                              │
│  01  Versprechen │   [SECTION 1 CONTENT]                        │
│  02  16 Gründe   │                                              │
│ ▸03  Qualität    │   [SECTION 2 CONTENT]                        │
│  04  Nachhaltig… │                                              │
│  05  Wandaufbau  │                                              │
│  06  Technik     │                                              │
│                  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```
Sticky `top: calc(var(--navbar-height) + var(--spacing-4))`. Active row: number colour
flips to `--clr-accent-primary` and the row gets a `border-inline-start: 2px solid`.

**Mobile sketch (390 px)**
```
┌──────────────────────────────────────┐
│  Auf dieser Seite (6)            ▾   │   ← disclosure summary
└──────────────────────────────────────┘
```
Tap → reveals Variant 1's mobile list inline.

**Motion behaviour**
- Sidebar number transitions (active state): 200 ms colour + 240 ms `motion-v` width on the
  border-inline-start (0 → 2 px).
- Mobile disclosure: `motion-v` animate `height: auto` with a layout transition; 280 ms.

**Inspiration source.** Stripe docs, Tailwind docs, MDN article sidebars.

**Tokens used from `style/`**
Same set as Variant 2, plus `--font-secondary` (Instrument Serif italic) for the numbers if
we want them to be the "premium fingerprint" detail.

**Lucide icons used** — `ChevronDown` on the mobile disclosure trigger.

**Pros**
- Highest information density on desktop — six sections always visible.
- Number-on-the-left is a typographic move that reads very editorial when done well.
- Desktop sidebar is a well-worn paradigm; users know what to do with it.

**Cons**
- Eats horizontal real estate on a brand site where photography needs room to breathe.
- Mobile disclosure adds a tap before the user sees the map of the page. One extra
  interaction. Variants 1 and 2 don't ask for it.
- Fights the `.wrapper` grid system (1600 px max-width centred) — we'd have to either negate
  it or accept a much narrower content column.

**When to pick this.** When pages are content-dense docs and the user is researching, not
browsing. Not the right fit for a marketing-led brand site, IMO.

---

### Recommendation

**Variant 2.** It steals the best of both references. The inline block gives the calm
"AirNZ moment," the sticky pill rail gives DanWood's always-on wayfinding without going dark,
and the type/colour system in `src/style/` is well-suited to it (one accent doing one job in
the progress bar, weight contrast in the rail, the existing `--navbar-height` token cleanly
positions the sticky offset). The brief asks for "Linear- or Vercel-grade." Variant 2 is
that.

---

## 1.4 — Information density toolkit

Catalogue of patterns to break text-heavy mobile content. Each pattern is *only* tokens from
`src/style/` and Lucide icons. Patterns are independently composable.

### 1. Eyebrow + Heading + Lede

- **What it does.** Opens a major section with the same three-line rhythm every time —
  smallcaps label → display heading → introductory paragraph.
- **When to use.** Top of every major section. The visual anchor.
- **Recipe.**
  `eyebrow`: `font-size: var(--fs-body-sm); text-transform: uppercase; letter-spacing: 0.12em; color: var(--clr-content-tertiary);`
  `heading`: H2 (uses global `var(--fs-h2)`), weight 500, `letter-spacing: var(--ls-heading)`.
  `lede`: `font-size: var(--fs-body-lg); color: var(--clr-content-secondary); max-width: 56rem;`
- **Icon usage.** Optional 16 px Lucide icon leading the eyebrow (matches the section's
  topic, e.g. `Leaf` for Nachhaltigkeit, `Shield` for Qualität).
- **Visual sketch.**
  ```
  [Leaf]  NACHHALTIGKEIT
  Holz speichert CO₂. Wir bauen mit Verantwortung.
  Bei BoHolz Haus verbinden wir Ihre Wohnträume mit
  aktivem Umweltschutz…
  ```
- **Mobile behaviour.** Stacks naturally. Lede line-length naturally constrained to the
  `.wrapper` content column.

### 2. Section Navigator (the TOC)

Described in §1.3 — listed here as a first-class pattern because pages may invoke it.

### 3. Stat blocks (oversized number, tiny caption)

- **What it does.** Replaces an image with a number doing the heavy lifting.
- **When to use.** Anywhere a claim has a number behind it (`30 Tonnen CO₂`, `16 gute
  Gründe`, `KfW 40`, `90 Jahre Erfahrung`, `2.350 EUR/m²`).
- **Recipe.**
  `value`: `font-size: var(--fs-h2); font-weight: 300; font-family: var(--font-primary); letter-spacing: var(--ls-heading); line-height: 1;`
  `unit`: `font-size: var(--fs-h5); color: var(--clr-content-secondary);` — inline after value
  `label`: `font-size: var(--fs-body-sm); text-transform: uppercase; letter-spacing: 0.08em; color: var(--clr-content-tertiary);` — beneath
- **Icon usage.** Optional 16 px Lucide icon left of the label (`TreeDeciduous`, `Award`,
  `Leaf`, `Clock`).
- **Visual sketch.**
  ```
  30                                  16
  TONNEN                              GUTE
  CO₂ je Haus                         GRÜNDE
  ```
- **Mobile.** Stacks 1 col by default, 2 col from `--from-tablet`, 4 col from `--from-desktop`.

### 4. Icon-prefixed list items

- **What it does.** Replaces bullet markers with topical Lucide icons; gives a list visual
  weight without using a card.
- **When to use.** "Was wir tun" lists, audience-fit lists (Familien / Senioren /
  Investoren), Ausbaustufen sub-points.
- **Recipe.**
  `display: grid; grid-template-columns: auto 1fr; column-gap: var(--spacing-3); row-gap: var(--spacing-2);`
  Icon column: 18 px Lucide icon, `color: var(--clr-content-tertiary);`
  Text column: body, with optional `strong` for the label.
- **Icon usage.** `Users` (Familien), `HeartHandshake` (Senioren), `Home` (Eigenheim),
  `Building2` (Mehrgenerationen), `TrendingUp` (Investoren), `Shield`, `Leaf`, `Wrench`,
  `Hammer`, `KeySquare`.
- **Visual sketch.**
  ```
  [Users]   Familien        Platz für Kinder, Gemeinschaft & Geborgenheit
  [Heart]   Senioren        Komfortabel & barrierefrei — fürs Leben geplant
  [Build]   Mehrgener…      Gemeinsam wohnen, getrennt leben — perfekt vereint
  ```

### 5. Two-column comparison (Without / With)

- **What it does.** Lays a contrast side-by-side. Each column is `Card`-style; one is
  greyed-out (`--clr-surface-secondary`), one is accent-trimmed.
- **When to use.** Standard vs. Premium build, KfW 55 vs KfW 40, conventional vs. Smart Home.
- **Recipe.**
  Two cards in a `grid-template-columns: 1fr` (mobile) → `repeat(2, 1fr)` from
  `--from-tablet`. The "with" card gets `border-color: var(--clr-accent-primary);` and a
  small `aria-hidden` Lucide `Check` icon in the top-right corner.
- **Icon usage.** `X` muted on the "without" card; `Check` accent on the "with" card.

### 6. Pull quote with attribution

- **What it does.** Lets the brand's tone of voice break the rhythm. A single sentence in
  Instrument Serif italic.
- **When to use.** Once or twice per page, between two heavy text sections. Use BoHolz copy
  *or* a real customer testimonial when we have one.
- **Recipe.**
  `font-family: var(--font-secondary); font-style: italic; font-size: var(--fs-h4); line-height: 1.3; color: var(--clr-content-primary); max-width: 36rem;`
  Attribution: body-sm, content-tertiary, weight 400.
- **Icon usage.** Optional `Quote` icon, 24 px, content-tertiary, top-left.

### 7. Numbered step cards (vertical mobile, horizontal desktop)

- **What it does.** The Ablauf / Phase narrative becomes a navigable rail of large numbered
  cards.
- **When to use.** `dein-zuhause.astro` Phase 1/2/3, the Ausbaustufen 1–4.
- **Recipe.**
  Card: `border: 1px solid var(--clr-border-secondary); border-radius: var(--radius-lg); padding: var(--spacing-3); background: var(--clr-surface-primary);`
  Number: `font-family: var(--font-secondary); font-style: italic; font-size: var(--fs-h2); color: var(--clr-content-tertiary);`
  Title: H4 / weight 500.
  Body: `--fs-body`, secondary content colour.
- **Icon usage.** Optional Lucide icon in the card header (`Compass`, `Hammer`, `KeySquare`).
- **Layout.** `grid-template-columns: 1fr` mobile → `repeat(3, 1fr)` desktop with
  `gap: var(--spacing-3)`.

### 8. Accordion FAQ (Reka UI)

- **What it does.** Collapses long-form content (Häufige Fragen, Ausbaustufen detail). Uses
  the existing `AccordionItem.vue` in `features/HousePage/components/` as a starting point or
  the Reka headless primitive directly.
- **When to use.** Anywhere a long list of paragraphs is repeating the same shape — questions
  & answers, scope descriptions, finance-product descriptions.
- **Recipe.**
  Trigger row: `padding: var(--spacing-3) 0; border-bottom: 1px solid var(--clr-border-secondary);`
  Body: `padding-block-end: var(--spacing-3); color: var(--clr-content-secondary);`
- **Icon usage.** `Plus` rotating to `Minus` (or `ChevronDown` rotating 180°). Always
  16–18 px, content-tertiary.

### 9. Definition list (term + description)

- **What it does.** Pairs short label with a longer explanation in two columns on desktop,
  stacks on mobile. Replaces what would otherwise be a wall-of-paragraphs.
- **When to use.** Ausbaustufen names + descriptions, KfW product names + summaries,
  Wandaufbau material specs.
- **Recipe.**
  Native `<dl>`. Mobile: `<dt>` on its own line, weight 500;  `<dd>` indented `--spacing-3`
  with `color: var(--clr-content-secondary);`.
  From `--from-tablet`: `display: grid; grid-template-columns: minmax(8rem, 14rem) 1fr; column-gap: var(--spacing-4);` with `border-block-end: 1px solid var(--clr-border-secondary)` between rows.

### 10. Inline badges / tags

- **What it does.** Compact metadata (KfW 40, Made in Germany, QNG-Plus, EFH/MFH).
- **When to use.** Below a heading where the metadata matters; never inside body text.
- **Recipe.**
  `display: inline-flex; align-items: center; gap: var(--spacing-1); padding: 0 var(--spacing-2); height: var(--control-height-sm); border: 1px solid var(--clr-border-secondary); border-radius: var(--radius-full); font-size: var(--fs-body-sm); color: var(--clr-content-secondary);`
- **Icon usage.** Optional 12–14 px Lucide leading the label (`Award`, `Leaf`, `Shield`).

### 11. Section divider with index ("01 — Section Name ———————")

- **What it does.** Replaces a generic `<hr>` with a thin typographic divider that introduces
  the next section by number + label, then a rule out to the edge.
- **When to use.** Between top-level sections on long pages. Optional — the
  EyebrowHeadingLede already does most of the work; this is when you want a stronger break.
- **Recipe.**
  `display: grid; grid-template-columns: auto auto 1fr; align-items: center; gap: var(--spacing-2); color: var(--clr-content-tertiary);`
  Number: Instrument Serif italic, `--fs-h6`.
  Label: body, weight 500.
  Line: `border-top: 1px solid var(--clr-border-secondary); align-self: center;`

### 12. Alternating section backgrounds for rhythm

- **What it does.** Surface alternates `--clr-surface-primary` ↔ `--clr-surface-secondary`
  every other section to break the visual rhythm without using colour.
- **When to use.** Long pages (`unser-versprechen.astro`, `dein-zuhause.astro`). Use
  *sparingly* — not every other section; every 2nd or 3rd. Otherwise it stripes.
- **Recipe.**
  Astro `Section.astro` gets a `tone?: 'primary' | 'secondary'` prop. Section becomes a
  `.full-width` grid child to break the wrapper centring, with `padding-inline:
  var(--padding-inline)` internally to recreate the gutter.

### 13. Sidebar callouts (Note / Pro tip / Important)

- **What it does.** Inline lozenge that warns / informs / advises.
- **When to use.** Finance disclaimer ("Rechtsanspruch besteht nicht"), build-stage warnings,
  reminders.
- **Recipe.**
  `display: flex; gap: var(--spacing-2); padding: var(--spacing-2) var(--spacing-3); border-inline-start: 2px solid var(--clr-status-info); background: color-mix(in srgb, var(--clr-status-info) 4%, var(--clr-surface-primary));`
  Title (optional): weight 500. Body: `--fs-body-sm`, content-secondary.
- **Icon usage.** `Info` (info), `Lightbulb` (pro tip), `AlertTriangle` (important),
  `CircleAlert` (warning). Always 18 px, colour matches the border colour.

### 14. Aspect-ratio video placeholders

- **What it does.** Reserves a video slot with an intentional empty state — gradient bg,
  subtle Lucide icon, an animated breathing pulse, `data-video-slot="<slot-name>"` for later
  hook-in.
- **When to use.** Hero of campaign pages, between major sections on `unser-versprechen.astro`
  ("watch the factory"), product showcase pages.
- **Recipe.**
  Container: `aspect-ratio: 16/9; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--clr-surface-secondary), var(--clr-surface-tertiary)); display: grid; place-items: center; isolation: isolate; overflow: hidden;`
  Icon (Lucide `Video` or `PlayCircle`): 48 px on mobile, 64 px desktop, colour
  `--clr-content-tertiary`, with a `motion-v` opacity pulse 0.6 ↔ 0.9 over 2.4 s ease-in-out
  infinite (respect `prefers-reduced-motion`).
  Optional caption beneath: "Bald verfügbar — Werksrundgang" in eyebrow style.
- **Icon usage.** `Video`, `PlayCircle`, or `Film` (component-prop-selected).
- **Marker.** `data-video-slot="hero-versprechen"` so you can grep your codebase later.

### 15. Typographic hero blocks

- **What it does.** A hero with no photograph — just a very large heading, optional eyebrow,
  optional lede. The brief explicitly calls out type as the secondary imagery.
- **When to use.** Campaign pages where the photography we have is generic (avoid the
  3-stock-photos-stacked look) and the brand statement is the visual.
- **Recipe.**
  `min-height: clamp(280px, 50vh, 560px);`
  H1: `font-size: clamp(2.5rem, 8vw, 5.5rem); font-weight: 300; line-height: 1; letter-spacing: var(--ls-heading);`
  with a key noun in `<span class="highlight">` using `font-family: var(--font-secondary); font-style: italic; font-weight: 400;` (the `.highlight` pattern is already used by `PageHero.astro` and `Section.astro`).
- **Icon usage.** None.

### 16. Initial drop-cap

- **What it does.** First letter of an editorial paragraph dropped 3 lines, in Instrument
  Serif. Used once per page max.
- **When to use.** Opening of `uber-uns.astro` and other editorial moments.
- **Recipe.**
  `p.lead::first-letter { font-family: var(--font-secondary); font-size: 4.5em; line-height: 1; float: inline-start; padding-inline-end: var(--spacing-2); padding-block-start: 0.05em; color: var(--clr-content-primary); }`

### 17. Quote-led paragraph

- **What it does.** Single italic Instrument-Serif sentence opens a paragraph, then drops into
  body. A subtler cousin of the pull quote.
- **When to use.** Manifesto-ish opening paragraphs on `uber-uns.astro`,
  `unser-versprechen.astro`.
- **Recipe.**
  First sentence wrapped in `<i class="open">`: `font-family: var(--font-secondary); font-size: var(--fs-body-lg); color: var(--clr-content-primary);` — then body resumes.

### 18. Progress indicator

- **What it does.** Either the SectionNavigator's progress strip *or* a per-section "Step X
  of Y" eyebrow on numbered-step content.
- **When to use.** Long Ablauf pages, multi-step forms.
- **Recipe.** Component-internal to SectionNavigator (Variant 2). The standalone "Step 2 of
  7" eyebrow is a simple `<p>` in the eyebrow style.

---

## 1.5 — Typography expansion plan

Working entirely inside `src/style/design-system.css`'s existing scale.

| Role             | Token combination                                                                       | Casing / treatment                                  | Example use                          |
| ---------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------ |
| Eyebrow / label  | `--fs-body-sm`, weight 500, `text-transform: uppercase`, `letter-spacing: 0.12em`       | Always paired with a heading; never alone           | "Nachhaltigkeit" above an H2          |
| Display H1       | `--fs-h1`, weight **300** (light), `var(--ls-heading)`, line-height `var(--lh-heading)` | Mixed case; key noun in `<span class="highlight">` italic serif | Page hero on `unser-versprechen.astro` |
| Display H1 (XL)  | inline `clamp(2.5rem, 8vw, 5.5rem)` weight 300                                          | Typographic hero variant (see toolkit pattern 15)   | Campaign-page heroes                  |
| Section H2       | `--fs-h2`, weight 500, `var(--ls-heading)`, line-height `var(--lh-heading)`             | Use `Section.astro`'s existing two-line split pattern | Each major section                   |
| Sub-heading H3   | `--fs-h3`, weight 400, `var(--ls-heading)`                                              | Use sparingly — one or two per section              | Inside `unser-versprechen` sub-blocks |
| Tertiary H4      | `--fs-h4`, weight 500, `var(--ls-heading)`                                              |                                                     | Card titles, accordion triggers       |
| Lede / intro     | `--fs-body-lg`, weight 300, `color: var(--clr-content-secondary)`, `max-width: 56rem`   |                                                     | Below H1 / H2                         |
| Body             | `--fs-body`, weight 300, `line-height: var(--lh-body)`                                  | Default                                             | Paragraphs                            |
| Caption / micro  | `--fs-body-sm`, weight 400, `color: var(--clr-content-tertiary)`                        | Optional `letter-spacing: 0.04em`                   | Image captions, badge labels          |
| Pull quote       | `--fs-h4`, `font-family: var(--font-secondary)`, italic, weight 400, `line-height: 1.3` |                                                     | Toolkit pattern 6                     |
| Stat value       | `--fs-h2`, weight 300, `line-height: 1`, `var(--ls-heading)`                            | Tabular figures via `font-variant-numeric: tabular-nums` | Toolkit pattern 3                  |
| Drop cap initial | `4.5em` of `--fs-body`, `font-family: var(--font-secondary)`                            | Editorial — `uber-uns.astro` lead paragraph         | Toolkit pattern 16                    |
| Highlight span   | `font-family: var(--font-secondary)`, italic, weight 400                                | Already used in `PageHero.astro`, `Section.astro`   | Hero / section headings               |

### Tokens missing from `style/` — proposed additions

1. **`--font-weight-light: 300`**, **`--font-weight-regular: 400`**,
   **`--font-weight-medium: 500`**, **`--font-weight-bold: 700`** in `design-system.css`.
   Right now weights are inline numbers everywhere. Naming them stops drift.
2. **`--tracking-eyebrow: 0.12em`** and **`--tracking-caption: 0.04em`** —
   the eyebrow pattern is in `PageHero.astro` already inline (`0.12em`); naming it lets us use
   it consistently across the navigator and the toolkit patterns.
3. **`--lh-display: 1`** — currently we only have `--lh-tight: 1`, `--lh-heading: 1.1`,
   `--lh-body: 1.5`. Display type at 60+ px needs a 1.0 line-height; `--lh-tight` works but
   "display" reads better in code. Optional.

I will use `--lh-tight` and inline weight numbers in Phase 2 unless you ratify the additions
above. Nothing silent.

---

## 1.6 — Icon strategy (Lucide)

Working in `lucide-vue-next 1.0.0`. Default stroke width 2, default size 16 px (named
`--icon-md`, to be added as `:size="16"` until the token exists). Three roles:

### Functional icons (UI controls)

| Where                                            | Icon                                |
| ------------------------------------------------ | ----------------------------------- |
| Section navigator inline overview                | `ArrowDown` (14 px)                 |
| Section navigator pill rail overflow indicator   | `ChevronRight` (16 px)              |
| Accordion expand / collapse                      | `ChevronDown` (rotates 180°)        |
| Button leading "Beratung vereinbaren"            | `CalendarCheck` (16 px)             |
| Button leading "Katalog bestellen"               | `BookOpen` (16 px)                  |
| Button trailing primary CTA                      | `ArrowRight` (16 px)                |
| External link                                    | `ArrowUpRight` (14 px)              |
| Map / location                                   | `MapPin` (16 px)                    |
| Phone, email                                     | `Phone`, `Mail` (16 px)             |
| Close / dismiss                                  | `X` (16 px)                         |
| Search (if/when added)                           | `Search` (16 px)                    |

### Anchor icons (decorative-functional, on list items / section headings)

| Topic                          | Icon                          |
| ------------------------------ | ----------------------------- |
| Nachhaltigkeit, Holz, Klima    | `Leaf`, `TreeDeciduous`       |
| Qualität, Zertifikate          | `Award`, `Shield`             |
| Energie, KfW, Effizienz        | `Zap`, `Sun`                  |
| Sicherheit, Schlüssel          | `KeyRound`, `Lock`            |
| Familien, Mehrgenerationen     | `Users`, `HeartHandshake`     |
| Senioren, Barrierefrei         | `Accessibility`               |
| Investoren, Vermietung         | `TrendingUp`, `Coins`         |
| Hausbau, Phasen                | `Hammer`, `HardHat`, `Compass`|
| Planung, Architektur           | `Ruler`, `Pencil`             |
| Smart Home                     | `SmartphoneNfc`, `Wifi`       |
| Wärmepumpe, PV                 | `Thermometer`, `Sun`          |
| Kontakt, Beratung              | `MessagesSquare`              |

### Status icons (sparing)

`CircleCheck` (success — `--clr-status-success`), `Info` (info — `--clr-status-info`),
`AlertTriangle` (warning — `--clr-status-warning`), `CircleAlert` (error —
`--clr-status-error`).

### Decorative-functional (large)

When a section has no good photo, a 64 px Lucide icon at low contrast (`color:
var(--clr-content-tertiary)` with 32% opacity over surface) at the section's start works as a
**visual anchor** in place of a hero image. Reserved for `unser-versprechen.astro` sections
that lack imagery (Wandaufbau, Haus- & Energietechnik).

### Per-page icon mapping

| Page                       | Icons in section anchors                                                           |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `uber-uns.astro`           | `HeartHandshake` (Partner), `Compass` (Werte), `Building2` (Wer wir sind)          |
| `unser-versprechen.astro`  | `Shield` (Qualität), `Award` (16 Gründe), `Leaf` (Nachhaltigkeit), `Layers` (Wandaufbau), `Zap` (Energietechnik) |
| `dein-zuhause.astro`       | `Compass` (Ablauf), `Pencil` (Architektur), `Wifi` (Smart Home), `Coins` (Finanzierung), `Hammer` (Ausbaustufen) |
| `vor-ort-beratung.astro`   | `MapPin` (Standorte), `Home` (Musterhäuser), `Building2` (Vertriebsbüros)          |
| `kontakt.astro`            | `MessagesSquare` (Direkt erreichbar), `Mail` (Katalog), `MapPin` (Vor Ort)         |
| `karriere.astro`           | `Briefcase` (Stellen), `Target` (Tätigkeitsfeld), `Sparkles` (Vorteile)            |

---

## 1.7 — Page-by-page restructure plan

I treat the **six existing static pages** plus the brief's planned campaign pages (Mehrfamilien
/ Bungalow, replacing comps 2 and 3). The navigator anchors are German-umlaut-normalised
(`hauser` etc.) per CLAUDE.md.

### `unser-versprechen.astro` — the most text-heavy page; the canary

**Current structure** (read from file): H1 hero + 5 huge sections (Qualität & Zufriedenheit
→ 16 gute Gründe → Nachhaltigkeit → Wandaufbau → Haus- & Energietechnik). Each section is
500–1000 words of unbroken text on mobile.

**Problems**
- The 16-gute-Gründe list is a 16-item `<ol>` rendered as bullets — content gold buried as
  chrome.
- Nachhaltigkeit has 4 sub-sections back-to-back with no visual break.
- Wandaufbau has technical specs in body paragraphs where a definition list belongs.
- No table of contents → on mobile, page-length is daunting; user has no map.

**New structure**

| Section | Pattern (from §1.4)                      | Anchor id      | Notes                                                                                 |
| ------- | ---------------------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| 0       | `PageHero.astro`                          | —              | Typographic hero variant: "Das BoHolz Versprechen" with "Versprechen" in italic serif |
| 1       | **SectionNavigator inline + sticky rail** | —              | First content after hero                                                              |
| 2       | EyebrowHeadingLede + StatBlocks (3×)      | `qualitaet`    | "90 Jahre Erfahrung · QDF/GDF · KfW 40/55"                                            |
| 3       | EyebrowHeadingLede + StepCards (3 phases) | `tradition`    | Tradition → Modernisierung → Zertifizierungen                                          |
| 4       | EyebrowHeadingLede + IconList (16 items) | `gruende`      | The 16 reasons as icon-prefixed list, 4 col desktop / 1 col mobile                    |
| 5       | EyebrowHeadingLede + Comparison           | `nachhaltigkeit` | Holzbau vs konventionell, 2-column comparison                                       |
| 6       | StatBlocks                                | —              | "30 t CO₂ je Haus · 11 h Phasenverschiebung · 92 % Temperaturpuffer"                   |
| 7       | EyebrowHeadingLede + DefinitionList       | `wandaufbau`   | Material specs in `<dl>` (ECO Nature / ECO Nature Plus)                               |
| 8       | EyebrowHeadingLede + IconList             | `technik`      | Wärmepumpen / PV / Raumklima                                                          |
| 9       | **VideoPlaceholder** (`data-video-slot="versprechen-werksrundgang"`) | — | Aspect 16:9, hint "Werksrundgang — bald verfügbar" |
| 10      | CTASection (existing component, accent tone) | —          | Beratung vereinbaren · Katalog bestellen                                              |

**Video placeholder locations.** 1 placeholder after section 8.
**Components needed.** SectionNavigator, EyebrowHeadingLede, StatBlocks, IconList, Comparison,
DefinitionList, StepCards, VideoPlaceholder. CTASection already exists; PageHero already
exists.
**Mobile considerations specific.** The 16-item list collapses to 1 column at mobile and uses
`gap: var(--spacing-2)`. The Comparison stacks (mobile) and the "with" card sits on top.

---

### `dein-zuhause.astro` — second long page

**Current.** H1 + 5 sections (Ablauf phases / Architektur / Smart Home / Finanzierung &
Förderung / Ausbaustufen). Phases 1–3 are rendered as three back-to-back H3 + `<ul>` blocks.

**Problems**
- The three Ablauf phases are a perfect Numbered Step Cards story and are not used as such.
- The four Ausbaustufen are a perfect Definition List + numbered cards combo.
- The KfW product summaries are a perfect Card grid.

**New structure**

| Section | Pattern                                   | Anchor id     |
| ------- | ----------------------------------------- | ------------- |
| 0       | PageHero (existing image)                  | —             |
| 1       | SectionNavigator (5 items)                | —             |
| 2       | EyebrowHeadingLede + StepCards (3 phases) | `ablauf`      |
| 3       | EyebrowHeadingLede + body                  | `architektur` |
| 4       | EyebrowHeadingLede + IconList (4 features) | `smart-home`  |
| 5       | EyebrowHeadingLede + StepCards (KfW programs) | `finanzierung` |
| 5b      | Callout (`Info`, finance disclaimer)       | —             |
| 6       | EyebrowHeadingLede + Numbered DL (4 stages) | `ausbaustufen` |
| 7       | VideoPlaceholder (`data-video-slot="dein-zuhause-zeitraffer"`) | — |
| 8       | CTASection (image tone)                    | —             |

---

### `uber-uns.astro` — the editorial page

**Current.** H1 + 2 sections (Zwei starke Partner / Unsere Werte). Some image grid usage.

**Problems**
- The page is short — only 3 main sections. SectionNavigator may be optional here.
- The opening paragraph is a perfect candidate for the drop-cap + quote-led-paragraph
  treatment.

**New structure**

| Section | Pattern                                | Anchor id |
| ------- | -------------------------------------- | --------- |
| 0       | PageHero                                | —         |
| 1       | (no navigator — page is short)         | —         |
| 2       | EyebrowHeadingLede with drop-cap        | `partner` |
| 3       | StatBlocks (90 Jahre · Bavarian HQ · …) | —         |
| 4       | EyebrowHeadingLede + body              | `werte`   |
| 5       | Existing value-grid (kept, polished)    | —         |
| 6       | PullQuote ("Qualität geht vor Quantität…") | —     |
| 7       | EyebrowHeadingLede + IconList ("Was wir tun") | `was-wir-tun` |
| 8       | CTASection                              | —         |

**Mobile considerations.** Drop-cap only applies from `--from-tablet` (mobile gives it a
heavier weight instead).

---

### `vor-ort-beratung.astro` — map + locations

**Current.** Map + feature-grid for Musterhäuser + ul-lists for Vertriebsbüros.

**Problems**
- The list of Vertriebsbüros reads as an admin export. Each location deserves a small card
  with icons (MapPin, Phone) and a "Standort öffnen" link.
- Musterhäuser deserve photos; if we don't have them yet, VideoPlaceholder slot per
  Musterhaus.

**New structure**

| Section | Pattern                                       | Anchor id        |
| ------- | --------------------------------------------- | ---------------- |
| 0       | PageHero (no image — typographic variant)     | —                |
| 1       | SectionNavigator (4 items)                    | —                |
| 2       | LocationsMap (existing)                       | `karte`          |
| 3       | EyebrowHeadingLede + Card grid (Musterhäuser)  | `musterhaeuser`  |
| 4       | EyebrowHeadingLede + IconList Cards (Büros BW) | `bueros-bw`      |
| 5       | EyebrowHeadingLede + IconList Cards (Büros BY) | `bueros-by`      |
| 6       | CTASection                                     | —                |

---

### `kontakt.astro`

**Current** is already passable; the form column + info column grid works. Adds:
- Eyebrow on each H2.
- StatBlocks above the form ("Antwortzeit < 24 h · Beratung kostenfrei · 5 Standorte").
- Section divider before the LocationsMap.

No new pages; just polish + navigator.

---

### `karriere.astro` — broken file

The file currently has a stripped frontmatter (just `---\n---`) and no `Layout` import — it
will not render at all. **Mark for full rebuild.** Same restructure approach as the other
content pages: PageHero + Navigator + IconList for sections.

---

### Replacement campaign pages — for the "Mehrfamilien" and "Bungalow" comps

These were Page 2 and Page 3 of the original mocks. **Decision pending: do we still want
campaign-targeted versions, or do we fold these into category landing pages
(`hauser?category=mehrfamilien`)?** I think the latter; campaign pages duplicate IA. Open
question 3 below.

---

## 1.8 — Component inventory

| Type        | Component                  | Complexity | Reuse | Build priority (1=first) |
| ----------- | -------------------------- | ---------- | ----- | ------------------------ |
| Foundation  | `SectionNavigator.vue`     | High       | 6+    | **1**                    |
| Foundation  | `VideoPlaceholder.vue`     | Low        | 6+    | **2**                    |
| Foundation  | `Eyebrow.astro` (or `.vue`)| Trivial    | 12+   | 2                        |
| Primitive   | `Badge.astro`              | Trivial    | 8+    | 3                        |
| Primitive   | `Callout.astro`            | Low        | 4+    | 3                        |
| Primitive   | `Divider.astro`            | Trivial    | 4+    | 3                        |
| Composition | `EyebrowHeadingLede.astro` | Low        | 12+   | 3                        |
| Composition | `StatBlock.astro` + `StatGrid.astro` | Low | 6+ | 3                        |
| Composition | `IconList.astro`           | Low        | 8+    | 3                        |
| Composition | `StepCards.astro`          | Medium     | 4+    | 4                        |
| Composition | `DefinitionList.astro`     | Low        | 4+    | 4                        |
| Composition | `Comparison.astro`         | Medium     | 2+    | 4                        |
| Composition | `PullQuote.astro`          | Trivial    | 4+    | 4                        |
| Composition | `Accordion*.vue` (Reka)    | Medium     | 4+    | 4                        |
| Page sections | Polish pass on `PageHero.astro`, `CTASection.astro`, `Section.astro` (add `tone` prop) | Low | n/a | 5 |

Total new components: **≈ 14.** Reuses 2 existing (`PageHero`, `CTASection`, `Section`).

---

## 1.9 — Build order

1. **Foundations (week 1 priority).**
   1. `SectionNavigator.vue` — Variant 2 if approved. Includes the
      `useActiveSection` composable. Ship with smoke test: render on one page, navigate, check
      sticky behaviour at 390 + 1440.
   2. `VideoPlaceholder.vue` — including the `data-video-slot` attribute and the
      `prefers-reduced-motion`-aware pulse.
   3. `Eyebrow.astro` — used by all subsequent compositions.
2. **Primitives.** `Badge`, `Callout`, `Divider`.
3. **Compositions.** `EyebrowHeadingLede`, `StatBlock/StatGrid`, `IconList`, `StepCards`,
   `DefinitionList`, `Comparison`, `PullQuote`, `Accordion`.
4. **Polish pass.** Add `tone` prop to `Section.astro`. Confirm `PageHero.astro` and
   `CTASection.astro` accept the additions cleanly (eyebrow consistency).
5. **Pages.** Restructure in this order:
   1. `unser-versprechen.astro` — the canary; if the system works here it works anywhere.
   2. `dein-zuhause.astro`.
   3. `uber-uns.astro`.
   4. `vor-ort-beratung.astro`.
   5. `kontakt.astro`.
   6. `karriere.astro` — rebuild from scratch.
6. **Audit pass.** Re-screenshot each page mobile + desktop. Run `a11y-contrast-auditor` on
   the navigator (the only place I'm introducing colour decisions on chrome). Note anything
   that did not land.

---

## 1.10 — Open questions (max 5, ranked by impact)

1. **Pick a SectionNavigator variant.** My strong recommendation is **Variant 2** (the
   inline-overview + sticky-pill-rail hybrid). Variant 1 is the safest, Variant 3 is the
   docs-shaped option. Reply with "variant 1", "variant 2", or "variant 3".

2. **Token additions (§1.5).** Are the proposed `--font-weight-*` and `--tracking-*` tokens
   OK to add to `src/style/design-system.css`? They're not invented values — just naming
   existing inline ones — but per the brief I do not silently extend the design system.

3. **Campaign pages (Page 2 / Page 3 of the original mocks).** Keep as standalone
   `kampagne/mehrfamilien.astro` and `kampagne/bungalow.astro`, or fold their content into
   the existing `hauser.astro` category filter UX? My take: fold them. They duplicate IA and
   we are unlikely to drive paid traffic to them at this stage.

4. **Accent colour usage.** `--clr-accent-primary` is `--boholz-blau-alt` (`#0a78c2`) — a
   confident, slightly cool blue. Are you happy keeping this as the *one* accent across the
   site, or do the campaign pages get their own muted accent (the comps tried this with sage
   / pastel / teal)? My take: one accent, full stop. Audience differentiation through
   imagery + copy, not palette.

5. **Sticky rail behaviour on hero pages.** The `Layout.astro` `data-hero="true"` attribute
   exists — should the SectionNavigator's sticky rail wait until the hero is fully off-screen
   *and* the navbar has transitioned from transparent to solid? (I'll default to "wait for
   both"; flag if you want simpler.)

---

## STOP — waiting for approval

This plan is complete through Phase 1. Per the brief I do not proceed to Phase 2 until you
approve and pick a Section Navigator variant.

---

## URGENT — Homepage mobile redesign (added 2026-05-17)

User has flagged the **homepage's mobile experience** as the top priority — it falls short of
the brand's premium intent and outranks every campaign page. The static-pages team owns the
implementation; this section is the brief for them. **Full long-form diagnostic:**
[`HOMEPAGE-MOBILE-ANALYSIS.md`](./HOMEPAGE-MOBILE-ANALYSIS.md).

### Diagnostic summary — biggest mobile problems

1. **No on-page wayfinder across 6 sections.** User scrolls 5–8 screens blind. Solved by
   wiring the existing `SectionNavigator` between Hero and section 1.
2. **Five `OverviewCard`s all carrying the same LOREM body.** User-visible content debt;
   the strongest typographic moment on the page is undermined by identical paragraphs.
3. **Three `TrustBadge` cards stacked on mobile = 3 identical Card shapes.** `StatBlock`s
   give the same information in roughly half the vertical space, denser and more typographic.
4. **`BuildingStages` hero frame is 75dvh on mobile (~633 px).** Plus the two empty
   `ImagePlaceholder` cells render on mobile — dead UI. Plus tabs are `<h3 role="tab">` —
   a11y broken.
5. **`Faq` category buttons are stacked vertically left-aligned on mobile.** Tap a category
   → scroll past the list to the questions → scroll back up to pick another. Pattern is
   desktop-first. Convert to a horizontal pill row on mobile.
6. **No section eyebrows anywhere.** Every section opens cold. Six "here's another section"
   moments could be six "VERTRAUEN / AUSZEICHNUNG / AUSBAUSTUFEN" wayfinding moments.

### Section-by-section restructure proposal

(See [`HOMEPAGE-MOBILE-ANALYSIS.md` §4.1](./HOMEPAGE-MOBILE-ANALYSIS.md#41--section-by-section-change-table) for the full table with kit components, Lucide icons, and nav entries per section.)

| # | Current | → | Proposed (mobile) |
| - | ------- | - | ----------------- |
| 1 | `Hero` (full-bleed photo) | → | Keep. Fix: `flex-direction: column` on `.bottom` at `(--mobile)`; drop badges 6→4; add `ChevronDown` scroll cue |
| 2 | `CategoriesShowcase` | → | Add `Eyebrow` "Katalog"; wire or remove the dead `LucideInfo` hint; expose `id="katalog"` |
| 3 | `TrustBadges` (3 Cards) | → | **3 `StatBlock`s** (same icons, same values, denser); `Eyebrow` "Vertrauen" |
| 4 | `Overview` (5 LOREM Cards) | → | **1 featured `OverviewCard` + 4 `IconList` rows** with real one-line copy; `Eyebrow` "Auszeichnung" |
| 5 | `BuildingStages` | → | Keep 4-stage tab UX but: Reka `TabsRoot` for a11y, cap hero at 50dvh mobile, drop empty cells, add `VideoPlaceholder` slot, `Eyebrow` "Ausbaustufen" |
| 6 | `Faq` | → | Pill-row category nav on mobile; swap `FaqItem.vue` → kit `FAQAccordion`; `Eyebrow` "Fragen" |
| 7 | *(new)* | → | Closing `CTASection` linking to `/kontakt` or `/vor-ort-beratung` |

### Proposed mobile section order (SectionNavigator pill list)

```
[Hero — not in rail]
1. Katalog          (was: CategoriesShowcase)
2. Vertrauen        (was: TrustBadges, now StatBlocks)
3. Auszeichnung     (was: Overview, now Featured + IconList)
4. Ausbaustufen     (was: BuildingStages, fixed)
5. Fragen           (was: Faq, fixed)
6. Kontakt          (NEW — closing CTASection)
```

Six rail entries — same count as `unser-versprechen.astro`. Fits the SectionNavigator's
mobile horizontal-scroll spec without strain.

### Dependencies (deferred polish-pass props)

| Prop | Component | Blocking this redesign? |
| ---- | --------- | ----------------------- |
| `variant: 'type'` | `PageHero.astro` | **No** — homepage hero stays photographic |
| `eyebrow?: string` | `CTASection.astro` | **Soft** — closing CTA loses eyebrow rhythm without it |
| `tone: 'primary' \| 'secondary'` | `Section.astro` | **Soft** — would break the six-uniform-Section vertical rhythm |

**Hard blockers: zero.** The static-pages team can ship without either prop; the result is
noticeably stronger with both. Recommended: land `CTASection.eyebrow` and `Section.tone`
before page assembly. They're cheap and they pay back across this redesign plus
`unser-versprechen.astro`, `dein-zuhause.astro`, `karriere.astro`.

### Estimated complexity & sequencing

| Step | Complexity | Why |
| ---- | ---------- | --- |
| 1. SectionNavigator wiring + Eyebrows everywhere | Low | Cheapest, biggest immediate "the page has structure" signal |
| 2. TrustBadges → StatBlocks | Medium | Single-section swap, high visual win |
| 3. Overview restructure + LOREM → real copy | Medium | Highest content-debt fix; copy is the slow part |
| 4. BuildingStages a11y + height fixes | Medium-High | Reka tab swap is the work |
| 5. Faq pill-row + FAQAccordion swap | Medium | Cleanup pass |
| 6. Closing CTASection | Low | Existing component |
| 7. Hero mobile flex fix + badge trim | Low | ~15-line patch, anytime |

Whole restructure is **~2–3 focused days** of static-pages work — the kit and design system
do the heavy lifting.

### Open caveat

The dev server's `getCategories()` loader fails in this working tree (Drizzle query against
`boholz.house_categories`), so the homepage couldn't be screenshotted live. The diagnostic
is grounded in the source (every component, every content file, every breakpoint), which is
more authoritative than a render. When the DB is reachable locally, the kit stream should
re-shoot under `screenshots/homepage-mobile/` per the plan in
[`HOMEPAGE-MOBILE-ANALYSIS.md` §8](./HOMEPAGE-MOBILE-ANALYSIS.md#8--what-i-would-screenshot-if-i-could).
