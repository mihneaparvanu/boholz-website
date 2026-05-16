# Homepage mobile redesign — analysis

**Date:** 2026-05-17
**Author:** ui-designer-savant
**Scope:** Diagnostic + restructure proposal for `src/pages/index.astro` at 390 px.
**Audience:** static-pages team (implementer). I do not modify homepage files.

---

## 0. Method note (read this first)

The dev server at `localhost:4321` is up, but **`/` errors out** before rendering
anything. The Drizzle `getCategories()` loader called from
`src/layouts/Layout.astro` fails (`Failed query: select "houseCategories"…
left join lateral … "house_categories"`) — the error truncates mid-message but
the query reaches the DB and fails on schema/data. This is the same
environment constraint the prior agent worked around for the sandbox by
bypassing `Layout.astro`.

**I am not authorised to modify `src/pages/index.astro` or anything under
`src/features/Home/` per the coordination contract**
(see [`coordination-with-pages-team`](../../.claude/agent-memory/ui-designer-savant/coordination-with-pages-team.md)).
A non-load-bearing fix to unblock a render — e.g. seeding categories — is out
of scope.

What I do have is the source code for every homepage section, every content
file, every CSS rule, and the breakpoints they react to. Content length,
mobile-specific media-query behaviour, real spacing/type tokens, and the
existence (or absence) of mobile overrides are all read directly from the
files. Where this analysis would normally show a screenshot ("here is the
wall of text"), it cites the exact source location and the content that
produces it. I would rather give the static-pages team a precise,
code-grounded brief than a screenshot-pretty one.

**No screenshots in this round.** When the homepage can render in this
working tree, I'll re-shoot under `screenshots/homepage-mobile/`.

---

## 1. The page as it exists today

`src/pages/index.astro` is six rendered children inside `Layout.astro`'s
single `<main class="wrapper">`. In rendered order:

| # | Component | Source | Wraps in `<Section>`? |
| - | --------- | ------ | --------------------- |
| 1 | `Hero` (Vue) | `features/Home/Hero/Hero.vue` | No — full-bleed `100dvh` |
| 2 | `CategoriesShowcase` (Vue) | `features/Home/CategoriesShowcase/CategoriesShowcase.vue` | Yes, `homeSections.categories` |
| 3 | `TrustBadges` (Vue) | `features/Home/TrustBadges/TrustBadges.vue` | Yes, `homeSections.trust` |
| 4 | `Overview` (Vue) | `features/Home/Overview/Overview.vue` | Yes, `homeSections.overview` |
| 5 | `BuildingStages` (Vue) | `features/Home/BuildingStages/BuildingStages.vue` | Yes, `homeSections.finishes` |
| 6 | `Faq` (Vue) | `features/Home/Faq/Faq.vue` | Yes, `homeSections.qa` |

A commented-out `<CatalogCard/>` is in source. The footer is rendered by
`Layout.astro`.

Each `<Section>` (`src/layouts/Section.astro`) renders the same three-line
rhythm: optional `heading1` / `heading2` split, italic-serif `highlight`
trailing span, then a `subheading` paragraph capped at 56 rem — centred,
constrained to 90 ch. **This is the kit's `EyebrowHeadingLede` minus the
eyebrow.** Section padding is `var(--spacing-6)` block (105 px desktop /
64 px mobile per the spacing-fluid scale) and `var(--spacing-5)` content
gap (65 px / 40 px).

---

## 2. Section-by-section diagnosis (mobile, 390 px)

For each section: function, what works, what doesn't, kit components that
help, Lucide icons that help.

### 2.1 — `Hero` (slide 1, screen 1)

**Function.** Brand statement + photographic anchor + entry point to one
featured house (CTA links to `/haus/[slug]`).

**Source.** `features/Home/Hero/Hero.vue` — full-bleed `100dvh` background
image (`Transition name="crossfade"` rotates through 6 slides on a 5s
interval), bottom-aligned headline + a 6-symbol quality-badge SVG row + one
"Featured house" button.

**What works on mobile.**
- Full-bleed image — type-over-photograph is brand-correct and luxe.
- One CTA, one job. (Commandment 1 — accent restraint.)
- Headline split into H1 ("Einfach einkommen.") + H2 ("Ihr Zuhause,
  meisterhaft vollendet.") gives a typographic moment, not just a slogan.

**What doesn't work on mobile.**
- **Quality-badge strip is too wide.** Six SVGs with `gap: var(--spacing-3)`
  (15–25 px) and individual `height: 28px` — at 390 px viewport with
  `--padding-inline: 20px` left and the CTA button on the right (with its
  own ~140 px width), the badges + CTA cannot fit side-by-side. CSS forces
  `.bottom` to be `display: flex; justify-content: space-between` on all
  viewports — there is no mobile breakpoint override (lines 138–210). The
  badges will overflow, wrap, or be visually crushed against the CTA.
- **No eyebrow / label above the H1.** Cold open — the user lands on a
  full-screen photo with the type "Einfach einkommen." floating with no
  context strip. Adding a thin eyebrow like "BOHOLZ HAUS · FERTIGHÄUSER
  AUS BAYERN" would anchor the brand for first-time visitors.
- **5-second auto-rotate with no pause-on-interaction.** `useIntervalFn`
  fires unconditionally (line 15). On mobile that's a 5-second rug-pull
  during read; on `prefers-reduced-motion` the slides still change but the
  crossfade transition is killed (jarring snap instead of a fade). This is
  a UX issue more than a layout one — flag it.
- **No section anchor.** The hero is the only thing the user sees on entry;
  there is no "below the fold" affordance. A chevron-down or a "Was
  BoHolz auszeichnet ↓" link would tell them to keep scrolling.

**Kit components that would help.**
- *None directly.* The hero is a one-off; the kit's `PageHero.astro` is
  more text-oriented and assumes a content page, not a marketing
  landing. The existing hero is structurally distinct. **Keep it.**
- The badge row is a candidate for the kit's `Badge.astro` — but the
  existing SVG quality marks (ISO, BDF, GDF, QDF, RAL) are *symbol marks*,
  not the kit's text-badge pattern. Keep the SVGs; just fix the layout
  collision below.

**Specific fix recommendation (for static-pages team).** Add a
`@media (--mobile)` override on `.bottom`: stack `proof` above `action`
with `flex-direction: column; align-items: flex-start; gap: var(--spacing-3)`.
Drop the badge row count from 6 to 4 on mobile (`.badges
:nth-child(n+5) { display: none }`) — the brand carries with ISO/BDF/GDF/RAL;
QDF and GDF-shield are noise on a 350 px row.

**Lucide icons.** `ChevronDown` (16 px, white, opacity 0.7) as a subtle
"scroll for more" affordance under the CTA.

**Verdict.** Strong section, two specific mobile collisions. Keep, polish.

---

### 2.2 — `CategoriesShowcase` (the `homeSections.categories` section)

**Function.** Browse-the-catalogue entry point — slide through 5 categories
(Bestseller excluded, virtual). Lead the user toward `/hauser`.

**Source.** `features/Home/CategoriesShowcase/CategoriesShowcase.vue` —
delegates rendering to `features/CategorySlider/CategorySlider.vue` (not
read, owned by another stream). Below the slider: a 2-line info block —
"Ab 200.000€ zzgl. Überführung. / Attraktive Finanzierungsmöglichkeiten.
[i]".

**Section heading copy (from `home.content.ts`):**
- H1: "Fertighäuser in Zimmermannsqualität"
- H2: "für Menschen mit"
- Highlight: "Anspruch." (italic serif)
- Subheading: 39-word paragraph about barrier-free houses, wood,
  energy-efficiency.

**What works on mobile.**
- The Section.astro three-line rhythm (heading-split + italic-serif
  highlight + lede) is the right pattern for this — already congruent with
  the proposed `EyebrowHeadingLede`. The brand serif italic on
  "Anspruch." is the brand's typographic fingerprint.
- The lede paragraph is the right length (39 words). This is the "longest
  unbroken text block ≤ 110 words" rule the Air NZ reference codifies.
  Sits well.
- The price hint ("Ab 200.000€ zzgl. Überführung") gives the user a
  concrete anchor — premium honesty.

**What doesn't work on mobile.**
- **No eyebrow.** Section opens cold with a centred H2-styled heading. A
  KATEGORIEN eyebrow (or KATALOG) would establish where the user is in
  the page — and would tie this section to a SectionNavigator entry.
- **The "Attraktive Finanzierungsmöglichkeiten. [i]"** hint icon is bare
  Lucide `LucideInfo` with `cursor: help` and no tooltip wired up. The
  affordance promises something (tooltip / link) and delivers nothing.
  Either link it to a `/finanzierung` anchor or remove the icon. Tap target
  is also under 44 px — accessibility.
- **No visible navigation handle from this section.** Once the user is in
  the slider, they can't tell from page chrome where they are in the
  document.

**Kit components that would help.**
- **`Eyebrow.astro`** — add "Katalog" or "Häuser" as a section anchor.
- **`SectionNavigator`** — this section's anchor becomes the first pill
  after the hero.
- *Do NOT replace the CategorySlider* — it's owned by another feature
  stream and works for its role.

**Lucide icons.** `Layers3` for the Eyebrow (Katalog stack metaphor).
Replace `LucideInfo` with a real `<a>` to a finance section if we have one,
or remove.

**Verdict.** Section is structurally fine. Adds: eyebrow, navigator anchor,
fix the dead Info icon.

---

### 2.3 — `TrustBadges` (the `homeSections.trust` section)

**Function.** Three numeric proof points: "100% Made in Germany",
"18 Monate Festpreisgarantie", "5 Jahre Gewährleistung".

**Source.** `features/Home/TrustBadges/TrustBadges.vue` — `grid-template-columns:
repeat(auto-fit, minmax(16rem, 1fr))` with `gap: var(--spacing-3)`.
`16rem = 256 px`. At 390 px viewport with 20 px gutters either side, the
content column is 350 px. **One badge per row on mobile.** Each badge is a
`Card.vue` (cross-feature primitive — owned by `components/ui/`, not by
the homepage stream).

**Section heading copy.**
- H1: "Ihr Vertrauen"
- Highlight: "fest verankert." (italic serif)
- Subheading: 26 words — "Wir bauen nicht nur Häuser, wir bauen Sicherheit. Mit zertifizierter Qualität aus Deutschland und Garantien, auf die Sie sich verlassen können."

**What works on mobile.**
- Three numeric badges = three concrete claims. This is *exactly* the
  StatBlock pattern the kit advocates for breaking text-heavy content.
- The auto-fit grid collapses cleanly to one column on mobile. No layout
  collision.
- Subheading is at the right length.

**What doesn't work on mobile.**
- **Three full-width cards stacked vertically** is a lot of vertical real
  estate for three numbers. Each `Card.vue` has padding-block on top + body
  copy + an icon — total height per card likely 120–160 px. **Three
  identical-shaped blocks** read as repetitive; on mobile this is dead
  scroll. The Air NZ reference would have these as a single row at any
  viewport — they're tabular data, not three feature cards.
- **The kit has a `StatBlock`** — bigger number, smaller label, optional
  Lucide icon — that's *denser*, *more typographic*, and stacks 1-col
  cleanly without looking like three cards. Using `StatBlock` here would
  free up roughly 200 px of vertical scroll on mobile.
- **No eyebrow.**

**Kit components that would help.**
- **`StatBlock`** (or three of them in a `StatGrid` wrapper) — the perfect
  replacement.
- **`Eyebrow`** (e.g. "VERTRAUEN").

**Lucide icons.** Already used by the trust-badges content
(`LucideHammer`, `LucideShieldCheck`, `LucideCalendar`). Migrate the same
icons into `StatBlock`'s `icon` prop via the `getIcon()` resolver pattern.

**Verdict.** **Highest-value swap in the analysis.** Three cards → three
StatBlocks. Section gets shorter, denser, more premium.

---

### 2.4 — `Overview` (the `homeSections.overview` section)

**Function.** Five-card USP grid — "Höchste Bauqualität" (featured, full
width) / "Echtes Holz" / "Energieeffizienz" / "Individuelle Planung" /
"Smart Living".

**Source.** `features/Home/Overview/Overview.vue` + `OverviewCard.vue`.
Grid is `grid-template-columns: repeat(2, 1fr)` with `gap: var(--spacing-2)`,
collapsing to single column at `--below-desktop`. **Featured card spans
both columns** (`grid-column: 1 / -1`).

**Content.** `overview.content.ts` — every card body is the same
**LOREM** placeholder (43 words about CLT walls). The headings change;
the bodies are all identical.

**Section heading copy.**
- H1: "Besser gebaut."
- H2: "Schneller geliefert."
- Highlight: "Sorgenfrei gelebt." (italic serif)
- Subheading: 29 words.

**What works on mobile.**
- The three-line heading split with three highlight words is the strongest
  typographic moment on the page. It is genuinely good.
- Single-column stack on mobile (`@media (--below-desktop)`) is correct —
  five cards × 56 px heading + 80 px body each ≈ 700 px of scroll, but
  it reads.
- Card padding is `var(--spacing-4)` (24→40 px) — generous, premium.

**What doesn't work on mobile.**
- **Five identical-shaped cards** is the same problem as TrustBadges —
  repetitive on mobile. The "featured" full-width treatment is invisible
  on mobile because everything is full-width.
- **Every card has the same LOREM text.** The user reading the live page
  sees the *exact same paragraph* under five different headings.
  This is real content debt, not a design problem — but it's the most
  damaging thing in the page right now and the static-pages team needs
  to know.
- **No icons on the cards.** Five "Bauqualität / Holz / Energie / Planung /
  Smart" cards without anchor icons read as wall-of-text on mobile.
- **No eyebrow.**

**Kit components that would help.**
- **`IconList`** (single-column on mobile) is a better fit than five
  cards. Icon + heading + 1-line body per row, much denser, much more
  Linear-grade. **This is the second-highest-impact swap in the page.**
- Alternative: **`StepCard`** (numbered, more editorial) if we want each
  USP to carry a number — "01 / 02 / 03 / 04 / 05".
- Or keep `OverviewCard` for the **one featured card** and use IconList
  for the other four — that gives the featured card real weight again.
- **`Eyebrow`** (e.g. "WAS BOHOLZ AUSZEICHNET").

**Lucide icons.** `Hammer` (Bauqualität), `TreePine` (Echtes Holz), `Zap`
(Energieeffizienz), `Pencil` or `Compass` (Individuelle Planung),
`Wifi` or `SmartphoneNfc` (Smart Living).

**Verdict.** **Second-highest-value swap.** Five LOREM cards → IconList +
one featured card. Saves ~400 px of mobile scroll, looks more brand.

---

### 2.5 — `BuildingStages` (the `homeSections.finishes` section)

**Function.** Four-stage Ausbaustufen picker — Ausbauhaus / Technikfertig
/ Fast Fertig / Schlüsselfertig — each with a hero image (R2-hosted webp)
+ a caption.

**Source.** `features/Home/BuildingStages/BuildingStages.vue` — tabbed
selector at top (H3 row, role="tablist"), hero image + figcaption below,
and **two empty `<ImagePlaceholder>` cells** beneath that on desktop.
Mobile collapses to 1 column.

**What works on mobile.**
- Real content with real images — this is the only section in the page
  with photography that's *not* the hero. Visual variety is valuable.
- Tab options wrap at `--below-desktop` (line 158–160).
- The motion-v `AnimatePresence` crossfade between stages is well-tuned
  (`[0.22, 1, 0.36, 1]` quartic-out, 650 ms) — the only good piece of
  ambient motion on the page.

**What doesn't work on mobile.**
- **Hero frame is `height: 75dvh` on mobile** (line 168). That's roughly
  633 px on a 390×844 viewport. **One stage's image takes up most of a
  screen.** That's not premium calm; it's wasteful. Air NZ's hero
  illustrations are nowhere near this proportion.
- **Tabs are H3-styled clickable rows.** Four tab labels at H3 font-size
  (`--fs-h6` per line 93 — actually H6, smaller) is fine, but they wrap to
  2 rows on mobile, and as `<h3 role="tab">` they're semantically wrong (a
  tab list is `<button>`s, not headings). a11y issue — keyboard focus
  doesn't work as expected on `<h3 role="tab">`.
- **Two empty `<ImagePlaceholder>` cells** are visible at the bottom on
  mobile (lines 67–72). On mobile they each get `min-height: 0` but still
  render as empty boxes with no purpose. **Dead UI on mobile.**
- **No eyebrow.**

**Kit components that would help.**
- The tab structure could become `StepCard` × 4 (numbered, vertical on
  mobile, no tab interaction at all) — every stage is shown at the same
  time, no clicking required. This is the "show, don't click" approach.
- Alternative: keep the tab interaction but use `Reka UI`'s headless
  `TabsRoot/List/Trigger/Content` for proper a11y. The existing
  implementation rolls its own with `role="tab"` on `<h3>`.
- **`VideoPlaceholder`** could replace the two empty `ImagePlaceholder`
  cells — at least they'd announce "Video coming" instead of "missing
  image."
- **`Eyebrow`** ("AUSBAUSTUFEN").

**Lucide icons.** `Wrench` (Ausbauhaus), `Plug` or `Cable` (Technikfertig),
`Brush` (Fast Fertig), `KeyRound` (Schlüsselfertig).

**Verdict.** Section has real content but mobile is over-tall + has dead
boxes + a11y-broken tabs. Two paths: (a) keep the tab UX and fix it with
Reka + smaller hero (50dvh max) + drop empty cells, or (b) convert to a
StepCard column.

---

### 2.6 — `Faq` (the `homeSections.qa` section)

**Function.** Show FAQs grouped by 4 categories (Allgemein / Planung &
Gestaltung / Bauphase & Qualität / Kosten & Finanzierung). User clicks
a category, sees its questions as a list of `<details>` accordions.

**Source.** `features/Home/Faq/Faq.vue` + `FaqItem.vue`. Layout is
`grid-template-columns: 1fr 1.5fr` on desktop (categories left, questions
right), collapsing to `1fr` at `--below-desktop`. **Categories collapse
ABOVE the question list on mobile.**

**Section heading copy.**
- H1: "Klarheit schafft"
- Highlight: "Vertrauen." (italic serif)
- Subheading: 33 words.

**What works on mobile.**
- Category buttons are real `<button>`s with proper `role="tab"` and
  `aria-selected` (lines 16–25). Better a11y than BuildingStages.
- `<details>`-based FAQ items get free keyboard support and reduced-motion
  handling.
- The plus-rotate-to-x chevron transition is a small charming detail.

**What doesn't work on mobile.**
- **Category list collapses ABOVE the questions.** User taps a category,
  scrolls past the category list to the questions, opens one, finishes
  reading, scrolls back up to pick a different category, scrolls back
  down. The desktop sidebar pattern doesn't translate.
- **Category buttons are stacked vertically left-aligned** on mobile
  (line 47 — `flex-direction: column; align-items: flex-start`). That's
  four full-width tap targets stacked at H6 size — visually a lot of
  whitespace for four short words. They should be a horizontal pill row
  on mobile (similar to the SectionNavigator pattern).
- **`.questions` has `width: 65ch`** — at mobile 390 px this gets clamped
  by parent but if it ever escapes a wrapper the questions will overflow.
  Already noted in the source (`@media (--below-desktop) { .questions {
  width: 100% } }`) — fine.
- **The chevron is a literal text "+"** (line 14 of FaqItem.vue). Should
  be the Lucide `Plus` for consistency with the kit's `FAQAccordion`
  (which uses Lucide `Plus` → rotates to ×).
- **No eyebrow.**

**Kit components that would help.**
- **`FAQAccordion`** (the kit one, built on Reka — proper ARIA, proper
  focus management, Lucide icon, no `<details>` quirks).
- For the category nav on mobile: a horizontal pill row, conceptually
  identical to the `SectionNavigator` mobile rail.
- **`Eyebrow`** ("HÄUFIGE FRAGEN").

**Lucide icons.** `Plus` (already in `FAQAccordion`). For category nav, no
icons — text pills.

**Verdict.** The section has the right *intent*. The category nav UX on
mobile is the problem. Two changes: pill-row categories + use kit
FAQAccordion.

---

## 3. Page-level mobile problems

Above each section. These cut across the whole page.

### 3.1 — No navigation handle on the whole page

The page has 6 sections and no on-page wayfinder. On mobile that means
the user scrolls blind for 5–8 screens with no sense of where they are or
what's coming. **This is the single biggest mobile UX gap** and is exactly
what the new `SectionNavigator` (already built, sitting in
`components/ui/`) solves.

### 3.2 — No eyebrows anywhere

Section.astro renders heading + highlight + subheading. No section has an
eyebrow. Every section opens cold. Adding consistent eyebrows turns six
"here's another section" moments into six "BENEFITS / TRUST / OVERVIEW /
STAGES / FAQ" wayfinding moments. Cheap fix, big readability win.

### 3.3 — Five identical-shaped Card surfaces

The page renders, in mobile order: hero, then **3 TrustBadge Cards**, then
**5 OverviewCards**, then a BuildingStages frame, then FAQ items. That's
eight Card-shaped containers in a row, no visual relief. The kit's
`StatBlock` and `IconList` break that homogeneity without introducing new
shapes — they're tighter, denser, more typographic.

### 3.4 — Dead content

- 5 OverviewCards all have the same LOREM body ("Unsere Wände bestehen aus
  massivem Kreuzlagenholz…"). User-visible duplication.
- 2 empty `ImagePlaceholder` cells in BuildingStages.
- 1 dead `[i]` hint icon in CategoriesShowcase.

### 3.5 — Section padding rhythm is uniform; no breath

Every section uses `padding-block: var(--spacing-6)` (105 px desktop /
64 px mobile). No alternation, no compression, no zoom-in moments. That's
six identical-cadence sections back-to-back. The kit pattern 12
(alternating tones) would help — but that requires the deferred
`tone?: 'primary' | 'secondary'` prop on `Section.astro`.

### 3.6 — Zero ambient brand expression below the hero

Below the hero photo, **the page contains zero photographs other than the
BuildingStages slider's one active image.** Six sections, one product
photo. The brand is supposedly a premium German prefab manufacturer —
craft photos, factory shots, finished homes — and the homepage shows none
of it on mobile. The kit's `VideoPlaceholder` can hold the slot for the
ones we know are coming.

---

## 4. Proposed restructure (mobile lens)

### 4.1 — Section-by-section change table

| # | Current section | Mobile problem | Proposed structure | Kit components | Lucide icons | SectionNavigator entry |
| - | --------------- | -------------- | ------------------ | -------------- | ------------ | ----------------------- |
| 1 | `Hero` | Badge row overflows; no eyebrow; no scroll cue | Keep hero. Mobile fix: `flex-direction: column` on `.bottom`; reduce badges to 4; add `ChevronDown` cue | (none — no new components) | `ChevronDown` | *not in nav* (rail hides while hero on-screen) |
| 2 | `CategoriesShowcase` | No eyebrow; dead Info icon; no nav anchor | Add `Eyebrow` "Katalog"; remove or wire the Info hint; expose `id="katalog"` for nav | `Eyebrow` | `Layers3` (eyebrow) | "Katalog" |
| 3 | `TrustBadges` (3 Cards) | Three repetitive cards on mobile | **Three `StatBlock`s** with the existing icons + values. Add `Eyebrow` "Vertrauen" | `Eyebrow`, `StatBlock` × 3 | `Hammer`, `Calendar`, `ShieldCheck` | "Vertrauen" |
| 4 | `Overview` (5 Cards, LOREM) | Five identical cards, all same LOREM | **One featured `OverviewCard`** (the lead "Höchste Bauqualität") + **four `IconList` rows** for the other four. Replace LOREM with real one-line bodies. Add `Eyebrow` "Was uns auszeichnet" | `Eyebrow`, `OverviewCard` (kept), `IconList` | `Hammer`, `TreePine`, `Zap`, `Compass`, `Wifi` | "Auszeichnung" |
| 5 | `BuildingStages` | Tabs are H3-as-button (a11y); hero 75dvh on mobile; 2 dead placeholders | Keep the 4-stage tab interaction, but: (a) Reka `TabsRoot` for a11y, (b) cap hero frame at 50dvh mobile, (c) **drop the two empty `<ImagePlaceholder>` cells on mobile**, (d) replace cells with one `VideoPlaceholder` slot. Add `Eyebrow` "Ausbaustufen" | `Eyebrow`, `VideoPlaceholder`, optional `StepCard` if dropping tabs | `Wrench`, `Plug`, `Brush`, `KeyRound` (one per tab via `Eyebrow` slot or Tab label) | "Ausbaustufen" |
| 6 | `Faq` | Vertical category buttons; cross-Section.astro chevron; bare-text + chevron | Convert category tablist to **horizontal pill row** on mobile (conceptually like the `SectionNavigator` rail). Swap `FaqItem.vue` → kit `FAQAccordion`. Add `Eyebrow` "Häufige Fragen" | `Eyebrow`, `FAQAccordion` | `Plus` (already in `FAQAccordion`) | "Fragen" |
| 7 *(new)* | `CTASection` (existing component) | — | Closing CTA to `/kontakt` or `/vor-ort-beratung`. The page currently ends abruptly at the FAQ. Add **`CTASection`** with eyebrow if the deferred `eyebrow?` prop lands; otherwise without. | `CTASection`, optionally `Eyebrow` | `CalendarCheck`, `BookOpen` | "Kontakt" (last pill — also acts as page-end cue) |

### 4.2 — Proposed new section order (= SectionNavigator pill list)

The hero is not in the rail (rail enters when hero leaves viewport).
Final closing CTA is the last rail entry.

```
[Hero — not in rail]
1. Katalog          (was: CategoriesShowcase)
2. Vertrauen        (was: TrustBadges, now StatBlocks)
3. Auszeichnung     (was: Overview, now mixed Featured + IconList)
4. Ausbaustufen     (was: BuildingStages, fixed)
5. Fragen           (was: Faq, fixed)
6. Kontakt          (NEW — closing CTASection)
```

Six rail entries. Same as `unser-versprechen.astro`'s sandbox-tested set.
Fits the SectionNavigator's mobile horizontal-scroll pattern without
strain.

### 4.3 — Hero treatment specifically for mobile

**Keep the existing photographic hero.** The brand has real, brand-specific
imagery in `heroSlides` (R2-backed, real product photos) — this is exactly
the case where the photographic asset is the brand statement. The
deferred `variant: 'type'` polish-pass proposal on `PageHero.astro`
**does NOT block this redesign** — that variant is for content pages
without good imagery (e.g. `karriere.astro`), not for the home page.

The hero already does the typographic work via the in-component H1+H2 +
the brand serif italic on the badge row caption. What it needs is the
mobile-collision fix described in 2.1, not a variant rewrite.

### 4.4 — Where the SectionNavigator rail sticks

The homepage hero is `100dvh` — a full screen. The rail should:
1. **Inline overview block (kit Variant 2 spec)** is rendered *between
   the hero and the first content section* (between `Hero` and the
   "Katalog" section).
2. **Sticky pill rail enters** when the inline overview leaves the
   viewport AND `scrollY > navbar-solid-threshold`. Already encoded in
   `useScrollSpy.ts` from Batch 1.
3. **Rail does NOT appear over the hero.** This is the existing behavior
   per `EXECUTION-LOG.md` — useScrollSpy uses the navbar's solid-state
   threshold (`useScrolledPast(10)`) as a coordination signal.

This is *already* solved by the existing component. The static-pages team
just needs to wire it into `index.astro` between `Hero` and the first
`<Section>`.

### 4.5 — VideoPlaceholder locations

Three places this kit slot earns its keep on the homepage:

1. **After BuildingStages tab area** — replace the 2 empty
   `ImagePlaceholder` cells. One `VideoPlaceholder` with
   `data-video-slot="home-factory-loop"` is the placeholder for the
   atmospheric factory loop the user has flagged as coming. 16:9 ratio.
2. **Inside the new "Auszeichnung" (formerly Overview) section** —
   between the featured card and the IconList, one `VideoPlaceholder` at
   4:5 ratio for a portrait "Holz-detail" loop. This breaks the
   text-icon-text-icon rhythm without adding more Card surfaces.
3. **(Optional)** Above the closing CTA. A wide `VideoPlaceholder` at
   21:9 ratio for an ambient "finished home" loop, captioned "Bald
   verfügbar". This is the kit pattern's strongest argument for use; it
   lets the page end on imagery rather than a CTA wall.

Don't ship all three — pick the strongest one or two (my pick: #1 + #3).

---

## 5. Dependencies — what blocks this

### 5.1 — Deferred polish-pass props

Of the three pending polish-pass APIs flagged in Batch 2:

| Prop | Component | Used by this redesign? | Verdict |
| ---- | --------- | ---------------------- | ------- |
| `variant: 'type'` | `PageHero.astro` | **No** — hero stays photographic | Not blocking |
| `eyebrow?: string` | `CTASection.astro` | **Yes, optional** — would let the new closing CTA match the section rhythm | Nice-to-have; can ship without |
| `tone: 'primary' \| 'secondary'` | `Section.astro` | **Yes, optional** — alternating section tones would break the six-uniform-Section rhythm flagged in 3.5 | Nice-to-have; can ship without |

**Hard blockers: zero.** Soft blockers: two. The static-pages team can
ship the restructure without either prop, but the result is noticeably
better with both. Recommendation: implement the two `eyebrow` /  `tone`
extensions before page assembly. They're cheap and they pay back across
this redesign and at least three other pages.

### 5.2 — Content debt (NOT a design dependency)

- 5 OverviewCard LOREM bodies need to become real one-line copy.
  Likely 8–15 words each.
- Closing CTA copy + target (`/kontakt` vs `/vor-ort-beratung`) is a
  product decision.

This is content work, not design. Flag for whoever owns copy.

### 5.3 — Coordination with the homepage feature owners

Every change above touches `src/features/Home/` or `src/pages/index.astro`.
**None of this should be implemented by the kit stream.** The kit stream's
deliverable is this document + the unchanged kit components. The
static-pages team owns the build.

---

## 6. Estimated complexity & sequencing

| Section | Complexity | Notes |
| ------- | ---------- | ----- |
| 1. Hero polish (mobile flex stack, ChevronDown) | **Low** | 1 file, ~15 lines |
| 2. CategoriesShowcase (Eyebrow + nav id) | **Low** | 1 file, 5 lines |
| 3. TrustBadges → StatBlocks | **Medium** | New file, 3 StatBlocks, content stays |
| 4. Overview → Featured + IconList | **Medium** | Restructure 1 file; content rewrite (LOREM → real) is the slow part |
| 5. BuildingStages fixes | **Medium-High** | Tab a11y fix is non-trivial (Reka swap) + height cap + drop dead cells |
| 6. Faq fixes | **Medium** | Pill row + FAQAccordion swap |
| 7. New CTASection | **Low** | New section, existing component |
| SectionNavigator wiring | **Low** | Already built; add to index.astro between hero and section 1 |

Suggested sequencing (lowest-risk → highest-payoff):
1. **SectionNavigator wiring + Eyebrows everywhere.** Cheapest, biggest
   immediate signal that the page has a structure.
2. **TrustBadges → StatBlocks.** Single-section swap, high visual win.
3. **Overview restructure + LOREM removal.** Highest content-debt fix.
4. **BuildingStages a11y + height fixes.** Lower-glamour but the right
   thing.
5. **Faq pill-row + FAQAccordion swap.** Cleanup pass.
6. **Closing CTASection.** Final.
7. **Hero mobile flex fix.** Anytime — it's a 15-line patch.

Whole redesign is roughly **2–3 focused days** of static-pages work, not
2–3 weeks. The kit and design system are doing the heavy lifting.

---

## 7. One honest concern

The "Overview" section is the strongest typographic moment on the live
page — three two-word phrases with three italic-serif highlights
("Besser gebaut. Schneller geliefert. Sorgenfrei gelebt."). It's the
brand. If the static-pages team converts five identical cards into
"one featured card + four IconList rows," the surrounding *heading
treatment* should stay exactly as it is. This is one of the few sections
where the existing copy and the existing typography are already premium.
Don't touch the heading; only restructure the body.

---

## 8. What I would screenshot if I could

For the record, if the dev server's DB were reachable, this is the
capture plan I had:

```
screenshots/homepage-mobile/
├─ homepage-mobile-full-current.png       (390×844 full-page)
├─ homepage-mobile-01-hero.png            (above the fold)
├─ homepage-mobile-02-categories.png
├─ homepage-mobile-03-trust.png
├─ homepage-mobile-04-overview.png
├─ homepage-mobile-05-buildingstages.png
├─ homepage-mobile-06-faq.png
└─ homepage-desktop-full-current.png      (1440×900 reference)
```

Re-engage this stream when the homepage renders locally and these can be
captured.
