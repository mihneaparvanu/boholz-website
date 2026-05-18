# Mobile polish — 2026-05-18

Per-section change list for the home + global mobile pass.

## 1. Button.vue — full-width on mobile
- Added `@media (--mobile) { .btn { width: 100% } }` to `src/components/ui/Button.vue`.
- Inline button rows now stack vertically on mobile (see PageHero / CTASection / Block changes).
- Navbar's inline `Katalog` CTA opts out via a scoped `.bar .cta { width: auto }` override in `NavbarMobile.vue`.

## 2. PageHero — taller + top-aligned on mobile, no orphans
- Added `context: "home" | "default"` prop; home is wired via `index.astro` and gets `min-height: 100dvh`.
- Default mobile floor for all other PageHero instances: `70dvh` (covers req #8).
- Mobile copy anchored to `align-items: start` so faces stay visible in the photo.
- `text-wrap: balance` on `<h1>` and `.subtitle`; H1 size scaled to 92% on mobile to push past single-orphan threshold.
- Actions row flips to a `flex-direction: column` stretch on mobile so the two CTAs become full-width stacked.

## 3. Proof-Section — tertiary eyebrow + one-line badges
- Mobile: `.proof span` color becomes `--clr-content-tertiary` (was `--proof-color` inherit → primary).
- Badges shrink to 36px (40px on Holz Rettet Klima, the oversize symbol) and the row uses `flex-wrap: nowrap` + `justify-content: space-between` + tiny `gap: var(--spacing-1)`. Six sigils now fit a 360px viewport on one line. Per-symbol aspect-ratio rules untouched.

## 4. TrustBadges count-up — bigger + centered on mobile
- `TrustStatCard.vue`: on `(--mobile)`, `.stat` overrides to `align-items: center; text-align: center` regardless of the `data-align` prop. `.value` font-size becomes `clamp(3rem, 2rem + 8vw, 4rem)` — lands ~3.4rem at 390px viewport.

## 5. Germany flag visual
- New `src/icons/GermanyFlag.vue` — inline 5:3 SVG (3 stripes, no gradients, ~470 bytes). One hairline border so the gold band doesn't dissolve on light surfaces.
- New `flag?: boolean` prop on `TrustStatCard.vue`; renders the flag above the icon for the Made-in-Germany card. 24px desktop / 32px mobile.
- `trust-badges.content.ts`: extended `TrustBadge` interface and set `flag: true` on the Made-in-Germany badge.

## 6. ImageBand — 65dvh mobile, 45dvh desktop
- `min-height: 65dvh` on `(--mobile)`, `45dvh` on `(--from-desktop)`. Aspect-driven clamp kept as the base fallback if `dvh` isn't honoured.

## 7. Footer certs — single line, smaller on mobile
- `(--mobile)` overrides: `.badges { flex-wrap: nowrap; column-gap: var(--spacing-1); justify-content: space-between; width: 100% }`; badges shrink to 32px (40px for Holz Rettet Klima). Six certs fit on a single row at 360px.

## 8. Static page heros — 70dvh mobile floor
- Folded into the PageHero default mobile `min-height: 70dvh`; the home context overrides upward.

## 9. Closing CTA removed from homepage
- Deleted the `<CTASection>` block at the bottom of `index.astro` and the unused `CTASection` import. `LeadFormBand` is now the final beat on the page.
- `closingCta` content **kept** in `uebersicht.content.ts` — verified still used by `landing/bungalow.astro`, `landing/mehrfamilien.astro`, `vorschau-anspruch.astro`.

## 10. Navbar mobile — overflow-x clip + bigger logo
- `.bar { overflow-x: clip }` — `clip` not `hidden` so sticky positioning above isn't affected.
- `--navbar-logo-mobile` bumped 40 → 46px in `design-system.css` (~15% larger). Touches every mobile navbar instance.
- `.bar .cta { width: auto; flex-shrink: 0 }` opts the inline Katalog button out of the global `(--mobile) .btn { width: 100% }` rule.

## Judgment calls
- **Block.astro `.actions` mobile stack:** Block isn't in the explicit "owned" list, but it's the layout primitive owning the actions slot row that the home uses (`AudienceBlock` CTAs). The spec authorises touching "page-level wrappers if needed". Change is contained to `(--mobile)` and is consistent with the new Button width.
- **Mobile center-align on TrustStatCard via CSS, not prop:** the call site keeps `align="start"` (correct for desktop); a media query inside the card flips to center. No additional reactive plumbing; cheaper than wiring a breakpoint composable.
- **Flag border:** 1px hairline at 10% of content-primary stops the gold band from dissolving on `--clr-surface-primary` (warm off-white). Subtle enough not to read as a frame.
- **Closing CTA `imageFallbackPath`:** the removed render referenced fields not present on every variant; deleting only the JSX is the conservative move. Content shape unchanged.

## Skipped / not done
- None.

## Build
- `bun run build` — clean. Pre-existing warnings only (vueuse `/* #__PURE__ */` annotations + sandbox `Hero.vue` unused import + chunk-size warning).

MOBILE POLISH DONE
