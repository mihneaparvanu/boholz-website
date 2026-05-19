# Content Audit — Internal Notes
**Date:** 2026-05-19 · **Site:** http://localhost:4322 (dev) · **Auditor:** content-gap-hunter

This file accompanies `CONTENT-GAPS-CLIENT.md`. Same findings, but with technical detail (file paths, table rows, R2 paths, evidence) so our team can act without re-running the audit. Findings are grouped by **system layer** rather than page, because most issues span multiple surfaces.

## Executive summary

- **38 client-facing items** (see `CONTENT-GAPS-CLIENT.md`). 16 are launch blockers.
- **3 user-visible placeholder strings** still in production HTML: `TODO: Straße und Hausnummer ...` (twice on `/musterhaus/[slug]`, also serialized into every page's hydration payload via Layout's `getLocations({ kind: "showhouse" })`), and `Bildmaterial folgt — bis dahin ein Platzhalter` on `/vor-ort-beratung`.
- **Both lead-capture forms are non-functional** (`ContactForm.vue`, `CatalogForm.vue` have no `@submit` handler, no API endpoint, no email transport configured). Submitting either does nothing observable.
- **No SEO metadata** on any page (no `<meta name="description">`, no Open Graph, no Twitter card, no canonical URL, no sitemap, no robots.txt). Only `<title>` and the `<link rel="icon">` to `/favicon.svg` are emitted by `Layout.astro`.
- **Stale legal copy:** Impressum names Michael Schäfer as Geschäftsführer (`src/pages/impressum.astro:34,38`), but DB `agents` row `wilfried-bolz` lists role "Geschäftsführer". Datenschutz/Cookies pages describe Google Analytics + GTM in detail although there's **no Analytics or GTM script anywhere in the codebase** (verified by grep — no `gtag`, no `tag-manager`, no `analytics.js` references). One of them is wrong.

---

## 1. DB content issues (`boholz.*` schema)

### `houseModels` (32 rows) — gallery, hero, thumbnail, descriptions

Probe script: relational query over `houseModels` with `media`, `floors`, `details`, joined to a HEAD-probe of each `media.path` against `PUBLIC_ASSETS_URL`.

**Models with `gallery < 3` (15 / 32):**

| slug | gallery | floors | category |
|------|---------|--------|----------|
| `bestseller-family-150` | 2 | 0 | Einfamilienhaus |
| `bestseller-freiraum-167` | 1 | 0 | Einfamilienhaus |
| `bestseller-komfort-116` | 2 | 0 | Bungalow |
| `bestseller-plus-223` | 1 | 0 | Generationenhaus |
| `bestseller-twin-138` | 1 | 0 | Doppelhaus |
| `bestseller-weitblick-140` | 2 | 0 | Stadtvilla |
| `bungalow-22-149` | 2 | 1 | Bungalow |
| `doppelhaus-28-299` | 1 | 2 | Doppelhaus |
| `einfamilienhaus-22-141-190` | 1 | 2 | Einfamilienhaus |
| `einfamilienhaus-22-173-190` | 1 | 5 | Einfamilienhaus |
| `einfamilienhaus-25-168-190` | 1 | 2 | Einfamilienhaus |
| `einfamilienhaus-28-182-170` | 2 | 2 | Einfamilienhaus |
| `einfamilienhaus-28-194-170` | 1 | 3 | Einfamilienhaus |
| `einfamilienhaus-35-146-150` | 1 | 2 | Einfamilienhaus |
| `einfamilienhaus-45-139-75` | 1 | 2 | Einfamilienhaus |
| `generationenhaus-28-264-160` | 1 | 2 | Generationenhaus |
| `kubus-0-190` | **0** | 4 | Kubus |
| `pultdachhaus-21-349-225` | 2 | 3 | Pultdachhaus |
| `stadtvilla-22-166` | 1 | 2 | Stadtvilla |
| `stadtvilla-22-173` | 1 | 3 | Stadtvilla |

> Note: all 6 Bestseller models also have `floors = 0` — no floor plans seeded for any of them. They render with an empty floor-plan tab.

**Hero / thumbnail anomalies:**

- **`kubus-0-190`** — `model_media` has **zero rows**. Detail page renders with no images at all (HTML body length 398 chars, mostly chrome). The 4 `floor_media` rows render in the floor-plan tab only. Hard blocker.
- **`bungalow-22-117`** — two `isHero=true` `model_media` rows. The newer one (`/images/models/bungalow/bungalow/hero/bungalow-bungalow-hero-2368x1728.webp`) returns 200; the older one (`/images/models/bungalow/bungalow-22-117/hero.jpg`) returns **404**. Dedup needed.
- **`stadtvilla-22-157`** — `isThumbnail=true` row points to `/images/models/city-villa/22-157/hero/city-villa-22-157-hero-1300x1039.webp` → **404**. Other media rows for this model 200.
- **`pultdachhaus-21-349-225`** — title field in DB is `Pultdachhaus 21-369-225` (note `369` vs slug `349`). `modelCode` is `21-349-225`. Description ends with `"...Einen wunderbaren Ausblick in die Natur bietet dieses"` — truncated.
- **`generationenhaus-28-264-160`** — title in DB is `Generationenhaus 28-244-160` (note `244` vs slug `264`). `modelCode = 28-264-160`. One number is wrong.
- **Bestseller titles** vs `modelCode`: the marketing titles (`Family 150`, `Komfort 116`, `Weitblick 140`, …) and the internal `modelCode` (`32-150-170`, `22-116-000`, `22-140-000`, …) tell different stories. Confirm with client whether this is intentional product-naming (likely yes — bestseller is a marketing layer) or a data-entry slip.

**Models without price (25 / 32):**

Only the 6 Bestseller models + `bungalow-22-117` have `price IS NOT NULL`. Confirm strategy: hide price field on Detail card, or set to "auf Anfrage" placeholder. Currently the `Pricing` component renders `null` as blank — looks like a missing field rather than an intentional choice.

**Models without `details.roofType` (26 / 32):**

All 6 Bestseller models have `roofType` set; everything else is NULL. `RoofTypeBadge` (or whatever surfaces it in `HousePage`) will be hidden across the catalog.

**Description quality:** `pultdachhaus-21-349-225` is the only obviously broken one (truncated at 89 chars). Everyone else has 175–1000 chars of plausible prose.

### `houseCategories` (7 rows)

- **All 7 categories have `description = NULL`** in DB. If `CategoriesShowcase` or similar surfaces this anywhere, it'll be blank.
- `Einfamilienhaus` hero alt is `null`; `Bungalow` hero alt is `null`. All others have alt populated.
- All hero + thumbnail paths return 200.
- `Generationenhaus`, `Pultdachhaus`, `Doppelhaus`, `Kubus` — same `media_id` flagged both `isHero=true` AND `isThumbnail=true`. Functional but visually identical hero/thumb. Decide whether this is fine (cheap shortcut) or whether category pages should have a distinct thumbnail vs. hero crop.

### `media` (166 rows) — alt text

- **40 / 166 rows have `alt IS NULL` or empty**. Full list saved during audit; the bulk are floor-plan JPGs (sensible — floor plans don't need descriptive alt beyond `"Grundriss Erdgeschoss"`) and gallery WebPs. Per WCAG, decorative-only images can have `alt=""` but the attribute must be present. Currently many `<img>` tags will render with `alt={null}` → no attribute at all.
- 0 rows with filename-style alt (good — earlier audits flagged some, all cleaned up).
- **0 orphaned media** (every `media` row is referenced by at least one pivot). Good housekeeping.

### `news` (4 rows)

- All 4 published, all 4 have a cover image (200), all 4 have title+content.
- **Body duplicate:** `april-samstag-13-06-2026-werksfuehrung-bei-keitel-haus` and `mai-samstag-02-05-2026-werksfuehrung-bei-keitel-haus` share the same first 200 chars of body. Verified by `LEFT(content, 200)` group-by. Likely template that was forgotten to be personalised per date.
- **Title issue:** `foerdertoepfe` title is `"Schnell sein lohnt sich Jetzt Förderung sichern! Informieren Sie sich hier"` — looks like a WordPress export concatenation. Strip + rewrite.
- `scripts/seed-news-rows.ts` originally planned 6 slugs (`APPROVED_SLUGS`) but only 4 are published. The two missing: `april-richtfest-in-75242-muenisngen` (note the typo "muenisngen"), `aprilt-richtfest-in-7177-steinheim` (note "aprilt"). These were either never published or never seeded — check with the team.

### `locations` (13 rows) — Musterhäuser, Vertriebsbüros, HQ

- **`Musterhaus Bad Vilbel`** + **`Musterhaus Fellbach`** — both have `address` containing the literal string `TODO: Straße und Hausnummer, ...`. `postalCode`, `phone`, `email` all `NULL`. This serializes into Layout's `getLocations({ kind: "showhouse" })` and then into the hydration payload for every page. Verified visible at `/musterhaus/bad-vilbel`:
  - `body.innerText` includes: `"... MUSTERHAUS Bad Vilbel erleben. TODO: Straße und Hausnummer, 61118 Bad Vilbel Alle Musterhäuser ADRESSE & ANFAHRT ..."`
  - Same for `/musterhaus/fellbach`.
- **`Vertriebsbüro Eltville`** — `phone IS NULL`, `email IS NULL`, `agents = 0`. The other 10 offices have 1+ agent each.
- **`Zentrale Bad Kissingen`** — `email IS NULL`. Probably should be `info@boholz-haus.de`.
- **`Vertriebsbüro Bad Mergentheim`**, **`Vertriebsbüro Hammelburg`**, etc. — no `location_media` rows. Confirms the "office galleries" feature isn't populated yet.

**Karte vs hardcoded list divergence (critical):**

The map on `/vor-ort-beratung` is DB-driven; the four `<ul>` lists below it are hardcoded in `src/pages/vor-ort-beratung.astro`. Diff:

| Office | In DB? | In page list? |
|--------|--------|---------------|
| Wenkheim | no  | yes (`buerosBW`) |
| Horb-Nordstetten | yes | yes |
| Schwäbisch Gmünd | no  | yes (`buerosBW`) |
| Villingen-Schwenningen | yes | yes |
| Rielasingen-Worblingen | no  | yes (`buerosBW`) |
| Bonndorf | no  | yes (`buerosBW`) |
| Hammelburg | yes | yes |
| Bad Kissingen | yes (HQ) | yes |
| München | yes | yes |
| Werneck | no | yes (`buerosBY`) |
| Bad Mergentheim | yes | no |
| Eltville | yes | no |
| Jockgrim | yes | no |
| Mainz | yes | no |
| Speyer | yes | no |
| Tholey-Hasborn | yes | no |

Six DB offices not on the page list; five page-list offices not in the DB. The page hero copy is also wrong: it says `"Drei Musterhäuser, zehn Vertriebsbüros"` — DB has 2 showhouses + 11 offices. **The hardcoded lists need to be either deleted (relying solely on the map+marker detail) or replaced with a DB-driven render.**

### `agents` (15 rows)

- **0 / 15 have a photo.** All `agent_media.length === 0`. Detail cards render with a default silhouette/initials placeholder.
- **2 placeholder agents:**
  - `agents.slug = "berater-bad-vilbel"`, `fullName = "TODO: Vorname Nachname"`, `email = "TODO: name@boholz.de"`, `phoneNumber = "TODO: +49 ..."`. Linked to `Musterhaus Bad Vilbel`.
  - `agents.slug = "berater-fellbach"`, same pattern, linked to `Musterhaus Fellbach`.
  These render visibly in the Musterhaus detail page's `Ansprechpartner` block. Hard blocker.
- The other 13 agents have plausible name/role/email/phone but no `bio` (all NULL).

---

## 2. Page-level issues

### `src/pages/impressum.astro`

- `:34`, `:38` — `Michael Schäfer` named as Geschäftsführer. DB has `wilfried-bolz` with role "Geschäftsführer". Reconcile.
- HRB 10618, USt-IdNr. DE 283 854 274, AG Schweinfurt — verify with client these are current.

### `src/pages/datenschutz.astro`

- `:38` — Hosting via "Hetzner". Confirm.
- `:62` — `datenschutz@boholz-haus.de`. Confirm mailbox exists.
- `:127–149` — entire Google Tag Manager + Google Analytics section. **There is no Google script in the codebase** (verified by grep). Either the GA/GTM integration is missing-implementation, or the privacy text is incorrect. Pick one.
- `:152–155` — OpenStreetMap clause. Site actually uses MapLibre with a custom raster style. The page references the right service-provider name but the description is generic OSM; double-check that the actual tile server (OSMF? a custom MapLibre style?) matches what we deploy. See `docs/maps-masterclass.md`.

### `src/pages/cookies.astro`

- `:49–71` — cookie table lists `_ga`, `_ga_*`, `_gid`, `_gat`. If we don't actually load GA, none of these are set. Aligns with datenschutz finding above — same source-of-truth question.
- `:99` — `datenschutz@boholz-haus.de` (same mailbox).

### `src/pages/kontakt.astro`

- `:46–48` — `StatBlock` claims "5 Standorte". DB has 13 (2 showhouses + 11 offices). Likely refers to Vertriebsbüro-class only excluding the new ones; either way the number is now wrong.
- `:71–72` — Telefon `0971 / 78 55 57 15`, E-Mail `info@boholz-haus.de` — same numbers as impressum. Cross-check with the per-agent emails (`a.bauder@`, `m.rossol@`, …) for routing consistency.

### `src/pages/karriere.astro`

- File header (`:1–14`) labels several sections as `PLACEHOLDER COPY — needs sign-off`. The IconList items in `taetigkeitsfeld` and `vorteile` need explicit client approval.
- `:166`, `:181` — `bewerbung@boholz-haus.de`. Confirm mailbox.

### `src/pages/vor-ort-beratung.astro`

- `:111` — hero subtitle "Drei Musterhäuser, zehn Vertriebsbüros, eine Zentrale in Bad Kissingen." DB-actual: **2 showhouses, 11 Vertriebsbüros, 1 HQ**.
- `:141` — visible literal placeholder string: `"Spüren Sie Materialien, Wandstärken und Lichtführung vor Ort. Bildmaterial folgt — bis dahin ein Platzhalter."`
- `:139–144` — heading "Drei Häuser zum Anfassen." but the array `musterhaeuser` only contains 2 entries. Fix copy or add the third showhouse to DB.
- `:30–44`, `:56–100` — hardcoded location arrays diverge from the DB (see table above). Pick one source of truth.

### `src/pages/index.astro`

- No issues with placeholder text or broken images at viewport `1440×900`. Page renders 14 images, all 200.
- `imgCount: 14, brokenCount: 0, noAltCount: 0` at desktop viewport.

### `src/layouts/Footer/Footer.astro`

- `:82–99` — four social-network anchors with `href="#"`. Empty links. Either populate with real URLs or remove the icons entirely.
- `:42` — `<a href="">` for "Ihre Privatsphäre-Einstellungen". Should bind to the cookie-consent reopen handler (Reka-UI or whatever drives `CookieConsent.vue`). Currently navigates to the current URL (no-op-ish).
- `:73` — copyright year: `© {currentYear}` (`= new Date().getFullYear()`), evaluated server-side at build. Auto-updates. Good.

### `src/layouts/Layout.astro`

- `:36–39` — only `<title>` and favicon links. No `<meta name="description">`, no `<meta name="robots">`, no Open Graph, no Twitter card, no `<link rel="canonical">`. All pages share the same minimal head. Add per-page `description` + `og:*` from `content.seo.*` (already declared in `uebersicht.content.ts` etc., but never rendered).
- `:37` — `<link rel="icon" href="/favicon.ico" />` but `public/` contains **only** `favicon.svg`. The `.ico` fallback returns 404 (verified). Either add a real `.ico` for legacy browsers (IE/Edge-legacy/some crawlers) or remove the line.
- No `manifest.json` declaration in `<head>`, but `public/manifest.json` exists. Add `<link rel="manifest" href="/manifest.json" />` or remove the file.

---

## 3. Forms (`src/features/ContactForms/`)

Both `ContactForm.vue` and `CatalogForm.vue` render fully — fields, validation hooks via `*.zod`, sectioned headings, submit button.

**Neither form has any submission logic:**

- `ContactForm.vue:23` — `<form novalidate>`, no `@submit`, no `:onsubmit`.
- `CatalogForm.vue:30` — same.
- Submit buttons (`ContactForm:43`, `CatalogForm:90`) are `type="submit"`, so they trigger native form submit → page reload to the same URL with `?` query string. No backend, no email transport.

Action: pick a transactional email service (Postmark / SendGrid / Brevo), implement `/api/contact` and `/api/catalog` endpoints (Astro server routes or Vue submission handler), wire to the forms, configure DKIM/SPF for `boholz-haus.de`. Add catalog PDF storage on R2 + a signed link in the response email for the catalog flow.

---

## 4. SEO / metadata gaps

Audit at 1440×900 across 12 routes:

| Route | `<title>` | meta `description` | OG | h1 | h2 |
|-------|-----------|-------------------|-----|----|----|
| `/` | yes | **no** | **no** | 1 | varies |
| `/hauser` | yes | **no** | **no** | 1 | 0 |
| `/bauen-mit-boholz` | yes | **no** | **no** | 1 | 7 |
| `/ihr-neues-zuhause` | yes | **no** | **no** | 1 | 7 |
| `/uber-uns` | yes | **no** | **no** | 1 | 4 |
| `/vor-ort-beratung` | yes | **no** | **no** | 1 | 5 |
| `/kontakt` | yes | **no** | **no** | 1 | 3 |
| `/katalog` | yes | **no** | **no** | 1 | 2 |
| `/news` | yes | **no** | **no** | 1 | 0 |
| `/karriere` | yes | **no** | **no** | 1 | 4 |
| `/impressum` | yes | **no** | **no** | 1 | 11 |
| `/datenschutz` | yes | **no** | **no** | 1 | 6 |
| `/cookies` | yes | **no** | **no** | 1 | 6 |

- All titles emit. All `h1` counts = 1 (good).
- **0 / 13 pages have meta description.** Add via `Layout.astro` prop `description?: string` and render `<meta name="description" content={description} />` when provided.
- **0 / 13 pages have OG tags.** Same fix — accept `ogImage`, `ogDescription`, render canonical OG block.
- **0 sitemap.xml, 0 robots.txt.** Astro has `@astrojs/sitemap` integration; we should add it before launch.
- `/hauser` has `h2 = 0` — investigate whether the per-model card titles use `h3` directly (skipping `h2`). Likely a tiny outline issue.

Page-specific content modules already declare SEO (`uebersicht.content.ts:64–68` exports `seo.title` + `seo.description`), but `Layout.astro` only reads `title`. Plumb through.

---

## 5. Images

- **All R2 paths probed:** 166 `media.path` HEAD requests sent. Two 404s flagged in §1 (`bungalow-22-117` second hero, `stadtvilla-22-157` thumb).
- **Hero / values images on `/uber-uns`:** all 200 (`hero-werte.png`, `value-1.jpg`, `value-2.jpg`, `value-3.jpg`).
- **Landing-page lifestyle images:** all 200 (`overview-hero.webp`, `lifestyle-05.webp`, `lifestyle-06.webp`).
- **40 `media` rows without alt text** — see §1, mostly floor plans + a handful of gallery WebPs. Recommend a one-off SQL update to add alt text. Floor plans → `"Grundriss <floor> <model>"`; gallery → `"<model> – Außen/Innenansicht <n>"`. Or hand off to copywriter for human-quality alt.
- **No CLS sizes on lots of pages:** `bauen-mit-boholz` has 9 images without `width`/`height`, `ihr-neues-zuhause` has 14, `hauser` has 3. Layout shifts likely on first paint. Not a content gap but worth flagging during the same pass.
- **No `loading="lazy"` audit done** — out of scope, but worth checking before launch.

---

## 6. Footer / nav consistency

- Footer social icons (FB / IG / YT / LI) have `href="#"` — see §2 Footer.
- Footer cert badges (`FOOTER_CERTIFICATIONS`) — visually fine, no findings.
- Navbar `Showhouses` dropdown surfaces the two `TODO:` placeholder addresses (via `getLocations({ kind: "showhouse" })` injected on every Layout render). Fixes when DB locations are updated.

---

## 7. Tasks owned by our team (no client input needed)

1. **Forms:** wire `ContactForm` + `CatalogForm` to a transactional email service. Pick one + ask client for the recipient address (already in client report row 10).
2. **Layout SEO plumbing:** add `description`, `ogImage`, `ogDescription`, `canonical` props to `Layout.astro`. Render them. Read from each page's `*.content.ts` `seo.*`.
3. **Add `@astrojs/sitemap`** integration. Configure `site` in `astro.config.mjs`.
4. **Add `robots.txt`** to `public/`.
5. **Fix favicon fallback:** generate a real `favicon.ico` (16+32+48 px) from the SVG mark, or remove the `.ico` link line.
6. **Add `<link rel="manifest">`** to `Layout.astro`, or delete `public/manifest.json`.
7. **Fix `Pultdachhaus 21-369-225` vs `21-349-225`** title/code mismatch in DB once client confirms (client report row 30).
8. **Fix `Generationenhaus 28-244-160` vs `28-264-160`** title/code mismatch in DB once client confirms.
9. **Bungalow 22-117 dedup:** delete the orphan `media` row + `model_media` pivot for `/images/models/bungalow/bungalow-22-117/hero.jpg` once client confirms the live hero is correct (client report row 25).
10. **Stadtvilla 22-157 thumb:** delete the `isThumbnail=true` pivot pointing to the 404, or repoint to the working hero, once client confirms (client report row 27).
11. **Footer empty links:** wire social icons or remove the block (depends on client row 7).
12. **`/vor-ort-beratung`:** replace hardcoded `buerosBW` + `buerosBY` arrays with a DB-driven render (`getLocations({ kind: 'office' })`). Update hero subtitle to read from `locations.length`.
13. **Hero copy on `/vor-ort-beratung`:** swap "Drei Musterhäuser" → either "Zwei" (matching DB) or add a third showhouse to DB.
14. **Datenschutz GA section:** if no GA is being added, remove the GTM/GA/cookie-table paragraphs; otherwise add the GA script (with consent gating). Depends on client row 5.
15. **Media alt text backfill:** SQL update to populate `alt` on the 40 NULL rows. Floor plans get systematic alt (`"Grundriss <floor.title> – <model.title>"`); gallery WebPs need 1-line each — either auto-generate from model title or hand off to copywriter.
16. **Image `width`/`height`:** add intrinsic sizes to the `bauen-mit-boholz` and `ihr-neues-zuhause` content-page images to kill CLS.

---

## 8. Things explicitly checked & found CLEAN

- **Placeholder strings in source code:** `grep -rn 'TODO\|TBD\|Lorem\|FIXME\|XXX\|Coming soon'` over `src/` returned only one hit: `src/pages/sandbox/section-navigator.astro` (sandbox-only, not in nav, not linked from public routes). Lorem-ipsum-free production output.
- **Image filename professionalism:** no `IMG_XXXX`-style filenames in `media.path` (all semantic).
- **DB orphaned media:** 0 unreferenced `media` rows.
- **R2 hero image paths from content modules:** all 200 (homepage hero, uber-uns hero, landing lifestyle images).
- **Mobile-vs-desktop divergence:** spot-checked 6 routes at 390×844 — no exclusive mobile breakage. Same placeholder strings surface either way (they're in HTML, not in CSS-conditional content).
- **Per-page `<title>`:** 13/13 routes emit a unique, sensible title.
- **One `<h1>` per page:** 13/13.
- **Footer copyright year:** auto-derives via `new Date().getFullYear()` — no stale `© 2024` to fix.
- **Cookie banner exists:** `CookieConsent.vue` hydrated via `client:visible` in Layout. Behavior not audited here (out of scope).

---

## 9. Verification log (commands run)

- DB audit (relational queries via Drizzle + R2 HEAD probes): run with `NODE_TLS_REJECT_UNAUTHORIZED=0 bun x tsx scripts/audit-content.ts` (script created + deleted per repo rules).
- Deep DB audit (per-anomaly drill-down): `NODE_TLS_REJECT_UNAUTHORIZED=0 bun x tsx scripts/audit-deep.ts` (script created + deleted).
- Page existence sweep: `await fetch(p)` for 13 routes — all 200 except the synthetic `/404-test-nonexistent` which correctly returns 404.
- Placeholder-string sweep: `await fetch(p).then(r => r.text())` + substring scan for `lorem ipsum`, `platzhalter`, `bildmaterial folgt`, `todo`, `tbd`, `undefined`, `{{` — hits as recorded above.
- Specific R2 image probes (page-level heroes): `curl -sI ... -o /dev/null -w "%{http_code}"` — 7/7 returned 200.
- Playwright visual sweep: `/`, `/hauser`, `/news`, `/musterhaus/bad-vilbel`, `/haus/kubus-0-190`, `/haus/bungalow-22-117` at both 1440×900 and 390×844.

Console errors during sweep: 1 unrelated dev-server WS warning. No content-related console errors.

---

## 10. Suggested launch-readiness gate

Block launch on at minimum: **rows 1, 2, 3, 4, 5, 8, 9, 10, 12, 13, 14, 15, 24, 25, 30, 32** of the client report (all 16 marked Blocker). Plus internal §7 items 1, 2, 11 (forms wired, SEO plumbed, footer links resolved).

Strongly recommend, but not strictly blocking: rows 17, 20, 26, 28, 36, 37.

Estimated client-side response time (honest): ~75 minutes if they batch via email; ~30 minutes if we run the walkthrough call.
Estimated team-side implementation time after client input: ~6–10 hours (forms wiring is the biggest item; DB updates are fast).
