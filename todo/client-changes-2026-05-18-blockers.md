# Blockers — Client Revision Pass 2026-05-18

Recording per workflow rule #5 of `client-changes-18-05-26.md`:

> "For any item that can't be cleanly completed (e.g., missing color certification logos, missing image), STOP and flag in `todo/client-changes-2026-05-18-blockers.md` rather than improvising."

## Items proceeding immediately

- **Item 3** — Pricing line. Located at `src/features/Home/CategoriesShowcase/CategoriesShowcase.vue:21`. Removable cleanly.
- **Item 4** — Italics → BoHolz-Haus Blau. Brand token is `--boholz-blau-alt: rgba(10, 120, 194, 1)` (`src/style/design-system.css:11`). Agent will audit homepage `<em>`/italic usage and apply.
- **Item 6** — FAQ `spaeter-erweitern` (Planung & Gestaltung). `src/content/qa.ts:67-72`. Clean removal.
- **Item 7** — FAQ `eigenmittel-eigenleistung` (Kosten & Finanzierung). `src/content/qa.ts:135-139`. Clean removal.
- **Item 9** — Ausbauhaus image swap. Agent will swap to Technikfertig's `utility-ready.webp` in `building-stages.content.ts:12` and visually verify no landscaping in frame.

## Items blocked — client decision required

### B1. Item 1 — Lake hero image asset is not findable

The brief says "use the hero from the first draft — the one with the lake image (Bild vom See!)". Sources checked:

- `old-design/` contains only three JPEG mockup screenshots (page-1 Übersicht, page-2 Mehrfamilien, page-3 Bungalow). **None show a lake.** Page 1 (the Übersicht/homepage draft) shows a family on a garden in front of a house. Page 3 (Bungalow) shows a bungalow with a small pool.
- `~/WorkNAS/BoHolz/1-Branding/Images/` contains only `bungalow-hero.webp`, `mehrfamilien-hero.webp`, `mehrgenerationen-gallery-*.webp`, etc. **No lake hero.**

**Need from client:** Either the actual lake-image asset (file or R2 path), or confirmation of which existing first-draft image they meant. If they want us to source one fresh, what's the brief (sunrise lake + house silhouette?).

### B2. Item 2 — Color certification logos not available locally

`Proof-Section.vue` renders six cert badges via monochrome `<svg use href="#badge-{iso,bdf,gdf,qdf,gdf-shield,ral}">` references. To switch to color we need the official multi-color logos for:

- ISO 9001
- BDF (Bundesverband Deutscher Fertigbau)
- GDF (Gütegemeinschaft Deutscher Fertigbau)
- QDF (Qualitätsgemeinschaft Deutscher Fertighersteller)
- GDF-Schild
- RAL Gütezeichen

`1-Branding/Certificates/` is empty apart from an empty `Received/` folder. **Per the brief's own rule ("if you don't have color versions of all certifications, flag which ones are missing rather than rendering some color and some grayscale"), we will NOT mix color + grayscale.**

**Need from client:** Color logo files (SVG preferred, PNG with transparency acceptable) for all six certs. If only some are available, we can hide the rest and use the ones we have — but client must explicitly choose that path.

### B4. Item 9 — Technikfertig image contains visible Außenanlage

The brief says to swap the Ausbauhaus image (`shell.webp`) to use the Technikfertig image (`utility-ready.webp`), with the explicit constraint "verify the image doesn't depict landscaping".

Fetched and inspected the live asset at:
`https://pub-47ece1c9a40d42ad8886561941b959b5.r2.dev/images/stages/utility-ready.webp` (2752×1536)

The image clearly shows substantial Außenanlage:

- Manicured green lawn filling the entire foreground
- Planted shrubs / bushes along the base of the house on both sides
- A large potted plant beside the front entrance
- A paved / decked surface at the door area
- Distant tree-line / garden landscaping behind the house, lit by warm sunset light

This directly violates the client's "no landscaping" constraint, so we are **NOT** performing the swap. `building-stages.content.ts:12` remains pointing at `shell.webp`.

**Need from client:** A clean Technikfertig-stage photo with no exterior grounds work in frame (e.g. house exterior only, neutral/cropped background, or a construction-state shot). Once supplied, the swap is a one-line edit.

### B3. Item 8 — "Außenanlage" no-op — text does not exist on any page

Investigation completed per user direction ("check Bauphasen + /dein-zuhause"):

- `grep` across `src/` (recursive, case-insensitive, all variants `Außenanlage` / `außenanlage` / `Aussenanlage`): **zero matches**.
- `src/features/Bauphasen/bauphasen.content.ts`: no Außenanlage. The three Bauphasen are Grundstein, Träume, Bauphase — none of which mentions exterior grounds work.
- `src/pages/dein-zuhause.astro`: only `Gartenbewässerung` appears, and it's in the Smart-Home block describing light + irrigation control, not in any Ausbaustufe inclusions list. The `/dein-zuhause` Ausbaustufen section (`#ausbaustufen`) renders the same `BuildingStagesCarousel` from the same `building-stages.content.ts` — identical Technikfertig copy, no Außenanlage.
- `src/pages/unser-versprechen.astro`: zero Außenanlage hits. Only `technikfertig` mention is a Wärmepumpen line ("ab der technikfertigen Ausbaustufe — renommierte Hersteller wie Nibe und Tecalor sorgen…") — nothing about exterior work.

**Conclusion: there is nothing to remove.** Either:

- (a) Item 8 was already addressed in a prior edit, or
- (b) The client is reading the **old WordPress site** (boholz-haus.de) and conflating it with the new Astro build, or
- (c) They're remembering the original Übersicht draft (the `old-design/` PDF) which may have had a long inclusions list.

**Action for the next client email:** "We searched every page on the new site for 'Außenanlage' and the word doesn't appear. The current Technikfertig description reads: 'Wir installieren die komplette Haustechnik – Heizung, Sanitär, Elektrik. Sie gestalten Wände, Böden und Oberflächen ganz nach Ihrem persönlichen Geschmack.' If you're seeing Außenanlage somewhere we missed, please send a screenshot or URL and we'll fix immediately."

## Items needing interpretation — proceeding with best guess (flagged for review)

### I1. Item 5 — "Vergleich mit Massivhaus und Steinhäusern" section

There is **no dedicated comparison section** on the current homepage. The page composition (`src/pages/index.astro`) is: Hero → ProofSection → CategoriesShowcase → TrustBadges → Overview → BauphasenStrip → BuildingStages → FAQ → CTA. None of those is a Massivhaus/Steinhaus comparison strip.

The closest match is **two FAQ questions in the "Allgemein" category** that compare BoHolz to Massivhaus / Steinhaus:

- `unterschied-massivhaus`: _"Wie unterscheidet sich ein BoHolz Haus von einem Massivhaus?"_ (qa.ts:36-41)
- `vorteile-vs-steinhaus`: _"Welche Vorteile haben Fertighäuser im Vergleich zu Steinhäusern?"_ (qa.ts:42-48)

**Interpretation we are proceeding with**: remove both of these FAQ questions from `src/content/qa.ts`.

**If the client meant something else** (a section we removed earlier, or a section on another page), they should reply with a screenshot or page URL and we revert / redirect.
