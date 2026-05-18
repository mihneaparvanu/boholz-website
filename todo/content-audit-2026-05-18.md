# BoHolz Content Audit — 18 May 2026

A full pass over the new site (homepage, landing pages, catalog, house detail pages, news, legal). Most of the items below are small — a number to confirm, a photo to send, a brand-spelling decision. **You are not asked to write copy or design anything.** Where a fix is on our side, it's marked **"we'll handle"** so you can ignore those rows.

The list looks long because it's a final pre-launch sweep — but the meaningful client decisions fit on roughly one screen (Section 1 below).

---

## 0. Revision Pass — 2026-05-18 PM (status update)

A targeted homepage revision pass was completed responding to the client's email of 2026-05-18 morning. Below is what changed.

### ✅ Resolved on our side

| Item | Status |
|---|---|
| **Item 3** — Pricing line `"Ab 200.000€ zzgl. Überführung."` | Removed. The dead `.price` CSS rule was pruned too. Confirmed gone in DOM. |
| **Item 4** — All homepage italics in BoHolz brand blue | Applied. 10 italic elements (7 section-heading `.highlight` spans + 3 Bauphasen `.index` numerals) now compute to `rgb(10, 120, 194)`. Scoped to `/` only — no bleed onto landing pages, catalog, or news. |
| **Item 5** — Removed "Massivhaus" + "Steinhaus" comparison FAQ questions | Removed both (`unterschied-massivhaus`, `vorteile-vs-steinhaus`). Interpretation: there was no dedicated comparison *section* on the page — the FAQ pair was the only Massivhaus/Steinhaus comparison content. Please flag if you meant something else. |
| **Item 6** — Removed expansion FAQ `"Kann ein BoHolz Fertighaus später erweitert werden?"` | Removed. |
| **Item 7** — Removed self-funding FAQ `"Was kann ich an Eigenmitteln und Eigenleistung einbringen?"` | Removed. |
| **F1 (was)** — Homepage trust stats | **Resolved.** Values are `100% Made in Germany / 18 Monate Festpreis / 5 Jahre Gewährleistung` — animated via GSAP, which is why the original audit captured them at 0/0/0 before the count-up fired. 18 confirmed as truthful. |

### 🔒 Still in your hands

| Item | Status |
|---|---|
| **Item 1** — Lake hero | Waiting on you to supply the asset. None of the three `old-design/` JPEGs show a lake; brand library has bungalow/mehrgenerationen heroes only. |
| **Item 2** — Color cert logos | Waiting on the Figma export. Brief explicitly forbade mixing color + grayscale, so currently still rendered as monochrome SVG `<use>` references. The swap is ~10 minutes of work once the assets land. |
| **Item 8** — Außenanlage in Technikfertig | **No-op confirmed.** Searched every page (Bauphasen, /dein-zuhause, /unser-versprechen, the home BuildingStages content, all `src/`) — "Außenanlage" appears nowhere on the new site. The current Technikfertig copy is *"Wir installieren die komplette Haustechnik – Heizung, Sanitär, Elektrik. Sie gestalten Wände, Böden und Oberflächen ganz nach Ihrem persönlichen Geschmack."* If you're seeing Außenanlage on a different page or stage, please send a screenshot or URL. |
| **Item 9** — Ausbauhaus image swap to Technikfertig's | **Blocked**: the Technikfertig image (`utility-ready.webp`) shows extensive landscaping — manicured lawn, planted shrubs, paved entry, potted plants. Per the brief's "verify the image doesn't depict landscaping" constraint, we did not swap. Need a clean Technikfertig photo with no exterior grounds work in frame. |

### ⚠️ One judgment call to confirm

The pricing line removal (Item 3) left the line "**Attraktive Finanzierungsmöglichkeiten.**" sitting alone under the catalog slider. Two reads on this:

- **Execution view (kept it):** A single reassurance sentence reads OK as a deliberate caption — the slider above and the section padding around it carry the visual weight.
- **Audit view (orphan):** On mobile especially, it floats with ~80 px of whitespace on either side; reads like a leftover stub.

Pick one of three paths (we apply whichever you choose, no further input needed):

1. **Leave as-is.** It works as a quiet caption.
2. **Pair it with a link** — e.g. "Attraktive Finanzierungsmöglichkeiten → Finanzierung berechnen" or similar — to give it purpose.
3. **Remove it entirely.** The financing message moves to a more substantive location later (CTA band, Ausbaustufen).

### Verification artefacts

- Full-page screenshots at 390 × 844 and 1440 × 900: `design-audit/2026-05-18/revision-screenshots/`
- Per-edit close-ups: `verify-A-pricing-removed.png`, `verify-B-italics-blue.png`, `verify-B-index-blue.png`, `verify-C-faq-12-questions.png`
- Console smoke test: clean (only a benign `/favicon.ico` 404, unrelated)
- No visual regressions in the rest of the page

### Notes for the design system (informational — no action needed)

- The new italic blue `#0A78C2` on the off-white section band `#F5F5F5` measures **4.30 : 1** contrast. That fails WCAG AA for normal text (needs 4.5) but passes for large text (≥ 31 px, which all current italics are). If `.highlight` is ever reused at < 24 px, that color must darken.
- Two blues coexist on the page — `#0A78C2` (accent/CTA, now also italics) and `#0F598A` (active state on FAQ pills and Ausbaustufen tabs). Pre-existing; more visible now. Future design-tokens pass.

---

## 1. What we need from you (~15 decisions)

### 1.1 Numbers and facts to confirm

| # | What we need | Where it appears | Notes |
|---|---|---|---|
| ~~F1~~ | ~~Three homepage "trust" numbers~~ | ~~Homepage `"Ihr Vertrauen fest verankert"` band~~ | **Resolved** (see §0). Numbers are `100% / 18 / 5` — GSAP count-up; not 0/0/0 as the original audit captured. 18 confirmed truthful. |
| F2 | Starting price ("ab … €") for each Einfamilienhaus model — 6 models, plus 3 Doppelhäuser/Generationenhäuser on /dein-zuhause | Catalog cards + each house detail page | The two Bestseller models already show prices. If pricing is genuinely on-request, we'll add a `Preis auf Anfrage` line instead — your call. |
| F3 | Correct model code: **Generationenhaus 28-244-160** or **28-264-160**? | Appears with both codes on /dein-zuhause and /landing/mehrfamilien | Same product, two numbers — we need the right one. |
| F4 | Correct model code: **Pultdachhaus 21-349-225** or **21-369-225**? | /hauser catalog card | Same situation. |
| F5 | What is the **"5 Standorte"** counter on /kontakt counting? | /kontakt stats row | /vor-ort-beratung lists 13 locations. If "5" is meant to mean "5 Bundesländer," we'll relabel — just confirm. |
| F6 | **House number for Vertriebsbüro Werneck** | /vor-ort-beratung | Address currently reads "Bühler Ring, Vasbühl, 97440 Werneck" — no number. |
| F7 | **Correct Fellbach address** | /vor-ort-beratung — Musterhaus Fellbach | We have "Höhenstraße – Platz 36, 70736 Fellbach" — suspected correct version: "Fertighauswelt Fellbach, Höhenstraße 36, 70736 Fellbach." |
| F8 | **Schwäbisch Gmünd street spelling** | /vor-ort-beratung | Currently "Liegnitzerweg 4" — likely should be "Liegnitzer Weg 4." |
| F9 | "Drei Musterhäuser" claim vs. two actually shown | /vor-ort-beratung hero | Either send us the third Musterhaus or we change the copy to "Zwei Musterhäuser." |

### 1.2 Photos and media to send

| # | What we need | For | Notes |
|---|---|---|---|
| M1 | **One outside photo each** for Musterhaus Bad Vilbel and Musterhaus Fellbach | /vor-ort-beratung — currently shows "BILDMATERIAL FOLGT" placeholders | Daylight phone photos are fine. We crop and colour-match. |
| M2 | **Exterior photo + area (m²)** for the **Kubus 0-190** model | /hauser catalog card — currently shows a "?" placeholder | This card looks broken next to its siblings. |
| M3 | **One landscape photo** for each of two news articles missing a cover (`/news/april-richtfest-…muensingen` and `/news/aprilt-richtfest-…steinheim`) | /news list shows literal "?" placeholders | Any build-site phone photo will do. |
| M4 | **Full photo set per house model** — 1 hero + 4–6 interior shots (living/kitchen/bath/bedroom) + 1–2 extra exterior angles, min 2000 px wide | Every /haus/[slug] product page | This is the biggest single ask in the audit. Currently every product page shows only one exterior shot — for a 6-figure purchase decision, that's the main conversion gap. We can fall back to category lifestyle imagery in the meantime so pages don't look empty. |
| M5 | **Floor plans (Grundriss)** for **Bestseller Family 150** and **Bestseller Freiraum 167** | Their /haus pages currently have zero floor plans | Same format as the Einfamilienhaus floor plans (≥ 1000 px wide). Ideally re-exported from the original CAD at ≥ 2000 px so room labels stay crisp when zoomed. |
| M6 | **Werksrundgang video or photos** | Homepage + /unser-versprechen tile, both currently say "Bald verfügbar" | If material isn't ready, we'll temporarily hide both tiles so the site doesn't advertise an unfinished feature. |

### 1.3 Copy + brand decisions

| # | Decision | Notes |
|---|---|---|
| C1 | **Canonical company name as filed with the Handelsregister** | The site shows three spellings: `BoHolz Haus GmbH` (footer), `BoHolz-Haus GmbH` (/kontakt, legal pages), `Boholz Haus` (homepage tab). One canonical version, we propagate everywhere. |
| C2 | **Canonical partner brand spelling: Keitel-Haus or Keitel Haus?** | Both appear across /unser-versprechen, /uber-uns, /karriere. Tell us how Keitel writes their own name and we find-and-replace. |
| C3 | **Marketing names for the 12 non-Bestseller Einfamilienhaus models** | Currently they show only their model code (e.g. "Einfamilienhaus 38-115-125"). Optional — if you prefer the code-only convention for the catalog, we keep it. |
| C4 | **News article titles** | 4 of 6 article titles start with a raw date and read awkwardly. We suggest "Topic first, date in metadata" (e.g. `"Richtfest in 75242 Münsingen — 4. April 2026"`). One-line approval is enough — we apply the pattern across all six. |
| C5 | **What to do with past-dated news articles** | Today is 18 May 2026; four articles describe April / early-May events still in future tense. Per article: archive, rewrite as past-tense recap, or delete. A one-line note per article ("event went well, ~30 visitors, photos attached") is all we need to rewrite. |
| C6 | **Bungalow 22-117 starting price "ab 189.000 €"** — shell (Ausbauhaus) or schlüsselfertig? | If it's the shell, we add a small qualifier ("ab 189.000 € · Ausbauhaus") so it doesn't mislead vs. the Bestseller Komfort 116 at €314k. |

### 1.4 URLs and contact info

| # | What we need | Where |
|---|---|---|
| U1 | **Real URLs for Facebook / Instagram / YouTube / LinkedIn** (or confirmation that a channel doesn't exist so we hide its icon) | Footer on every page — currently all four icons link to `#` and do nothing. |
| U2 | **Confirm the public contact info is final** — one phone (0971 / 78 55 57 15) and one email (info@boholz-haus.de) | Lead forms across all landing pages | If you want a postal address or office hours added, send them. |

### 1.5 Legal — please confirm with your legal/data-protection advisor

We don't draft legal copy. Once you give us the corrected wording, we paste it in verbatim.

| # | Item | Notes |
|---|---|---|
| L1 | **Impressum**: replace `§ 55 Abs. 2 RStV` with the current reference (likely `§ 18 Abs. 2 MStV`) | RStV was replaced by the Medienstaatsvertrag on 7 Nov 2020. |
| L2 | **Datenschutz**: replace all 9 references to `§ 25 TTDSG` with the current `§ 25 TDDDG` | TTDSG was renamed to TDDDG effective 14 May 2024. |
| L3 | **Datenschutz**: confirm a "Stand: …" date to display at the top of the policy (e.g. "Stand: Mai 2026") | Currently no last-updated marker — mandatory for a privacy notice. |
| L4 | **Cookies**: do we install **Google Analytics + a consent banner** (matches the current policy text), or do we **trim the policy** to "this site sets no tracking cookies" (matches the current site)? | Today the policy describes a site that doesn't exist — the live site sets zero cookies. Five-minute decision; we implement either way. |

---

## 2. What we'll handle on our side (FYI only — no action needed)

These don't need your input. Listed so you have full transparency about what we're fixing in parallel.

- Add `<meta description>` to every page (we draft, you approve if you want).
- Fix the homepage H1 line-break that splits "Zimmermannsqualität" mid-word.
- Add scrim/contrast fix so the homepage hero subhead is readable against the sky.
- Normalise spacing and hyphenation: `Ab 200.000 €` (not `200.000€`), `E-Mail-Adresse` (not `E-Mail Adresse`), `Vor-Ort-Beratung.` headline.
- Switch all catalog m² values from `104.94 m²` to `104,94 m²` (German comma).
- Standardise catalog cards to show **m² · Zimmer · KfW-Klasse** (matches the landing-page carousels) instead of the unlabelled `38°` roof-pitch number.
- Standardise all photo `alt` text to one pattern (`BoHolz [Typologie] [Modellname] — Außenansicht`), so screen readers + Google stop seeing "Hausbild 22-141-190" style SKUs.
- Re-export oversized news cover images (currently 4000×3000 raw photos) and the four oversized/wrong-format catalog thumbnails to consistent WebP.
- Add intrinsic `width`/`height` on floor-plan images (removes layout shift on load).
- Wrap all phone and email mentions in `tel:` / `mailto:` links across the site.
- Fix the relative footer link `vor-ort-beratung` → absolute `/vor-ort-beratung` (it breaks under `/news/…` and `/landing/…`).
- Fix the unified navbar so every page (including the homepage) shows the same items in the same order.
- Render the lead paragraph of `/news/foerdertoepfe` and the two Richtfest articles correctly (currently shows raw `&hellip;` HTML entity).
- Investigate the `/landing/uebersicht` self-navigation glitch (page intermittently jumps to /unser-versprechen on load — probably an over-eager prefetch).
- Add per-house CTA strips ("Angebot für [Hausname] anfordern" → lead form, "Beratung vor Ort buchen" → /vor-ort-beratung) on every detail page.
- Add an "Ähnliche Modelle" rail + breadcrumb on every detail page so visitors can browse sideways.
- Add a "Dieses Haus erleben" block on detail pages linking to relevant showhouses.
- Reword the duplicate `"Mehr Raum, mehr Möglichkeiten"` eyebrow/heading pair on /landing/mehrfamilien.
- Reword the duplicate `"Egal in welcher Lebensphase…"` ledes on /landing/uebersicht.
- Reword the duplicate `"Barrierefrei[es] Wohnen"` eyebrows on /landing/bungalow.
- Reword the third bungalow FAQ to drop the stiff `"ein Wohnen"` phrasing.
- Fix the misfiled Bungalow 22-117 image path (`/bungalow/bungalow/…` → `/bungalow/22-117/…`).
- Replace `"Schäfer-Haus"` partner brand leaking into the BoHolz bungalow hero `alt` text.
- Tighten the "Tradition & Innovation" body on /unser-versprechen and the "Klarheit schafft Vertrauen" intro on the homepage so they sound less salesy.
- Replace the en-dash typo `"Rot am See-Brettheim"` on /uber-uns with proper formatting.
- Dedupe the `Bad Vilbel (Hessen)` / `Hessen` entries in the /karriere positions list.
- Trim the duplicate "wir antworten innerhalb eines Werktags" line on the lead-form (appears twice).
- Adopt one canonical KfW spelling (`KfW-40-Haus` with hyphens) across all FAQs.
- Normalise the BoHolz brand spelling everywhere (replace `Bo Holz`, `Boholz`, `BoHolz-Haus` with the canonical version once you confirm C1).
- Add the third paragraph of bungalow FAQ punctuation to the run-on `Schnell sein lohnt sich Jetzt Förderung sichern! …` title.
- Set up redirects from the two typo-slugs (`/news/aprilt-…` and `/news/april-richtfest-…muenisngen`) to the corrected URLs once you confirm them.
- Align two conflicting "Stand:" dates on `/news/foerdertoepfe`.
- Distinguish or merge the two near-identical Steinheim a.d. Murr — Kleinbottwar articles (we'll send you a one-liner choice once we know whether they're one event or two).
- Either populate `Breite`/`Länge` on the Einfamilienhaus spec block to match the Bestseller pages, or drop those fields from the Bestseller pages — your preference; we have a default.

---

## 3. Full findings appendix (sorted by severity)

> Page · Section · Issue · Severity · Finding · Recommendation. Use this for reference; **everything actionable for you is already in Section 1.**

### Blocker (visible breakage or empty product pages)

| Page | Section | Issue type | Finding | Recommendation |
|---|---|---|---|---|
| Home | Hero | Grammar/Typo | H1 "Zimmermannsqualität" wraps mid-word as "Zimmermannsqu / alität" | We'll fix the line-break. |
| Home | "Vertrauen" stats | Placeholder | Three "0" counters | **F1** — send numbers. |
| Home | Werksrundgang | Placeholder | "Bald verfügbar" tile, no media | **M6** — supply video or we'll hide. |
| All pages | `<meta description>` | Placeholder | Empty on every page | We'll draft. |
| /vor-ort-beratung | Musterhaus cards | Placeholder | Both show "BILDMATERIAL FOLGT" | **M1** — send photos. |
| /hauser | Kubus 0-190 card | Missing media | No exterior photo, area missing | **M2** — send photo + m². |
| All 8 sampled /haus/[slug] | Whole page | Empty section | No image gallery — only a single hero shot | **M4** — send photo sets. |
| Bestseller Family 150, Bestseller Freiraum 167 | Floor plans | Missing media | Zero floor plans on flagship Bestsellers | **M5** — send Grundrisse. |
| All 6 Einfamilienhaus pages | Specs | Placeholder | No "ab … €" price line | **F2** — send prices or confirm "Preis auf Anfrage". |
| All 8 /haus pages | CTA | Empty section | No CTA, no contact form — page ends at spec block | We'll add CTA strip. |
| All /haus pages | Page body | Copy quality | No descriptive marketing copy — pure spec sheet | Optional: voice memo from product team, we ghost-write. |
| /news/aprilt-richtfest-… | URL slug | Grammar/Typo | Slug typo `aprilt-…7177-…` | Confirm corrected slug + we add redirect. |
| /news/april-richtfest-…muenisngen | URL slug | Grammar/Typo | Slug typo `muenisngen` → `muensingen` | Same — confirm + we redirect. |
| Footer (all pages) | Social links | Placeholder | Facebook/Instagram/YouTube/LinkedIn all point to `#` | **U1** — send URLs. |

### High

| Page | Section | Issue | Finding | Recommendation |
|---|---|---|---|---|
| Home | Browser tab | Grammar/Typo | "Boholz Haus" (lowercase h) | We'll fix once **C1** is confirmed. |
| Home | Navbar | Inconsistency | Homepage nav has fewer items than every other page | We'll align. |
| /dein-zuhause | Card 3 | Grammar/Typo | Label `28-264-160` vs. heading `28-244-160` | **F3** — confirm correct code. |
| /dein-zuhause | Body | Inconsistency | "Bo Holz Haus" with space | We'll fix once **C1** is confirmed. |
| /unser-versprechen | Section heroes | Other | Images flash/disappear during scroll | We'll fix. |
| /unser-versprechen | Werksrundgang tile | Placeholder | Same as homepage | **M6**. |
| /unser-versprechen, /uber-uns, /karriere | Body | Inconsistency | "Keitel-Haus" vs. "Keitel Haus" — three spellings | **C2**. |
| /vor-ort-beratung | Hero | Inconsistency | "Drei Musterhäuser" but only two shown | **F9**. |
| /vor-ort-beratung | Fellbach card | Copy quality | Confusing address format | **F7**. |
| /vor-ort-beratung | Werneck | Missing contact info | No house number | **F6**. |
| /kontakt | Direkt erreichbar | Inconsistency | "BoHolz-Haus GmbH" (hyphen) vs footer "BoHolz Haus" | **C1**. |
| /kontakt | Stats | Inconsistency | "5 Standorte" but site lists 13 | **F5**. |
| /hauser | Catalog naming | Placeholder | 12/14 Einfamilienhaus cards show only model code | **C3**. |
| /hauser | Pultdachhaus | Inconsistency | Code mismatch 21-349 vs 21-369 | **F4**. |
| /hauser | Card m² format | Grammar/Typo | `.` decimal instead of `,` | We'll fix. |
| /hauser | Bungalow 22-117 image | Other | Misfiled path `/bungalow/bungalow/…` | We'll re-upload. |
| /landing/mehrfamilien | Generationenhaus card | Inconsistency | `28-244` vs `28-264` mismatch (same as F3) | **F3**. |
| /landing/mehrfamilien | Sustainability paragraph | Grammar/Typo | "Bo Holz Haus" with space | **C1** + we fix. |
| /landing/uebersicht | Closing CTA | Unnatural German | `"Sie sind unverbindlich beraten"` is grammatically off | We'll fix. |
| /landing/bungalow | Hero alt | Copy quality | Partner brand "Schäfer-Haus" leaking into BoHolz alt | We'll fix. |
| /landing/bungalow | FAQ Q3 | Unnatural German | `"Ist ein barrierefreies Wohnen…"` stiff | We'll fix. |
| /landing/bungalow | Section 4 eyebrow | Inconsistency | "Barrierefrei Wohnen" + "Barrierefreies Wohnen" both appear | We'll fix. |
| /landing/mehrfamilien | TwoColumn | Copy quality | Eyebrow = heading, repeated | We'll fix. |
| All 3 landings | Footer | Other | `vor-ort-beratung` link is relative → 404 from sub-routes | We'll fix. |
| All 3 landings | Footer socials | Missing contact info | Same as **U1** | **U1**. |
| /haus heroes alt | All 8 pages | Inconsistency | Four different alt-text patterns including SKU-only "Hausbild 22-141-190" | We'll standardise. |
| /haus | Discovery | Empty section | No "Ähnliche Modelle", no breadcrumb | We'll add. |
| /haus | Cross-links | Empty section | No link to showhouses where the model can be visited | We'll add. |
| /haus | Meta description | Copy quality | Absent — Google snippets will show raw specs | We'll template from data. |
| /haus heroes | 22-141-190, 22-162-190 | Copy quality | Alt is "Hausbild 22-141-190" (internal SKU) | We'll fix. |
| /news (list) | Article titles | Copy quality | 4 of 6 titles start with raw date, awkward | **C4**. |
| /news (list) | All articles | Stale date | Past April/May 2026 events still in future tense | **C5**. |
| /news cover images | 2 articles | Missing media | Empty cover slot | **M3**. |
| /news cover images | Keitel-Haus covers | Image quality | 4000×3000 raw photos, unoptimised | We'll re-export. |
| News articles | Contact info | Other | Phone/email plain text, not clickable | We'll wrap in `tel:`/`mailto:`. |
| /news/foerdertoepfe | Excerpt | Other | Raw `&hellip;` HTML entity visible | We'll fix. |
| /impressum | RStV reference | Other | Outdated legal reference (RStV → MStV) | **L1**. |
| /datenschutz | TTDSG references (×9) | Other | Outdated (TTDSG → TDDDG) | **L2**. |
| /datenschutz | "Stand:" date | Stale date | No last-updated marker anywhere | **L3**. |
| /cookies | Cookie policy vs site | Inconsistency | Policy describes cookies + banner that don't exist | **L4**. |

### Medium

| Page | Section | Finding | Recommendation |
|---|---|---|---|
| Home | Hero subhead | Illegible against bright sky | We'll add scrim. |
| Home | Catalog row | `200.000€` missing space before € | We'll fix. |
| Home | Stat #1 | "Boholz-Team" lowercase b | **C1** + we fix. |
| Home | "Klarheit" intro | Sales-y vs rest of page tone | We'll soften. |
| /dein-zuhause | Examples row | 3 of 5 cards have no price | **F2** or hide price line. |
| /unser-versprechen | Tradition & Innovation | "starker Partner" sales-brochure-y | We'll tighten. |
| /vor-ort-beratung | H1 | `Vor Ort Beratung` (no hyphens) vs slug | We'll fix. |
| /vor-ort-beratung | Schwäbisch Gmünd | `Liegnitzerweg` likely `Liegnitzer Weg` | **F8**. |
| /karriere | Open positions | `Bad Vilbel (Hessen)` + `Hessen` duplicated | We'll dedupe. |
| /uber-uns | Body | `Rot am See-Brettheim` formatting | We'll fix. |
| Footer | Quality badges | No tooltips on ISO/RAL/QDF/GDF | Optional: send one-liners + we add tooltips. |
| /landing/mehrfamilien | "16 Einheiten" promise | Catalog has no real Mehrfamilienhaus models | Add 1–2 models, or soften copy. Decide. |
| /landing/uebersicht | Audience lede | Two near-identical sentences in a row | We'll reword. |
| /landing/uebersicht | Self-navigation | Page intermittently jumps to /unser-versprechen | We'll investigate. |
| /landing/bungalow + /mehrfamilien | Testimonials | Authors look placeholder ("Renate H., Bauherrin, 68"…) | Send 2-3 real quotes per landing, or we add a "Beispiel" tag. |
| /hauser | Thumbnail size variance | 700×495 → 4960×3507 px mixed | We'll re-export to ~1300×920 WebP. |
| /hauser | Bestseller-only pricing | 12/14 cards show no price | **F2**. |
| /hauser | Card stats | Unlabelled `38°` (roof pitch) | We'll switch to m²/Zimmer/KfW. |
| /haus floor plans | Alt text patterns | Three different patterns on 28-194-170 | We'll normalise. |
| /haus floor plans | Image quality | No intrinsic width/height; CAD-screenshot quality | We add dimensions; you re-export at ≥ 2000 px if possible. |
| /haus heroes | All 8 | Mixed JPG/WebP/PNG, mixed dimensions | We'll re-export. |
| /haus specs | All 6 EFH | "Garage: Nein" everywhere — fallback or real? | Confirm; we update. |
| /haus specs | Bestseller vs EFH | Bestseller shows Breite/Länge, EFH doesn't | We'll align (you pick direction). |
| /news (list) | Publish dates | 2024-2025 dates on 2026 articles | We'll update once **C5** resolved. |
| /news/foerdertoepfe | Two "Stand" dates | `31.08.2024` vs `14.09.2025` conflict | Confirm correct date + we align. |
| /impressum, /datenschutz, /cookies | Tab title | "BoHolz-Haus" vs "BoHolz Haus" | **C1** + we fix. |
| /impressum, /datenschutz, /cookies | Contact block | Plain-text phone/email | We'll fix. |
| Footer (all pages) | Vor-Ort-Beratung link | Relative href → 404 from `/news/<slug>` | We'll fix. |

### Low

| Page | Section | Finding | Recommendation |
|---|---|---|---|
| /dein-zuhause | Image alt texts | Three patterns mixed | We'll normalise. |
| /uber-uns | Quote block | Mixed brand hyphenation | **C2**. |
| /kontakt | Catalog form | `E-Mail Adresse` (no hyphen) inconsistent | We'll normalise. |
| /landing/uebersicht | FAQ | `KfW 40 Haus` vs `KfW-40-Mehrfamilienhaus` | We'll pick canonical (hyphenated). |
| All 3 landings | Lead-form helper | Same promise stated twice | We'll trim. |
| /hauser | Thumbnail formats | Bestseller JPG + one PNG mixed with WebP | We'll re-export. |
| /hauser | Pultdachhaus category | Only one card | Confirm whether more are planned; otherwise we fold into Einfamilienhaus. |
| /landing/mehrfamilien | Hero subtitle | Pun phrasing takes a second read | Optional reword. |
| /landing/bungalow | Bungalow 22-117 | `ab 189.000 €` unlabelled | **C6**. |
| /news (Steinheim articles) | Body | Two near-identical articles | Confirm: same event or two? |
