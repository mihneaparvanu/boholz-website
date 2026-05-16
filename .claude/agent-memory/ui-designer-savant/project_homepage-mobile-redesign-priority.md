---
name: project-homepage-mobile-redesign-priority
description: Homepage mobile redesign is the top user-flagged priority as of 2026-05-17 — outranks campaign-page reworks when the static-pages team picks next
metadata:
  type: project
---

Homepage mobile redesign (`src/pages/index.astro`) is the top user-flagged priority as of
2026-05-17.

**Why:** the user finds the current mobile experience falls short of the brand's premium
intent and is more critical than the campaign-page redesigns or the longer content pages
(`unser-versprechen.astro` etc.). They flagged it as URGENT and asked specifically for the
diagnostic + restructure proposal to be appended to the existing PLAN.

**How to apply:**
- When the static-pages team asks "which page should I do next?", this one outranks the
  other static pages even though the original PLAN §1.7 used `unser-versprechen.astro` as
  the canary.
- When re-engaging the kit (this stream), the homepage's needs come first: any new
  components or token additions surfaced by homepage work jump the queue.
- The full diagnostic + restructure lives at
  `design-audit/2026-05-16/HOMEPAGE-MOBILE-ANALYSIS.md`.
- The PLAN.md has an `## URGENT — Homepage mobile redesign` section appended at the bottom
  with the section-by-section change table + dependencies.

**Top mobile problems the redesign fixes (in priority order):**
1. No on-page wayfinder across 6 sections — solved by wiring the already-built
   `SectionNavigator`.
2. Five `OverviewCard`s carry the same LOREM body (real content debt, visible on prod).
3. Three `TrustBadge`s stack as three repetitive Card surfaces — `StatBlock` is denser
   and more typographic.

**Key swaps proposed:**
- `TrustBadges` (3 Cards) → 3 `StatBlock`s
- `Overview` (5 LOREM Cards) → 1 Featured + 4 `IconList` rows + real copy
- `BuildingStages` 75dvh hero on mobile → 50dvh cap + drop 2 empty `ImagePlaceholder` cells
- `Faq` vertical-stacked category buttons → horizontal pill row
- Add `CTASection` at end (page currently ends abruptly at FAQ)
- Add `Eyebrow` to every section

**Deferred polish-pass props now soft-blocking:**
- `CTASection.eyebrow?` — closing CTA loses rhythm without it
- `Section.tone?: 'primary' | 'secondary'` — alternating tones would break the six-uniform
  Section.astro padding rhythm
- (`PageHero.variant: 'type'` is NOT needed for homepage — hero stays photographic)

**Open environment caveat:** the homepage's `getCategories()` Drizzle loader currently
fails in the local dev tree, so I produced the analysis from source (no homepage
screenshots this round). When the DB is reachable, re-shoot at 390×844 under
`screenshots/homepage-mobile/`.

See related: [[coordination-with-pages-team]], [[style-system-tokens]],
[[feedback_accent_application]].
