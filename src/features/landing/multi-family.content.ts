/**
 * Page 2 — `/wohnen/mehrfamilien`
 *
 * Multi-family / investment-oriented campaign. Targets two distinct
 * intents under one umbrella:
 *   1. Multi-generational families building one house with separate
 *      living units (Generationenhaus, Zweifamilienhaus).
 *   2. Private investors building larger multi-unit blocks (12-Familien,
 *      up to 16 Wohneinheiten) — KfW-40 standard.
 *
 * Voice: pragmatic, return-on-investment as much as lifestyle. The hero
 * leads on flexibility ("Mehr Raum für Familien") and the lead-form
 * pre-selects `mfh` so the form serves the cold visitor.
 */
import type { LandingPageContent } from "./landing.types";

export const multiFamilyContent: LandingPageContent = {
  seo: {
    title: "Mehrfamilien- & Generationenhäuser · BoHolz Haus",
    description:
      "Flexible Wohnlösungen für Familien, Generationen und Investoren — von 2 bis 16 Wohneinheiten, schlüsselfertig in Holzbauweise, nach KfW-40-Standard.",
  },

  hero: {
    eyebrow: "Mehr Raum für Familien",
    heading: "Ihr Haus für",
    highlight: "mehrere Generationen.",
    lede:
      "Flexible Wohnlösungen aus Holz — für Familien, die zusammen leben, ohne aufeinander zu wohnen. Vom Zweifamilien- bis zum 16-Einheiten-Haus.",
    imageAlt:
      "Mehrfamilienhaus von BoHolz Haus — großzügige Architekturvisualisierung mit mehreren Wohneinheiten",
    imageFallbackPath: "/images/landing/mehrfamilien/lifestyle-03.webp",
    preferredCategorySlug: "mehrfamilienhaus",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliche Beratung", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Flexible Wohnlösungen für Familien",
    highlight: "und Generationen.",
    lede: "Vom Zweifamilienhaus bis zum 16-Einheiten-Block — vier Eigenschaften, die jedes BoHolz-Mehrfamilienhaus tragen.",
  },

  benefits: [
    {
      icon: "leaf",
      title: "Gebaut aus Holz",
      body: "Angenehmes Raumklima und natürliche Materialien — regional gefertigt.",
      tone: "forest",
    },
    {
      icon: "layers",
      title: "Flexible Grundrisse",
      body: "Individuelle Planung für Familien jeder Größe — vom Generationenhaus bis zum kompakten Wohnblock.",
      tone: "sage",
    },
    {
      icon: "building-2",
      title: "2 bis 16 Wohneinheiten",
      body: "Perfekt für Familien, Investoren oder Gemeinschaftsprojekte — skalierbar in Holzbauweise.",
      tone: "leaf",
    },
    {
      icon: "key-round",
      title: "Schlüsselfertig gebaut",
      body: "Festpreis, klare Kosten, termintreue Übergabe — auch bei mehreren Einheiten unter einem Dach.",
      tone: "accent",
    },
  ],

  houses: {
    eyebrow: "Beispiele",
    heading: "Häuser für mehrere Familien",
    highlight: "im Überblick.",
    lede: "Vom Doppelhaus für zwei junge Familien bis zum Generationenhaus mit getrennten Wohneinheiten — alle Modelle dieser Typologie auf einen Blick.",
    categorySlugs: [
      "doppelhaus",
      "generationenhaus",
      "zweifamilienhaus",
      "mehrfamilienhaus",
    ],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Gemeinsam wohnen",
    heading: "Nah genug für die Familie,",
    highlight: "weit genug für sich selbst.",
    lede: "Getrennte Eingänge, geteilte Außenflächen — Generationenhäuser, die Eigenständigkeit und Nähe in Balance halten.",
    imageFallbackPath: "/images/landing/mehrfamilien/lifestyle-03.webp",
    imageAlt:
      "Mehrgenerationenhaus von BoHolz — Lifestyle-Szene mit Bewohnern verschiedener Generationen",
    allowPlaceholder: true,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Vier Motive.",
    highlight: "Ein flexibles Konzept.",
    lede: "Ob Familienprojekt oder Vermietungsobjekt — wir entwickeln das Mehrfamilienhaus, das Ihre Anforderungen trägt.",
    items: [
      {
        icon: "users",
        label: "Mehrgenerationen",
        description:
          "Eltern, Kinder, Großeltern unter einem Dach — getrennte Wohneinheiten mit gemeinsamem Garten und Eingangsbereich.",
      },
      {
        icon: "heart-handshake",
        label: "Familien mit Vermietung",
        description:
          "Ein Zweifamilienhaus, das die Finanzierung mitträgt — Eigennutzung kombiniert mit Mieteinnahmen.",
      },
      {
        icon: "trending-up",
        label: "Investoren",
        description:
          "Wertbeständige Holzbauweise nach KfW 40 — niedrige Betriebskosten und hohe Förderfähigkeit.",
      },
      {
        icon: "building-2",
        label: "Bauträger & Gemeinschaften",
        description:
          "Bis zu 16 Wohneinheiten als Gesamtprojekt — geplant, vorgefertigt und montiert aus einer Hand.",
      },
    ],
  },

  featureBody: {
    eyebrow: "Mehr Raum, mehr Möglichkeiten",
    heading: "Mehr Raum,",
    highlight: "mehr Möglichkeiten.",
    paragraphs: [
      "Ob für Familien oder zur Vermietung — ein Mehrfamilienhaus bietet Platz, Flexibilität und langfristige Wertbeständigkeit.",
      "Bo Holz Haus baut energieeffizient nach KfW-40/55-Standard, mit bis zu 16 Wohneinheiten unter einem Dach.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-01.webp",
    imageAlt:
      "Stadtvilla mit Einliegerwohnung in Holzbauweise — Zweifamilien-Konzept unter einem Dach",
    reverse: false,
    cta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  testimonials: {
    eyebrow: "Erfahrung im Mehrwohnungsbau",
    heading: "Holzfertigbau",
    highlight: "für mehrere Familien.",
    lede: "Zwei Familienunternehmen, 90 Jahre Holzbau, KfW-zertifizierte Bauweise — bewährt im Mehrfamilien-Segment.",
    tone: "olive",
    badges: [
      { label: "Made in Germany", flag: true },
      { label: "KfW 40", sub: "Förderfähig" },
    ],
    testimonials: [
      {
        name: "Jürgen M.",
        role: "Investor, Bayern",
        rating: 5,
        quote:
          "Klare Konditionen, ein Ansprechpartner durchgängig, präzise Termine — bei einem Bauprojekt mit acht Einheiten Gold wert.",
      },
      {
        name: "Familie Wagner",
        role: "Generationenhaus, Hessen",
        rating: 5,
        quote:
          "Wir wohnen jetzt im selben Haus wie die Großeltern — und alle haben ihre eigene Wohnung. Genau das, was wir wollten.",
      },
      {
        name: "Stefan B.",
        role: "Bauträger",
        rating: 5,
        quote:
          "Die Vorfertigung in Halle hat unseren Zeitplan eingehalten, obwohl wir mitten im Winter montieren wollten. Empfehlung.",
      },
    ],
  },

  faq: {
    eyebrow: "Häufige Fragen",
    heading: "Wir sind hier um all Ihre",
    highlight: "Fragen zu beantworten.",
    items: [
      {
        id: "individuell-planen-mfh",
        question: "Kann man das BoHolz Haus individuell planen?",
        answer:
          "Ja. Auch Mehrfamilienhäuser planen wir vom Grundriss bis zur Fassade individuell. Jede Wohneinheit kann eigene Schnitte, Materialien und Ausstattungen erhalten.",
      },
      {
        id: "foerderung-kfw-40-mfh",
        question: "Welche Förderungen gibt es für ein KfW-40-Mehrfamilienhaus?",
        answer:
          "Für Mehrfamilienhäuser im KfW-40-Standard gibt es BEG-Zuschüsse und zinsgünstige KfW-Kredite — auch für vermietete Einheiten. Wir beraten Sie zu den jeweils aktuellen Programmen.",
      },
      {
        id: "wie-viele-einheiten",
        question: "Wie viele Wohneinheiten sind in einem Bauprojekt möglich?",
        answer:
          "Wir realisieren Mehrfamilienhäuser von 2 bis 16 Wohneinheiten. Größere Projekte planen wir gerne im persönlichen Gespräch — sprechen Sie uns an.",
      },
    ],
  },

  leadForm: {
    eyebrow: "Kostenloser Hauskatalog",
    heading: "Mehrfamilienhaus-Katalog jetzt",
    highlight: "gratis herunterladen.",
    lede: "Name, E-Mail und Ort genügen — Sie erhalten den Katalog sofort als PDF. Kein Anruf, kein Verkaufsdruck.",
  },

  midPageCta: {
    eyebrow: "Kostenlos und unverbindlich",
    heading: "Holen Sie sich jetzt den",
    highlight: "Hauskatalog.",
    lede:
      "Alle Grundrisse, Ausstattungen und Preise für Ihr Mehrfamilienhaus — als PDF, direkt nach dem Absenden.",
    tone: "brand",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliche Beratung", href: "/kontakt" },
  },
};
