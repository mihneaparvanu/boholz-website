import type { SpecGroup } from "./advantage.types";

/**
 * Verbatim extracts from the Bau- und Leistungsbeschreibung (BLB),
 * Stand September 2026 — `boholz/product-docs/BOL_BLB September_2026_low.pdf`.
 *
 * This is the contractual specification document. Every string below is
 * quoted character for character from the PDF; the `source` field on each
 * group names the page it came from so any figure can be checked against
 * the original. Three rules when touching this file:
 *
 *   1. Never paraphrase, never round, never translate a figure. Replace a
 *      block wholesale from the current BLB or leave it alone.
 *   2. Anything the BLB marks "Optional" stays in `options` (or carries
 *      `optional: true`) — standard scope and upgrades must stay visually
 *      separate, because the page reads as an offer.
 *   3. No connective prose. If a block needs a sentence the BLB does not
 *      contain, the sentence has to come from the client.
 *
 * Identical for every house model, which is why it is file-based and shared
 * rather than per-model data in Postgres.
 *
 * Two deliberate deviations from the PDF, both non-numeric:
 *   - S. 14 prints "Ihr Boholz-Haus"; written here with the brand's own
 *     capitalisation, "BoHolz-Haus".
 *   - S. 27 prints "erhältich"; written here as "erhältlich".
 */

/** Wände & Fassade — BLB S. 14, 16, 17, 18. */
export const wandSpecGroups: SpecGroup[] = [
  {
    heading: "Außenwände",
    paragraphs: [
      "Ihr BoHolz-Haus wird durch unseren Partner, die Keitel-Haus GmbH, in 74585 Rot am See-Brettheim produziert.",
      "Wir verwenden in unseren Wänden keine Folien und verzichten auf flächigen Einsatz von Styropor. Die Wände unserer Fertighäuser sind diffusionsoffen gebaut mit Holzfaserdämmplatte und hochwertigen OSB4 Platten mit PEFC Siegel. Bei der Gefachdämmung wird im kompletten Haus standardmäßig der Mineralwolle-Dämmstoff von Knauf mit ECOSE® Technologie verwendet, ausgezeichnet mit dem Blauen Engel.",
      "Auf Wunsch und nach Vereinbarung können Sie vor Ort das Werk besuchen und sich selbst von der hochwertigen Qualität und Bauweise überzeugen.",
    ],
    source: "BLB 09/2026, S. 14",
  },
  {
    heading: "Außenputz",
    paragraphs: [
      "Der Außenputz erfolgt an allen über der Kellerdecke/Bodenplatte befindlichen Außenwänden.",
      "Der Übergang zwischen Fassade und spritzwasserberührtem Sockelbereich wird mit einem schlagregensicheren Kompriband versehen.",
      "Auf die zum Wandaufbau gehörige Putzträgerplatte wird im Werk ein diffusionsoffener, armierter Grundputz aufgebracht.",
      "Als Ober- bzw. Edelputz wird nach Ihren Wünschen ein Kratzputz bis zu einem Hellbezugswert > 40 auf Silikonharzbasis 3,0 mm Körnung fugenlos aufgetragen.",
    ],
    options: [
      "Optional bieten wir Ihnen gerne andere Putzausführungen oder Farbklassen an.",
      "Optional bieten wir Ihnen einen Egalisations- oder Schutzanstrich an.",
    ],
    source: "BLB 09/2026, S. 16",
  },
  // S. 17 introduces all three with "Optional sind folgende Fassaden
  // erhältlich:" — hence `optional` on each group rather than a lead-in line.
  {
    heading: "Holz-Fassade",
    optional: true,
    paragraphs: [
      "Hier entfällt der Kratzputz. Waagerechte Profilschalung, mit offenporigem Lasuranstrich aus unserer Farbkollektion, Unterkonstruktion auf 60 mm feuchtebeständiger Holzweichfaserplatte.",
    ],
    source: "BLB 09/2026, S. 17",
  },
  {
    heading: "Paneel-Fassade",
    optional: true,
    paragraphs: [
      "Hier entfällt der Kratzputz. Dekorplatte ca. 8 mm (Dekore gem. Kollektion), ca. 30 mm Unterkonstruktion auf 60 mm feuchtebeständiger Holzweichfaserplatte.",
    ],
    source: "BLB 09/2026, S. 17",
  },
  {
    heading: "Klinker-Fassade",
    optional: true,
    paragraphs: [
      "Hier entfällt der Kratzputz. Stattdessen führen wir eine ca. 50 mm dicke Hinterlüftungsebene und ca. 100 mm dicke Vormauer-Klinkersteine aus ausgesuchten und hartgebrannten Tonen auf Basis unserer Musterpalette aus.",
    ],
    source: "BLB 09/2026, S. 17",
  },
  {
    heading: "Innenwände",
    paragraphs: ["Alle tragenden und nichttragenden Innenwände werden wie folgt aufgebaut:"],
    bullets: [
      "12,5 mm Feuerschutzplatte (GKF)",
      "12 mm OSB4-Platte",
      "100 mm starke Holzrahmenkonstruktion",
      "100 mm Knauf Insulation zwischen den Rahmen",
      "12 mm OSB4-Platte",
      "12,5 mm Feuerschutzplatte (GKF)",
    ],
    footnotes: [
      "Bei Projekten mit Einliegerwohnung erfüllen die Wohnungstrennwände die Mindestanforderungen der DIN 4109-1 (Schallschutz).",
    ],
    source: "BLB 09/2026, S. 18",
  },
];

/** Fenster, Fensterbänke, Rollläden, Dachflächenfenster — BLB S. 25, 26, 27. */
export const fensterSpecGroups: SpecGroup[] = [
  {
    heading: "Fenster und Fensterbänke",
    paragraphs: [
      "Die Fenster Ihres BoHolz-Hauses bestehen aus wetterfestem, stabilem, weißem Kunststoff mit hohem Anspruch an Qualität und Verarbeitung. Sämtliche Fenster sind schlagregendicht ausgeführt. Es werden wärmedämmende Sechs-Kammer-Profile verwendet. Die verwendeten Beschläge (nach RC1N) unseres Herstellers werden mit 4 Sicherheitspilzzapfen, 4 Sicherheitsschließstücken und 1 Getriebeaufbohrschutz ausgeführt und sind somit einbruchhemmend ausgestattet.",
      "Alle Fenster sind mit einer dreifach Wärmeschutzverglasung mit einer sogenannten „warmen Kante“ versehen, haben eine dauerbeständige Lippendichtung, und besitzen einen U-Wert der Verglasung von Ug=0,5 W/(m²K).",
      "Alle bodentiefen Fenster in oberen Geschossen haben, sofern im Angebot/Vertragspläne enthalten, feststehende absturzsichere Brüstungsverglasungen. Diese Sonderverglasungen besitzen einen U-Wert von Ug=0,7 W/(m²K).",
    ],
    specs: [
      { term: "Verglasung", value: "Ug=0,5 W/(m²K)" },
      { term: "Brüstungsverglasung", value: "Ug=0,7 W/(m²K)" },
      { term: "Beschläge", value: "nach RC1N" },
    ],
    options: [
      "Optional sind, anstelle der absturzsicheren Verglasung, französische Brüstungsgeländer in verschiedenen Ausführungen erhältlich.",
      "Optional können Sie aus unserer Musterkollektion auch Holz-, Kunststoff- oder Holz-Alu-Fenster in verschiedenen Ausführungs- und Sprossenvarianten sowie Farben wählen.",
    ],
    source: "BLB 09/2026, S. 26",
  },
  {
    heading: "Fensterbänke",
    paragraphs: [
      "Alle Außenfensterbänke werden in hochwertigem Granit ausgeführt. Sie sind mit einer zweiten Dichtungsebene versehen und bieten daher einen dauerhaften Witterungsschutz.",
      "Die Innenfensterbänke sind standardmäßig in einer Tiefe von ca. 9 cm und einem Überstand von ca. 2,5 cm ausgeführt und sind aus der Musterkollektion in Marmor- und Granit erhältlich.",
    ],
    options: [
      "Optional erhalten Sie selbstverständlich auch Fensterbänke aus Holz und Kunststein.",
    ],
    source: "BLB 09/2026, S. 27",
  },
  {
    heading: "Rollläden",
    paragraphs: [
      "Alle Fenster ab Oberkante Bodenplatte/Kellergeschossdecke enthalten Rollläden in verschiedenen Farben mit Gurtantrieb aus stabilen Aluminiumlamellen mit Lüftungsschlitzen.",
      "Aus technischen Gründen werden bei Schrägfenstern, Oberlichtfenstern, Rundfenstern und Dreiecksfenstern keine Rollläden ausgeführt.",
      "Die verdeckt liegenden Rollladenkästen sind wärmegedämmt.",
    ],
    options: [
      "Optional erhalten Sie elektrische Antriebe, Steuerungen sowie weitere Beschattungs- und Verdunklungsvarianten.",
    ],
    source: "BLB 09/2026, S. 27",
  },
  {
    heading: "Dachflächenfenster Ihres BoHolz-Hauses",
    paragraphs: [
      "Die Klapp-/Schwingfenster unseres Markenherstellers, sofern im Angebot/Vertragspläne enthalten, sind aus weißem Kunststoff mit einem Aluminiumeindeckrahmen in der Farbe grau, einer 3-fach-Wärmeschutzverglasung, manueller Bedienung über die Griffleiste oben und unten und ohne Rollladen ausgestattet.",
    ],
    options: [
      "Optional bieten wir Ihnen auch andere Dachflächenfenstertypen, Beschattungen, Insektenschutz und Tageslichtspots sowie weiteres Zubehör an.",
    ],
    source: "BLB 09/2026, S. 25",
  },
];

/**
 * Decken & Dach — BLB S. 19, 20, 22, 24, 25.
 *
 * Pultdach and Erkerdachanbindung (S. 23) are not listed separately: the
 * BLB prints the identical eight-layer build-up as the Binderdach, so a
 * third and fourth copy of the same list would only repeat itself.
 */
export const dachSpecGroups: SpecGroup[] = [
  {
    heading: "Geschossdecken",
    paragraphs: [
      "Die Holzbalkenlage bildet den massiven Kern der Geschossdecke über den einzelnen Wohngeschossen. Je nach Bauweise und Ausstattung ist die lichte Wohnraumhöhe bis 2,44 m möglich (gemessen von Oberkante fertiger Fußboden bis Unterkante fertige Raumdecke).",
      "Der Aufbau gliedert sich wie folgt von oben nach unten:",
    ],
    bullets: [
      "schwimmender Estrich auf Trittschalldämmung",
      "18 mm Holzwerkstoffplatte",
      "massive Holzbalkenlage lt. Statik in Konstruktionsvollholz (min. 240 mm)",
      "120 mm mineralische Dämmung im Gefach (im Deckenrandbereich voll ausgedämmt)",
      "12,5 mm Feuerschutzplatte (GKF) ungespachtelt auf Traglattung",
    ],
    options: [
      "Optional ist je nach Bauweise und Ausstattung eine lichte Wohnraumhöhe bis 2,64 m möglich.",
    ],
    source: "BLB 09/2026, S. 19",
  },
  {
    heading:
      "Geschossdecken mit Schallschutzanforderungen nach DIN 4109-1 für Häuser mit zweiter Wohneinheit",
    bullets: [
      "schwimmender Estrich auf Trittschalldämmung",
      "18 mm Holzwerkstoffplatte",
      "massive Holzbalkenlage lt. Statik in Konstruktionsvollholz",
      "Traglattung und Federschiene",
      "Beplankung mit Phonestar TRI 12,5 mm einlagig",
      "Feuerschutzplatte (GKF)",
    ],
    source: "BLB 09/2026, S. 19",
  },
  {
    heading: "Der Dachstuhl Ihres BoHolz-Hauses",
    paragraphs: [
      "Die Dachkonstruktion inklusive Sparren besteht bei unseren Dachstühlen immer aus KVH (kammergetrocknetes Konstruktionsvollholz) gemäß den statischen Erfordernissen.",
      "Die Konstruktion des Dachstuhls richtet sich außerdem nach den jeweiligen örtlichen Gegebenheiten und ist ohne Aufpreis für die Schneelastzone 1 (max. 2,5 kN/m² Belastung) und Windlastzone 2 ausgelegt.",
      "Sollte nach Prüfung der technischen Unterlagen eine stärkere Konstruktion für höhere Schnee- oder Windlasten notwendig sein, wird Ihnen diese Zusatzleistung gesondert berechnet.",
      "Der Dachstuhl bei Bungalows oder Stadtvillen wird als hochwertige Binderkonstruktion ausgeführt.",
      "Der Dachstuhl und die Kehlbalkenlage (falls vorhanden) erhalten im Bereich des Wohnraumes eine Dämmung, Dampfsperre, Traglattung und eine Feuerschutzplatte (GKF), ungespachtelt.",
    ],
    bullets: [
      "240 mm Dämmung (280 mm Dämmung bei EE 40) (WLG 035)",
      "Dampfsperre",
      "Traglattung",
      "12,5 mm Feuerschutzplatte (GKF)",
    ],
    specs: [{ term: "U-Wert", value: "0,172 W/(m²K)" }],
    options: [
      "Optional zum Erreichen der Anforderungen der aktuellen Förderprogramme wird die Dämmung um 40 mm erhöht werden.",
    ],
    source: "BLB 09/2026, S. 20",
  },
  {
    heading: "Binderdach",
    bullets: [
      "Dachsteine/Dachdeckung",
      "Dachlattung",
      "Konterlattung",
      "Unterspannbahn",
      "240 mm Dämmung (WLG 035)",
      "Dampfbremse",
      "Traglattung",
      "12,5 mm Feuerschutzplatte (GKF)",
    ],
    source: "BLB 09/2026, S. 22",
  },
  {
    heading: "Flachdach",
    bullets: [
      "Bekiesung/Begrünung**",
      "Dachabdichtungsbahn",
      "EPS* Aufdachdämmung",
      "18 mm* Holzwerkstoffplatte",
      "Traglattung",
      "12,5 mm* Feuerschutzplatte (GKF)",
    ],
    footnotes: [
      "* Flachdachausführungen können je nach Größe des Daches in der Ausführung variieren.",
      "** Als Flachdachauflast ist eine Bekiesung/Begrünung durch den Bauherren immer erforderlich.",
    ],
    source: "BLB 09/2026, S. 22",
  },
  {
    heading: "Dacheindeckung Ihres BoHolz-Hauses",
    paragraphs: [
      "Im Leistungsumfang enthalten sind Qualitäts-Betondachsteine mit 30-jähriger Herstellergarantie.",
      "Zum Lieferumfang gehören Dachlattung, Konterlattung, eine dampfdiffusionsoffene Unterspannbahn sowie die Windsogsicherung bis Windlastzone II, als auch das entsprechende Zubehör des Herstellers wie z. B. Ortgangsteine, Traufenkamm sowie First- und Gratelemente.",
    ],
    bullets: ["S-Pfanne", "Sigma-Pfanne", "Finkenberger-Pfanne"],
    options: [
      "Optional erhalten Sie auch Zubehör wie Schneefangvorrichtungen und Antennendurchgangspfanne, Kamintritte oder Dachausstiegsfenster.",
    ],
    source: "BLB 09/2026, S. 24",
  },
  {
    heading: "Dachentwässerung Ihres BoHolz-Hauses",
    paragraphs: [
      "Die gesamten Klempner- und Spenglerarbeiten, wie die vorgehangene Halbrund-Rinne, Regenfallrohre und Kehlen werden in Titanzink ausgeführt. Die Dachentwässerung wird bis zur Oberkante Kellerdecke/Bodenplatte geführt.",
    ],
    options: [
      "Optional werden die Spenglerarbeiten in Kupfer oder beschichtetem Aluminium ausgeführt.",
    ],
    source: "BLB 09/2026, S. 25",
  },
];

/** Heizung & Lüftung — BLB S. 32, 33, 35. */
export const haustechnikSpecGroups: SpecGroup[] = [
  {
    heading: "Heiztechnik",
    paragraphs: [
      "Die ausgewählte Anlagentechnik und Ihre Funktionen beziehen sich auf das BoHolz-Haus als Einfamilienhaus mit einer Fläche bis maximal 200 m². Lüftungsanlagen mit zentraler oder dezentraler Zuluft sind nach DIN 1946 Teil 6 ausgelegt und einreguliert.",
      "Die Beheizung des Hauses erfolgt, je nach gewähltem System, über ein Luftsystem oder eine Fußbodenheizung. Kommt eine Fußbodenheizung zum Einsatz, legen wir diese grundsätzlich für den optimalen Heizbetrieb aus.",
      "Durch die flächendeckende Verlegung der wasserführenden Heizungsschleifen in den Räumen ist eine gleichmäßige Verteilung der Wärme gewährleistet. Die zugelassenen Rohrleitungen werden auf einer verstärkten Dämmung verlegt und fixiert. Die Heizkreisverteiler mit den Stellmotoren sitzen flächenbündig in der Wand. Bäder werden je nach Heizlastberechnung zusätzlich mit einem elektrisch betriebenen Handtuchheizkörper (HTHK) ausgestattet (ab Ausbaustufe 3).",
      "Eine individuelle Temperaturregelung erfolgt über Raumthermostate, die optional passend zur Schalterserie des Elektroprogramms bemustert werden können. Alle Wohnräume werden mit Fußbodenheizung ausgestattet. Nebenräume, wie Speisekammer oder Abstellraum, erhalten keine Fußbodenheizung.",
    ],
    source: "BLB 09/2026, S. 32",
  },
  {
    heading:
      "Luft-Wasser-Wärmepumpe mit Innen- und Außeneinheit und separater Wohnungslüftung",
    paragraphs: [
      "Das System aus der außen installierten Luft-Wasser-Wärmepumpe TTL 5.1 ACS eco und dem perfekt abgestimmten Integralspeicher TSBC 200 sorgt energieeffizient und zuverlässig für Heizwärme und Warmwasser in Ihrem Zuhause. Auch bei niedrigen Außentemperaturen arbeitet die Anlage zuverlässig und verteilt die erzeugte Wärme gleichmäßig über die Fußbodenheizung in allen Räumen.",
      "Der Integralspeicher kombiniert Trinkwarmwasserspeicher (168 Liter) und Pufferspeicher (100 Liter) in einem kompakten Gerät. Dadurch wird im Technikraum deutlich weniger Platz benötigt als bei zwei separaten Speichern.",
      "Die Wärmepumpe arbeitet besonders leise und energieeffizient. Mit einem Schallleistungspegel von nur 44 dB(A) nach EN 12102 eignet sie sich auch für Wohngebiete mit enger Bebauung. Für die Installation sind bis zu drei Meter Anschlussleitung zwischen Innen- und Außengerät im Lieferumfang enthalten. Die Bedienung erfolgt komfortabel über die integrierte Regelung.",
      "Die Wärmepumpe nutzt die Energie der Umgebungsluft und überträgt diese mithilfe eines modernen Verdichters und des natürlichen Kältemittels R290 in das Heizsystem des Hauses.",
    ],
    specs: [
      { term: "Trinkwarmwasserspeicher", value: "168 Liter" },
      { term: "Pufferspeicher", value: "100 Liter" },
      { term: "Schallleistungspegel", value: "44 dB(A) nach EN 12102" },
      { term: "Kältemittel", value: "R290" },
    ],
    options: [
      "Optional kann das System gegen Aufpreis um eine Kühlfunktion über die Fußbodenheizung erweitert werden, sodass auch in den Sommermonaten für angenehm temperierte Räume gesorgt ist.",
    ],
    source: "BLB 09/2026, S. 33",
  },
  {
    heading: "Alternative Heiz- und Energiesysteme",
    paragraphs: [
      "Bei BoHolz-Haus haben Sie alternativ zu der von uns im Standard angebotenen Luft-Wasser-Wärmepumpe die Möglichkeit, Ihr neues Haus auch mit einem anderen Heizsystem auszustatten.",
      "Wir möchten Ihnen damit die ganze Vielfalt aktueller Heiz- und Energiegewinnungssysteme zur Auswahl stellen. Ob Luft-Wasser-Wärmepumpe (mit oder ohne Wohnraumlüftung), Abluft-Wasser-Wärmepumpe, Sole-Wasser-Wärmepumpe, Luft-Luft-Wärmepumpe - gerne beraten wir Sie bei der Auswahl des für Sie und Ihr Haus idealen Heizungssystems.",
      "Weitere alternative und hier nicht aufgeführte technische Heizkonzepte stellen wir Ihnen gerne individuell zusammen.",
    ],
    source: "BLB 09/2026, S. 35",
  },
];
