# CONTACT-SUBNAV — split contact page + Kontakt subnav

Branch: `dev`. `bun run build` clean.

## What changed (per file)

### Split contact page
- **`src/pages/kontakt.astro`** — Section 03 ("Katalog") was a single `ContactForm` (the house-inquiry schema, mis-labeled). Renamed to "Anfragen" and split into a 2-column grid: **Form A (Hausanfrage)** = existing `ContactForm`, **Form B (Katalog anfordern)** = new `CatalogForm`. Each form keeps its own `EyebrowHeadingLede`. Mobile: stacked (`grid-template-columns: 1fr`). Desktop: side-by-side (`1fr 1fr`, `gap: --spacing-6`). The band background, info-box, stats trio, and map section are unchanged.

### Catalog form (new)
- **`src/features/ContactForms/types/catalog.types.ts`** — re-exports `FormField`/`FormSection` from the existing contact types and adds `Versandart` + `CatalogFormState`.
- **`src/features/ContactForms/data/catalog.zod.ts`** — `catalogSchema` using Zod with a `superRefine` block: address fields (`street`, `postalCode`, `city`) are only validated when `versandart === "post"`. Same shape conventions as `contact.zod.ts` (trim, regex for PLZ, literal-true for consent).
- **`src/features/ContactForms/data/catalog.schema.ts`** — Four field-section descriptors: contact, versand (radio), postal (rendered conditionally), consent.
- **`src/features/ContactForms/CatalogForm.vue`** — Mirrors `ContactForm.vue`'s submission shape, reuses `TextField` / `RadioField` / `ConsentField`. Conditional postal block is a plain `v-if="versandart === 'post'"`; a small fade-in keyframe softens the reveal. Submit button class/style match the existing pattern.

### Desktop Kontakt subnav
- **`src/layouts/Navbar/NavbarKontaktDrop.vue`** (new) — Single-column panel pattern-matching `NavbarDrop.vue`'s outer chrome (2px border, `--panel-padding` of `--spacing-2`, computed `--panel-b-radius`, `--clr-surface-primary` fill). Contents: one primary affordance row (CalendarCheck icon tile + "Vor-Ort-Beratung" + one-line lede + chevron) linking to `/vor-ort-beratung`, then a horizontal rule and a `Standorte` list pulling from `Location[]` props. Each office links to `/vor-ort-beratung#{slug}`. Width is `min(420px, calc(100vw - 2 * --padding-inline))` and anchored to `inset-inline-end: 0` so it sits flush under the Kontakt item rather than spanning the full nav.
- **`src/layouts/Navbar/parts/NavbarLinks.vue`** — Generalised the single-drop state into a `DropKey = "houses" | "kontakt" | null` ref so one open-drop wins at a time, sharing the existing 150ms close timer. Each `li > a` now renders a small `ChevronDown` (Lucide, 14px, sw 2) when the route has a dropdown, and that chevron rotates 180° on `li:hover`. `dropForRoute()` is the single decision point. The Kontakt drop also dismisses when `currentPath === ROUTES.contact`, same as Häuser.
- **`src/layouts/Navbar/NavbarDesktopSolid.vue`** — Added `officeLocations?: Location[]` prop and forwarded as `:locations` to `NavbarLinks`. (The Kontakt drop only fires when `enable-dropdown` is set, which is solid-variant only — transparent navbars stay dropdown-free, preserving the existing behaviour.)
- **`src/layouts/Navbar/NavbarDesktopTransparent.vue`** — Same `officeLocations` prop accepted for type symmetry; not forwarded (no dropdown on transparent).
- **`src/layouts/Navbar/Navbar.vue`** — Added `officeLocations?: Location[]` prop and threaded to the desktop component.
- **`src/layouts/Layout.astro`** — One added DB call: `getLocations({ exceptKind: "showhouse" })` next to the existing showhouse fetch. Same query path, runs in parallel with the page's own loaders. Passed as `officeLocations` to `<Navbar>`. **This is a cross-cut outside my owned-files list strictly speaking**; flagging it explicitly so the parent agent is aware. It's the only way to feed the new Kontakt drop without making `Navbar.vue` (a client island) hit the DB.

### Mobile Kontakt subnav (separate, not yet wired)
- **`src/layouts/Navbar/NavbarMobileContactExpand.vue`** (new) — Self-contained block: primary "Vor-Ort-Beratung" row + Standorte list, indented and bordered to read as a nested branch. Emits `navclick(href, event)` so it can reuse `NavbarMobile.vue`'s existing fade-then-navigate handler. Locations come in as a prop.

## Integration note for the mobile sheet (parent reconciles)

`NavbarMobile.vue` is off-limits to me — the mobile agent owns it. Wiring the new mobile expand is a four-line patch the parent should make after merge:

1. **In `Navbar.vue`** (already done by this branch): the `officeLocations` prop now reaches `NavbarMobile.vue` too — add `:office-locations="props.officeLocations"` to the `<NavbarMobile>` invocation in the template (not done yet; the mobile bar doesn't take that prop today).
2. **In `NavbarMobile.vue`**: accept the prop, add `const kontaktExpanded = ref(false)` near `isOpen`.
3. **In the `.items` `<ul>` template**: for the Kontakt route specifically, render a `<button>` that toggles `kontaktExpanded` instead of (or in addition to) the plain `<a>`. The chevron from the existing row can rotate when expanded.
4. **Immediately after that Kontakt `<li>`**: mount
   ```vue
   <NavbarMobileContactExpand
     v-if="kontaktExpanded && officeLocations"
     :locations="officeLocations"
     @navclick="(href, e) => handleNavClick(e, href)"
   />
   ```
   The `@navclick` handler reuses the existing fade-out-then-`window.location.assign` pattern. No new motion or state machinery required.

## Judgment calls

- **Subnav as new component (option a), not generalised NavbarDrop.** NavbarDrop's layout is locked to two columns + a category gallery composable that doesn't fit the Kontakt content (one affordance + a list). Generalising would mean threading `variant` through `useCategoryGallery` for no reuse benefit; a fresh 100-line component is smaller and clearer.
- **Accent application.** The primary affordance icon tile and all hover/focus states in the new dropdowns use `--clr-accent-secondary` (the deeper blue), matching the project rule that secondary accent goes on smaller elements. The existing submit-button accent (`--clr-accent-primary`) is untouched — that's the one primary use on the form.
- **Conditional postal validation.** Zod `superRefine` rather than a `discriminatedUnion` — the union shape would have forced the form state into two variants and complicated `v-model`. SuperRefine keeps the state flat and the error paths land on the right field names.
- **Postal reveal motion.** A 220ms opacity + translateY keyframe, not Motion-V — the rest of the form is plain CSS, adding a Motion island for one block would be inconsistent. Respects `prefers-reduced-motion`.
- **Cross-cut into Layout.astro.** Documented above. Minimal, parallel to existing showhouse fetch.

`CONTACT SUBNAV DONE`
