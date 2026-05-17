/**
 * Page 1 — `/landing/uebersicht`
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

export const uebersichtContent: LandingPageContent = {
  slug: "uebersicht",

  seo: {
    title: "Premium-Fertighäuser aus Holz · BoHolz Haus",
    description:
      "Nachhaltige Fertighäuser aus Holz — energieeffizient, individuell geplant, schlüsselfertig übergeben. Vom Bungalow bis zum Mehrfamilienhaus.",
  },

  hero: {
    eyebrow: "Sichern Sie jetzt Ihr Traumhaus",
    title: "Premium-Fertighäuser",
    highlight: "aus Holz.",
    subtitle:
      "Nachhaltig, energieeffizient und individuell auf Sie zugeschnitten — vom ersten Entwurf bis zur Schlüsselübergabe begleitet von einem festen Ansprechpartner.",
    imageAlt:
      "Modernes Holz-Fertighaus von BoHolz Haus, am Abend mit warmem Licht",
    imageFallbackPath: "/images/pages/dein-zuhause/hero-bauen.jpg",
    preferredCategorySlug: "einfamilienhaus",
    primaryCta: { label: "Jetzt Angebot anfordern", href: "/kontakt" },
    secondaryCta: { label: "Katalog erhalten", href: "/kontakt#katalog" },
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
      body: "Holzbau mit zertifizierter Forstwirtschaft — ein CO₂-Speicher, der Generationen überdauert.",
      tone: "grun",
    },
    {
      icon: "pencil",
      title: "Individuelle Planung",
      body: "Architekturberatung von der ersten Skizze bis zur Detailplanung — kein Haus von der Stange.",
      tone: "bg",
    },
    {
      icon: "zap",
      title: "Energieeffizient",
      body: "Standardmäßig KfW 40 oder 55 — niedrige Energiekosten und attraktive Förderungen.",
      tone: "oliv",
    },
    {
      icon: "key-round",
      title: "Schlüsselfertig",
      body: "Festpreis, fester Termin, ein Ansprechpartner — vorgefertigt in Halle, montiert vor Ort.",
      tone: "petrol",
    },
  ],

  houses: {
    eyebrow: "Hausmodelle",
    heading: "Welche Häuser",
    highlight: "gibt es?",
    lede: "Drei Typologien, jede individuell anpassbar. Vom kompakten Bungalow für jedes Alter bis zum Doppelhaus für zwei Familien.",
    categorySlugs: null, // every featured category — page 1 is the broad overview
    maxItems: 3,
  },

  imageBand: {
    eyebrow: "Größe und Passform",
    heading: "Für jedes Leben",
    highlight: "das passende Haus.",
    lede: "Egal in welcher Lebensphase Sie planen — wir entwickeln das Raumkonzept gemeinsam mit Ihnen.",
    imageFallbackPath: "/images/pages/uber-uns/value-2.jpg",
    imageAlt:
      "Familie vor einem BoHolz-Fertighaus — Mehrgenerationen-Szene im Garten",
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
    imageFallbackPath: "/images/pages/unser-versprechen/nachhaltigkeit.jpg",
    imageAlt:
      "BoHolz Fertighaus mit Photovoltaik und naturbelassener Holzfassade",
    reverse: false,
    cta: { label: "Jetzt Angebot anfordern", href: "/kontakt" },
  },

  trust: {
    eyebrow: "Langjährige Erfahrung",
    heading: "Langjährige Erfahrung",
    highlight: "im Holzfertigbau.",
    lede: "Vertrieb aus Bad Kissingen, Produktion in Rot am See — zwei Familienunternehmen, ein Maßstab.",
    tone: "olive",
    badges: [
      { label: "Made in Germany" },
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
    eyebrow: "Jetzt Angebot",
    heading: "Anfordern und",
    highlight: "Katalog erhalten.",
    lede: "Wir sind für Sie da — stellen Sie uns Ihre Fragen oder fordern Sie Ihr persönliches Angebot an.",
    contact: {
      phone: "0971 / 78 55 57 15",
      email: "info@boholz-haus.de",
    },
    interestOptions: [
      { value: "bungalow", label: "Bungalow" },
      { value: "efh", label: "Einfamilienhaus" },
      { value: "doppelhaus", label: "Doppelhaus" },
      { value: "mfh", label: "Mehrfamilienhaus" },
      { value: "individuell", label: "Individuelle Planung" },
      { value: "unsure", label: "Noch unentschieden" },
    ],
    tone: "pastell",
  },

  closingCta: {
    eyebrow: "Nächster Schritt",
    title: "Bereit für Ihr",
    highlight: "Traumhaus?",
    subtitle:
      "Sie sind unverbindlich beraten — oder direkt ein Angebot anfordern.",
    tone: "surface",
    primaryCta: { label: "Jetzt Angebot anfordern", href: "/kontakt" },
    secondaryCta: { label: "Katalog erhalten", href: "/kontakt#katalog" },
  },
};
