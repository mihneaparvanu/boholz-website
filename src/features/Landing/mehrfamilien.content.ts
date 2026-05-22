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

export const mehrfamilienContent: LandingPageContent = {
  slug: "mehrfamilien",

  seo: {
    title: "Mehrfamilien- & Generationenhäuser · BoHolz Haus",
    description:
      "Flexible Wohnlösungen für Familien, Generationen und Investoren — von 2 bis 16 Wohneinheiten, schlüsselfertig in Holzbauweise, nach KfW-40-Standard.",
  },

  hero: {
    eyebrow: "Mehr Raum für Familien",
    title: "Ihr Haus für",
    highlight: "mehrere Generationen.",
    subtitle:
      "Flexible Wohnlösungen aus Holz — für Familien, die zusammen leben, ohne aufeinander zu wohnen. Vom Zweifamilien- bis zum 16-Einheiten-Haus.",
    imageAlt:
      "Mehrfamilienhaus von BoHolz Haus — großzügige Architekturvisualisierung mit mehreren Wohneinheiten",
    imageFallbackPath:
      "/images/models/generationenhaus/28-264-160/gallery/generationenhaus-28-264-160-gallery-hero.webp",
    preferredCategorySlug: "mehrfamilienhaus",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Hauskatalog bestellen", href: "/katalog" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Flexible Wohnlösungen für Familien",
    highlight: "und Generationen.",
    lede: "Vom Zweifamilienhaus bis zum 16-Einheiten-Block — vier Eigenschaften, die jedes BoHolz-Mehrfamilienhaus tragen.",
  },

  benefits: [
    {
      icon: "layers",
      title: "Flexible Grundrisse",
      body: "Individuelle Planung für Familien jeder Größe — vom Generationenhaus bis zum kompakten Wohnblock.",
      tone: "bg",
    },
    {
      icon: "key-round",
      title: "Schlüsselfertig gebaut",
      body: "Festpreis, klare Kosten, termintreue Übergabe — auch bei mehreren Einheiten unter einem Dach.",
      tone: "petrol",
    },
    {
      icon: "leaf",
      title: "Nachhaltig aus Holz",
      body: "Gesundes Raumklima und natürliche Materialien — CO₂-speichernd, regional gefertigt.",
      tone: "grun",
    },
    {
      icon: "building-2",
      title: "2 bis 16 Wohneinheiten",
      body: "Perfekt für Familien, Investoren oder Gemeinschaftsprojekte — skalierbar in Holzbauweise.",
      tone: "oliv",
    },
  ],

  houses: {
    eyebrow: "Beispiele",
    heading: "Häuser für mehrere Familien",
    highlight: "im Überblick.",
    lede: "Vom Doppelhaus für zwei junge Familien bis zum Generationenhaus mit getrennten Wohneinheiten — alle Modelle dieser Typologie auf einen Blick.",
    // Typology page: Mehrfamilien = Doppelhaus + Generationenhaus in our
    // schema (no dedicated `mehrfamilienhaus` slug exists). Bestseller gate
    // off so the full sub-catalogue (5 models) surfaces.
    categorySlugs: ["doppelhaus", "generationenhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  imageBand: {
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
    lede: "Ob Familienprojekt oder Renditeobjekt — wir entwickeln das Mehrfamilienhaus, das Ihre Anforderungen trägt.",
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
          "Wertbeständige Holzbauweise nach KfW 40 — niedrige Betriebskosten, hohe Förderfähigkeit, langfristige Rendite.",
      },
      {
        icon: "building-2",
        label: "Bauträger & Gemeinschaften",
        description:
          "Bis zu 16 Wohneinheiten als Gesamtprojekt — geplant, vorgefertigt und montiert aus einer Hand.",
      },
    ],
  },

  sustainability: {
    eyebrow: "Mehr Raum, mehr Möglichkeiten",
    title: "Mehr Raum,",
    highlight: "mehr Möglichkeiten.",
    paragraphs: [
      "Ob für Familien oder als Investition — ein Mehrfamilienhaus bietet Platz, Flexibilität und nachhaltige Wertbeständigkeit.",
      "Bo Holz Haus baut energieeffizient nach KfW-40/55-Standard, mit bis zu 16 Wohneinheiten unter einem Dach.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-01.webp",
    imageAlt:
      "Stadtvilla mit Einliegerwohnung in Holzbauweise — Zweifamilien-Konzept unter einem Dach",
    reverse: false,
    cta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  trust: {
    eyebrow: "Erfahrung im Mehrwohnungsbau",
    heading: "Holzfertigbau",
    highlight: "für mehrere Familien.",
    lede: "Zwei Familienunternehmen, 90 Jahre Holzbau, KfW-zertifizierte Bauweise — bewährt im Mehrfamilien-Segment.",
    tone: "olive",
    badges: [
      { label: "Made in Germany" },
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
    eyebrow: "Ihr persönliches Angebot",
    heading: "Anfordern und",
    highlight: "Hauskatalog bestellen.",
    lede: "Wir sind für Sie da — stellen Sie uns Ihre Fragen oder fordern Sie Ihr persönliches Angebot an.",
    contact: {
      phone: "0971 / 78 55 57 15",
      email: "info@boholz-haus.de",
    },
    // Multi-family decision points — disambiguate the two intents the
    // page funnels (Generationen-Eigennutz vs. Renditeobjekt) and surface
    // the levers that actually move the planning: typology, Einheiten,
    // Eingänge, Nutzung, KfW. German voice, no marketing fluff.
    interestOptions: [
      { value: "doppelhaus", label: "Doppelhaus (2 Einheiten)" },
      { value: "generationenhaus", label: "Generationenhaus" },
      { value: "mfh-klein", label: "Mehrfamilienhaus (3–6 Einheiten)" },
      { value: "mfh-gross", label: "Mehrfamilienhaus (ab 7 Einheiten)" },
      {
        value: "eingaenge-getrennt",
        label: "Getrennte Eingänge je Wohneinheit",
      },
      { value: "eigennutzung", label: "Eigennutzung im Familienverbund" },
      { value: "vermietung", label: "Eigennutzung mit Vermietung" },
      { value: "investment", label: "Reines Renditeobjekt" },
      { value: "kfw-foerderung", label: "Beratung zu KfW-Förderung" },
      { value: "individuell", label: "Individuelle Planung" },
      { value: "unsure", label: "Noch unentschieden" },
    ],
    tone: "pastell",
  },

  closingCta: {
    eyebrow: "Nächster Schritt",
    title: "Planen Sie Ihr Traumhaus",
    highlight: "für mehrere Generationen.",
    subtitle:
      "Jetzt unverbindlich beraten lassen oder direkt ein Angebot anfordern.",
    tone: "surface",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Hauskatalog bestellen", href: "/katalog" },
  },
};
