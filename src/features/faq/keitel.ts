// Keitel + BoHolz partner copy registry, sourced from the client revision
// document `dev/todo/aenderungen-homepage-2.md`. Consumed by
// uber-uns.astro, bauen-mit-boholz.astro, karriere.content.ts, qa.ts.

const strings: Record<string, string> = {
  qaWerksfuehrung:
    "<p>Die Werkführung bei BoHolz ermöglicht Ihnen einen Blick hinter die Kulissen unserer modernen Fertigung.</p>",
  versprechenTraditionCard:
    "Seit Generationen verbinden wir traditionelles Handwerk mit moderner Fertigungstechnik.",
  karriereVorteilBullet:
    "Attraktive Vergütung, flexible Arbeitszeiten und ein familiäres Umfeld.",

  // Section 02 — Zwei starke Partner (BoHolz Haus intro)
  uberUnsPartnerLede:
    "Ihr Premium Vertriebspartner: gemeinsam mit Keitel Haus bauen wir Premium-Fertighäuser aus Holz — von der ersten Skizze bis zur Schlüsselübergabe.",
  uberUnsLeadProseOpener: "Als Vertriebsgesellschaft hat",
  uberUnsLeadProse:
    "BoHolz Haus höchste Ansprüche an Qualität und Nachhaltigkeit beim Hausbau.",
  uberUnsLeadProseSecond:
    "Deshalb beraten und begleiten wir Sie umfassend zu allen Fragen und Wünschen rund um Ihr individuelles Traumhaus. Unsere erfahrenen Hausberater sorgen dafür, dass von der Planung Ihres BoHolz Fertighauses bis zum Abschluss Ihres Hausvertrags alles zu Ihrer vollsten Zufriedenheit abläuft. Dabei geben wir Ihnen wichtige Informationen und Tipps, beginnend bei der aktuellen Förderung von KfW Baudarlehen, bis zur Finanzierung.",
  uberUnsPartnerPullQuote:
    "Mit diesen umfassenden Beratungsleistungen legen wir den Grundstein für Ihr Traumhaus.",

  // Section 04 — Unser starker Partner Keitel Haus
  uberUnsKeitelHeading: "Unser starker Partner",
  uberUnsKeitelHighlight: "Keitel Haus",
  uberUnsKeitelLede:
    "Für uns steht die absolute Zufriedenheit unserer Kunden im Mittelpunkt.",
  uberUnsKeitelPullQuote:
    "Qualität vor Quantität. Individualität vor Standardlösungen. Beratung vor Überredung.",
  uberUnsKeitelVideoCaption: "Einblick in die Keitel-Fertigung",
  uberUnsKeitelVideoLabel: "Video abspielen",

  uberUnsStatCaption: "Jahre Erfahrung im Fertighausbau",
  uberUnsWasWirTunLede:
    "Wir bauen Fertighäuser in höchster Qualität — nachhaltig, individuell und mit Leidenschaft.",
};

const arrays: Record<string, string[]> = {
  // Rendered as: prose[0..1] → pull quote → prose[2..].
  // Retained for backwards compatibility — `uber-uns.astro` no longer reads
  // this array (the principles + financial claim were lifted out into
  // structured data below; see `keitelPrinciples` and `keitelFinancial`).
  // If another page begins consuming these strings, keep them in sync.
  uberUnsKeitelProse: [
    "Deshalb setzen wir von BoHolz Haus als Premium Vertriebspartner auf die Kompetenz unseres renommierten Partners Keitel Haus. Keitel Haus übernimmt von der detaillierten Planung Ihres Hauses bis zur kompletten Fertigstellung alle Arbeiten aus einer Hand. Keitel Haus ist ein renommiertes Familienunternehmen mit Sitz in 74585 Rot am See-Brettheim (bei Rothenburg o.d. Tauber).",
    " Seit über 90 Jahren widmet sich Keitel-Haus intensiv dem nachhaltigen Baustoff Holz und nutzt dessen Vorzüge täglich im qualitativ hochwertigen Fertighausbau — von Einfamilien- bis zu Generationenhäusern.",
    "Auch spezielle Wünsche wie Kombinationen von Wohn- und Arbeitsbereichen oder individuelle Erweiterungen setzt Keitel Haus mit seinem Partner BoHolz Haus gerne um.Ein weiterer Vorteil für alle Bauherren:",
  ],

  // New: intro prose that precedes the principles block on `uber-uns.astro`.
  // Two short paragraphs: who Keitel is (Familienunternehmen, location) and
  // what they do (90 Jahre Holzbau, Einfamilien- bis Generationenhaus). The
  // editorial weight then transfers to the structured principles block.
  uberUnsKeitelIntroProse: [
    "Deshalb setzen wir von BoHolz Haus als Premium-Vertriebspartner auf die Kompetenz unseres renommierten Partners Keitel-Haus. Keitel-Haus übernimmt von der detaillierten Planung Ihres Hauses bis zur kompletten Fertigstellung alle Arbeiten aus einer Hand — ein Familienunternehmen mit Sitz in Rot am See-Brettheim, unweit von Rothenburg o. d. Tauber.",
    "Seit über 90 Jahren widmet sich Keitel-Haus dem nachhaltigen Baustoff Holz und nutzt dessen Vorzüge täglich im qualitativ hochwertigen Fertighausbau — von Einfamilien- bis zu Generationenhäusern.",
  ],

  // New: closing prose between the financial callout and the video block.
  // Optional in render — keeps a soft transition; the video is the final beat.
  uberUnsKeitelOutroProse: [
    "Auch spezielle Wünsche — Kombinationen von Wohn- und Arbeitsbereichen, individuelle Erweiterungen — setzt Keitel-Haus gemeinsam mit BoHolz gerne um.",
  ],
};

/**
 * The four guiding principles of Keitel-Haus, expressed as dualistic pairs:
 * the first term is what the brand stands for, the second is what it rejects.
 * Lifted out of `uberUnsKeitelPullQuote` so they can render as scannable
 * design rather than as a single flattened sentence.
 */
export interface KeitelPrinciple {
  /** What the brand commits to. Rendered dominant. */
  primary: string;
  /** What the brand rejects. Rendered as the "vor X" counterpoint. */
  counter: string;
}

export const keitelPrinciples: readonly KeitelPrinciple[] = [
  { primary: "Qualität", counter: "Quantität" },
  { primary: "Individualität", counter: "Standardlösungen" },
  { primary: "Umfassende Beratung", counter: "Überredung" },
  { primary: "Transparente Baubeschreibung", counter: "Kleingedrucktem" },
];

/**
 * The financial-independence claim, lifted from prose into a stat-style
 * callout. Keitel-Haus operates exclusively on own capital — surfaced as
 * a substantive highlight under the principles block.
 */
export interface KeitelFinancial {
  value: string;
  label: string;
  caption: string;
}

export const keitelFinancial: KeitelFinancial = {
  value: "100 %",
  label: "Eigenmittel",
  caption:
    "Als finanziell solides Unternehmen operiert Keitel-Haus ausschließlich mit eigenen Mitteln — unabhängig von externen Finanzierungspartnern. Alle Ressourcen fließen gezielt in Qualität, Nachhaltigkeit und Ausstattung der Häuser.",
};

export function keitel(key: string): string {
  return strings[key] ?? `[MISSING: ${key}]`;
}

export function keitelArray(key: string): string[] {
  return arrays[key] ?? [`[MISSING: ${key}]`];
}
