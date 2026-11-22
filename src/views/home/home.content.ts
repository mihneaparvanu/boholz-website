import { getMediaURL } from "@/core/media/media";

import type { SectionContent } from "@/core/design/sections/section.types";
import type { OverviewCardData } from "@/features/home/Overview/overview.types";
import type { LandingPageContent } from "@/features/landing/landing.types";

export type HomeSection = SectionContent & {
  id: string;
  eyebrow: string;
  navLabel: string;
};

export const homeSections = {
  categories: {
    id: "katalog",
    eyebrow: "Broschüre",
    navLabel: "Broschüre",
    heading1: "Ihr Zuhause,",
    heading2: "präzise gedacht.",
    highlight: "Modell wählen.",
    subheading:
      "Vom Bungalow bis zur Stadtvilla — barrierefreie Fertighäuser aus Holz, gebaut mit Zimmermannskunst; auf Wunsch als Effizienzhaus 40.",
  },
  trust: {
    id: "vertrauen",
    eyebrow: "Vertrauen",
    navLabel: "Vertrauen",
    heading1: "Ihr Vertrauen",
    highlight: "fest verankert.",
    subheading:
      "Wir bauen nicht nur Häuser, wir bauen Sicherheit. Mit hochwertiger Fertigung aus Deutschland und klaren vertraglichen Zusagen, auf die Sie sich verlassen können.",
  },
  overview: {
    id: "auszeichnung",
    eyebrow: "Auszeichnung",
    navLabel: "Auszeichnung",
    heading1: "Besser gebaut.",
    highlight: "Sorgenfrei gelebt.",
    subheading:
      "BoHolz-Haus verbindet präzise Vorfertigung in Holzbauweise mit durchdachter Planung und abgestimmter Haustechnik. So entstehen klar definierte Leistungen, strukturierte Abläufe und ein Zuhause, das zu Ihren Bedürfnissen passt.",
  },
  buildPhases: {
    id: "bauphasen",
    eyebrow: "Bauphasen",
    navLabel: "Bauphasen",
    heading1: "In drei Phasen ins",
    highlight: "eigene Zuhause.",
    subheading:
      "Vom ersten Beratungstermin bis zur Schlüsselübergabe — in klare Phasen gegliedert, begleitet von einem festen Ansprechpartner.",
  },
  finishes: {
    id: "ausbaustufen",
    eyebrow: "Ausbaustufen",
    navLabel: "Ausbaustufen",
    heading1: "Ihr Traumhaus.",
    highlight: "Ihr Weg.",
    subheading:
      "Ein Hausbau ist eine ganz persönliche Reise. Wir bieten Ihnen vier flexible Ausbaustufen – vom Ausbauhaus bis zur schlüsselfertigen Übergabe. So behalten Sie die volle Kontrolle über Ihr Projekt, Ihren Zeitplan und Ihr Budget.",
  },
  qa: {
    id: "fragen",
    eyebrow: "Fragen",
    navLabel: "Fragen",
    heading1: "Klarheit schafft",
    highlight: "Vertrauen.",
    subheading:
      "Mit BoHolz haben Sie bereits die Antwort auf die Frage nach Ihrem Traumhaus gefunden. Für alle weiteren Details – von der Bauweise bis zur Finanzierung – haben wir hier das Wichtigste übersichtlich für Sie zusammengefasst.",
  },
  contact: {
    id: "kontakt",
    eyebrow: "Kontakt",
    navLabel: "Kontakt",
    heading1: "Sprechen Sie",
    heading2: "mit uns",
    highlight: "persönlich.",
    subheading:
      "Buchen Sie eine Vor-Ort-Beratung — wir nehmen uns Zeit für Ihr Projekt.",
  },
} as const satisfies Record<string, HomeSection>;

type HeroCopy = {
  heading: string;
  highlight: string;
  lede: string;
};

export const heroVariants = {
  current: {
    heading: "Premium Fertighäuser",
    highlight: "aus Holz.",
    lede:
      "Wir bauen Fertighäuser aus Holz in Deutschland – persönlich begleitet von der ersten Idee bis zur Hausübergabe. Für ein Zuhause, das zu Ihnen und Ihrer Lebenssituation passt.",
  },
  classic: {
    heading: "Fertighäuser in Zimmermannsqualität.",
    highlight: "Für Generationen.",
    lede:
      "Unsere barrierefreien Fertighäuser aus Holz verbinden durchdachte Holzbauweise mit handwerklicher Sorgfalt — für Wohnqualität, die zu Ihrer Familie passt.",
  },
  brand: {
    heading: "Fertighäuser von",
    highlight: "BoHolz-Haus.",
    lede:
      "Präzise gefertigter Holzbau aus Deutschland — Ihr Traumhaus, individuell geplant und schlüsselfertig übergeben.",
  },
} as const satisfies Record<string, HeroCopy>;

export type HeroVariantKey = keyof typeof heroVariants;

export const heroVariant: HeroVariantKey = "current";

export const overviewContent: LandingPageContent = {

  seo: {
    title: "Premium Fertighäuser aus Holz · BoHolz-Haus",
    description:
      "Fertighäuser aus Holz — individuell geplant, schlüsselfertig übergeben. Vom Bungalow bis zum Mehrfamilienhaus.",
  },

  hero: {
    eyebrow: "Finden Sie jetzt Ihr Traumhaus",
    heading: heroVariants[heroVariant].heading,
    highlight: heroVariants[heroVariant].highlight,
    lede: heroVariants[heroVariant].lede,
    imageAlt:
      "Stadtvilla in Holzbauweise von BoHolz-Haus — moderne Architektur mit klaren Linien",
    imageFallbackPath: "/images/brand/hero.webp",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Infopaket anfordern", href: "/katalog" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihre Fertighäuser",
    highlight: "auf einen Blick.",
    lede: "Durchdachte Holzbauweise, definierte Effizienzhausstandards, individuelle Planung und klar beschriebene Ausbaustufen – vier Merkmale, die jedes BoHolz-Haus auszeichnen.",
  },

  benefits: [
    {
      icon: "leaf",
      title: "Holzbauweise",
      body: "Diffusionsoffene Außenwände mit Holzfaserdämmplatte und konkret ausgewiesenen Dämmwerten.",
      tone: "forest",
    },
    {
      icon: "zap",
      title: "Effizienzhausstandard",
      body: "KfW 55 im angebotenen Standard. KfW 40 und QNG sind abhängig vom Bauvorhaben optional möglich.",
      tone: "sage",
    },
    {
      icon: "pencil",
      title: "Individuelle Planung",
      body: "Persönlich geplanter Grundriss – abgestimmt auf Ihre Wünsche, Ihre Lebenssituation und Ihr Grundstück.",
      tone: "leaf",
    },
    {
      icon: "key-round",
      title: "Schlüsselfertige Ausführung",
      body: "Klar festgelegte Leistungen und strukturierte Abläufe gemäß unserer Bau- und Leistungsbeschreibung.",
      tone: "accent",
    },
  ],

  houses: {
    eyebrow: "Hausmodelle",
    heading: "Welche Häuser",
    highlight: "gibt es?",
    lede: "Vom kompakten Bungalow bis zur Stadtvilla — eine Auswahl unserer meistgewählten Modelle, individuell anpassbar.",
    categories: null,
    featuredOnly: true,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Größe und Passform",
    heading: "Für jedes Leben",
    highlight: "das passende Haus.",
    lede: "Egal in welcher Lebensphase Sie planen — wir entwickeln das Raumkonzept gemeinsam mit Ihnen.",
    imageFallbackPath:
      "/images/models/mehrfamilienhaus/satteldorf/satteldorf-12-familienhaus.webp",
    imageAlt: "BoHolz Mehrfamilienhaus — 12-Familienwohnhaus",
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Vier Lebenswege.",
    highlight: "Ein Haus, das mitwächst.",
    lede: "Egal in welcher Lebensphase Sie sind — wir haben das passende Konzept.",
    items: [
      {
        icon: "users",
        label: "Familien",
        description:
          "Großzügige Grundrisse für Kinder, Gemeinschaft und Geborgenheit — vom ersten Babyjahr bis zur Studienzeit.",
      },
      {
        icon: "heart-handshake",
        label: "Senioren",
        description:
          "Komfortabel und barrierearm geplant — ein Zuhause, das mit Ihnen älter wird und Selbstständigkeit erhält.",
      },
      {
        icon: "layers",
        label: "Mehrgenerationen",
        description:
          "Getrennte Wohneinheiten unter einem Dach — gemeinsam wohnen, ohne aufeinander zu wohnen.",
      },
      {
        icon: "trending-up",
        label: "Investoren",
        description:
          "Holzbauweise mit KfW-Förderung — durchdacht geplant für die Vermietung.",
      },
    ],
  },

  featureBody: {
    eyebrow: "Individuelle Planung",
    heading: "Persönlich geplant.",
    highlight: "Für Sie gemacht.",
    lede: "Ein Zuhause, das Ihre Handschrift trägt.",
    paragraphs: [
      "Aus Ihren Vorstellungen entsteht individuelle Architektur. Gemeinsam entwickeln wir einen Grundriss, wählen die passende Ausbaustufe und gestalten die Details, die aus einem Haus Ihr Zuhause machen.",
      "Beginnen Sie jetzt mit der Planung Ihres BoHolz-Hauses – persönlich begleitet von der ersten Idee bis zur Umsetzung.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-06.webp",
    imageAlt:
      "Naturnahes Wohnen — persönlich geplantes Zuhause von BoHolz-Haus",
    reverse: false,
    cta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  testimonials: {
    eyebrow: "Langjährige Erfahrung",
    heading: "Langjährige Erfahrung",
    highlight: "im Holzfertigbau.",
    lede: "Vertrieb aus Bad Kissingen, Produktion in Rot am See — zwei Partner mit einem gemeinsamen Anspruch an jedes Haus.",
    tone: "olive",
    badges: [
      { label: "Made in Germany", flag: true },
      { label: "KfW", sub: "Förderung" },
    ],
    testimonials: [
      {
        name: "Olaf V.",
        role: "Kunde",
        rating: 5,
        quote:
          "Habe ein Musterhaus besichtigt und war begeistert von der Qualität. Sowohl auch vom Kundenservice am Telefon. Kann ich nur weiterempfehlen.",
      },
      {
        name: "Khalid T.",
        role: "Kunde",
        rating: 5,
        quote:
          "Fachlich kompetente Beratung. In den Verkaufsgesprächen fühlt alles sehr fair an. Lief alles vom Erstgespräch bis zum Hausvertrag rund.",
      },
      {
        name: "Christina K.",
        role: "Kundin",
        rating: 5,
        quote:
          "Super und nette Beratung — auf jede Frage eine Antwort. Lief alles sehr professionell ab.",
      },
    ],
  },

  faq: {
    eyebrow: "Häufige Fragen",
    heading: "Wir sind hier um all Ihre",
    highlight: "Fragen zu beantworten.",
    items: [
      {
        id: "individuell-planen",
        question: "Kann man das BoHolz Haus individuell planen?",
        answer:
          "Ja. Jedes Projekt beginnt mit einer persönlichen Planungsphase — Grundriss, Fassade, Materialien und Ausbaustufe werden gemeinsam mit unserem Architekturteam auf Sie zugeschnitten.",
      },
      {
        id: "foerderung-kfw-40",
        question: "Welche Förderungen gibt es für ein KfW 40 Haus?",
        answer:
          "Aktuell sind die KfW-Klassen 40, 40-Plus und die QNG-Förderung förderfähig. Wir beraten Sie zu KfW-Krediten, BEG-Zuschüssen und regionalen Programmen — passend zu Ihrem Standort.",
      },
      {
        id: "was-kostet",
        question: "Was kostet ein Holzfertighaus?",
        answer:
          "Der Preis hängt von Größe, Ausstattung und Ausbaustufe ab. Preisbeispiele finden Sie bei unseren Bestseller-Häusern; Ihr individuelles Angebot erstellen wir auf Grundlage Ihrer Planung.",
      },
    ],
  },

  leadForm: {
    eyebrow: "Ihr persönliches Angebot",
    heading: "Anfordern und",
    highlight: "Infopaket anfordern.",
    lede: "Wir sind für Sie da — stellen Sie uns Ihre Fragen oder fordern Sie Ihr persönliches Angebot an.",
  },

  midPageCta: {
    eyebrow: "Nächster Schritt",
    heading: "Bereit für Ihr",
    highlight: "Traumhaus?",
    lede:
      "Sie sind unverbindlich beraten — oder direkt ein Angebot anfordern.",
    tone: "surface",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Infopaket anfordern", href: "/katalog" },
  },
};

export const featuredCard: OverviewCardData = {
  heading: "Hohe Bauqualität",
  subheading:
    "Massive Kreuzlagenholz-Wände, präzise im Werk vorgefertigt — jedes Detail vom Meister geprüft, jedes Haus gebaut für Generationen.",
  featured: true,
  image: {
    url: getMediaURL("/images/stock/lifestyle/craftsmanship-factory.webp"),
    alt: "BoHolz Fachkraft bei der Vorfertigung eines Holzelements im Werk",
    width: 2560,
    height: 1664,
  },
};

export const overviewCardsSecondary: OverviewCardData[] = [
  {
    heading: "Echtes Holz",
    subheading:
      "Wir bauen mit Holz aus PEFC-zertifizierter Forstwirtschaft.",
    image: {
      url: getMediaURL("/images/photography/log-stack.webp"),
      alt: "Gestapelte Holzstämme aus zertifizierter Forstwirtschaft",
      width: 2560,
      height: 1280,
    },
  },
  {
    heading: "Energieeffizienz",
    subheading:
      "Mindestens KfW-40-Standard serienmäßig — niedrige Energiekosten ab dem ersten Tag, förderfähig zum Bauantrag.",
    image: {
      url: getMediaURL("/images/stock/lifestyle/energy-efficiency-heatpump.webp"),
      alt: "Moderne Luft-Wärmepumpe an der Fassade eines BoHolz Hauses",
      width: 2688,
      height: 1536,
    },
  },
  {
    heading: "Individuelle Planung",
    subheading:
      "Vom Grundriss bis zur Materialwahl in Ihrem Tempo geplant — gemeinsam mit unseren Architekten, nicht gegen sie.",
    image: {
      url: getMediaURL("/images/stock/lifestyle/house-planning-office.webp"),
      alt: "Architektin bespricht einen Hausgrundriss am Planungstisch",
      width: 4608,
      height: 3584,
    },
  },
  {
    heading: "Smart Living",
    subheading:
      "Vernetzte Haustechnik vorbereitet — Heizung, Licht und Sicherheit von einer Hand, ohne Nachrüst-Kabelsalat.",
    image: {
      url: getMediaURL("/images/stock/lifestyle/smart-living.webp"),
      alt: "Smart-Home-Steuerung in einem modernen Wohnraum",
      width: 2048,
      height: 1374,
    },
  },
];
