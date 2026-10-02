/**
 * Landing content — Mehrfamilienhaus (/wohnen/mehrfamilienhaus).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Mehrfamilien-
 * haus", Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative
 * claims, no unbacked prices). SPECIAL: this category has no catalog — the
 * Hauskatalog contains no Mehrfamilienhäuser — so both hero and mid-page CTA
 * point at a project inquiry (/kontakt) instead of the catalog request.
 * DRAFT — pending BoHolz (Christoph) + legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const multiFamilyContent: LandingPageContent = {
  seo: {
    title: "Mehrfamilienhaus in Holzbauweise | BoHolz-Haus",
    description:
      "Mehrfamilienhaus in Holzbauweise: individuell geplant, im Werk vorgefertigt, persönlich begleitet – für Vermieter, Bauherrengemeinschaften und Kommunen.",
    focusKeyword: "Mehrfamilienhaus Holzbauweise",
  },

  hero: {
    eyebrow: "Mehrfamilienhaus in Holzbauweise",
    heading: "Wohnraum schaffen.",
    highlight: "Mit einem Partner an Ihrer Seite.",
    lede: "Sie möchten auf Ihrem Grundstück Wohnungen für mehrere Parteien bauen – zur Vermietung, für die Familie oder als Bauherrengemeinschaft? Wir planen Ihr Mehrfamilienhaus in Holzbauweise gemeinsam mit Ihnen.",
    imageAlt: "Mehrfamilienhaus in Holzbauweise von BoHolz-Haus",
    imageFallbackPath: "/images/models/mehrfamilienhaus/ilshofen/ilshofen-neu.webp",
    preferredCategorySlug: "mehrfamilienhaus",
    primaryCta: { label: "Projekt anfragen", href: "/kontakt" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihr Mehrfamilienhaus",
    highlight: "auf einen Blick.",
    lede: "Vier Punkte, auf die Sie bei Ihrem Projekt bauen können.",
  },
  benefits: [
    {
      icon: "pencil",
      title: "Individuelle Projektplanung",
      body: "Grundrisse, Wohnungsmix und Geschosszahl entwickeln wir passend zu Grundstück und Bebauungsplan.",
      tone: "leaf",
    },
    {
      icon: "building-2",
      title: "Im Werk vorgefertigt",
      body: "Die Bauteile entstehen bei Keitel-Haus in Rot am See-Brettheim und werden vor Ort vom Montageteam aufgebaut.",
      tone: "forest",
    },
    {
      icon: "layers",
      title: "Klar beschriebener Wandaufbau",
      body: "Holz-Aktiv-Wand mit 60 mm Holzfaserdämmplatte und Holzrahmenkonstruktion: U-Wert 0,164 W/(m²K), in der Plus-Variante 0,143 W/(m²K).",
      tone: "sage",
    },
    {
      icon: "coins",
      title: "Beratung zur Förderung",
      body: "Wir unterstützen Sie bei Fragen zu KfW-Programmen, deren Kredite in der Regel je Wohneinheit gewährt werden.",
      tone: "accent",
    },
  ],

  houses: {
    eyebrow: "Hausmodelle",
    heading: "Unsere",
    highlight: "Mehrfamilienhäuser.",
    lede: "Beispielentwürfe für 12 und 18 Wohneinheiten – als Ausgangspunkt für Ihre individuelle Projektplanung.",
    categorySlugs: ["mehrfamilienhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Mehrfamilienhäuser von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Mehrfamilienhaus von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Wohn- und Objektbau",
    heading: "Ihr Projekt.",
    highlight: "Unsere Erfahrung im Holzbau.",
    lede: "Vom Grundstück bis zur Übergabe – persönlich begleitet.",
    paragraphs: [
      "Ob Wohnhaus mit drei, sechs oder neun Parteien oder größere Entwürfe wie unser 12- und 18-Familienwohnhaus: Wir entwickeln mit Ihnen Planungsvorschläge, die zu Grundstück, Bebauungsplan und Nutzungskonzept passen.",
      "Auch für geförderten Mehrgeschosswohnungsbau und Objektbauten wie Kindergärten oder Tagespflegeeinrichtungen sind wir Ihr Ansprechpartner.",
    ],
    imageFallbackPath: "/images/landing/interiors/mehrfamilien/mfh-ilshofen-wohnen.jpg",
    imageAlt: "Mehrfamilienhaus in Holzbauweise von BoHolz-Haus",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Das Mehrfamilienhaus",
    highlight: "für Ihr Vorhaben.",
    lede: "Für Bauherren, die mehr als ein Zuhause schaffen möchten.",
    items: [
      {
        icon: "map-pin",
        label: "Grundstückseigentümer",
        description:
          "Sie haben ein Grundstück und möchten es mit mehreren Wohnungen bebauen.",
      },
      {
        icon: "key-round",
        label: "Vermieter",
        description:
          "Wohnungen zur Vermietung, geplant nach Ihrem Nutzungskonzept.",
      },
      {
        icon: "users",
        label: "Bauherrengemeinschaften",
        description:
          "Mehrere Parteien, ein Projekt – jede Partei mit eigener Wohnung.",
      },
      {
        icon: "building-2",
        label: "Kommunen und Träger",
        description:
          "Kindergärten, Tagespflegeeinrichtungen oder geförderter Wohnungsbau – sprechen Sie uns an.",
      },
    ],
  },

  testimonials: {
    eyebrow: "Stimmen unserer Bauherren",
    heading: "Was Bauherren",
    highlight: "über uns sagen.",
    lede: "Vertrieb aus Bad Kissingen, Fertigung bei Keitel-Haus in Rot am See-Brettheim – zwei Partner mit einem gemeinsamen Anspruch an jedes Haus.",
    tone: "olive",
    badges: [{ label: "Made in Germany" }],
    testimonials: [],
  },

  faq: {
    eyebrow: "Häufige Fragen",
    heading: "Ihre Fragen zum",
    highlight: "Mehrfamilienhaus.",
    items: [
      {
        id: "holzbauweise",
        question: "Kann man ein Mehrfamilienhaus in Holzbauweise bauen?",
        answer:
          "Ja. Holzrahmenbau ist auch für mehrgeschossige Wohngebäude möglich. Anforderungen an Brand- und Schallschutz richten sich nach der jeweiligen Landesbauordnung und werden in der Planung Ihres Projekts festgelegt.",
      },
      {
        id: "wohneinheiten",
        question: "Für wie viele Wohneinheiten planen Sie?",
        answer:
          "Unsere Beispielentwürfe umfassen 12 und 18 Wohneinheiten; kleinere Wohnhäuser mit drei, sechs oder neun Parteien planen wir ebenso. Sprechen Sie uns zu Ihrem Vorhaben an.",
      },
      {
        id: "ablauf",
        question: "Wie läuft ein Projekt ab?",
        answer:
          "Zuerst klären wir Grundstück, Bebauungsplan und Nutzungskonzept. Es folgen Planung, Bauantrag und Bemusterung, danach Fertigung im Werk, Montage und Innenausbau bis zur Übergabe.",
      },
      {
        id: "kosten",
        question: "Was kostet ein Mehrfamilienhaus in Holzbauweise?",
        answer:
          "Bei Mehrfamilienhäusern kalkulieren wir projektbezogen – abhängig von Größe, Wohnungsmix, Ausbaustufe und Ausstattung. Grundlage ist Ihre konkrete Planung.",
      },
      {
        id: "foerderung",
        question: "Welche Förderung ist möglich?",
        answer:
          "KfW-Förderkredite werden in der Regel je Wohneinheit gewährt; die Voraussetzungen hängen vom Programm und Energiestandard ab. Auf Wunsch planen wir als Effizienzhaus 40, optional mit QNG-Zertifizierung.",
      },
    ],
  },

  seoText: {
    heading: "Mehrfamilienhaus in Holzbauweise bauen – mit BoHolz-Haus",
    sections: [
      {
        heading: "Wohnungen für mehrere Parteien – individuell geplant",
        body: "Ob Sie ein Grundstück mit mehreren Mietwohnungen bebauen, als Bauherrengemeinschaft gemeinsam bauen oder Wohnraum für die eigene Familie schaffen möchten: Ein Mehrfamilienhaus in Holzbauweise planen wir von Anfang an mit Ihnen gemeinsam. Unsere Beispielentwürfe für 12 und 18 Wohneinheiten zeigen, was möglich ist; ebenso planen wir kleinere Wohnhäuser mit drei, sechs oder neun Parteien. Wohnungsgrößen, Wohnungsmix und Geschosszahl richten sich nach Ihrem Nutzungskonzept und den Vorgaben des Bebauungsplans. Auch für geförderten Mehrgeschosswohnungsbau sowie für Objektbauten wie Kindergärten oder Tagespflegeeinrichtungen stehen wir Ihnen als Ansprechpartner zur Verfügung.",
      },
      {
        heading: "Vorgefertigt im Werk, montiert auf Ihrer Baustelle",
        body: "Die Bauteile Ihres Mehrfamilienhauses fertigt unser Partner Keitel-Haus in Rot am See-Brettheim. Auf der Baustelle baut ein Montageteam das Gebäude auf, anschließend folgen Innenausbau und Haustechnik. Für die Außenwände stehen die Holz-Aktiv-Wand mit einem U-Wert von 0,164 W/(m²K) und die Holz-Aktiv-Wand plus mit 0,143 W/(m²K) zur Verfügung. Anforderungen an Brand- und Schallschutz legen wir in der Planung nach der jeweiligen Landesbauordnung fest. Zu KfW-Förderprogrammen, deren Kredite in der Regel je Wohneinheit gewährt werden, beraten wir Sie gemeinsam mit Ihrer Bank.",
      },
      {
        heading: "Beratung für Grundstückseigentümer",
        body: "Sie besitzen ein Grundstück, eine Baulücke oder eine Fläche zur Nachverdichtung und fragen sich, was darauf möglich ist? Die Beratung von Grundstückseigentümern gehört zu unseren Schwerpunkten. Gemeinsam klären wir, welche Bebauung der Bebauungsplan zulässt, wie viele Wohneinheiten sinnvoll sind und welche Ausbaustufe zu Ihrem Vorhaben passt – bis hin zur Erstellung und Einreichung des Bauantrags beim zuständigen Bauamt.",
      },
    ],
  },

  gallery: {
    eyebrow: "Eindrücke",
    heading: "Mehrfamilienhaus",
    highlight: "von innen.",
    lede: "Einblicke in Ausstattung und Raumgefühl. Die Abbildungen zeigen Musterhäuser und können Sonderausstattungen enthalten.",
    images: [
      { src: "/images/landing/interiors/mehrfamilien/mfh-ilshofen-wohnen.jpg", alt: "Wohnbereich – Mehrfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/mehrfamilien/mfh-ilshofen-wohnen-kueche.jpg", alt: "Wohn- & Kochbereich – Mehrfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/mehrfamilien/mfh-ilshofen-kueche.jpg", alt: "Küche – Mehrfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/mehrfamilien/mfh-ilshofen-diele.jpg", alt: "Eingangsbereich – Mehrfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/mehrfamilien/mfh-ilshofen-bad-1.jpg", alt: "Badezimmer – Mehrfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/mehrfamilien/mfh-ilshofen-bad-2.jpg", alt: "Badezimmer – Mehrfamilienhaus (Musterhaus)" },
    ],
  },

  leadForm: {
    eyebrow: "Projektanfrage",
    heading: "Erzählen Sie uns",
    highlight: "von Ihrem Vorhaben.",
    lede: "Ein paar Angaben zu Grundstück und Anzahl der Wohneinheiten genügen – wir melden uns persönlich bei Ihnen.",
  },

  midPageCta: {
    eyebrow: "Persönlich und unverbindlich",
    heading: "Sprechen Sie mit uns über",
    highlight: "Ihr Bauvorhaben.",
    lede: "Grundstück, Anzahl der Wohneinheiten, Zeitplan – schildern Sie uns Ihr Projekt, und wir besprechen mit Ihnen die nächsten Schritte.",
    tone: "brand",
    primaryCta: { label: "Projekt anfragen", href: "/kontakt" },
  },
};
