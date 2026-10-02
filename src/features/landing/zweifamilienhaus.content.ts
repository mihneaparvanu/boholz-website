/**
 * Landing content — Zweifamilienhaus (/haeuser/zweifamilienhaus).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Zweifamilien-
 * haus", Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative
 * claims, no unbacked prices). DRAFT — pending BoHolz (Christoph Schmidt) +
 * legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const zweifamilienhausContent: LandingPageContent = {
  seo: {
    title: "Zweifamilienhaus als Fertighaus aus Holz | BoHolz-Haus",
    description:
      "Zweifamilienhaus in Holzbauweise: zwei eigenständige Wohnungen für Familie oder Vermietung, individuell geplant. Entwürfe ansehen, Hauskatalog kostenlos.",
    focusKeyword: "Zweifamilienhaus Fertighaus",
  },

  hero: {
    eyebrow: "Zweifamilienhaus aus Holz",
    heading: "Zwei Zuhause",
    highlight: "unter einem Dach.",
    lede: "Ob mit den Eltern, den erwachsenen Kindern oder einer vermieteten Wohnung: Ein Zweifamilienhaus gibt zwei Haushalten ihren eigenen Raum. Wir planen es in Holzbauweise genau für Ihr Vorhaben.",
    imageAlt: "Zweifamilienhaus aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/brand/hero.webp",
    preferredCategorySlug: "zweifamilienhaus",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihr Zweifamilienhaus",
    highlight: "auf einen Blick.",
    lede: "Vier Punkte, die zwei Haushalte gut unter ein Dach bringen.",
  },
  benefits: [
    {
      icon: "building-2",
      title: "Zwei eigenständige Wohnungen",
      body: "Eigene Küche, eigenes Bad, eigene Wohnräume – für ein selbstständiges Leben auf jeder Etage.",
      tone: "leaf",
    },
    {
      icon: "key-round",
      title: "Flexible Nutzung",
      body: "Selbst bewohnen, mit der Familie teilen oder eine Wohnung vermieten – die Nutzung darf sich mit den Jahren ändern.",
      tone: "forest",
    },
    {
      icon: "trending-up",
      title: "Auch für Hanglagen",
      body: "Das Pultdachhaus 21-349-225 nutzt Hanggrundstücke für drei Geschosse und lässt sich in getrennte Einheiten teilen.",
      tone: "sage",
    },
    {
      icon: "layers",
      title: "Klar beschriebener Wandaufbau",
      body: "Holz-Aktiv-Wand mit 60 mm Holzfaserdämmplatte und Holzrahmenkonstruktion: U-Wert 0,164 W/(m²K), in der Plus-Variante 0,143 W/(m²K).",
      tone: "accent",
    },
  ],

  houses: {
    eyebrow: "Hausmodelle",
    heading: "Unsere",
    highlight: "Zweifamilienhäuser.",
    lede: "Vom Zweifamilienhaus mit zwei Etagenwohnungen bis zum Pultdachhaus für Hanggrundstücke – jeder Entwurf individuell anpassbar.",
    categorySlugs: ["zweifamilienhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Zweifamilienhäuser von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Zweifamilienhaus von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Zwei Wohneinheiten",
    heading: "Zwei Wohnungen.",
    highlight: "Ein gemeinsames Haus.",
    lede: "Zwei eigenständige Wohnungen, gemeinsam geplant und gebaut.",
    paragraphs: [
      "Im Zweifamilienhaus 22-282 hat jede Etage ihren offenen Wohn- und Essbereich, eine separate Küche, Bad und Schlafzimmer. Freisitz und Balkon schaffen für beide Wohnungen einen Platz im Freien.",
      "Ob beide Einheiten gleich groß sein sollen oder eine Wohnung mehr Fläche erhält: Wir planen die Aufteilung nach Ihren Wünschen.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-06.webp",
    imageAlt: "Zweifamilienhaus von BoHolz-Haus",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Das Zweifamilienhaus",
    highlight: "für zwei Haushalte.",
    lede: "Für Familien, die zusammenrücken, und Bauherren, die weiterplanen.",
    items: [
      {
        icon: "home",
        label: "Mehrere Generationen",
        description:
          "Eltern oben, Kinder unten – oder umgekehrt: nah beieinander, mit getrennten Wohnungen.",
      },
      {
        icon: "coins",
        label: "Wohnen und vermieten",
        description:
          "Eine Wohnung selbst nutzen, die zweite vermieten – das Konzept ist für beides geplant.",
      },
      {
        icon: "users",
        label: "Gemeinsam Bauende",
        description:
          "Zwei Parteien, ein Grundstück, ein Haus – mit klar getrennten Wohnbereichen.",
      },
      {
        icon: "trending-up",
        label: "Hanglage",
        description:
          "Ein Grundstück mit Gefälle? Unser Pultdachhaus nutzt die Hanglage für drei Geschosse.",
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
    highlight: "Zweifamilienhaus.",
    items: [
      {
        id: "unterschied-doppelhaus",
        question: "Was ist der Unterschied zwischen Zweifamilienhaus und Doppelhaus?",
        answer:
          "Beim Zweifamilienhaus liegen zwei Wohnungen in einem Gebäude, meist übereinander. Beim Doppelhaus stehen zwei Haushälften nebeneinander, jede mit eigenem Eingang. Beide Varianten planen wir.",
      },
      {
        id: "wohnflaeche",
        question: "Wie viel Wohnfläche bietet ein Zweifamilienhaus?",
        answer:
          "Der Entwurf 22-282 bietet rund 257 m² Wohnfläche nach WoFlV auf zwei Etagen. Die Aufteilung zwischen den Wohnungen passen wir an Ihren Bedarf an.",
      },
      {
        id: "vermieten",
        question: "Kann ich eine der Wohnungen vermieten?",
        answer:
          "Ja. Beide Wohnungen sind eigenständig geplant und lassen sich getrennt nutzen. Zu Finanzierung und steuerlichen Fragen beraten Sie Ihre Bank und Ihr Steuerberater.",
      },
      {
        id: "kfw-foerderung",
        question: "Wie wird die KfW-Förderung bei zwei Wohneinheiten berechnet?",
        answer:
          "KfW-Förderkredite werden in der Regel je Wohneinheit gewährt. Welche Programme und Beträge für Ihr Vorhaben infrage kommen, hängt von den jeweils gültigen Förderbedingungen ab – dazu beraten wir Sie gemeinsam mit Ihrer Bank.",
      },
      {
        id: "kosten",
        question: "Was kostet ein Zweifamilienhaus aus Holz?",
        answer:
          "Der Preis hängt von Größe, Grundriss, Ausbaustufe und Ausstattung ab. Preisbeispiele finden Sie bei unseren Bestseller-Häusern; Ihr individuelles Angebot erstellen wir auf Grundlage Ihrer Planung.",
      },
    ],
  },

  seoText: {
    heading:
      "Zweifamilienhaus als Fertighaus aus Holz – zwei Wohnungen, ein Haus",
    sections: [
      {
        heading: "Zwei Haushalte, klar getrennt",
        body: "Ein Zweifamilienhaus vereint zwei eigenständige Wohnungen in einem Gebäude. Das passt, wenn mehrere Generationen zusammenleben möchten, wenn erwachsene Kinder eine eigene Wohnung brauchen oder wenn eine Wohnung vermietet werden soll. Unser Zweifamilienhaus 22-282 bietet auf zwei Etagen rund 257 m² Wohnfläche: In jeder Wohnung bildet ein offener Wohn- und Essbereich den Mittelpunkt, ergänzt durch separate Küche, Schlafzimmer, Bad und Nebenräume. Ein Kinderzimmer im Erdgeschoss und zwei Kinderzimmer im Obergeschoss bieten Platz für unterschiedliche Familiengrößen, Freisitz und Balkon schaffen Plätze im Freien. Für Hanggrundstücke bieten wir mit dem Pultdachhaus 21-349-225 einen Entwurf mit drei Geschossen, der sich in getrennte Einheiten teilen lässt.",
      },
      {
        heading: "Zweifamilienhaus am Hang: das Pultdachhaus",
        body: "Für Grundstücke mit Gefälle bieten wir das Pultdachhaus 21-349-225 an. Auf Kellergeschoss, Erdgeschoss und Dachgeschoss verteilt es rund 281 m² Wohnfläche nach WoFlV. Die Geschosse lassen sich als getrennte Wohneinheiten oder als offenes Raumkonzept nutzen, und die große Garage dient zugleich als Terrasse. So wird aus einer anspruchsvollen Hanglage ein Haus mit weitem Ausblick und Platz für zwei Haushalte.",
      },
      {
        heading: "Holzbauweise mit klar beschriebenem Wandaufbau",
        body: "Die Außenwände unserer Häuser bestehen aus einer Holzrahmenkonstruktion mit außenliegender 60-mm-Holzfaserdämmplatte, Dämmung der Wärmeleitgruppe 035 zwischen den Rahmen, OSB-4-Platte, Luftdichtheitsebene und Gipskarton-Feuerschutzplatte. Außen schließt ein diffusionsoffener Silikonharz-Edelputz die Wand ab. Die Holz-Aktiv-Wand erreicht einen U-Wert von 0,164 W/(m²K), die Holz-Aktiv-Wand plus mit 240 mm Rahmen 0,143 W/(m²K) – beide mit Brandschutzklassifizierung F30-B. Gefertigt werden die Bauteile bei unserem Partner Keitel-Haus in Rot am See-Brettheim, montiert von einem eingespielten Montageteam auf Ihrer Baustelle.",
      },
      {
        heading: "Vom ersten Gespräch bis zur Schlüsselübergabe",
        body: "Am Anfang steht ein persönliches Gespräch – in einem unserer Musterhäuser in Bad Vilbel oder Fellbach oder bei einer Vor-Ort-Beratung. Wir unterstützen Sie bei der Grundstückssuche, entwickeln mit Ihnen den Entwurf und begleiten Bauantrag und Finanzierung. In der Bemusterung bei Keitel-Haus legen Sie Ausstattung und Haustechnik fest. Danach folgen Fertigung, Montage, Innenausbau und die Übergabe. Dabei wählen Sie eine von vier Ausbaustufen: Ausbauhaus, Technikfertig, Fast fertig oder Schlüsselfertig – je nachdem, wie viel Sie selbst übernehmen möchten. Unser Leitsatz dabei: „Ein Haus wie unser eigenes.“",
      },
    ],
  },

  leadForm: {
    eyebrow: "Kostenloser Hauskatalog",
    heading: "Den Hauskatalog",
    highlight: "kostenlos anfordern.",
    lede: "Name, E-Mail und Ort genügen – Sie erhalten unseren kompletten Hauskatalog mit allen Haustypen als PDF per E-Mail: vom Bungalow über die Stadtvilla bis zum Einfamilien-, Doppel- und Generationenhaus.",
  },

  midPageCta: {
    eyebrow: "Kostenlos und unverbindlich",
    heading: "Holen Sie sich jetzt den",
    highlight: "Hauskatalog.",
    lede: "Unser kompletter Hauskatalog mit allen Haustypen – Grundrisse und Hausdaten zu jedem Entwurf, als PDF per E-Mail.",
    tone: "brand",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
  },
};
