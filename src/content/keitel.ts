/**
 * Site-wide toggle for the Keitel-Haus partner brand mentions. Client asked
 * to hide them in 2026-05; flip `SHOW_KEITEL_HAUS` to `true` to restore.
 */
export const SHOW_KEITEL_HAUS = true;

const copy = {
  versprechenTraditionLede: {
    with: "Unser starker Partner Keitel-Haus greift auf jahrelanges und generationenübergreifendes Wissen rund um den Fertighausbau zurück. Dies gewährleistet handwerkliche Wertarbeit im traditionellen Sinne, kombiniert mit modernster Technologie.",
    without:
      "BoHolz vereint jahrzehntelanges Wissen rund um den Fertighausbau mit moderner CNC-Fertigung. Das Ergebnis: handwerkliche Wertarbeit im traditionellen Sinne, getragen von einer Manufaktur, die jeden Schritt selbst verantwortet.",
  },
  versprechenTraditionCard: {
    with: "Generationsübergreifendes Wissen und Kompetenz rund um den Fertighausbau — handwerkliche Wertarbeit im traditionellen Sinne, getragen vom Partner Keitel-Haus.",
    without:
      "Generationsübergreifendes Wissen rund um den Fertighausbau — handwerkliche Wertarbeit im traditionellen Sinne, getragen von einer eigenständigen Manufaktur in Deutschland.",
  },
  zuhauseArchitektur: {
    with: "In Zusammenarbeit mit der renommierten Keitel-Haus GmbH in Rot am See-Brettheim, dem Geburtsort und der Produktionsstätte jedes BoHolz-Hauses, bieten wir Ihnen die perfekte Partnerschaft zweier starker Unternehmen. Diese Kooperation garantiert höchste Qualitätsstandards und jahrzehntelange Erfahrung im Fertighausbau.",
    without:
      "Jedes BoHolz-Haus wird in Rot am See-Brettheim gefertigt — von einer Manufaktur, die jeden Schritt selbst verantwortet. Jahrzehntelange Erfahrung im Fertighausbau und höchste Qualitätsstandards sind dabei keine Versprechen, sondern Voraussetzung.",
  },
  karriereVorteilBullet: {
    with: "Sie verkaufen ein Produkt, hinter dem ein gewachsenes Familienunternehmen und unser Partner Keitel Haus mit jahrzehntelanger Erfahrung stehen.",
    without:
      "Sie verkaufen ein Produkt, hinter dem ein gewachsenes Familienunternehmen mit jahrzehntelanger Erfahrung steht.",
  },
  uberUnsPartnerLede: {
    with: "Ein Verbund aus fachlicher Kompetenz, Wissen und jahrelanger Erfahrung — BoHolz-Haus übernimmt Vertrieb und Begleitung, Keitel-Haus die Produktion. Was Sie unterschreiben, hat ein Gesicht und 90 Jahre Holzbau hinter sich.",
    without:
      "Ein Verbund aus fachlicher Kompetenz, Wissen und jahrelanger Erfahrung. BoHolz-Haus übernimmt Vertrieb und Begleitung; produziert wird in unserer eigenen Manufaktur in Rot am See-Brettheim. Was Sie unterschreiben, hat ein Gesicht — und 90 Jahre Holzbau hinter sich.",
  },
  // Italic opener for the first paragraph of the partner section — the
  // "premium Vertriebspartner" tagline the client asked us to lead with.
  uberUnsLeadProseOpener: {
    with: "Ihr Premium Vertriebspartner BoHolz-Haus.",
    without: "Ihr Premium Vertriebspartner BoHolz-Haus.",
  },
  uberUnsLeadProse: {
    with: "Als Vertriebsgesellschaft hat BoHolz-Haus höchste Ansprüche an Qualität und Nachhaltigkeit beim Hausbau. Deshalb beraten und begleiten wir Sie umfassend zu allen Fragen und Wünschen rund um Ihr individuelles Traumhaus.",
    without:
      "BoHolz-Haus begleitet Sie von der ersten Idee bis zum fertigen Zuhause — persönlich, transparent und mit festen Ansprechpartnern an Ihrer Seite. Jeder Entwurf entsteht individuell und wird gemeinsam mit Ihnen geplant. Traditionelles Handwerk, moderne Fertigung und nachhaltige Bauweise bilden dabei die Grundlage jedes Hauses.",
  },
  uberUnsLeadProseSecond: {
    with: "Unsere erfahrenen Hausberater sorgen dafür, dass von der Planung Ihres BoHolz-Fertighauses bis zum Abschluss Ihres Hausvertrags alles zu Ihrer vollsten Zufriedenheit abläuft. Dabei geben wir Ihnen wichtige Informationen und Tipps — beginnend bei der aktuellen KfW-Förderung bis zur Finanzierung.",
    without:
      "Unsere erfahrenen Hausberater begleiten Sie persönlich — von der Planung Ihres Fertighauses bis zum Abschluss des Hausvertrags. Dabei geben wir Ihnen wichtige Informationen und Tipps zu Förderprogrammen und zur Finanzierung.",
  },
  uberUnsStatCaption: {
    with: "Erfahrung unseres Partners Keitel Haus aus Rot am See-Brettheim.",
    without: "Erfahrung aus unserer Manufaktur in Rot am See-Brettheim.",
  },
  uberUnsQuoteAuthor: {
    with: "BoHolz-Haus & Keitel Haus",
    without: "BoHolz-Haus",
  },
  uberUnsWasWirTunLede: {
    with: "Familien, Paare, Singles, Senioren — wir planen für die, die bauen. Mit Keitel Haus an unserer Seite bringen wir Kompetenz, Erfahrung und ein durchdachtes Komplettpaket auf Ihren Bauplatz.",
    without:
      "Familien, Paare, Singles, Senioren — wir planen für die, die bauen. Wir bringen Kompetenz, Erfahrung und ein durchdachtes Komplettpaket auf Ihren Bauplatz.",
  },
  qaWerksfuehrung: {
    with: "<p>Ja, mit unseren Kunden vereinbaren wir regelmäßige Werksführungen bei unserem starken Partner Keitel-Haus in 74585 Rot am See-Brettheim (bei Rothenburg o.d. Tauber). Gerne können Sie auf Wunsch auch persönliche Einzeltermine vereinbaren.</p>",
    without:
      "<p>Ja, mit unseren Kunden vereinbaren wir regelmäßige Werksführungen in unserer Manufaktur in 74585 Rot am See-Brettheim (bei Rothenburg o.d. Tauber). Gerne können Sie auf Wunsch auch persönliche Einzeltermine vereinbaren.</p>",
  },
  uberUnsKeitelEyebrow: {
    with: "Unser starker Partner",
    without: "Unsere Manufaktur",
  },
  uberUnsKeitelHeading: {
    with: "100% individuell.",
    without: "100% individuell.",
  },
  uberUnsKeitelHighlight: {
    with: "Kein Haus von der Stange.",
    without: "Kein Haus von der Stange.",
  },
  uberUnsKeitelLede: {
    with: "Ein Zuhause, das zu Ihnen passt. Für uns steht die Zufriedenheit unserer Bauherren an erster Stelle.",
    without:
      "Ein Zuhause, das zu Ihnen passt. Für uns steht die Zufriedenheit unserer Bauherren an erster Stelle.",
  },
  uberUnsKeitelVideoLabel: {
    with: "So entsteht ein Keitel-Haus",
    without: "So entsteht ein BoHolz-Haus",
  },
  uberUnsKeitelVideoCaption: {
    with: "BoHolz & Keitel-Haus — Qualität & Expertise im Fertighausbau.",
    without: "Qualität & Expertise im Fertighausbau.",
  },
  uberUnsPartnerPullQuote: {
    with: "Mit diesen umfassenden Beratungsleistungen legen wir den Grundstein für Ihr Traumhaus.",
    without:
      "Traditionelles Handwerk, moderne Fertigung und nachhaltige Bauweise bilden die Grundlage jedes Hauses.",
  },
  uberUnsKeitelPullQuote: {
    with: "Dabei steht nicht die Masse im Mittelpunkt, sondern jedes einzelne Zuhause.",
    without:
      "Dabei steht nicht die Masse im Mittelpunkt, sondern jedes einzelne Zuhause.",
  },
} as const;

// Multi-paragraph copy lives separately so the `keitel()` string contract
// stays intact. Read with `keitelArray("uberUnsKeitelProse")`.
const arrayCopy = {
  uberUnsKeitelProse: {
    with: [
      "Für uns steht die absolute Zufriedenheit unserer Kunden im Mittelpunkt. Deshalb setzen wir von BoHolz-Haus als Premium-Vertriebspartner auf die Kompetenz unseres renommierten Partners Keitel-Haus — von der detaillierten Planung bis zur kompletten Fertigstellung übernimmt Keitel-Haus alle Arbeiten aus einer Hand.",
      "Keitel-Haus ist ein renommiertes Familienunternehmen mit Sitz in 74585 Rot am See-Brettheim (bei Rothenburg o.d. Tauber). Seit über 90 Jahren widmet sich Keitel-Haus dem nachhaltigen Baustoff Holz und nutzt dessen Vorzüge täglich im qualitativ hochwertigen Fertighausbau.",
      "Keitel-Haus plant und realisiert maßgeschneiderte Wohnprojekte — vom Einfamilien- bis zum Generationenhaus. Auch spezielle Wünsche wie Kombinationen von Wohn- und Arbeitsbereichen oder individuelle Erweiterungen setzt Keitel-Haus mit BoHolz-Haus gerne um.",
      "Als Familienunternehmen mit 90-jähriger Geschichte legt Keitel-Haus großen Wert auf eine Unternehmenskultur mit festen Prinzipien: Qualität vor Quantität, Individualität vor Standardlösungen, umfassende Beratung vor Überredung, transparente Baubeschreibung vor Kleingedrucktem.",
      "Als finanziell solides Unternehmen, das ausschließlich mit eigenen Mitteln operiert, ist Keitel-Haus unabhängig von externen Finanzierungspartnern. Das gibt Ihnen gerade in der heutigen Zeit die nötige Sicherheit — so fließen alle Ressourcen gezielt in Qualität, Nachhaltigkeit und Ausstattung der Häuser.",
    ],
    without: [
      "Bei BoHolz-Haus steht die Zufriedenheit unserer Bauherren an erster Stelle.",
      "Wir beschäftigen uns seit Jahrzehnten mit dem nachhaltigen Baustoff Holz und zählen zu den erfahrenen Herstellern im modernen Fertighausbau. Von der individuellen Planung bis zur hochwertigen Fertigung entstehen Häuser, die Qualität, Energieeffizienz und Wohnkomfort vereinen.",
      "Gemeinsam realisieren wir maßgeschneiderte Wohnkonzepte – vom klassischen Einfamilienhaus bis hin zu individuellen Lösungen für modernes Wohnen und Arbeiten unter einem Dach.",
      "Dabei steht nicht die Masse im Mittelpunkt, sondern jedes einzelne Zuhause. Persönliche Beratung, transparente Leistungen, hochwertige Materialien und nachhaltige Bauweise bilden die Grundlage jedes Projekts.",
      "Als wirtschaftlich solides Familienunternehmen mit jahrzehntelanger Erfahrung bieten wir ein hohes Maß an Sicherheit und Verlässlichkeit — ein wichtiger Faktor für alle, die sorgenfrei bauen möchten.",
    ],
  },
} as const;

export type KeitelKey = keyof typeof copy;
export type KeitelArrayKey = keyof typeof arrayCopy;

export const keitel = (key: KeitelKey): string =>
  SHOW_KEITEL_HAUS ? copy[key].with : copy[key].without;

export const keitelArray = (key: KeitelArrayKey): readonly string[] =>
  SHOW_KEITEL_HAUS ? arrayCopy[key].with : arrayCopy[key].without;
