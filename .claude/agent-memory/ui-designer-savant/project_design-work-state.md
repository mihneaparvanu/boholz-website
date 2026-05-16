---
name: project-design-work-state
description: Snapshot of the design-system / component-build / page-redesign work as of 2026-05-17 — phase status, deferred items, next decisions, where to pick up
metadata:
  type: project
---

Snapshot as of **2026-05-17, end of session before user machine-switch**.
Updates this memory when phase status or open decisions change. The full
narrative lives in `design-audit/2026-05-16/EXECUTION-LOG.md` and
`design-audit/2026-05-16/PLAN.md`; this is the read-on-resume crib sheet.

## Phase status

| Phase | Status |
| --- | --- |
| **Phase 1** — Audit + Plan (PLAN.md §0–§1.10) | ✓ Complete |
| **Phase 2.0** — SectionNavigator + scrollSpy + 5 named tokens | ✓ Complete |
| **Phase 2.0b** — Contrast fix (`--cold-gray-350`, content-tier remap) | ✓ Complete |
| **Phase 2.1** — Component kit (13 net-new + 3 token-swap polish on existing sections) | ✓ Complete |
| **Phase 2.2** — Polish-pass API extensions + comprehensive taste pass | ✓ **Complete (Batch 3, 2026-05-17 evening)** |
| **Phase 3** — Page assembly (the four landing pages + the homepage) | 🔄 In progress — Wave 2a (homepage) ✓ complete 2026-05-17 |
| **URGENT** — Homepage mobile redesign | ✓ **Shipped (Wave 2a, 2026-05-17).** Full restructure executed against HOMEPAGE-MOBILE-ANALYSIS.md spec; see HOMEPAGE-REDESIGN-EXECUTION.md for the file-by-file change log + deviations + real copy strings. 0 astro-check errors. |

## Frozen surface (do not modify without coordination)

- `src/components/ui/*.{vue,astro}` — all 14 kit components + 6 pre-existing primitives
- `src/composables/useScrollSpy.ts`
- `src/utils/icons.ts`
- `src/style/*.css`

See [[coordination-with-pages-team]] for the full frozen / joint / pages-team-owned zone map.

## What the kit contains (the spec for page assembly)

Foundations: `SectionNavigator.vue`, `VideoPlaceholder.vue`, `Divider.astro`,
`Eyebrow.astro`
Primitives: `Badge.astro`, `Callout.vue`, `Button.vue` (pre-existing, audited)
Compositions: `EyebrowHeadingLede.astro`, `StatBlock.vue`, `IconList.vue`,
`PullQuote.astro`, `StepCard.vue`, `FAQAccordion.vue`, `ComparisonBlock.vue`,
`DefinitionList.astro`
Section primitives (joint surface — token-swap polish applied, structural
extensions deferred): `PageHero.astro`, `CTASection.astro`, `Section.astro`
Utility: `src/utils/icons.ts` (cross-island icon name resolver)
Sandbox: `src/pages/sandbox/components.astro`

## Open decisions waiting for the user

**Polish-pass A — `PageHero.astro` gets `variant?: 'image' | 'type'`**
- Need: Pure typographic hero for pages with no good imagery (campaign pages)
- Status: Still deferred — not needed for homepage; add when a campaign page actually wants it.

**Polish-pass B — `CTASection.astro` gets `eyebrow?: string`** — ✓ **Shipped Batch 3**.
**Polish-pass C — `Section.astro` gets `tone?: 'primary' | 'secondary'`** — ✓ **Shipped Batch 3** with `.full-width` grid escape.

See Batch 3 in `design-audit/2026-05-16/EXECUTION-LOG.md` for the
comprehensive polish-pass changelog: SectionNavigator alignment + tracking
tightened, Button mobile padding-block restructured (min-height +
padding-block), eyebrow → heading rhythm boosted system-wide
(`--spacing-3` → effective `--spacing-4` via margin-block-end on the
eyebrow), StepCard head re-aligned (baseline → center), Badge asymmetric
padding gated by `:has(.icon)`, FAQ trigger `min-height: 44px`, sandbox
VideoPlaceholder kebab→camelCase fixes.

## Re-engagement triggers for this agent (ui-designer-savant)

See [[coordination-with-pages-team]]. Re-engage when:
- Pages team surfaces an 18-pattern toolkit gap (PLAN §1.4)
- New component need emerges from real content
- Contrast or a11y regressions appear in assembled pages
- A page actually needs PageHero `variant: 'type'`
- Phase 3 cleanup: converge `FAQAccordion` with feature-local `HousePage/AccordionItem`

## Hand-offs the next session should remember

1. **Skip screenshots by default** — see [[feedback-skip-verification-screenshots]].
2. **Cross-island icon prop pattern is mandatory** — see [[style-system-tokens]] "Cross-island prop pattern" section.
3. **Accent rule encoded** — see [[feedback_accent_application]].
4. **Content tier rule encoded** — `--clr-content-tertiary` is text-safe (5:1+), `--clr-content-quaternary` is UI-only (3:1).
5. **Sandbox at `/sandbox/components`** is the canonical visual spec for the kit.
6. **Homepage uses a local `HomeSection.astro`** (eyebrow + anchor id + tone) instead of the kit `<Section>` — kit Section is untouched, but other static pages may want the same pattern. If three pages independently need eyebrow-on-Section, lift HomeSection to the kit as `Section.eyebrow?` polish-pass D.
7. **Homepage Faq uses a local `FaqAccordion.vue`** (Reka + v-html for `qa.ts` HTML bodies) instead of kit `<FAQAccordion>` (text-only). Convergence already tracked as a Phase 3 cleanup item; HousePage's own accordion is the other half.

## Key files for re-entry

- `design-audit/2026-05-16/PLAN.md` — original plan + URGENT homepage section at line ~1107
- `design-audit/2026-05-16/HOMEPAGE-MOBILE-ANALYSIS.md` — full homepage diagnostic
- `design-audit/2026-05-16/EXECUTION-LOG.md` — running log of everything built; closure stamp at the bottom
- `src/style/design-system.css` — token authority (post-fix as of 2026-05-17)
