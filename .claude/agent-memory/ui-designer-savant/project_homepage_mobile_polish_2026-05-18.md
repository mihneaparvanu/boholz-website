---
name: project_homepage_mobile_polish_2026-05-18
description: 2026-05-18 mobile polish pass — closing CTA removed from home, PageHero context prop, GermanyFlag icon, footer/proof badges single-line, mobile button width
metadata:
  type: project
---

Mobile polish executed 2026-05-18 (post `83576d7 client feedback: major overhaul`).

**Why:** client-driven polish round on top of the previous day's major overhaul. Focus: tighten mobile UX — uniform button width, taller heroes with visible photo subjects, single-line cert rows, bigger count-up numbers, kill the redundant closing CTA below LeadFormBand.

**How to apply (for future polish passes on the home):**
- The home hero is `<PageHero context="home">` — 100dvh mobile floor, all other PageHero instances default to 70dvh. If a new section needs the home's extra height, set `context="home"`.
- `TrustStatCard.vue` now has a `flag` boolean. Only the Made-in-Germany card uses it. New flag-bearing cards go through `trust-badges.content.ts → flag: true`.
- The closing CTA block is REMOVED from `src/pages/index.astro` only. `closingCta` content stays in `uebersicht.content.ts` because landing pages (`bungalow.astro`, `mehrfamilien.astro`, `vorschau-anspruch.astro`) still render it. Don't delete the content shape.
- `--navbar-logo-mobile` is 46px (was 40). Future tweaks → token only, never inline pixel values.
- Mobile button uniformity rule lives in `Button.vue`; consumers stack via `.actions` mobile rules. See [[feedback_button_mobile_width]].
- `GermanyFlag.vue` lives in `src/icons/` and is a Vue SFC (not raw SVG like the others in that folder). Pattern: SVG components for visuals that need props/sizing logic; raw `.svg` for sprite symbols.

**File map for this pass:**
- `src/pages/index.astro` — CTASection removed, `context="home"` wired
- `src/components/sections/PageHero.astro` — context prop, mobile heights, mobile action-stack, text-wrap balance
- `src/components/sections/Proof-Section.vue` — mobile tertiary eyebrow + nowrap single-line badges
- `src/components/sections/ImageBand.astro` — 65dvh mobile / 45dvh desktop
- `src/components/sections/CTASection.astro` — mobile action-stack
- `src/components/sections/Block.astro` — mobile action-stack
- `src/components/ui/Button.vue` — mobile width 100%
- `src/features/Home/TrustBadges/TrustStatCard.vue` — flag prop, mobile center + larger value
- `src/features/Home/TrustBadges/TrustBadges.vue` — forwards `flag`
- `src/features/Home/TrustBadges/trust-badges.content.ts` — `flag?: boolean` field, set on Made-in-Germany
- `src/icons/GermanyFlag.vue` — new
- `src/layouts/Footer/Footer.astro` — single-line cert row on mobile
- `src/layouts/Navbar/NavbarMobile.vue` — overflow-x clip + cta width opt-out
- `src/style/design-system.css` — `--navbar-logo-mobile: 46px`

Related: [[feedback_button_mobile_width]], [[style-system-tokens]], [[project_design-work-state]].
