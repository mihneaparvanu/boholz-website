---
name: uber-uns-keitel-section
description: Keitel section restructure on /uber-uns — pair-grid principles + StatBlock financial callout; new structured exports in keitel.ts
metadata:
  type: project
---

2026-05-26 — restructured `<section id="keitel">` in `src/pages/uber-uns.astro`
to surface two pieces of editorial content that were previously buried in prose:

**Principles block** — four "X vor Y" pairs (Qualität/Quantität,
Individualität/Standardlösungen, Umfassende Beratung/Überredung,
Transparente Baubeschreibung/Kleingedrucktem) rendered as a local 2-up
typographic pair-grid (1-up mobile). Hairlines-only, primary term in
`--fs-h4` medium, "vor X" counterpoint in body size at tertiary tone with
serif-italic "vor" connector. Mirrors `PrinciplesGrid.astro`'s hairline
discipline so the two blocks share a visual language on the same page.
Lives as scoped `.principles` / `.principle` CSS in the page — not promoted
to `ui/sections/` because the "X vor Y" form is too specific to this page.

**Financial callout** — reuses `StatBlock.vue` (`100 %` / `Eigenmittel` /
caption) with `shield` icon, centred, framed by hairlines top + bottom
(no card, no fill). Sits between principles and outro prose as its own beat.

**Why not ComparisonBlock:** structurally wrong — assumes two parallel
multi-item lists with check/X markers. Our principles are four atomic
dualistic statements where the form itself IS the comparison.

**Why not PrinciplesGrid:** already used directly above in the same section
for the four service steps. Repeating would feel mechanical.

**Pull quote dropped:** the previous `uberUnsKeitelPullQuote` echoed 3 of
the 4 principles in compressed form; once the principles render properly,
the quote is redundant. The string is still in `keitel.ts` (other pages may
import it; see [[style-system-tokens]] for the project pattern of keeping
historical exports).

**Data restructure in `src/features/faq/keitel.ts`:**
- Added `keitelPrinciples: readonly KeitelPrinciple[]` with `{ primary, counter }`.
- Added `keitelFinancial: KeitelFinancial` with `{ value, label, caption }`.
- Added `uberUnsKeitelIntroProse[]` (2 short paragraphs preceding principles).
- Added `uberUnsKeitelOutroProse[]` (1 closing paragraph before video).
- Kept `uberUnsKeitelProse[]` and `uberUnsKeitelPullQuote` strings intact for
  backwards compatibility (grep at restructure time showed no consumers
  outside this page, but defensive non-removal per project convention).

Final section flow:
EyebrowHeadingLede → intro prose (2 paragraphs) → principles 2×2 →
financial callout (StatBlock) → outro prose → video.
