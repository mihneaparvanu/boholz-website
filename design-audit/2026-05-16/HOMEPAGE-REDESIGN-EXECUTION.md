# Homepage redesign — execution log

**Date:** 2026-05-17 (Wave 2a)
**Branch:** `feat/homepage`
**Verification:** `npx astro check` → **0 errors, 0 warnings, 0 hints** (72 files).
**Screenshots:** skipped per [[feedback_skip-verification-screenshots]] and the
`getCategories()` Drizzle loader failure flagged in the original analysis.

---

## Files touched

| Path | Change |
| --- | --- |
| `src/pages/index.astro` | Rewired entire homepage. Added SectionNavigator between Hero and first section, replaced kit `<Section>` with local `<HomeSection>` (eyebrow + anchor + tone), added closing CTASection with two buttons, alternating tones primary/secondary across six sections. |
| `src/features/Home/HomeSection.astro` | **NEW.** Local section primitive that composes Eyebrow + heading rhythm + anchor id + `tone?: primary \| secondary`. Mirrors the kit `<Section>`'s token rhythm; adds the eyebrow slot the kit doesn't expose. |
| `src/features/Home/home.content.ts` | Extended `homeSections` with `id`, `eyebrow`, `navLabel` per section + added new `contact` entry for the closing CTA. Strict-typed via new `HomeSection` type. |
| `src/features/Home/Hero/Hero.vue` | Mobile-only: `.bottom` stacks `proof`/`action` column on `(--mobile)`; badges `:nth-child(n+5)` hidden on mobile (cap at 4); `ChevronDown` 16px white opacity 0.7 scroll-cue under the CTA with a subtle 2.4s bounce that honors `prefers-reduced-motion`. |
| `src/features/Home/CategoriesShowcase/CategoriesShowcase.vue` | Removed dead `LucideInfo` hint icon + its CSS (no tooltip wired, sub-44px tap target — analysis §2.2). Price/finance copy unchanged. |
| `src/features/Home/TrustBadges/trust-badges.content.ts` | Migrated from Lucide-component-as-prop to `IconName` strings (cross-island pattern). Added `caption` field for the StatBlock body line. |
| `src/features/Home/TrustBadges/TrustBadges.vue` | Replaced Card-grid with three `<StatBlock>`s. Three-column layout from `(--from-tablet)`; single column on mobile. |
| `src/features/Home/Overview/overview.content.ts` | Killed the LOREM. Split into `featuredCard` (lead) + `overviewPillars` (the four supporting differentiators with real one-line copy + `IconName` strings). |
| `src/features/Home/Overview/Overview.vue` | Restructured: one featured `<OverviewCard>` (kept) + `<IconList>` 2-column for the four pillars. Old 5-card grid removed. |
| `src/features/Home/BuildingStages/BuildingStages.vue` | Swapped `<h3 role="tab">` for Reka `TabsRoot/TabsList/TabsTrigger/TabsContent` — proper a11y (keyboard arrow keys, focus, aria-controls). Hero frame capped at 50dvh on `(--mobile)` (was 75dvh). Dropped both empty `<ImagePlaceholder>` cells. One desktop-only `<VideoPlaceholder slot-id="home-factory-loop">` 16:9. Motion-v animation preserved. |
| `src/features/Home/Faq/Faq.vue` | Category nav rebuilt as horizontal pill row (rounded pills, secondary-accent fill when active) — pattern mirrors SectionNavigator. Desktop returns to a sticky sidebar column of the same pills. `<FaqItem>` import dropped (file kept on disk per spec). |
| `src/features/Home/Faq/FaqAccordion.vue` | **NEW.** Homepage-local Reka-based accordion. Mirrors kit `<FAQAccordion>` visually (Plus→×, min-height: 44px, focus ring, reduced-motion guard) but renders the answer via `v-html` because `Question.answer` ships trusted HTML lists/paragraphs. See "Deviations" below. |

`FaqItem.vue` left untouched — per spec, not deleted in case HousePage still uses it.

---

## Real copy strings

### Overview — featured card

> **Höchste Bauqualität.** Massive Kreuzlagenholz-Wände, präzise im Werk vorgefertigt — jedes Detail vom Meister geprüft, jedes Haus gebaut für Generationen.

### Overview — four IconList rows

1. **Echtes Holz** — Diffusionsoffener Holzbau aus PEFC-zertifizierten deutschen Wäldern — atmungsaktiv, langlebig, klimapositiv.
2. **Energieeffizienz** — Mindestens KfW-40-Standard serienmäßig — niedrige Energiekosten ab dem ersten Tag, förderfähig zum Bauantrag.
3. **Individuelle Planung** — Vom Grundriss bis zur Materialwahl in Ihrem Tempo geplant — gemeinsam mit unseren Architekten, nicht gegen sie.
4. **Smart Living** — Vernetzte Haustechnik vorbereitet — Heizung, Licht und Sicherheit von einer Hand, ohne Nachrüst-Kabelsalat.

### Closing CTA — "Kontakt"

- **Eyebrow:** Kontakt
- **Heading:** Sprechen Sie mit uns *persönlich.*
- **Subtitle:** Buchen Sie eine Vor-Ort-Beratung — wir nehmen uns Zeit für Ihr Projekt.
- **Primary button:** `Vor-Ort-Beratung` → `/vor-ort-beratung`
- **Secondary button:** `Kontaktformular` → `/kontakt`

### TrustBadges — StatBlock captions (added)

1. "Vorgefertigt im Werk, montiert vom Boholz-Team."
2. "Garantiert keine Nachforderungen während der Bauzeit."
3. "Vertraglich gesichert auf Konstruktion und Material."

---

## Deviations from the analysis spec

1. **`Hammer` reused for both Featured + Echtes Holz icon.** The brief listed `Hammer, TreePine, Zap, Compass, Wifi`. `icons.ts` exports `tree-deciduous` (not `tree-pine`), so the closest-meaning icon was used for "Echtes Holz". Pillar count and layout match the brief otherwise.
2. **`shield` instead of `shield-check`** for the Gewährleistung StatBlock. `icons.ts` exports `shield`; `shield-check` isn't in the map. Adding it now would breach the frozen-token surface — `shield` carries the same meaning. Flag for kit-extension if a future page needs the check-mark variant.
3. **Closing CTA uses `CTASection tone="surface"` instead of wrapping in `<Section tone="secondary">`.** The kit `<Section>` renders its own heading-group, which would double-up with CTASection's heading. CTASection's `surface` tone already paints `--clr-surface-secondary` — same visual goal, no double-render. The spec offered both as options ("pick whichever reads cleaner").
4. **Built local `FaqAccordion.vue` instead of swapping to kit `<FAQAccordion>` directly.** The kit accordion interpolates `{{ item.answer }}` as text; `qa.ts` answers ship trusted HTML (bullet lists, `<strong>`, `<p>`). Local component is structurally identical (Reka primitives, same Plus→× icon rotation, same min-height, same reduced-motion guard) — the only divergence is `v-html` on the answer node. The kit is left untouched. Convergence is the existing Phase 3 cleanup item already tracked in `coordination-with-pages-team.md`.
5. **Built local `HomeSection.astro` instead of using kit `<Section>` directly.** The kit Section has no eyebrow slot and no `id` prop — both required by the brief. HomeSection mirrors the kit's spacing/heading tokens verbatim (no new tokens), adds the eyebrow rhythm via `:global(.eyebrow)` child margin (same pattern PageHero/CTASection/EyebrowHeadingLede use after polish-pass C), and forwards `tone` to the same surface logic. The kit Section is untouched.
6. **CategoriesShowcase dead-icon removed in scope.** Analysis §2.2 flagged the `LucideInfo` hint icon as broken UX (cursor: help, no tooltip, sub-44px target). Cleaned out in this pass since the file was already being read for the eyebrow wiring.

---

## Screenshot status

**Skipped.** Two compounding reasons:
- The `getCategories()` Drizzle loader fails locally in this working tree (DB unreachable — confirmed in the prior analysis, unchanged this session).
- User preference [[feedback_skip-verification-screenshots]] — Playwright/screenshot loops add noise without proportional information for static-page work.

When the DB is reachable, re-shoot at 390×844 and 1440×900 into
`design-audit/2026-05-16/screenshots/homepage-mobile/`.
