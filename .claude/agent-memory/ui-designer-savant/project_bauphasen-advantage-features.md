---
name: bauphasen-advantage-features
description: Two new feature folders wired with R2 imagery 2026-05-17 — Bauphasen (3-phase narrative, shared homepage strip + dein-zuhause) and Advantage (Holzfaserdämmung sommer/winter, Wandaufbau ECO Nature/Plus, Nachhaltigkeit lite-YouTube)
metadata:
  type: project
---

Wired R2 imagery on 2026-05-17 for the build-phases narrative and the
"advantage" content (Holzfaserdämmung, Wandaufbau, Nachhaltigkeit).

## New feature folders

**`src/features/Bauphasen/`** — shared between homepage strip and `/dein-zuhause`.
- `bauphasen.types.ts` — `BuildPhase { slug, title, description, teaser, icon, imageURL }`.
- `bauphasen.content.ts` — three phases with verbatim StepCard copy (`description`) + shorter `teaser` for the homepage strip + `bauphasenHeroImageURL` for `/dein-zuhause` hero swap.
- `BauphasenStrip.vue` — compact 3-up card row; optional `linkBaseHref` makes each card a link to `/dein-zuhause#phase-<slug>`. Hover lifts image (scale 1.02) and shifts title to accent-secondary.

**`src/features/Advantage/`** — content shapes + components for advantage subsections.
- `advantage.types.ts` — `FeatureCard { eyebrow, title, lede?, bullets[], imageURL, imageAlt, icon? }`.
- `FeatureCardPair.vue` — side-by-side two-card layout with optional `accent: "left" | "right" | "none"`. Active card gets a tinted border (color-mix with `--clr-accent-secondary`) and accent-tinted eyebrow + checkmarks. Used by Holzfaserdämmung (sommer/winter, no accent) and Wandaufbau (ECO Nature / Plus, accent="right").
- `LiteYouTube.vue` — lazy-loaded YouTube embed. Idle state: button with poster image + glass-chip play affordance. On click, swaps to `<iframe src="...?autoplay=1">`. Warms the YouTube preconnect on hover/focus/touch. Honours `prefers-reduced-motion`.

## Page changes

**`src/pages/index.astro`** — added `bauphasen` entry to `homeSections` in `home.content.ts` (id `bauphasen`, eyebrow "Bauphasen"). Inserted `<Section tone="secondary">` with `<BauphasenStrip>` between Overview and Ausbaustufen. Flipped Ausbaustufen from `tone="secondary"` to `tone="primary"` to preserve alternation cadence.

**`src/pages/dein-zuhause.astro`** — swapped hero image from local `/images/pages/dein-zuhause/hero-bauen.jpg` to `bauphasenHeroImageURL` (`/images/content/bauphasen/hero.webp`). Wrapped each StepCard in `<article id="phase-<slug>" class="phase">` with an above-card image (`.phase-frame`, 4:3 aspect ratio). Did NOT mutate StepCard — the image-above-StepCard composition lives entirely in the page consumer.

**`src/pages/unser-versprechen.astro`** — added three subsections of imagery:
1. **Nachhaltigkeit (existing #04)** — added a `.media-pair` (hero image + LiteYouTube) above the existing ComparisonBlock. Moved the prior standalone "Drei Kennzahlen" stats trio INSIDE the nachhaltigkeit band as `.stats-trio` so the page's no-band / band alternation stays clean after inserting Holzfaserdämmung.
2. **Holzfaserdämmung (new #05)** — section with hero image + `<FeatureCardPair>` for sommer / winter.
3. **Wandaufbau (renumbered #06)** — kept inside the existing band. Added hero image + `<FeatureCardPair accent="right">` for ECO Nature / ECO Nature Plus. Demoted the existing `<DefinitionList>` into a `<details>` element ("Schicht für Schicht — alle Werte im Detail") so the high-level comparison leads and the deep spec is on-demand. Removed the now-redundant ECO Nature Plus Callout (the FeatureCardPair already carries that information as the accented right card).
4. **Renumbered** Energietechnik from #06 to #07; updated the `sections` array passed to the SectionNavigator accordingly.

## Design decisions

- **Lite-YouTube pattern over autoplay-by-default.** User explicitly said "I don't like the trade off" — keeping initial-load weight low is worth the extra click. `youtube-nocookie.com` (not youtube.com) for the embedded iframe so no cookies until the user clicks play.
- **Bauphasen homepage strip placement.** Slotted between Overview ("Besser gebaut, schneller geliefert, sorgenfrei gelebt") and Ausbaustufen ("Ihr Traumhaus, Ihr Weg"). Reads as the bridging "how it happens" beat. Strip is image-led with 4:3 aspect frames so the cards' visual rhythm is distinct from Overview's three-pillar grid above.
- **Sommer/Winter without accent**, **ECO Nature/Plus with accent="right"**. The seasons are co-equal facets of the same material; the wall variants are a tier choice where Plus is the recommended upgrade. Per project accent rule, `--clr-accent-secondary` (deeper blue) on the smaller card chrome elements (border tint, eyebrow, checkmark).
- **Progressive disclosure for the DefinitionList.** The 9-row layer-by-layer spec is valuable to the engineering-curious but overwhelming as the first read. Putting it behind `<details>` keeps the page's information hierarchy: comparison → spec.
- **Tonal alternation preserved on both pages.** Index.astro now alternates primary/secondary cleanly through all 7 sections. Unser-versprechen.astro alternates band/no-band through all 8 sections (stats trio absorbed into nachhaltigkeit band).

## Open questions / deferred

- The hero image inside Wandaufbau may feel redundant given the FeatureCardPair already shows wall renderings. Considered dropping it, kept it as the section anchor — user can tell me to remove.
- LiteYouTube isn't a kit component yet (lives in features/Advantage). If a second section ever needs a video embed, promote to `src/components/ui/LiteYouTube.vue`.
- Pre-existing `:size="16" :stroke-width="2"` Vue-colon syntax on Lucide-in-Astro inside `unser-versprechen.astro` CTA Buttons left untouched (pre-existing, out of brief scope — see [[feedback-astro-vue-prop-syntax]]).

See [[style-system-tokens]] for token references used. See [[feedback_accent_application]] for the accent rule applied in FeatureCardPair.
