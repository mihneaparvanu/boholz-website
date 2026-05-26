# Homepage changes — round 2

> Translated from `Änderungen HOMEPAGE_2.pdf` (client revision notes).
> Source PDF was removed after translation. See audit table at the bottom.

---

## 1. Bestseller price asterisk

**Applies to Bestseller cards only** (these display only a price, no further details).

- Add an asterisk (`*`) after the price.
- Below the price, add the footnote text:

  > \*The prices apply to the "almost finished" (`fast fertig`) build stage in energy-efficiency class **55** per the current Bau- und Leistungsbeschreibung, version **03/2026**. Valid only for construction sites in Germany.

- For the model priced from **€314,395**, also add `(inklusive Bodenplatte)` ("including foundation slab") next to the price.

The PDF references the card for *Bestseller Komfort 116*, **BUNGALOW**, "ab 314.395 €", with the tagline "Wohnen, das sich Ihrem Leben anpasst." (CTAs: *Beratungstermin*, *Katalog bestellen*.)

---

## 2. "Premium-Fertighäuser auf einen Blick" (Advantages block)

**Keep all copy as-is. Only reorder the four blocks and adjust colors.**

Desired block order:

1. Nachhaltig & ökologisch (Sustainable & ecological)
2. Energieeffizient (Energy-efficient)
3. Individuelle Planung (Individual planning)
4. Schlüsselfertig (Turnkey)

Adopt the colors from the **old** homepage at <https://boholz-haus.de/>.

The PDF screenshot shows the section header "IHRE VORTEILE / Premium-Fertighäuser *auf einen Blick.*" with subtitle "Nachhaltig, energieeffizient, individuell planbar — vier Eigenschaften, die jedes BoHolz-Haus auszeichnen."

---

## 3. Über Uns (About Us) — new structure

### Heading

> **Zwei starke Partner**
> Ein Verbund aus fachlicher Kompetenz, Wissen und jahrelanger Erfahrung

(*"Two strong partners. A union of professional competence, knowledge, and many years of experience."*)

### Section A — "Ihr Premium Vertriebspartner BoHolz-Haus"

> As a sales partner, BoHolz Haus holds itself to the **highest standards** of **quality** and **sustainability** in homebuilding.
>
> That is why we **advise and accompany you** comprehensively on every question and wish regarding your individual dream home. Our experienced home advisors ensure that everything — **from the planning** of your BoHolz prefab home through to the **signing of your build contract** — runs to your complete satisfaction. Along the way we provide important information and tips, starting with the **current KfW construction loan subsidies** and continuing through to **financing**.
>
> With these comprehensive advisory services we lay the foundation for your dream home.
>
> - Planning your dream home with our build advisors
> - Help with the property search
> - Securing financing
> - Signing the build contract

### Section B — "Unser starker Partner Keitel Haus"

> The **complete satisfaction** of our **customers** is at the centre of what we do.
>
> That is why we at BoHolz Haus, as a premium sales partner, rely on the competence of our **renowned partner Keitel Haus**. Keitel Haus handles everything from detailed planning of your home through to complete delivery, all from a single source.
>
> Keitel Haus is a renowned family-run business based in 74585 Rot am See-Brettheim (near Rothenburg ob der Tauber).
>
> **For over 90 years**, Keitel Haus has dedicated itself intensively to the sustainable building material that is wood, and uses its advantages every day in **high-quality** prefab homebuilding. Keitel Haus plans and realises bespoke living projects, from single-family homes through to multi-generation homes.
>
> Special wishes such as combined living-and-working spaces or individual extensions are likewise realised by Keitel Haus together with its partner BoHolz Haus. **A further advantage for every owner-builder:**
>
> As a family business with a 90-year history, Keitel Haus places great value on a company culture built on firm principles: **quality** over quantity, **individuality** over off-the-shelf, **comprehensive advice** over persuasion, **transparent build specifications** over fine print.
>
> As a financially solid business that operates **exclusively with its own resources**, Keitel Haus is **independent** of external **financing partners**. That is enormously important in the current climate and gives you the necessary security. Every resource flows specifically into the quality, sustainability, and finish of the homes.

### Add the Premium-Partner logo to this section

---

## 4. Certificates — strict whitelist

Use **only** these certificates. **No others.**

Section header: **"Unsere Zertifikate und Partnerschaften"** ("Our certificates and partnerships")

The PDF shows the six allowed marks as a single row:

1. **QDF** — Qualitätsgemeinschaft Deutscher Fertigbau
2. **GDF** — Gütegemeinschaft Deutsche Fertigbau
3. **DIN 1052 GDF Holztafelbau** — (Keitel-Haus GmbH, 74585 Rot am See-Brettheim — DIN 1052 Holztafelbau mark)
4. **RAL Gütezeichen Holzhausbau**
5. **BDF** — Bundesverband Deutscher Fertigbau
6. **CrefoZert 2024** — Creditreform creditworthiness certificate (KEITEL-HAUS GmbH, valid through 10/2026)

---

## 5. House detail pages — "Leistungsumfang" (Scope of services)

Under every house's **Leistungsumfang** section, use exactly this text:

> Je nach Ihren individuellen Bedürfnissen können wir verschiedene Gewerke und Leistungsumfänge anbieten. Gerne berät Sie unser Fachberater hierzu ausführlich und erstellt gemeinsam mit Ihnen ein passendes Konzept.

(*"Depending on your individual needs, we can offer different trades and service scopes. Our specialist advisor will be happy to advise you on this in detail and put together a suitable concept with you."*)

---

## Implementation audit

Re-verified end-to-end in a running dev server with Playwright on 2026-05-26.

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Bestseller price asterisk + footnote + "inkl. Bodenplatte" | ✅ **Done** | `src/lib/derive.ts`: `priceHintFor` now appends `*` when `m.isFeatured`; new `priceCaveatFor` returns "inkl. Bodenplatte" when the slug is in `FOUNDATION_INCLUDED_SLUGS` (currently just `bestseller-komfort-116`); new exported constant `BESTSELLER_PRICE_FOOTNOTE` holds the disclaimer copy. `HouseModelCard.vue` accepts `priceCaveat` and renders it in a `.price-stack` under the price (smaller, muted). `HouseModelsCarousel.vue` and `HouseModelsGrid.astro` both forward the new prop. The four pages that render Bestseller cards — `index.astro`, `wohnen/bungalow.astro`, `wohnen/mehrfamilien.astro`, `vorschau-anspruch.astro` — import the constant and drop a `<p class="price-footnote">` after the carousel. Browser check: all 6 Bestseller cards show `ab €X*`; Komfort 116 specifically shows `inkl. Bodenplatte`; the footnote renders below the section. |
| 2 | Vorteile block order + colors | ✅ **Order done.** ⚠️ **Colors still unverified vs the live old site** | `src/features/landing/uebersicht.content.ts` lines 91–116 — order matches PDF exactly: Nachhaltig & ökologisch → Energieeffizient → Individuelle Planung → Schlüsselfertig. Each card has a distinct `tone` (`forest`, `sage`, `leaf`, `surface`). Can't programmatically compare those tones to `https://boholz-haus.de/` — needs a 30-second eyeball check from a browser. |
| 3 | Über Uns — "Zwei starke Partner" + Keitel copy | ✅ **Done** | `src/features/faq/keitel.ts` fully rewritten to match the PDF. Verified in the rendered page: section eyebrow "Zwei starke Partner", section heading "Ein Verbund aus fachlicher Kompetenz, Wissen und jahrelanger Erfahrung", lead opener "Als Vertriebsgesellschaft hat" → "BoHolz Haus höchste Ansprüche an Qualität und Nachhaltigkeit beim Hausbau", pull quote "Mit diesen umfassenden Beratungsleistungen…" (matches PDF closer), Keitel section heading "Keitel Haus. Seit über 90 Jahren.", lede "Für uns steht die absolute Zufriedenheit unserer Kunden im Mittelpunkt." (matches PDF opener), Keitel pull quote "Qualität vor Quantität. Individualität vor Standardlösungen. Beratung vor Überredung.", 4 Keitel paragraphs covering Premium Vertriebspartner / Rot am See-Brettheim / Familienprinzipien / financial independence — all matching PDF. Bullet list (Planen → Hilfestellung → Sicherung → Abschluss) already lived in `uber-uns.content.ts` and renders in the "Was wir tun" section. `PremiumPartnerBadge` mounted in both partner sections. |
| 4 | Certificates — strict whitelist (6 marks) | ✅ **List enforced.** ⚠️ **DIN 1052 art is a placeholder** | `src/features/certifications/certifications.ts` exports exactly 6 in PDF order: `cert-qdf`, `cert-gdf`, `cert-din-1052`, `cert-ral`, `cert-bdf`, `cert-creditreform`. `PROOF_CERTIFICATIONS` now equals `CERTIFICATIONS` (the old `PROOF_OMIT` filter is gone because ISO + Holz-Klima are no longer in the list at all). Sprite `certifications.svg` cleaned: `cert-iso` symbol stripped (zero callers); `cert-holz-klima` kept because `src/pages/ihr-neues-zuhause.astro:253` still uses it inline for the sustainability section; new `cert-din-1052` symbol added as a **clearly-marked text-only placeholder** (Keitel-Haus / DIN 1052 / Holztafelbau / GDF inside a framed square) — when the real Keitel-Haus DIN 1052 / GDF Holztafelbau mark arrives, swap the symbol body. Browser check: proof strip and footer both render exactly the 6 whitelisted marks in the correct order. |
| 5 | "Leistungsumfang" on house detail pages | ✅ **Done** (was already implemented, just missed in the first audit) | `src/pages/haus/[slug].astro:33–34` declares `leistungenCopy` with the PDF's exact German paragraph; `:69–71` renders it inside an `<AccordionItem label="Leistungsumfang">` under the "Informationen" section. Note: it's an accordion item rather than its own top-level section, but it satisfies the PDF's "use this text under Leistungsumfang on the houses" instruction. |

### Summary

**5 / 5 items implemented.** Two minor open follow-ups:

- **Item 2 — color check.** The four Vorteile tones may or may not match the legacy palette at <https://boholz-haus.de/>. A 30-second visual comparison is needed; if they don't match, retune the four `tone` values in `uebersicht.content.ts:91–116`.
- **Item 4 — real DIN 1052 artwork.** The current sprite entry is a clearly-labelled placeholder. When the asset arrives (likely from the Keitel-Haus / GDF brand archive), replace the symbol body in `certifications.svg` while keeping `id="cert-din-1052"` and a 1:1 viewBox.

### Files touched

- `src/lib/derive.ts` — asterisk + Bodenplatte caveat + footnote constant
- `src/ui/sections/HouseModelCard.vue` — new `priceCaveat` prop + `.price-stack` markup + styles
- `src/ui/sections/HouseModelsCarousel.vue` — forwards `:price-caveat`
- `src/ui/sections/HouseModelsGrid.astro` — forwards `priceCaveat`
- `src/ui/style/design-system.css` — `.price-footnote` rule
- `src/pages/index.astro`, `wohnen/bungalow.astro`, `wohnen/mehrfamilien.astro`, `vorschau-anspruch.astro` — import + render footnote after carousel
- `src/features/faq/keitel.ts` — Keitel copy rewrite
- `src/features/certifications/certifications.ts` — whitelist of 6, drop PROOF_OMIT
- `src/features/certifications/certifications.svg` — strip `cert-iso`, add `cert-din-1052` placeholder, keep `cert-holz-klima`

