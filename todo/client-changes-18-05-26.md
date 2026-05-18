# Client Change Requests — Homepage — 2026-05-18

**Source:** Client email, Monday 2026-05-18 morning  
**Deadline:** Revised version must be reviewable by client **Tuesday 2026-05-19 PM**  
**Live target:** Wednesday **2026-05-20**  
**Tone:** Client is frustrated but constructive. Treat every item as
non-negotiable unless I explicitly override.

---

## Critical context — read first

The client feels content decisions were made without their input. From
now on:

- Do NOT add comparative content (vs. competitors, vs. other house types)
  unless explicitly requested
- Do NOT add expansion/customization questions or FAQ content the client
  didn't supply
- Do NOT invent financial framings ("starting at X €", payment options,
  etc.) unless the client provides the exact wording
- When in doubt about content, leave a placeholder and flag it — don't
  fill the gap creatively

---

## Action items (in order of execution)

### 1. Homepage hero — revert to first draft

- The current hero is not what the client wants
- Use the hero **from the first draft** ("1. Entwurf")
- Specifically: the hero **with the lake image** ("Bild vom See!")
- The lake image is in `old-design/` — locate the version they originally
  approved
- Aspect ratio, treatment, type overlay: match the first draft, not
  current implementation

### 2. Certifications — switch from monochrome to color

- Currently rendered in grayscale / single color
- Use the **official colored versions** of each certification logo
- Sources: certification authority websites, or check `old-design/` and
  the brand assets folder for color versions
- If you don't have color versions of all certifications, flag which
  ones are missing rather than rendering some color and some grayscale
  (consistency matters)

### 3. Remove pricing line

- Remove **"Ab 200.000 € zzgl. Überführung"** wherever it appears on
  the homepage
- Do not replace with another price or "starting from" framing
- The client does not want public pricing on the homepage

### 4. Italic typography — color change

- Every italic text on the homepage should be in **BoHolz-Haus Blau**
  (the brand blue)
- Find the exact hex in `style/` (likely `--color-brand` or `--accent`
  or similar — check tokens)
- Apply via a CSS rule for `em`, `i`, or whatever italic class is being
  used — verify the rule cascades through all italic instances
- Audit the page after applying: every italic word should now be blue

### 5. Remove "Vergleich mit Massivhaus und Steinhäusern" section

- The comparison section with stone/solid-construction houses
- **Remove entirely** — do not just hide, remove the component from
  the page
- The client questioned why this was added at all

### 6. Remove "Kann ein BoHolz-Haus erweitert werden?" FAQ

- This expansion FAQ item
- Client said: "Das ist Schwachsinn, bitte rausnehmen"
- Remove the question and answer from the FAQ section
- If this leaves the FAQ section thin, do not add filler — leave it as is

### 7. Remove "Was kann ich an Eigenmitteln und Eigenleistung einbringen?"

- This FAQ item about self-funding and self-performed work
- Remove entirely
- Same rule: no filler replacements

### 8. "Technikfertig" — remove Außenanlage (outdoor/landscaping work)

- In the "Technikfertig" (technically complete) construction phase
  description
- Remove any mention of **Außenanlage** (exterior grounds work) from
  the list of what's included
- The client says Technikfertig does NOT include exterior work — this
  is a factual correction

### 9. "Ausbauhaus" — use Technikfertig image

- The current image for **Ausbauhaus** (extension house / fit-out home)
  needs to be replaced
- Use the **image from Technikfertig** (without the Außenanlage element
  shown — verify the image doesn't depict landscaping)
- This is an asset swap; if no clean Technikfertig image exists without
  visible Außenanlage, flag it for the client to provide

---

## Workflow rules for this revision pass

1. **Work in order.** Items 1-9 above are sequenced. Don't skip ahead.
2. **One commit per item** with the format: `fix(homepage): item N - <description>`
3. **Screenshot after each change.** Mobile (390) and desktop (1440).
4. **Save all screenshots to** `design-audit/2026-05-18/revision-screenshots/`
5. **For any item that can't be cleanly completed** (e.g., missing color
   certification logos, missing image), STOP and flag in
   `todo/client-changes-2026-05-18-blockers.md` rather than improvising.
6. **Final pass:** after all 9 items, run a full-page screenshot at both
   viewports, and a Playwright smoke test that the page loads without
   console errors.

## What to expect from the client today

- The client said "im Laufe des Tages noch mehrere Änderungen zusenden" —
  "more changes coming throughout the day"
- Be prepared to append items 10+ to this list as they arrive
- Treat each new email from the client the same way: numbered items,
  one commit each, screenshots, blocker flags if needed

## Tone reminder

- This client is frustrated. The work should feel responsive, precise,
  exactly-what-was-asked-for.
- Do NOT add improvements they didn't ask for, even if you think they'd
  help. This is a trust-rebuilding pass. Stick to the brief.
- If you think something they're asking for will cause a problem
  (e.g., a section becoming too thin after removals), flag it
  separately — don't fix it unilaterally.
