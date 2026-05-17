---
name: landing-pages-archetype
description: Shape, file layout, and section composition of the /landing/* campaign pages (Phase 1 canonical = uebersicht; Phase 2 = mehrfamilien, bungalow)
metadata:
  type: project
---

Built 2026-05-17 — `/landing/uebersicht` is the canonical template. Pages 2
and 3 (`mehrfamilien`, `bungalow`) pattern-match it: same section order, same
loaders, swap only the imported content module + preferred-category
fallback. Plan lives in `design-audit/2026-05-16/LANDING-PAGES-PLAN.md`.

## Files

- `src/features/Landing/landing.types.ts` — shared `LandingPageContent`
  shape. Re-exports `Benefit`, `AudienceItem`, `Testimonial`,
  `CredentialBadge`, `ContactInfo`, `InterestOption`, `FAQItem` from the
  section components so a content file imports only from `landing.types.ts`.
- `src/features/Landing/{uebersicht,mehrfamilien,bungalow}.content.ts` —
  typed `LandingPageContent` modules, German copy, one per page.
- `src/pages/landing/uebersicht.astro` — canonical page. Phase-2 agents
  duplicate this and swap the content import + the preferred-category
  slug used for the hero photo lookup.

## Section composition (top → bottom)

1. **PageHero** — full-bleed (`<div class="full-width">`), 2 Buttons via
   `slot="actions"`.
2. **BenefitsRow** — 4 cards (tuple-typed for safety).
3. **HouseModelsCarousel** (live DB) — frontmatter does `getModels()`,
   filters `isFeatured` + `category.slug ∈ content.houses.categorySlugs`
   (or no filter when `null`), caps at `maxItems`, maps to
   `HouseModelCardProps` via local `specsFor` / `priceHintFor` /
   `imageFor` helpers.
4. **ImageBand** — full-bleed lifestyle strip (it's already
   `.full-width` internally, no wrapping div needed).
5. **AudienceBlock** + a CTA pair pinned beneath (mirrors old JPEG).
6. **TwoColumn** — sustainability narrative; paragraphs render in the
   default slot, optional CTA in `slot="actions"`.
7. **TestimonialBand** — full-bleed dark olive band, 3 quotes + badges.
8. **FAQAccordion** — wrapped in `<div class="faq-wrap">` (max-width
   56rem so answers wrap tight).
9. **LeadFormBand** — full-bleed pastell band, pre-selected interest
   options per page.
10. **CTASection** — wrapped in `<div class="full-width">`.

## Per-page customisation hooks

- `content.hero.preferredCategorySlug` — frontmatter looks up an
  `isFeatured` model in this category and uses its `isHero` media as
  the hero photo. Falls back to `content.hero.imageFallbackPath`.
- `content.houses.categorySlugs` — array or `null`. `null` =
  every featured model. Use specific slugs to narrow to a typology.
- `content.closingCta.tone` — `surface` for the broad page,
  `accent` (deep blue) for the focused/conversion-heavy page
  (bungalow uses this).
- `content.leadForm.interestOptions` — per-page-relevant select options.

## Hero image fallback chain

DB hero (preferred category, isFeatured, isHero media) → static
`imageFallbackPath` resolved through `getMediaURL()`. Documented static
paths use the `images/pages/<slug>/...` R2 convention. The user has
local source files for `bungalow-hero.webp`, `mehrfamilien-hero.webp`,
`ubersicht-hero.webp` in `1-Branding/Images/` not yet uploaded —
flagged in `r2-image-curator/project_missing_images.md`. When those
upload, swap the `imageFallbackPath` strings.

## Frozen surface respected

No new section components were created. No tokens were added. The
`@/utils/icons.ts` resolver was used as-is. Icons referenced from the
content files: `leaf, pencil, zap, key-round, layers, building-2,
shield, smartphone-nfc, compass, users, heart-handshake, trending-up` —
all already in the union.

## Phase-2 handoff

To build `mehrfamilien.astro` / `bungalow.astro`:
1. Copy `uebersicht.astro` verbatim.
2. Swap the one content import line (`uebersichtContent` →
   `mehrfamilienContent` or `bungalowContent`).

That's it — pure content swap. All section intros (including the one
above `BenefitsRow`) come from the content file via
`LandingPageContent.benefitsIntro` (added 2026-05-17). No strings are
hardcoded in the page template.
