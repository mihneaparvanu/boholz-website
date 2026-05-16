---
name: coordination-with-pages-team
description: Coordination protocol when a parallel agent stream is assembling static pages — what to touch, what to freeze, when to re-engage
metadata:
  type: project
---

A separate "team of agents" is (or has been) working on static-page assembly in
parallel with the ui-designer-savant kit-build stream. Both touch the same repo.

**Why this exists:** concurrent edits to `PageHero.astro`, `CTASection.astro`,
`Section.astro`, and `src/style/design-system.css` will conflict. Same with
adding props to a shared component while pages are being written against
its current API.

**How to apply:** Before starting any work in this repo, check whether a
page-assembly stream is active. If yes, restrict edits to the "frozen surface"
contract below and request API changes via the user rather than applying them
silently.

## Frozen surface (component-kit-owned; do not modify mid-assembly)

- `src/components/ui/*.{vue,astro}` — all 14 kit components + 6 pre-existing primitives
- `src/composables/useScrollSpy.ts`
- `src/utils/icons.ts`
- `src/style/design-system.css` (tokens including `--cold-gray-350` and the post-fix content tiers)
- `src/style/breakpoints.css`, `wrapper.css`, `fonts.css`, `reset.css`

Bug fixes are OK if API-preserving. **New props, new components, new tokens are not** — they create version skew with whatever the page-assembly team is consuming.

## Page-assembly-team-owned surface

- `src/pages/*.astro` (all pages)
- `src/features/<page-feature>/`
- `src/layouts/Layout.astro` (likely needs SectionNavigator wiring per page)

Stay out of these while the parallel stream is active.

## Joint / coordinate-explicitly surface

- `src/layouts/Section.astro` — has a `tone?: 'primary' | 'secondary'` proposal pending
- `src/components/sections/PageHero.astro` — has a `variant?: 'image' | 'type'` proposal pending
- `src/components/sections/CTASection.astro` — has an `eyebrow?` prop proposal pending

If a polish-pass API change is needed, request user approval before applying.

## Hand-offs to give the page-assembly team

When briefing the page-assembly stream (or when the user briefs them on the kit's behalf):

1. Cross-island icon pattern: `import { getIcon, type IconName } from '@/utils/icons'` — Lucide-as-prop from `.astro` → Vue hydrates broken. See [[style-system-tokens]] §"Cross-island prop pattern".
2. Accent rule: primary accent on large surfaces; secondary accent (deep blue) on small white-text fills. See [[feedback_accent_application]].
3. Content tier rule: tertiary is safe for text post-fix (5.07:1+); quaternary is UI-only (3.08:1+) — never body text. See [[style-system-tokens]] "Content (post-2026-05-17 contrast fix)".
4. Use `--clr-pure-white` for text/logos over imagery; `--clr-surface-primary` is warm off-white.
5. Sandbox at `/sandbox/components` is the live spec.

## Re-engagement triggers (when to come back)

- Page-assembly team requests a deferred polish-pass API extension
- Page-assembly team surfaces a pattern gap not in PLAN §1.4
- A new component need emerges from real content
- Contrast / a11y regressions appear in assembled pages
- Phase 3 cleanup: converge `FAQAccordion` with feature-local `HousePage/AccordionItem`

Until any of those happen, the kit is the spec — don't pre-emptively expand it.
