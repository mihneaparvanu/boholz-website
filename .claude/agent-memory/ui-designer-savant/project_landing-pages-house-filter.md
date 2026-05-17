---
name: landing-pages-house-filter
description: Landing-page house showcase filter contract — featuredOnly flag, uncap pattern, mehrfamilien slug truth
metadata:
  type: project
---

`LandingHouseShowcase` (in `src/features/Landing/landing.types.ts`) exposes three filter knobs the three landing pages share. All three pages have an identical filter expression in their frontmatter — diverge only by content.

- `categorySlugs: string[] | null` — `null` means every category.
- `featuredOnly?: boolean` (default `true`) — bestseller gate. Overview-style pages leave it on; typology pages (bungalow, mehrfamilien) set `false` so the audience that has already self-selected sees the full sub-catalogue.
- `maxItems: number` — set to `99` as the "effectively uncapped" signal when the page should render every match.

Page filter expression (canonical, identical across all three landing pages):

```ts
const featuredOnly = content.houses.featuredOnly ?? true;
const filteredModels = allModels
  .filter((m) => (featuredOnly ? m.isFeatured : true))
  .filter((m) =>
    content.houses.categorySlugs === null
      ? true
      : content.houses.categorySlugs.includes(m.category?.slug ?? ""),
  )
  .slice(0, content.houses.maxItems);
```

**Why:** content owns intent, page stays generic. New landing pages copy the canonical frontmatter and never touch the filter.

**How to apply:** when adding a new landing page or category gate, never inline a literal `m.isFeatured` — always route through `content.houses.featuredOnly ?? true`. If a future page needs a more exotic filter, surface it as another optional field on `LandingHouseShowcase`, don't fork the page.

**Mehrfamilien slug truth (2026-05-17):** the DB has no `mehrfamilienhaus` category. The closest match for the "Mehrfamilien" campaign is `["doppelhaus", "generationenhaus"]` (3 + 2 = 5 models). `mehrfamilien.content.ts` previously referenced `mehrfamilienhaus` and `hero.preferredCategorySlug` still does (the hero-image lookup misses gracefully and falls back to the static R2 asset — non-fatal, but worth fixing when a real MFH category lands or the hero is reshot).

Related: [[landing-pages-archetype]].
