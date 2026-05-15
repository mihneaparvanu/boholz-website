// Shared FAQ content — surfaced on the Home page and (eventually) a dedicated /faq.
// Sourced from the production WordPress export (boholz-haus.de FAQ accordion).
// Answers contain trusted internal HTML; render with v-html.
// If this ever moves to the DB, this file is the seed shape.

export type Question = {
  id: string;
  question: string;
  answer: string;
};

export type QuestionCategory = {
  id: string;
  title: string;
  questions: Question[];
};

export const qaCategories: QuestionCategory[] = [
  {
    id: "allgemein",
    title: "Allgemein",
    questions: [
      {
        id: "was-ist-fertighaus",
        question: "Was ist ein Fertighaus?",
        answer:
          "<p>Ein Fertighaus ist ein Wohngebäude, dessen wesentliche Bauteile industriell vorgefertigt und anschließend auf dem Grundstück montiert werden. Es zeichnet sich durch eine kürzere Bauzeit, präzise Planung und oft höhere Energieeffizienz im Vergleich zu konventionell gebauten Häusern aus. Fertighäuser bieten eine große Vielfalt an Designs und Anpassungsmöglichkeiten, sodass sie individuell auf die Bedürfnisse der Bauherren zugeschnitten werden können.</p>",
      },
      {
        id: "materialien",
        question: "Welche Materialien verwendet BoHolz Haus?",
        answer:
          "<p>BoHolz Haus verwendet für den Bau seiner Fertighäuser primär Holz als Hauptbaustoff, insbesondere für die tragende Konstruktion. Die Außenwände bestehen aus einer Holzrahmenkonstruktion, die mit Holzfaserdämmplatten für eine effektive Wärmedämmung ausgestattet ist. Zusätzlich kommen weitere natürliche und ökologische Materialien zum Einsatz, um ein gesundes Raumklima und eine hohe Energieeffizienz zu gewährleisten.</p>",
      },
      {
        id: "unterschied-massivhaus",
        question: "Wie unterscheidet sich ein BoHolz Haus von einem Massivhaus?",
        answer:
          "<p>Kürzere Bauzeit, höhere Energieeffizienz und geringere Kosten bei gleicher Qualität und Langlebigkeit.</p>",
      },
      {
        id: "vorteile-vs-steinhaus",
        question: "Welche Vorteile haben Fertighäuser im Vergleich zu Steinhäusern?",
        answer:
          "<ul><li><strong>Energieeffizienz:</strong> Dank innovativer Bauweise und hochwertiger Dämmung helfen Fertighäuser, Energiekosten zu senken.</li><li><strong>Kosteneffizienz:</strong> Geringere Unterhaltskosten und eine schnellere Bauzeit reduzieren die Gesamtausgaben.</li><li><strong>Zeitersparnis:</strong> Die verkürzte Bauphase spart nicht nur Miete, sondern auch Bereitstellungszinsen.</li><li><strong>Finanzielle Vorteile:</strong> Viele Banken bieten mittlerweile günstigere Finanzierungskonditionen für Fertighäuser an.</li><li><strong>Fördermöglichkeiten:</strong> Fertighäuser qualifizieren sich häufiger für höhere staatliche Förderungen.</li></ul>",
      },
      {
        id: "richtiger-haustyp",
        question: "Welcher Haustyp ist der Richtige für mich?",
        answer:
          "<p>Ohne einen vorgegebenen Bebauungsplan orientiert sich die Bauweise typischerweise an der umliegenden Bebauung. Leben Ihre Nachbarn beispielsweise in Flachdachhäusern, wird Ihnen wahrscheinlich auch dieser Haustyp vorgeschrieben. Ähnlich verhält es sich mit Satteldachhäusern. Um die Möglichkeiten für Ihr Grundstück zu erkunden und den optimalen Haustyp zu ermitteln, empfehlen wir Ihnen ein persönliches Beratungsgespräch mit einem unserer BoHolz-Experten.</p>",
      },
    ],
  },
  {
    id: "planung",
    title: "Planung & Gestaltung",
    questions: [
      {
        id: "individuell-gestalten",
        question: "Wie individuell kann ich mein BoHolz Haus gestalten?",
        answer:
          "<p>Wir bieten vielfältige Anpassungsmöglichkeiten und Ausbaustufen bei Grundriss, Design und Ausstattung ganz nach Ihren Wünschen.</p>",
      },
      {
        id: "spaeter-erweitern",
        question: "Kann ein BoHolz Fertighaus später erweitert werden?",
        answer:
          "<p>Ja, unsere Häuser sind flexibel und können in der Regel problemlos erweitert oder umgebaut werden.</p>",
      },
      {
        id: "musterhaus-besichtigen",
        question: "Kann ich ein Musterhaus besichtigen?",
        answer:
          "<p>Ja, wir bieten Besichtigungen in unseren beiden Musterhäusern in Bad Vilbel und Fellbach an, um Ihnen einen realen Eindruck zu vermitteln. Vereinbaren Sie gerne einen Termin vor Ort und lassen Sie sich ausführlich beraten.</p>",
      },
      {
        id: "werk-besichtigen",
        question: "Kann ich das Werk besichtigen, in dem mein Fertighaus entsteht?",
        answer:
          "<p>Ja, mit unseren Kunden vereinbaren wir regelmäßige Werksführungen bei unserem starken Partner Keitel-Haus in 74585 Rot am See-Brettheim (bei Rothenburg o.d. Tauber). Gerne können Sie auf Wunsch auch persönliche Einzeltermine vereinbaren.</p>",
      },
    ],
  },
  {
    id: "bauphase",
    title: "Bauphase & Qualität",
    questions: [
      {
        id: "bauzeit",
        question: "Wie lange dauert der Bau eines Fertighauses?",
        answer:
          "<p>Das ist abhängig von der Ausbaustufe und der Jahreszeit. Die durchschnittliche Bauzeit für ein Fertighaus liegt zwischen 3 und 6 Monaten von Montage bis zur Fertigstellung.</p>",
      },
      {
        id: "energieeffizienz",
        question: "Wie energieeffizient sind BoHolz Fertighäuser?",
        answer:
          "<p>Unsere Häuser erfüllen hohe Energiestandards und erreichen die Effizienzhaus-Kriterien KfW 55 und KfW 40.</p>",
      },
      {
        id: "garantien",
        question: "Welche Garantien bietet BoHolz Haus?",
        answer:
          "<p>Wir gewähren umfassende Garantien auf Konstruktion und Materialien. Details erfahren Sie im kostenlosen Beratungsgespräch mit unseren BoHolz-Experten.</p>",
      },
    ],
  },
  {
    id: "finanzierung",
    title: "Kosten & Finanzierung",
    questions: [
      {
        id: "kosten",
        question: "Was kostet ein Fertighaus?",
        answer:
          "<p>Im mittleren Preissegment kostet ein komplettes, schlüsselfertiges Fertighaus zwischen 2.400 und 3.000 Euro pro Quadratmeter.</p>",
      },
      {
        id: "finanzierung",
        question: "Wie finanziere ich ein Fertighaus von BoHolz?",
        answer:
          "<p>Wir beraten Sie umfassend zu verschiedenen Finanzierungsoptionen und empfehlen Ihnen auf Wunsch geeignete Finanzierungsmöglichkeiten.</p>",
      },
      {
        id: "eigenkapital",
        question: "Wie viel Eigenkapital benötigt man für seinen Hausbau?",
        answer:
          "<p>Experten von Banken wie der Sparkasse empfehlen mindestens 20–30 % der Gesamtkosten als Eigenkapital einzubringen. Idealerweise sollten Sie 10–15 % für die Nebenkosten und weitere 10–15 % für den Kaufpreis selbst aufbringen können.</p>",
      },
      {
        id: "eigenmittel-eigenleistung",
        question: "Was kann ich an Eigenmitteln und Eigenleistung einbringen?",
        answer:
          "<p><strong>Finanzielles Eigenkapital:</strong></p><ul><li>Bargeld, Sparguthaben, Wertpapiere</li><li>Bausparverträge, Lebensversicherungen</li><li>Riester-Rente für Wohneigentum</li></ul><p><strong>Sachwerteigenkapital:</strong></p><ul><li>Schuldenfreies Baugrundstück</li></ul><p><strong>KfW-Fördermittel und Zuschüsse</strong></p><p><strong>Eigenleistungen</strong> (nach Absprache mit BoHolz Haus wählbar):</p><ul><li>Innen: z. B. Malerarbeiten, Bodenbeläge verlegen</li><li>Außen: Gartengestaltung, einfache Montagearbeiten</li></ul><p>Für genaue Informationen zu möglichen Eigenleistungen und deren Wertanrechnung kontaktieren Sie bitte unsere BoHolz-Experten.</p>",
      },
    ],
  },
];
