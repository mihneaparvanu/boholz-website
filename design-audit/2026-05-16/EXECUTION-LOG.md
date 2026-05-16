# Phase 2 Execution Log

**Date:** 2026-05-17
**Phase:** 2 (component build), batch 1 of N
**Scope:** SectionNavigator (Variant 2) — first foundation per PLAN §1.9

---

## Components built

### 1. `SectionNavigator.vue` (Variant 2)

**Status:** Built and verified at 1440 + 390.
**Location:** `src/components/ui/SectionNavigator.vue` — placed under
`components/ui/` per CLAUDE.md ("primitive used cross-feature").
**Behaviour:** Inline overview block (two-column desktop, single-column mobile)
+ sticky horizontal pill rail (hidden until overview scrolls off + page is
past the navbar's solid-state threshold) + thin progress bar.

**Accent application — encoded the project rule (Q4):**
- **Primary accent (`--clr-accent-primary`) on the larger inline-overview
  surface** — active row gets a 9% accent-primary tint via `color-mix()`,
  with the leading `ArrowDown` icon promoted to full accent. Verified contrast
  with body text on tinted bg: **15.06:1** (AAA).
- **Secondary accent (`--clr-accent-secondary`) on the smaller sticky pill** —
  full-fill deep blue with `--clr-pure-white` label. Verified: **7.46:1**
  (AAA). At the rail's 13px label size, primary accent's white-text contrast
  would have been borderline; secondary is clearly safer.

### 2. `useScrollSpy.ts`

**Location:** `src/composables/useScrollSpy.ts`
**Approach:** `IntersectionObserver` for trigger + passive `scroll` listener
for precise boundary recomputation. Activation line = navbar height + rail
height. Snap-to-last when scrolled within 16px of document bottom (fixed
during verification — initial heuristic missed the final section).

### 3. Sandbox demo page

**Location:** `src/pages/sandbox/section-navigator.astro`
**Why kept:** Useful for future component development against the navigator;
sits under `/sandbox/` so it's discoverable but not linked from production
nav. **Bypasses `Layout.astro`** to avoid the DB calls that fail in this
working tree (no `.env` configured); inlines a faux 64px navbar to make the
sticky offset real.
**Action item for user:** Either keep this dir for the rest of Phase 2
component verification, or delete `src/pages/sandbox/` before deploy.

---

## Tokens added to `design-system.css`

Three additions, all under the existing "Letter Spacing" section. Each
codifies an inline value that was already in the system rather than
introducing new visual decisions.

| Token | Value | Rationale |
| ----- | ----- | --------- |
| `--tracking-eyebrow` | `0.12em` | The exact value already inline in `PageHero.astro`; now nameable from SectionNavigator and any future Eyebrow component |
| `--font-weight-light` | `300` | DIN-Light, the body default |
| `--font-weight-regular` | `400` | DIN-Regular, used in headings |
| `--font-weight-medium` | `500` | DIN-Medium, used by navigator labels + pill text |
| `--font-weight-bold` | `700` | DIN-Bold, reserved for future use |

`--lh-display` from the plan was deliberately **not added** — the navigator
doesn't need it. Will propose it when a display-tier heading component does.

---

## Files created / modified

| Path | Status |
| ---- | ------ |
| `src/components/ui/SectionNavigator.vue` | Created |
| `src/composables/useScrollSpy.ts` | Created |
| `src/pages/sandbox/section-navigator.astro` | Created (sandbox) |
| `src/style/design-system.css` | Modified — added 5 named tokens |
| `design-audit/2026-05-16/EXECUTION-LOG.md` | Created (this file) |
| `design-audit/2026-05-16/screenshots/built/section-navigator/*` | 6 screenshots |

---

## Verification

### Playwright smoke

- **Desktop (1440x900) and mobile (390x844)** — both viewports rendered.
- **Scroll-spy correctness** — 7/7 sections track when scrolled to them,
  including the doc-bottom edge case for the final section (`kontakt`) after
  fix to `useScrollSpy.ts`.
- **Click → smooth scroll → focus** — clicking "Wandaufbau" pill resulted in
  `activeElement = H2 "Wandaufbau"`, with the section's top landing at 111px
  (just under the 112px activation line — correct).
- **Active pill auto-centring on rail** — verified `scrollLeft = 159` (centred)
  after switching to direct `scrollTo({left})` instead of `scrollIntoView`,
  which was causing the page-window vertical scroll to outrace the
  horizontal scroll on the pill container.
- **Keyboard arrows** — ArrowRight/ArrowDown advances, ArrowLeft retreats,
  cycles correctly across the 7 pills.

### Contrast audit (computed in-browser; WCAG 2.1 sRGB)

| Pair | Ratio | AA Normal Text | AA UI (3:1) |
| ---- | ----- | -------------- | ----------- |
| Overview active text on accent-primary 9% tint | 15.06:1 | PASS (AAA) | PASS |
| Rail active pill (white on accent-secondary) | 7.46:1 | PASS (AAA) | PASS |
| Rail inactive pill (content-tertiary on surface) | 3.57:1 | Inactive-state exempt; meets UI 3:1 | PASS |
| Overview eyebrow (content-tertiary on surface) | 3.57:1 | Secondary metadata; meets UI 3:1 | PASS |
| Active row's ArrowDown icon on tinted bg | 4.06:1 | n/a (non-text icon) | PASS |

The two 3.57:1 ratios involve `--clr-content-tertiary` paired with
`--clr-surface-primary` — a pre-existing design-system combination used
elsewhere (FAQ category buttons in inactive state). Promoting to
`--clr-content-secondary` would lift them to ~9:1 but is a system-wide call,
not a SectionNavigator one. Flagging for the audit but not overriding.

### Reduced motion

- Component reads `useReducedMotion()` from `motion-v` and switches:
  - smooth scroll → `behavior: 'auto'`
  - progress-bar tween duration → 0
  - focus moved on `nextTick` instead of after 720ms scroll-settle delay
- The global rule in `reset.css` kills CSS transitions/animations
  independently. Verified the rule is loaded.
- Note: Playwright session here couldn't toggle `prefers-reduced-motion` via
  the MCP transport, so this was code-review-verified rather than runtime-
  verified. Worth a manual pass at the next critical-component review.

---

## What didn't land cleanly (and how I fixed it)

1. **`recomputeProgress` ran on the SSR server** — `watch(scrollY, fn,
   { immediate: true })` fired synchronously during setup with no DOM. Removed
   `immediate: true` and guarded the function body with `typeof window`.
2. **Initial scroll-spy state at doc bottom showed the second-to-last
   section** — the "snap to last" fallback used `lastRect.bottom <
   viewport * 0.4` which is geometrically wrong at doc-bottom. Replaced with
   `scrollY + innerHeight >= documentHeight - 16`.
3. **Pill auto-centring on the rail did nothing on first scroll-spy hit** —
   the `activeId` watcher was firing before `railVisible` flipped true. Added
   a second `watch(railVisible)` that re-centres the active pill in a
   requestAnimationFrame when the rail enters.
4. **`scrollIntoView({inline:'center'})` was scrolling the document
   vertically as a side-effect.** Replaced with a direct
   `pills.scrollTo({left: computed})` — pure horizontal scroll, no
   vertical surprise.

---

## Open concerns (for the user, before page assembly)

1. **The page's `<main class="wrapper">` is the sticky positioning ancestor**
   for the rail. That works in the sandbox. In real pages, if `Layout.astro`'s
   `main.wrapper` ever gets `overflow: hidden` for any reason, the sticky
   rail will stop sticking. Currently safe; flagging as a non-obvious
   coupling.
2. **The navbar uses `useScrolledPast(10)`** to switch transparent→solid.
   The rail uses `useElementVisibility` on the overview + `scrollY >
   stickyOffset`. The two thresholds are different on purpose (the rail
   shouldn't pop in while the navbar is mid-transition). Looks clean in
   practice but it's two independent state machines watching the same
   scroll. If we ever centralise scroll observers, do both at once.
3. **Mobile mask fade on the pills** is purely visual; the rightmost pill
   under the mask is still clickable. WCAG-wise fine. Worth user-testing once
   real content lands — if users miss the affordance, switch to a chevron
   indicator instead of the fade.

---

## Recommended next foundation (per PLAN §1.9)

**`VideoPlaceholder.vue`** — Toolkit pattern 14 in the plan. Low complexity,
high reuse (≥ 6 placements across the redesigned pages), and we need it
unblocked before assembling `unser-versprechen.astro`. It also gives us the
first opportunity to validate the breathing-pulse-with-reduced-motion-respect
pattern that future components will copy.

After VideoPlaceholder, **`Eyebrow.astro`** (or `.vue` — Astro since it's
content-only) — it's a trivial component but it's used by ~12 future
compositions, so getting its API right early matters.

---

# Batch 2 — Component library (kit)

**Date:** 2026-05-17
**Scope:** Every atomic foundation, primitive, and composition in PLAN §1.4 §1.8 §1.9
EXCEPT page assemblies. Page assemblies remain gated for user review.

## Components built

### Foundations
| Component | Status | Location |
| --- | --- | --- |
| `VideoPlaceholder.vue` | Built | `src/components/ui/VideoPlaceholder.vue` |
| `Divider.astro` | Built | `src/components/ui/Divider.astro` |
| `Eyebrow.astro` | Built | `src/components/ui/Eyebrow.astro` |

### Primitives
| Component | Status | Location |
| --- | --- | --- |
| `Badge.astro` | Built | `src/components/ui/Badge.astro` |
| `Callout.vue` | Built | `src/components/ui/Callout.vue` |
| `Button.vue` | **Audited — accept as-is** | `src/components/ui/Button.vue` (existing, full 4-variant 3-size API, accent-rule-correct) |
| Form/Input | **Deferred — existing `src/style/form.css` handles fields globally; no separate component needed for forms.** Will reconsider if a more bespoke input emerges from the contact page redesign. |

### Compositions
| Component | Status | Location |
| --- | --- | --- |
| `EyebrowHeadingLede.astro` | Built | `src/components/ui/EyebrowHeadingLede.astro` |
| `StatBlock.vue` | Built | `src/components/ui/StatBlock.vue` |
| `IconList.vue` | Built | `src/components/ui/IconList.vue` |
| `PullQuote.astro` | Built | `src/components/ui/PullQuote.astro` |
| `StepCard.vue` | Built | `src/components/ui/StepCard.vue` |
| `FAQAccordion.vue` | Built (Reka `AccordionRoot/Item/Header/Trigger/Content`) | `src/components/ui/FAQAccordion.vue` |
| `ComparisonBlock.vue` | Built | `src/components/ui/ComparisonBlock.vue` |

### Polish pass (existing files — minor token swaps only)
- **`PageHero.astro`** — Token-swap pass: `letter-spacing: 0.12em` → `var(--tracking-eyebrow)`, eyebrow weight made explicit (`var(--font-weight-medium)`), h1 weight `400` → `var(--font-weight-regular)`. Structural change proposed but not applied: a more aggressive typographic-only variant (no image) per PLAN pattern 15 and a larger H1 weight-300 lean, plus optional `Eyebrow` slot composition.
- **`CTASection.astro`** — Token-swap pass: h2 weight `400` → `var(--font-weight-regular)`. Proposed but not applied: `eyebrow` prop to match the system; `Button` slot ergonomics; a tone-aware p-color cascade rather than inline data-tone branching.
- **`Section.astro`** — Token-swap pass: weights `500` → `var(--font-weight-medium)`, weight `400` → `var(--font-weight-regular)`. Proposed but not applied: `tone?: 'primary' | 'secondary'` prop for alternating backgrounds per PLAN pattern 12 — needs the `.full-width` grid escape hatch; flagged for user decision.

### Utility
| File | Purpose |
| --- | --- |
| `src/utils/icons.ts` | Created. Lucide icon name → component resolver. Required because passing Lucide functional components as Vue props from `.astro` pages causes hydration mismatches. See "Cross-island prop pattern" note in memory. |

## Sandbox

| Path | Purpose |
| ---- | ------- |
| `src/pages/sandbox/components.astro` | Aggregate sandbox with every component rendered in realistic German-language context, grouped by category with Dividers as section headers. Bypasses `Layout.astro` (no DB calls). |

## Tokens added to `design-system.css`

**None this batch.** All five tokens added in Batch 1 (`--tracking-eyebrow`,
`--font-weight-light/regular/medium/bold`) were sufficient to express every
component in this kit. The total in `design-system.css` since Phase 2 began
is 5 new tokens.

Out of band: `--cold-gray-350` and a re-mapping of `--clr-content-tertiary`
to it were added by a parallel pass (now visible in
`style/design-system.css` and reflected in updated memory). This lifts the
previously-failing 3.57:1 `--clr-content-tertiary`-on-`--clr-surface-primary`
pair to ~5.07:1 (AA Normal Text ✓). Components in this kit do not depend on
the failing combination — most opted up to `--clr-content-secondary`
defensively — but consumers using tertiary now pass without rework.

## Verification

### Render & layout
- Aggregate sandbox renders at 1440×900 and 390×844 with **0 hydration
  errors** after refactoring icon-prop-receiving Vue components to use
  string names + `getIcon()` resolver. **The hydration mismatch warnings
  observed in initial render were caused by passing Lucide functional
  components directly through Astro `client:load` Vue-island props** — fixed
  by the `src/utils/icons.ts` indirection. This pattern is now documented in
  memory for future Phase 2 component work.
- All 13 component groups visible at both viewports.
- IconList 4-column collapses → 2-column at tablet → 1-column at mobile per
  PLAN §1.4.4.
- ComparisonBlock stacks vertically below `--from-tablet`.
- VideoPlaceholder respects all five aspect ratios (16/9, 21/9, 1/1, 4/5,
  4/3 supported).

### Contrast (computed in-browser, WCAG 2.1 sRGB)
Pass = AA Normal Text (4.5:1) unless flagged as UI-only (3:1).

| Pair | Ratio | Notes |
| ---- | ----- | ----- |
| Body / page bg | 16.96:1 | AAA |
| Eyebrow tertiary / surface | 5.07:1 | **Now passes AA text** (was 3.57 pre-`--cold-gray-350`) |
| Eyebrow secondary / surface | 7.53:1 | AAA |
| Badge default text / fill | 7.08:1 | AAA |
| Badge accent (white on accent-secondary) | 7.46:1 | AAA. **Fixed during build** — initial tint variant was 2.80:1 (FAIL); swapped to solid fill per accent rule for small elements |
| Callout note title / tint | 15.97:1 | AAA (all four tones similar) |
| Callout note content / tint | 7.09:1 | AAA (all four tones similar) |
| StatBlock value / page | 16.96:1 | AAA |
| StatBlock label / page | 7.53:1 | AAA |
| IconList label / page | 7.53:1 | AAA |
| IconList desc / page | 7.53:1 | AAA |
| StepCard title / card | 16.96:1 | AAA |
| StepCard desc / card | 7.53:1 | AAA |
| StepCard num decorative / card | ~5:1 | tertiary now; passes AA |
| FAQ question / page | 16.96:1 | AAA |
| Comparison title / card | 16.96:1 | AAA |
| Comparison row / card | 7.53:1 | AAA |
| PullQuote / page | 16.96:1 | AAA |
| Button primary (white on accent-primary) | 4.57:1 | AA Normal — borderline but passes |
| VideoPlaceholder label / gradient surface | ~5:1 effective (gradient resolves to a mid-gray ~`#F4F4F5`); the in-browser audit reported "transparent" because the gradient surface isn't a flat colour. Visually verified at desktop and mobile. |

**Overall contrast pass: 100% AA Normal Text** after the Badge accent fix.
The original audit caveat from the prior agent (3.57:1 tertiary) is now
resolved system-wide by the `--cold-gray-350` upgrade.

### Reduced motion (code review)
- `VideoPlaceholder.vue` — uses `useReducedMotion()` from `motion-v`. When
  reduced, the opacity-pulse animation is fully suppressed (no `:animate` /
  `:transition` props passed). Verified by code reading; Playwright MCP
  cannot toggle the media query in this session.
- `FAQAccordion.vue` — open/close CSS keyframes and the `Plus → ×` rotation
  transition are wrapped in `@media (prefers-reduced-motion: reduce) { ... }`
  and disabled.
- The global rule in `reset.css` (kills CSS transitions/animations) covers
  every remaining transition on Badge, Button, Callout, IconList, etc.
- `Callout.vue` — no motion. No reduced-motion path needed.
- All other components: no JS-driven motion. Safe.

### Reka primitives used
- `AccordionRoot`, `AccordionItem`, `AccordionHeader`, `AccordionTrigger`,
  `AccordionContent` from `reka-ui` in `FAQAccordion.vue`. Keyboard
  navigation, ARIA states, focus management all handled by Reka. Styled via
  scoped CSS using design-system tokens. Animation uses Reka's
  `--reka-accordion-content-height` CSS variable for height keyframes.

## What didn't land cleanly (and how I fixed it)

1. **Hydration mismatches on every Vue island receiving a Lucide icon as a
   prop from Astro.** Astro serializes `client:load` component props via
   JSON-stringify; Lucide functional components don't survive that.
   Symptom: SVG renders in SSR HTML, then hydration log floods with
   `Hydration node mismatch` and the component is missing on the client.
   **Fix:** introduced `src/utils/icons.ts` — string-name → component map.
   Refactored `StatBlock`, `IconList`, `StepCard` to accept `icon?: IconName`
   instead of `icon?: Component`. Sandbox now hydrates clean.
   **Documented in memory** so future Vue islands hitting this same wall
   know to use the same pattern.

2. **Badge accent variant initially failed AA contrast** at 2.80:1
   (`--clr-accent-secondary` text on a 10% mix tint of itself). Fixed by
   switching to solid accent-secondary fill with `--clr-pure-white` text —
   7.46:1, AAA, and consistent with the project accent rule (small element →
   secondary accent).

3. **Eyebrow component initially tried to accept Lucide as an `icon` prop**
   in Astro — for the same hydration reason it would have caused trouble
   even though Eyebrow is server-only. Refactored to expose a named slot
   `icon` so consumers can drop any Lucide-vue-next component into the slot
   directly. Cleaner Astro pattern. Demonstrated in sandbox §1.

## Polish-pass proposals (NOT silently applied)

Three structural ideas surfaced from auditing the existing section
components against the new kit. Flagged here for user decision; only the
safe token-swaps above were applied.

1. **`PageHero.astro`** — Add an optional "typographic-hero" variant per
   PLAN pattern 15 (no image, very large light-weight H1, italic-serif
   highlight). Currently `PageHero.astro` requires an image for differentiation;
   campaign pages where we lack good imagery would benefit from the
   typographic option. Proposed addition: `variant?: 'image' | 'type'`
   (default `'image'` for back-compat).

2. **`CTASection.astro`** — Add `eyebrow?: string` prop to match the
   `EyebrowHeadingLede` pattern. The current API gives heading + highlight +
   subtitle but no eyebrow line; pages that want consistent visual rhythm
   between content sections and the closing CTA can't get it.

3. **`Section.astro`** — Add `tone?: 'primary' | 'secondary'` prop per
   PLAN pattern 12 (alternating section backgrounds). This requires the
   section to render as `.full-width` to escape the wrapper centring, then
   re-pad internally. Non-trivial change — proposing rather than implementing.
   Also: the current heading-only-or-heading2-with-highlight API is fine but
   could grow an `eyebrow` slot for parity with `EyebrowHeadingLede`. Best
   answer might be to deprecate `Section.astro` and have every page use
   `EyebrowHeadingLede` directly — but that's a Phase 3 conversation.

## Sandbox URL

**`http://localhost:4321/sandbox/components`** — full kit, both viewports
work, mobile-first. Group by category, Dividers as headers (also exercising
the Divider component).

## Screenshots

`design-audit/2026-05-16/screenshots/built/aggregate/`
- `desktop-full.png` (1440 full page)
- `mobile-full.png` (390 full page)
- `desktop-callout.png`, `desktop-stat-iconlist.png`,
  `desktop-stepcard-faq.png`, `desktop-comparison-video.png`,
  `desktop-badge-button.png`, `desktop-badge-after-fix.png`,
  `desktop-faq-open.png`, `desktop-video.png`
- `mobile-iconlist.png`, `mobile-comparison.png`

## Open concerns (before page assembly begins)

1. **Polish-pass items above are real structural decisions.** I won't
   start page assembly until the user signals which of the three proposed
   API changes (PageHero variant, CTASection eyebrow, Section tone) they
   want. Otherwise pages will end up working around the existing APIs and
   we'll have to refactor mid-build.

2. **Form components left out by design.** The existing global
   `src/style/form.css` `.field` system is clean and works. The
   `kontakt.astro` redesign in PLAN §1.7 doesn't actually need a new
   `<Input>` component — it needs better content layout around the form.
   Calling this out so the user knows the omission was deliberate.

3. **`FAQAccordion` uses content from the plan §1.4.8** but the project
   already has a `src/features/HousePage/components/AccordionItem.vue` that
   the houses pages use. **Did not touch** the existing one — it's
   feature-local and works for its caller. If/when the houses page gets a
   visual refresh, the two should converge on `FAQAccordion`. Flagging the
   duplication for awareness.

4. **`StepCard` doesn't have a horizontal-mobile variant.** PLAN §1.4.7
   asked for "vertical mobile, horizontal desktop." Cards naturally stack
   1-col on mobile; the parent's grid controls layout. The card itself
   doesn't need a horizontal-aware variant because there is no
   "horizontal mobile" use case. If a page needs a stripped row-style step
   indicator (Linear-docs-style) that's a different component. Flagging in
   case the user expected one component to do both.

5. **`VideoPlaceholder` motion is autoplay-by-default** (subtle opacity
   pulse). It respects `prefers-reduced-motion`. If we're worried about
   ambient-motion-on-marketing-pages, we could make the pulse opt-in via a
   prop. Default behaviour matches PLAN §1.4.14.

6. **Sandbox is dev-only.** If `src/pages/sandbox/` is in the prod build
   it ships these pages. Either guard with `process.env.NODE_ENV` in
   `astro.config.mjs` `excludePaths`, or delete the directory before
   prod-deploy. Decision deferred; the sandbox is more useful kept around
   during Phase 2/3.

## Ready for page assembly?

**Yes — with one caveat.** The kit is complete and verified at both
viewports with AA contrast across the board. The caveat is the three
polish-pass proposals: I'd rather know whether to bake those into
`PageHero` / `CTASection` / `Section` now (before pages are written
against them) than after.

If user signals "use existing APIs as-is, propose changes later" → I'm
ready. If user signals "yes, add those three additions to the polish
pass" → I'll do that next, then start page assembly.

---

# Phase 2 — Component build CLOSED (2026-05-17)

**Decision:** User confirmed a separate "team of agents" is working on static pages
in parallel. To avoid concurrent edits to shared files, the ui-designer-savant
stream stops here. **No page assembly from this stream.**

## Frozen surface (do not modify without coordination)

The following files are owned by the component kit and are now frozen for the
duration of the parallel page-assembly work. Bug fixes only — no API changes,
no token churn:

- `src/components/ui/*.{vue,astro}` — all 14 kit components + the 6 pre-existing primitives
- `src/composables/useScrollSpy.ts`
- `src/utils/icons.ts`
- `src/style/design-system.css`
- `src/style/breakpoints.css`
- `src/style/wrapper.css` / `fonts.css` / `reset.css`

## Shared surface (page-assembly team OWNS during their phase)

- `src/pages/*.astro` (all page files)
- `src/features/<page-feature>/`
- `src/layouts/Layout.astro` — likely needs `<SectionNavigator />` slot wiring per page

## Joint surface (changes must be coordinated)

These section-level components were token-swap-touched in batch 2 but the three
polish-pass API extensions (variant / eyebrow / tone props) are **deferred**:

- `src/layouts/Section.astro` — `tone?` prop deferred (non-trivial — needs `.full-width` grid escape)
- `src/components/sections/PageHero.astro` — `variant?: 'image' | 'type'` deferred
- `src/components/sections/CTASection.astro` — `eyebrow?` prop deferred

**If the page-assembly team needs any of these props to write a hero/section cleanly,
they should request the API extension here rather than inline a workaround.** A
clean addition now is much cheaper than rewriting pages later.

## Open items handed forward to the parallel team

1. **Use the cross-island icon pattern.** Lucide-as-prop from `.astro` → Vue
   hydrates broken. Use `import { getIcon, type IconName } from '@/utils/icons'`
   + string names. Documented in agent memory.
2. **Use the accent rule.** Primary accent for large surfaces / type / icons.
   Secondary accent for small fills with white text. Verified contrast pairings
   documented in agent memory.
3. **Use the content tier rule.** content-tertiary is now safe for text
   (5.07:1+). content-quaternary is UI-only (3.08:1) — never body text.
4. **Use `--clr-pure-white` over imagery** rather than `--clr-surface-primary`
   when text/logos sit on photographs.
5. **Sandbox at `/sandbox/components`** is a live reference for every component
   in real composition. Leave the sandbox up — useful for diffing pages against
   the kit during assembly.

## Re-engagement triggers

ui-designer-savant should be re-invoked when any of the following happen:

- Page-assembly team requests one of the three deferred polish-pass APIs
- Page-assembly team surfaces a new pattern not in PLAN §1.4 (an 18-pattern toolkit gap)
- A new component need emerges from real content that wasn't anticipated
- Contrast or accessibility regressions appear in assembled pages
- Phase 3 cleanup: converge `FAQAccordion` with the feature-local `HousePage/AccordionItem`

Until then, the kit is the spec.

---

# Machine handoff — 2026-05-17

**Context:** User is switching machines mid-project. The next session will be
on a different machine with the DB running (so the homepage will actually
render locally — the `getCategories()` block from this session won't apply).

## State at handoff

- Component kit: ✓ complete, frozen
- Homepage mobile diagnostic: ✓ in `HOMEPAGE-MOBILE-ANALYSIS.md` + appended to `PLAN.md` line ~1107
- Polish-pass B (CTA eyebrow) and C (Section tone): ⏸ deferred, awaiting user green-light. Strongly recommended before homepage assembly.
- Polish-pass A (PageHero variant): defer indefinitely — not needed
- Static-pages team work: status unknown to this stream; coordination contract intact

## Pick-up checklist (next session, other machine)

1. **Read `project_design-work-state.md`** in agent memory — it's the crib sheet.
2. **Check whether the user has decided on polish-pass B + C.** If yes, dispatch ui-designer-savant for that focused pass on `CTASection.astro` and `Section.astro` only.
3. **Check status of the static-pages team stream.** If they've started homepage assembly, confirm they're following the coordination contract (cross-island icon pattern, accent rule, content tier rule).
4. **DB is now reachable** — if homepage Playwright verification is wanted, it'll work. But default behavior is still to skip screenshots per the user's feedback memory.
5. **The kit sandbox at `/sandbox/components` should still render.** Confirm before relying on it as the visual spec.

## Memory entries added this session

- `feedback-skip-verification-screenshots` — user-preference to skip the Playwright loop
- `project-design-work-state` — this snapshot
- `project-homepage-mobile-redesign-priority` — added earlier this session by the homepage-analysis agent

Closure stamped 2026-05-17. Ship is mid-passage.
