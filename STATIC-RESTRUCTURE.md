# Static page restructure — 2026-05-18

Three marketing pages restructured per client feedback. `bun run build` clean.

## `/unser-versprechen` (Bauen mit BoHolz)

- **Removed cert / Zertifikate proof band** (full `<Block tone="band">` with `<ProofSection />`).
- **Removed Qualität & Zertifikate section** (`id="qualitaet"`) plus its three `qualityStats` (Qualität / 18 Monate / Deutschland) — `StatBlock` array dropped from frontmatter.
- **Removed `qualitaet` entry** from the `sections` array driving `SectionNavigator`. Renumbered remaining sections 01–06.
- **Removed konventionell-vs-Holzbau `ComparisonBlock`** in the Nachhaltigkeit section, plus the `konventionell` and `holzbau` `ComparisonSide` arrays. Numeric stat trio (30 t / 11 h / 92 %), LiteYouTube, and hero image stay — the section now reads as: hero image + video pair → stats trio → footnote.
- **Removed Werksrundgang `<VideoPlaceholder>`** (slotId `versprechen-werksrundgang`) including its wrapping `<Block tone="band">`.
- **Dropped imports**: `ComparisonBlock`, `ComparisonSide` type, `VideoPlaceholder`, `ProofSection`.

## `LiteYouTube.vue` (mobile play-icon visibility)

- **Strengthened chip background** from 22 % → 32 % white tint, border 30 % → 40 %, added `box-shadow: 0 6px 24px ~28% black` so the chip separates from light scenes (snowy posters, light facades) that previously swallowed the glass.
- **Mobile-only override** (`@media (--mobile)`): chip padding bumps from `--spacing-3` to `--spacing-4`, background to 38 % white. Icon size unchanged — only the chip footprint grows.
- **Reinforced scrim** with a radial darkness around the chip's optical centre (28 % at centre fading at 55 % radius) layered over the existing top-to-bottom gradient. Desktop look essentially unchanged; mobile now reliably reads the play affordance.

## `/dein-zuhause` (Ihr Neues Zuhause)

- **Architektur — zigzag editorial.** Replaced the single `.prose` block with three editorial beats (Grundriss / Fassade / Innen & außen). Image-left/text-right alternates via `.beat:nth-child(even) .beat-frame { order: 2 }` from tablet up; mobile stacks every beat (image above text). Each beat carries its own eyebrow / h3 / body. Tokens: `--spacing-5` between beats, `--spacing-3` inside, `--radius-lg` on the image frame, `--fs-h5` on the heading. Images sourced from `/images/landing/uebersicht/lifestyle-01.webp`, `-04.webp`, `-05.webp`.
- **New Nachhaltigkeit `<Block tone="band">`** sits between Ausbaustufen and the CTA. Eyebrow `06 · Nachhaltigkeit`, heading `Gebaut für *Generationen.*`, lede about 30 t CO₂ + KfW 40/55. Two side-by-side editorial frames (4:3, `--radius-lg`); the `#badge-holz-klima-color` sigil from the global sprite overlays the first frame, anchored top-end at `--spacing-3` inset, sized `clamp(64px, 18vw, 112px)` so it never overflows the frame on mobile. Drop-shadow keeps the badge legible against the photo.
- **Added `nachhaltigkeit` entry** to the `sections` array (06).
- **Removed Zeitraffer `<VideoPlaceholder>`** (slotId `dein-zuhause-zeitraffer`) and its wrapping `<Block>`.
- **Removed `<VideoPlaceholder>` import** (no longer used).
- **Garten / Außenanlage scrub**: changed Smart Home item 4 description from `"Von Beleuchtungssteuerung bis Gartenbewässerung — ..."` to `"Von Beleuchtungssteuerung bis Lichtszenen — ..."`. Lichtszenen (light scenes) is a real smart-home staple and stays on-brand.

## `building-stages.content.ts`

- Removed two stale comments that referenced Außenanlage / landscaping. Visible copy was already clean. Kept the intentional `imageURL: null` on Technikfertig with a shorter, neutral comment.

## `/uber-uns`

- **Mobile hero constraint fix**: wrapped `<PageHero />` in `<div class="full-width">` so the hero escapes the `wrapper` content grid and bleeds to the page edges. Mirrors the pattern on `/index.astro` and the other restructured pages. Desktop unchanged (PageHero's own inner padding handles the safe area).

## Judgment calls

- "Lichtszenen" as the Gartenbewässerung replacement: alternative was deleting the example entirely, but the bullet reads cleaner with a concrete cue. Reverting is a one-word swap.
- Architektur beat copy is new editorial German written tight to brand voice; reads in 2–3 sentences each. If the client wants different beats (Materialität, Lichtführung, etc.), the array is one source of truth at the top of the file.
- Nachhaltigkeit badge sized via `clamp()` rather than two breakpoints — fewer media-query branches, never overflows the frame on the narrowest viewports.
- Kept the Ablauf section first (id `ablauf`), Architektur second — original order preserved. The Nachhaltigkeit Block is new and lands at 06 so the SectionNavigator reads end-to-end.

## Skipped

Nothing skipped from the brief. Untouched: `Layout`, `index.astro`, `kontakt.astro`, `PageHero`, `Button`, `Proof-Section`, `ImageBand`, `TrustBadges`, `ContactForms`, `CTASection` — all on the off-limits list.

STATIC RESTRUCTURE DONE
