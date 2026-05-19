# Static Pages — Client Feedback Pass (2026-05-18)

Two pages touched: `/unser-versprechen` and `/dein-zuhause`. No new components, no
DB work, no homepage / navbar changes.

## `/unser-versprechen` — `src/pages/unser-versprechen.astro`

1. **Hero image.** Added `image={nachhaltigkeitHero}` + `imageAlt` to the
   `<PageHero>`. Reuses the existing R2 asset
   `/images/content/advantage/nachhaltigkeit/hero.webp` — strongest Advantage
   hero already on disk. Alignment stays `center`.
2. **Zertifikate & Siegel.** Imported `Proof-Section.vue` and dropped it into
   a new `.band.full-width` band immediately under the hero. Sprite is
   already injected globally by `Layout.astro` — colour variants
   (`#badge-iso-color`, etc.) render straight away. Scoped `.proof-band`
   tunes `--proof-color: var(--clr-content-secondary)` so the label reads on
   the tinted band; `padding-block: var(--spacing-5)` keeps it tighter than
   the editorial bands.
3. **`qualityStats` rewrite (3 cards).** Replaced verbatim per client brief:
   - `Qualität` / `ständig überwacht` — "Unsere Güter werden ständig
     überwacht — eigene Qualitätskontrollen plus unabhängige
     Fremdüberwachung."
   - `18 Monate` / `Festpreisgarantie` — "Bei uns haben Sie 18 Monate
     Festpreisgarantie auf Ihr Bauprojekt."
   - `Deutschland` / `Made in Germany` — "Jedes Haus wird in Deutschland
     produziert."
   Removed the stale `// Section 2 — Qualität & Zertifikate stats` comment
   block (the QDF/GDF/Keitel rationale no longer applies).
4. **Holzfaserdämmung qualifier (`sechzehnGruende` item 1).** Now reads
   "Nachhaltige diffusionsoffene ausgedämmte Außenwände — optional mit
   Holzfaserdämmplatte für sommerlichen Hitzeschutz und besten Wohnkomfort."
5. **Bodenplatte qualifier (`sechzehnGruende` item 3).** Now reads "Optional
   gedämmte Bodenplatte zur Einhaltung klimafreundlicher KfW-Vorgaben."
6. **Keitel-Haus mentions removed.** Two spots rewritten so BoHolz owns the
   narrative directly:
   - Section 02 lede: removed "Unser starker Partner Keitel-Haus…" framing.
     New copy: "BoHolz vereint jahrzehntelanges Wissen rund um den
     Fertighausbau mit moderner CNC-Fertigung. Das Ergebnis: handwerkliche
     Wertarbeit im traditionellen Sinne, getragen von einer Manufaktur, die
     jeden Schritt selbst verantwortet."
   - StepCard "Tradition" description: "…getragen vom Partner Keitel-Haus"
     → "…getragen von einer eigenständigen Manufaktur in Deutschland."
   Verified zero remaining "Keitel" matches on the page.

## `/dein-zuhause` — `src/pages/dein-zuhause.astro`

1. **KfW link.** Appended a second `<p>` to the "Hinweis zur Förderung"
   Callout: "Förderbedingungen ändern sich laufend. Die jeweils aktuellen
   Konditionen finden Sie auf [www.kfw.de](https://www.kfw.de)." Anchor
   opens in a new tab with `rel="noopener noreferrer"`. The
   "Zinskonditionen orientieren sich am Kapitalmarkt…" sentence stays. The
   Callout component had no anchor styling, so a small scoped rule was
   added via `:global(a)` inside `.callout-slot` — accent colour, 1px
   underline at `0.2em` offset, hover → `--clr-accent-secondary`, focus
   ring tied to `--clr-accent-primary`.
2. **Technikfertig — Rohinstallation Sanitär.** `building-stages.content.ts`
   description updated to read "…Heizung, Elektrik und Rohinstallation für
   Sanitär." (was "Heizung, Sanitär, Elektrik"). Implies finished plumbing
   was promised; now the bullet matches what's actually delivered.
3. **Ausbauhaus image swap — BLOCKED.** Client asked to reuse the
   Technikfertig imagery on Ausbauhaus, but only after stripping
   Außenanlage. Audit flag stands: the current `utility-ready.webp` does
   show landscaping, so swapping it onto Ausbauhaus would import the same
   problem one tile to the left. Left `shell.webp` in place on Ausbauhaus
   and added a `TODO(client 2026-05-18)` comment on the field documenting
   the blocker — swap proceeds the moment a clean Technikfertig variant
   lands on R2.

## Not done / open

- **Keitel-Haus mention on `/dein-zuhause`.** Section "02 · Architektur"
  still contains "In Zusammenarbeit mit der renommierten Keitel-Haus GmbH
  in Rot am See-Brettheim, dem Geburtsort und der Produktionsstätte jedes
  BoHolz-Hauses…" The client's Keitel-removal item lived in the
  `/unser-versprechen` brief only; flagging here so the next pass can
  decide whether to extend the rule to this paragraph too.
- **Keitel logo treatment.** Brief allowed keeping a Keitel logo
  ("gerne das Logo mit einbringen") if a partnership mark exists; no
  such asset is present in `src/icons/` or referenced anywhere on
  `/unser-versprechen`, so nothing to wire up.
