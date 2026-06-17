/**
 * Page 1 — `/wohnen/uebersicht`
 *
 * Generic premium-Fertighaus campaign. Audience-agnostic; aimed at someone
 * arriving from a paid search ad for "Fertighaus aus Holz" without a
 * specific typology in mind. Showcases the full house catalogue and the
 * four pillar benefits.
 *
 * Voice: precise, restrained, German engineering rather than lifestyle
 * marketing. The old JPEG cycled through pastel cards and full-saturation
 * "energy stars" badges — we lean on the kit's diluted pastels and the
 * single brand accent.
 */
import type { LandingPageContent } from "./landing.types";

/**
 * Hero copy variants — only `title` / `highlight` / `subtitle` differ across
 * variants. Eyebrow, image, CTAs and category preferences are page-level
 * (declared once on `uebersichtContent.hero`).
 *
 * To switch variants on the homepage, change a single line below:
 *   `export const heroVariant: HeroVariantKey = "current";`
 * Valid keys: `current` (default), `classic`, `brand`.
 */
type HeroCopy = {
  title: string;
  highlight: string;
  subtitle: string;
};

export const heroVariants = {
  // Variant 1 — the current launch copy. Default.
  current: {
    title: "Premium Fertighäuser",
    highlight: "aus Holz.",
    subtitle:
      "Wir bauen Premium-Fertighäuser aus Holz in Deutschland — nachhaltig, individuell, persönlich begleitet. Gemacht für Generationen zum Genießen, nicht nur zum Wohnen.",
  },
  // Variant 2 — the previous home hero (see `features/Home/Hero/Hero.vue`).
  classic: {
    title: "Fertighäuser in Zimmermannsqualität.",
    highlight: "Für Generationen.",
    subtitle:
      "Unsere barrierefreien Fertighäuser aus Holz vereinen höchste Energieeffizienz mit meisterhaftem Handwerk. So sparen Sie Energiekosten und gewinnen wertvolle Lebensqualität für die ganze Familie.",
  },
  // Variant 3 — brand-led new copy.
  brand: {
    title: "Fertighäuser von",
    highlight: "BoHolz-Haus.",
    subtitle:
      "Nachhaltiger Holzbau, präzise gefertigt in Deutschland — Ihr Traumhaus, individuell geplant und schlüsselfertig übergeben.",
  },
} as const satisfies Record<string, HeroCopy>;

export type HeroVariantKey = keyof typeof heroVariants;

/**
 * Active hero variant. Change this single line to swap homepage hero copy.
 */
export const heroVariant: HeroVariantKey = "current";

export const uebersichtContent: LandingPageContent = {
  slug: "uebersicht",

  seo: {
    title: "Premium Fertighäuser aus Holz · BoHolz Haus",
    description:
      "Nachhaltige Fertighäuser aus Holz — energieeffizient, individuell geplant, schlüsselfertig übergeben. Vom Bungalow bis zum Mehrfamilienhaus.",
  },

  hero: {
    eyebrow: "Finden Sie jetzt Ihr Traumhaus",
    title: heroVariants[heroVariant].title,
    highlight: heroVariants[heroVariant].highlight,
    subtitle: heroVariants[heroVariant].subtitle,
    imageAlt:
      "Premium-Stadtvilla in Holzbauweise von BoHolz Haus — moderne Architektur mit klaren Linien",
    imageFallbackPath: "/images/brand/hero.webp",
    preferredCategorySlug: "einfamilienhaus",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Hauskatalog bestellen", href: "/katalog" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Premium-Fertighäuser",
    highlight: "auf einen Blick.",
    lede: "Nachhaltig, energieeffizient, individuell planbar — vier Eigenschaften, die jedes BoHolz-Haus auszeichnen.",
  },

  benefits: [
    {
      icon: "leaf",
      title: "Nachhaltig & ökologisch",
      body: "Holz aus verantwortungsvoller Forstwirtschaft – wohngesund und langlebig.",
      tone: "forest",
    },
    {
      icon: "zap",
      title: "Energieeffizient",
      body: "Zukunftssicher bauen mit QNG Siegel und von den aktuellen KfW- Förderung profitieren.",
      tone: "sage",
    },
    {
      icon: "pencil",
      title: "Individuelle Planung",
      body: "Architektenhaus mit persönlichem Grundriss – Ihr Stil, Ihr Zuhause.",
      tone: "leaf",
    },
    {
      icon: "key-round",
      title: "Schlüsselfertig",
      body: "Fixe Abläufe, klare Kosten, termingerechte Übergabe.",
      tone: "accent",
    },
  ],

  houses: {
    eyebrow: "Hausmodelle",
    heading: "Welche Häuser",
    highlight: "gibt es?",
    lede: "Vom kompakten Bungalow bis zur Stadtvilla — eine Auswahl unserer meistgewählten Modelle, individuell anpassbar.",
    // Overview page: every typology, bestseller gate ON, no practical cap
    // (the DB currently holds 6 featured models — 99 is an "uncapped" signal).
    categorySlugs: null,
    featuredOnly: true,
    maxItems: 99,
  },

  imageBand: {
    eyebrow: "Größe und Passform",
    heading: "Für jedes Leben",
    highlight: "das passende Haus.",
    lede: "Egal in welcher Lebensphase Sie planen — wir entwickeln das Raumkonzept gemeinsam mit Ihnen.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-05.webp",
    imageAlt:
      "BoHolz-Bauvorhaben in Ilshofen — Luftaufnahme eines fertiggestellten Holzfertighauses",
    allowPlaceholder: true,
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
          "Wertbeständige Holzbauweise mit KfW-Förderung — ein langfristig rentables Renditeobjekt.",
      },
    ],
  },

  sustainability: {
    eyebrow: "Gefördert und effizient",
    title: "Nachhaltig bauen",
    highlight: "mit Holz.",
    paragraphs: [
      "Mit moderner Haustechnik erfüllen wir alle Standards für QNG-Siegel und KfW-Förderungen — und schaffen so Wohnkomfort für die Zukunft.",
      "Profitieren Sie von den staatlichen Förderungen. Wir beraten Sie umfassend, welche Programme zu Ihrem Vorhaben passen.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-06.webp",
    imageAlt:
      "Holzfertighaus in naturnaher Umgebung — Symbolbild für nachhaltigen Holzbau",
    reverse: false,
    cta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  trust: {
    eyebrow: "Langjährige Erfahrung",
    heading: "Langjährige Erfahrung",
    highlight: "im Holzfertigbau.",
    lede: "Vertrieb aus Bad Kissingen, Produktion in Rot am See — zwei Familienunternehmen, ein Maßstab.",
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
          "Aktuell sind die KfW-Klassen 40, 40-Plus und Nachhaltigkeitsklasse förderfähig. Wir beraten Sie zu KfW-Krediten, BEG-Zuschüssen und regionalen Programmen — passend zu Ihrem Standort.",
      },
      {
        id: "was-kostet",
        question: "Was kostet ein Holzfertighaus?",
        answer:
          "Der Preis hängt von Größe, Ausstattung und Energieeffizienz ab. Ein schlüsselfertiges Haus beginnt ab 2.350 €/m². Für weitere Infos fragen Sie unseren Hauskatalog oder eine Baubeschreibung an.",
      },
    ],
  },

  leadForm: {
    eyebrow: "Ihr persönliches Angebot",
    heading: "Anfordern und",
    highlight: "Hauskatalog bestellen.",
    lede: "Wir sind für Sie da — stellen Sie uns Ihre Fragen oder fordern Sie Ihr persönliches Angebot an.",
  },

  closingCta: {
    eyebrow: "Nächster Schritt",
    title: "Bereit für Ihr",
    highlight: "Traumhaus?",
    subtitle:
      "Sie sind unverbindlich beraten — oder direkt ein Angebot anfordern.",
    tone: "surface",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Hauskatalog bestellen", href: "/katalog" },
  },
};
