/**
 * Page 3 — `/landing/bungalow`
 *
 * Barrier-free / senior-comfort campaign. The audience here is older
 * homeowners planning a downsize, or mobility-constrained buyers planning
 * a forever-home on one level. Bungalow = everything on one floor, no
 * stairs, wide doors, level transitions.
 *
 * Voice: reassuring, dignified, never patronising. The old JPEG leaned
 * pastel-blue and lifestyle photos of older adults; we keep the imagery
 * cues (one-level living, gardens, pool decks) but route messaging
 * through autonomy and design language rather than "Altersheim" tropes.
 */
import type { LandingPageContent } from "./landing.types";

export const bungalowContent: LandingPageContent = {
  slug: "bungalow",

  seo: {
    title: "Barrierefreie Bungalows aus Holz · BoHolz Haus",
    description:
      "Bungalow als Fertighaus aus Holz — altersgerecht, rollstuhlgerecht oder einfach bequem. Komfort, Sicherheit und nachhaltiges Wohnen auf einer Ebene.",
  },

  hero: {
    eyebrow: "Barrierefrei Wohnen",
    title: "Ihr Bungalow als",
    highlight: "Fertighaus aus Holz.",
    subtitle:
      "Ob altersgerecht, rollstuhlgerecht oder einfach bequem — ein BoHolz-Bungalow bietet Ihnen Sicherheit, Unabhängigkeit und nachhaltiges Wohnen auf einer Ebene.",
    imageAlt:
      "Bungalow aus Holz mit großer Terrasse und Poolbereich am Abend",
    imageFallbackPath: "/images/pages/uber-uns/value-2.jpg",
    preferredCategorySlug: "bungalow",
    primaryCta: { label: "Jetzt Angebot anfordern", href: "/kontakt" },
    secondaryCta: { label: "Katalog erhalten", href: "/kontakt#katalog" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Mehr Komfort, Sicherheit und Flexibilität",
    highlight: "in jedem Raum.",
    lede: "Vier Eigenschaften, die jeden BoHolz-Bungalow tragen — auf einer Ebene, ein Leben lang.",
  },

  benefits: [
    {
      icon: "pencil",
      title: "Flexibel planbar",
      body: "Auf Anbau mit Aufzug, barrierefreien Zugang und stufenlose Übergänge zugeschnitten — jedes Detail nach Maß.",
      tone: "bg",
    },
    {
      icon: "shield",
      title: "Altersgerecht & sicher",
      body: "Komfortabel geplant — mit Fokus auf Sicherheit, Bewegungsfreiheit und langfristige Selbstständigkeit.",
      tone: "petrol",
    },
    {
      icon: "zap",
      title: "Modern & energieeffizient",
      body: "Smart-Home, dauerhaft wartungsarm und KfW-förderfähig — niedrige Betriebskosten ab dem ersten Tag.",
      tone: "oliv",
    },
    {
      icon: "leaf",
      title: "Ruhig & geborgen",
      body: "Holz reguliert das Raumklima auf natürliche Weise — wohnen in entspannter Atmosphäre, das ganze Jahr.",
      tone: "grun",
    },
  ],

  houses: {
    eyebrow: "Beispiele",
    heading: "Fertighaus-Beispiele",
    highlight: "im Überblick.",
    lede: "Drei Bungalow-Konzepte — vom kompakten Komfort-Heim bis zum Flachdach-Bungalow mit Pool-Terrasse.",
    categorySlugs: ["bungalow"],
    maxItems: 3,
  },

  imageBand: {
    eyebrow: "Komfort und Sicherheit",
    heading: "Ein Zuhause,",
    highlight: "das mit Ihnen lebt.",
    lede: "Helle Räume, breite Türen, ebenerdiger Garten — ein Bungalow, der heute funktioniert und morgen mitwächst.",
    imageFallbackPath: "/images/pages/unser-versprechen/qualitaet.jpg",
    imageAlt:
      "Senior auf einer Terrasse vor einem Bungalow — entspannte Nachmittagslektüre",
    allowPlaceholder: true,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Drei Lebenslagen.",
    highlight: "Ein Konzept ohne Hindernisse.",
    lede: "Ob jung, im mittleren Alter oder im Ruhestand — ein Bungalow nimmt Ihnen Treppen ab und schenkt Ihnen Zeit.",
    items: [
      {
        icon: "heart-handshake",
        label: "Leben ohne Grenzen",
        description:
          "Barrierefreies Wohnen heißt komfortabel leben — mit stufenlosen Zugängen, großzügigen Räumen und ebenerdigem Bewegungsfluss.",
      },
      {
        icon: "smartphone-nfc",
        label: "Smart, sicher & zukunftsorientiert",
        description:
          "Moderne Smart-Home-Technologie sorgt für mehr Sicherheit, Komfort und Unabhängigkeit im Alltag — auch im hohen Alter.",
      },
      {
        icon: "compass",
        label: "Ein Zuhause, das sich anpasst",
        description:
          "Flexible Grundrisse und durchdachte Details schaffen Wohnkomfort — heute bauen, morgen umnutzen.",
      },
      {
        icon: "leaf",
        label: "Naturnah und langlebig",
        description:
          "Holz reguliert Feuchtigkeit, dämpft Geräusche und altert würdevoll — ein Material, das mit Ihrem Leben mitspielt.",
      },
    ],
  },

  sustainability: {
    eyebrow: "Barrierefreies Wohnen",
    title: "Komfort und Sicherheit",
    highlight: "für jedes Alter.",
    paragraphs: [
      "Ein barrierefreies Zuhause bedeutet mehr als stufenlose Übergänge — es steht für Unabhängigkeit, Sicherheit und täglichen Komfort.",
      "Jeder BoHolz-Bungalow wird individuell geplant — mit breiten Türen, offenen Grundrissen und intelligenten Details, die das Wohnen heute und in Zukunft angenehm und mühelos machen.",
    ],
    imageFallbackPath: "/images/pages/unser-versprechen/wandaufbau.jpg",
    imageAlt:
      "Bungalow-Innenraum mit barrierefreiem Übergang zur Terrasse und großer Glasfront",
    reverse: false,
    cta: { label: "Jetzt Angebot anfordern", href: "/kontakt" },
  },

  trust: {
    eyebrow: "Erfahrung im barrierefreien Bauen",
    heading: "Wohnen ohne Hindernisse,",
    highlight: "geplant mit Erfahrung.",
    lede: "Zwei Familienunternehmen mit 90 Jahren Holzbau-Erfahrung — und einem klaren Blick für Bungalow-Details, die heute und morgen funktionieren.",
    tone: "olive",
    badges: [
      { label: "Made in Germany" },
      { label: "DIN 18040", sub: "Barrierefrei" },
    ],
    testimonials: [
      {
        name: "Renate H.",
        role: "Bauherrin, 68",
        rating: 5,
        quote:
          "Wir wollten ein Haus, das wir auch in 20 Jahren noch komfortabel bewohnen können. Die Planung war geduldig, jede Frage wurde durchdacht beantwortet.",
      },
      {
        name: "Familie Becker",
        role: "Bungalow mit Anbau",
        rating: 5,
        quote:
          "Mein Vater wohnt jetzt im Anbau — getrennter Eingang, aber wir sind unter einem Dach. Genau das hatten wir uns vorgestellt.",
      },
      {
        name: "Dr. Stefan W.",
        role: "Kunde",
        rating: 5,
        quote:
          "Die Beratung war ehrlich, präzise und ohne Verkaufsdruck. Das Haus steht jetzt seit zwei Wintern und alles ist genau wie versprochen.",
      },
    ],
  },

  faq: {
    eyebrow: "Häufige Fragen",
    heading: "Wir sind hier um all Ihre",
    highlight: "Fragen zu beantworten.",
    items: [
      {
        id: "rollstuhlgerecht",
        question: "Kann man ein Fertighaus rollstuhlgerecht bauen?",
        answer:
          "Ja. Wir planen Bungalows nach DIN 18040 — mit ebenerdigen Zugängen, breiten Türen, schwellenlosen Übergängen und wenn gewünscht einer rollstuhlgerechten Sanitärplanung.",
      },
      {
        id: "kosten-bungalow",
        question: "Wie teuer ist ein barrierefreier Bungalow?",
        answer:
          "Der Preis hängt von Größe, Ausstattung und Energieeffizienz ab. Wir kalkulieren transparent ab dem ersten Gespräch — und beraten Sie zu KfW-Förderungen, die für altersgerechtes Bauen verfügbar sind.",
      },
      {
        id: "fuer-junge-familien",
        question:
          "Ist ein barrierefreies Wohnen auch für junge Familien sinnvoll?",
        answer:
          "Ja, in vielen Fällen kann ein barrierefreies Wohnen auch für junge Familien praktisch sein. Stufenlose Zugänge und großzügige Grundrisse erleichtern den Alltag — zum Beispiel mit Kinderwagen oder kleinen Kindern — und bieten langfristig mehr Flexibilität.",
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
      { value: "bungalow-barrierefrei", label: "Bungalow barrierefrei" },
      { value: "anbau-aufzug", label: "Bungalow mit Anbau / Aufzug" },
      { value: "efh", label: "Einfamilienhaus auf einer Ebene" },
      { value: "individuell", label: "Individuelle Planung" },
      { value: "unsure", label: "Noch unentschieden" },
    ],
    tone: "pastell",
  },

  closingCta: {
    eyebrow: "Nächster Schritt",
    title: "Leben ohne Grenzen.",
    highlight: "Starten Sie Ihr Projekt.",
    subtitle:
      "Jetzt unverbindlich beraten lassen oder direkt ein Angebot anfordern.",
    tone: "accent",
    primaryCta: { label: "Jetzt Angebot anfordern", href: "/kontakt" },
    secondaryCta: { label: "Katalog erhalten", href: "/kontakt#katalog" },
  },
};
