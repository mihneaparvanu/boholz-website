# Landing Pages — Build Plan

**Date:** 2026-05-17
**Scope:** Three campaign landing pages derived from `old-design/*.jpg`
**Routes:** `/landing/uebersicht`, `/landing/mehrfamilien`, `/landing/bungalow`

## User decisions (confirmed)

- Three SEPARATE landing pages — the existing homepage at `src/pages/index.astro` is untouched.
- Route shape: `/landing/<slug>` (German slug, umlaut-normalised).
- House showcase: live DB filtered by category + `isFeatured` (uses the existing `getModels()` loader, filtered in-page).
- Imagery: real R2 assets for the hero, `VideoPlaceholder` / `ImagePlaceholder` for mid-page lifestyle frames the user hasn't shot yet.

## Section → component mapping (all 3 pages share this skeleton)

| Old-design beat | Section component | Notes |
| --- | --- | --- |
| Hero with photo + 2 CTAs | `sections/PageHero.astro` or `HeroOverlayCard.astro` | Real R2 image; "Angebot anfordern" + "Katalog erhalten" |
| 4-card "Ihre Vorteile" pastel row | `sections/BenefitsRow.astro` | Already has 4 tones; tone-per-card already in API |
| 3-house "Welche Häuser gibt es?" row | `sections/HouseModelsCarousel.vue` or `HouseModelsGrid.astro` | Filter `getModels()` by category + isFeatured |
| Full-bleed lifestyle photo | `sections/ImageBand.astro` | Mid-page lifestyle = placeholder for now |
| "Für wen geeignet?" 4-row icon list | `sections/AudienceBlock.astro` | Page-specific audience copy |
| Nachhaltigkeit / sustainability narrative | `sections/FeatureSpotlight.astro` or `TwoColumn.astro` | Real R2 image (sustainability/KfW) |
| Dark-green "Langjährige Erfahrung" trust strip + testimonials | `sections/TestimonialBand.astro` | Dark surface, 3 quote cards |
| FAQ "Wir sind hier um all Ihre Fragen zu beantworten" | `ui/FAQAccordion.vue` inside Section | Reuse `qaCategories` or page-specific |
| Inline lead-capture form | `sections/LeadFormBand.vue` | Pre-select `interestOptions` per page |
| Footer "Bereit für Ihr Traumhaus?" CTA strip | `sections/CTASection.astro` | Tone varies per page |

## Frozen surface (do NOT modify during this phase)

- `src/components/ui/*` — full kit
- `src/components/sections/*` — all 30+ section components
- `src/style/design-system.css`, `breakpoints.css`, `wrapper.css`
- `src/layouts/Layout.astro`, `Section.astro`, `Navbar/`, `Footer/`

## Files to create

```
src/features/Landing/
  landing.types.ts            — shared LandingPage content shape
  uebersicht.content.ts       — Page 1 content
  mehrfamilien.content.ts     — Page 2 content
  bungalow.content.ts         — Page 3 content

src/pages/landing/
  uebersicht.astro            — canonical (Phase 1)
  mehrfamilien.astro          — Phase 2
  bungalow.astro              — Phase 2
```

## Phase plan

**Phase 1** (single ui-designer-savant agent, sequential):
1. Read all section components actually used + the 3 old-design jpegs
2. Build `landing.types.ts` shape
3. Write content files for ALL 3 pages (text + audience + benefits + lifestyle slots)
4. Build canonical `landing/uebersicht.astro` composing sections in the order above
5. Verify desktop 1440 + mobile 390 render
6. Hand off contract for Phase 2: where to pattern-match, what differs per page

**Phase 2** (2 parallel ui-designer-savant agents):
- Agent A: `landing/mehrfamilien.astro` — pattern-match Page 1, swap content, audience-specific lifestyle photo / accent
- Agent B: `landing/bungalow.astro` — same pattern, bungalow content

## Style guardrails (from PLAN + frozen kit + CLAUDE.md)

- No new Lucide imports outside `src/utils/icons.ts` resolver — pass string `IconName` props
- One accent rule: `--clr-accent-primary` for large surfaces / type / icons; `--clr-accent-secondary` for small fills with white text
- Breakpoints via `@custom-media` tokens only; no pixel media queries
- `content-tertiary` is now safe for text (~5.07:1); `content-quaternary` is UI-only
- `--clr-pure-white` for text over photos (not `--clr-surface-primary`)
- No BEM — short semantic classes (`.head`, `.card`, `.active`); state via `[data-state]` or chained selectors
