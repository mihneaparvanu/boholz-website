---
name: feedback_button_mobile_width
description: Global Button mobile rule = width 100%; inline call sites must opt out and parent action rows must stack on mobile
metadata:
  type: feedback
---

`src/components/ui/Button.vue` applies `width: 100%` to every `.btn` under `@media (--mobile)`. Client wants every mobile button at the same visual width so labels of different lengths read consistently.

**Why:** confirmed 2026-05-18 (mobile polish pass) — mixed-label buttons with intrinsic widths created uneven row weight on mobile that the client wanted gone.

**How to apply:**
- Any new inline button row on a page wrapper must add `@media (--mobile) { flex-direction: column; align-items: stretch; width: 100% }` to its `.actions` (or equivalent) container. PageHero.astro, CTASection.astro, Block.astro already do this — copy the pattern.
- Inline navbar / toolbar CTAs that must stay intrinsic-width on mobile (e.g. Katalog button next to a hamburger trigger) opt out with `.bar .cta { width: auto; flex-shrink: 0 }` at the parent's scope (higher specificity than `.btn`).
- LeadFormBand and other single-button surfaces are fine — one button at full width is the correct behavior.

Related: [[style-system-tokens]] (breakpoint token reference).
