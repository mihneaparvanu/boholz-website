/**
 * Einfamilienhaus landing — served at `/wohnen/einfamilienhaus` (the
 * Google-Ads landing target for the Einfamilienhaus category).
 *
 * Scoped entirely to the Einfamilienhaus typology: hero, benefit cards,
 * house carousel, image band, audience, feature two-column, FAQ and copy
 * all speak to a single-family-home buyer only. The house carousel is
 * filtered to `categorySlugs: ["einfamilienhaus"]` with `featuredOnly:
 * false` so the full sub-catalogue (13 visible models) shows.
 *
 * Kept deliberately free of environmental / sustainability claims
 * (EmpCo-clean): Holz is described as a material and its factual physical
 * properties, never as a climate benefit.
 */
import type { LandingPageContent } from "./landing.types";

export const einfamilienhausContent: LandingPageContent = {
  slug: "einfamilienhaus",

  seo: {
    title: "Einfamilienhaus aus Holz bauen · BoHolz Haus",
    description:
      "Ihr Einfamilienhaus aus Holz — individuell geplant, schlüsselfertig übergeben. Freie Grundrissplanung, definierte Effizienzhausstandards und persönliche Begleitung von der ersten Idee bis zur Übergabe.",
  },

  hero: {
    eyebrow: "Ihr Einfamilienhaus aus Holz",
    title: "Das Einfamilienhaus,",
    highlight: "das zu Ihnen passt.",
    subtitle:
      "Wir bauen Ihr Einfamilienhaus aus Holz in Deutschland – individuell geplant und schlüsselfertig übergeben. Ein Zuhause, das genau zu Ihrer Familie, Ihrem Alltag und Ihrem Grundstück passt.",
    imageAlt:
      "Modernes Einfamilienhaus in Holzbauweise von BoHolz Haus — klare Architektur mit Holzfassade",
    imageFallbackPath:
      "/images/models/einfamilienhaus/28-194-170/gallery/einfamilienhaus-28-194-170-gallery-hero.webp",
    preferredCategorySlug: "einfamilienhaus",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Imagebroschüre bestellen", href: "/katalog" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihr Einfamilienhaus",
    highlight: "auf einen Blick.",
    lede: "Frei geplanter Grundriss, durchdachte Holzbauweise, definierte Effizienzhausstandards und klar beschriebene Ausbaustufen – vier Merkmale, die jedes Einfamilienhaus von BoHolz auszeichnen.",
  },

  benefits: [
    {
      icon: "pencil",
      title: "Frei geplanter Grundriss",
      body: "Ihr Einfamilienhaus entsteht nach Ihren Wünschen – Raumaufteilung, Zimmerzahl und Wohnfläche werden individuell auf Ihre Familie zugeschnitten.",
      tone: "leaf",
    },
    {
      icon: "leaf",
      title: "Holzbauweise",
      body: "Diffusionsoffene Außenwände mit Holzfaserdämmplatte und konkret ausgewiesenen Dämmwerten – für ein angenehmes Raumklima im ganzen Haus.",
      tone: "forest",
    },
    {
      icon: "zap",
      title: "Effizienzhausstandard",
      body: "KfW 55 im angebotenen Standard. KfW 40 und QNG sind abhängig vom Bauvorhaben optional möglich.",
      tone: "sage",
    },
    {
      icon: "key-round",
      title: "Schlüsselfertige Ausführung",
      body: "Klar festgelegte Leistungen und strukturierte Abläufe gemäß unserer Bau- und Leistungsbeschreibung – bis zur Übergabe Ihres Einfamilienhauses.",
      tone: "accent",
    },
  ],

  houses: {
    eyebrow: "Hausmodelle",
    heading: "Unsere",
    highlight: "Einfamilienhäuser.",
    lede: "Vom kompakten Grundriss bis zum großzügigen Familienhaus – eine Auswahl unserer Einfamilienhaus-Modelle, jedes individuell anpassbar.",
    // Einfamilienhaus only. featuredOnly OFF so the full sub-catalogue
    // (13 visible EFH models) shows, not just the 2 bestsellers.
    categorySlugs: ["einfamilienhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  imageBand: {
    eyebrow: "Für die ganze Familie",
    heading: "Ein Zuhause,",
    highlight: "das mitwächst.",
    lede: "Kinderzimmer, Homeoffice, Rückzugsort – wir planen Ihr Einfamilienhaus so, dass es zu jeder Lebensphase Ihrer Familie passt.",
    imageFallbackPath:
      "/images/models/einfamilienhaus/35-146-150/gallery/einfamilienhaus-35-146-150-gallery-exterior-2026.webp",
    imageAlt:
      "BoHolz Einfamilienhaus mit Garten — Zuhause für die ganze Familie",
    allowPlaceholder: true,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Das Einfamilienhaus",
    highlight: "für jede Lebenslage.",
    lede: "Ob junge Familie oder Bauherren mit klarer Vorstellung – Ihr Einfamilienhaus planen wir passend zu Ihrer Lebenssituation.",
    items: [
      {
        icon: "users",
        label: "Familien",
        description:
          "Großzügige Grundrisse mit Kinderzimmern, Gemeinschaftsflächen und Rückzugsorten – ein Haus, das mit den Kindern mitwächst.",
      },
      {
        icon: "heart-handshake",
        label: "Paare",
        description:
          "Der erste gemeinsame Neubau – kompakt oder großzügig, exakt auf Ihre Pläne für die nächsten Jahre zugeschnitten.",
      },
      {
        icon: "briefcase",
        label: "Homeoffice",
        description:
          "Ein separates Arbeitszimmer oder ein flexibler Raum, der Wohnen und Arbeiten unter einem Dach klar voneinander trennt.",
      },
      {
        icon: "trending-up",
        label: "Umsteiger",
        description:
          "Vom Miethaus ins Eigentum – ein individuell geplantes Einfamilienhaus mit KfW-Förderung und langfristiger Wertbeständigkeit.",
      },
    ],
  },

  sustainability: {
    eyebrow: "Individuelle Planung",
    title: "Persönlich geplant.",
    highlight: "Für Ihre Familie.",
    subtitle: "Ein Einfamilienhaus, das Ihre Handschrift trägt.",
    paragraphs: [
      "Aus Ihren Vorstellungen entsteht individuelle Architektur. Gemeinsam entwickeln wir den Grundriss Ihres Einfamilienhauses, wählen die passende Ausbaustufe und gestalten die Details, die aus einem Haus Ihr Zuhause machen.",
      "Beginnen Sie jetzt mit der Planung Ihres Einfamilienhauses – persönlich begleitet von der ersten Idee bis zur Umsetzung.",
    ],
    imageFallbackPath:
      "/images/models/einfamilienhaus/32-150-170/gallery/einfamilienhaus-32-150-170-gallery-ehf-02.webp",
    imageAlt:
      "Einfamilienhaus mit Holzfassade — persönlich geplantes Zuhause von BoHolz-Haus",
    reverse: false,
    cta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  trust: {
    eyebrow: "Langjährige Erfahrung",
    heading: "Langjährige Erfahrung",
    highlight: "im Holzfertigbau.",
    lede: "Vertrieb aus Bad Kissingen, Produktion in Rot am See – zwei Familienunternehmen, ein Maßstab.",
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
    heading: "Ihre Fragen zum",
    highlight: "Einfamilienhaus.",
    items: [
      {
        id: "efh-individuell-planen",
        question: "Kann ich mein Einfamilienhaus individuell planen?",
        answer:
          "Ja. Jedes Einfamilienhaus beginnt mit einer persönlichen Planungsphase — Grundriss, Fassade, Materialien und Ausbaustufe werden gemeinsam mit unserem Architekturteam auf Sie zugeschnitten.",
      },
      {
        id: "efh-was-kostet",
        question: "Was kostet ein Einfamilienhaus aus Holz?",
        answer:
          "Der Preis hängt von Größe, Ausstattung und Energieeffizienz ab. Ein schlüsselfertiges Haus beginnt ab 2.350 €/m². Für ein konkretes Angebot fragen Sie unseren Katalog oder eine Baubeschreibung an.",
      },
      {
        id: "efh-foerderung",
        question: "Welche Förderungen gibt es für ein Einfamilienhaus?",
        answer:
          "Im angebotenen Standard erreichen wir KfW 55; KfW 40 und QNG sind je nach Bauvorhaben optional möglich. Wir beraten Sie zu KfW-Krediten, BEG-Zuschüssen und regionalen Programmen — passend zu Ihrem Standort.",
      },
    ],
  },

  leadForm: {
    eyebrow: "Ihr persönliches Angebot",
    heading: "Einfamilienhaus anfragen und",
    highlight: "Imagebroschüre bestellen.",
    lede: "Wir sind für Sie da — stellen Sie uns Ihre Fragen oder fordern Sie Ihr persönliches Angebot für Ihr Einfamilienhaus an.",
  },

  closingCta: {
    eyebrow: "Nächster Schritt",
    title: "Bereit für Ihr",
    highlight: "Einfamilienhaus?",
    subtitle:
      "Lassen Sie sich unverbindlich beraten — oder fordern Sie direkt ein Angebot an.",
    tone: "brand",
    primaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
    secondaryCta: { label: "Imagebroschüre bestellen", href: "/katalog" },
  },
};
