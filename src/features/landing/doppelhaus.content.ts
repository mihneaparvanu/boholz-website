/**
 * Landing content — Doppelhaus (/haeuser/doppelhaus).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Doppelhaus",
 * Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative claims, no
 * unbacked prices; EH40 only as the optional upgrade). DRAFT — pending BoHolz
 * (Christoph) + legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const doppelhausContent: LandingPageContent = {
  seo: {
    title: "Doppelhaus als Fertighaus aus Holz | BoHolz-Haus",
    description:
      "Doppelhaus in Holzbauweise: zwei eigenständige Haushälften, gemeinsam geplant – für Baupartner, Familie oder Vermietung. Hauskatalog kostenlos anfordern.",
    focusKeyword: "Doppelhaus Fertighaus",
  },

  hero: {
    eyebrow: "Doppelhaus aus Holz",
    heading: "Gemeinsam bauen.",
    highlight: "Jeder für sich zu Hause.",
    lede: "Sie wünschen sich ein eigenes Haus mit Garten – und möchten Grundstück und Planung mit Familie, Freunden oder Baupartnern teilen? Ein Doppelhaus in Holzbauweise macht zwei eigenständige Zuhause daraus.",
    imageAlt: "Doppelhaus aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/brand/hero.webp",
    preferredCategorySlug: "doppelhaus",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihr Doppelhaus",
    highlight: "auf einen Blick.",
    lede: "Vier Punkte, die ein Doppelhaus von BoHolz-Haus ausmachen.",
  },
  benefits: [
    {
      icon: "building-2",
      title: "Zwei eigenständige Einheiten",
      body: "Getrennte Eingänge und Wohnbereiche – für Bauherrengemeinschaften, Familien oder Vermietung.",
      tone: "leaf",
    },
    {
      icon: "compass",
      title: "Aus einem Guss",
      body: "Fassade, Dach und Carport planen wir als gemeinsames Konzept, die Innenräume nach den Wünschen jeder Partei.",
      tone: "forest",
    },
    {
      icon: "hammer",
      title: "Vier Ausbaustufen",
      body: "Vom Ausbauhaus für handwerklich Begabte bis zur schlüsselfertigen Übergabe – Sie entscheiden, wie viel Sie selbst übernehmen.",
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
    highlight: "Doppelhäuser.",
    lede: "Mit Satteldach und Carport oder mit Walmdach und einem Obergeschoss ohne Dachschrägen – jeder Entwurf individuell anpassbar.",
    categorySlugs: ["doppelhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Doppelhäuser von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Doppelhaus von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Zwei Haushälften",
    heading: "Eine Planung.",
    highlight: "Zwei eigene Wege.",
    lede: "Zwei Haushälften, gemeinsam geplant – und doch jede mit eigenem Charakter.",
    paragraphs: [
      "Ein Doppelhaus verbindet zwei Wohneinheiten unter einem Dach. Jede Haushälfte hat ihren eigenen Eingang und ihre eigenen Wohnräume – vom Wohn- und Essbereich im Erdgeschoss bis zu den Schlafräumen im Obergeschoss.",
      "Ob Sie mit bereits bekannten Baupartnern bauen oder eine Hälfte selbst bewohnen und die andere vermieten: Wir stimmen die Planung auf Ihr Vorhaben ab.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-06.webp",
    imageAlt: "Individuell geplantes Doppelhaus von BoHolz-Haus",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Das Doppelhaus",
    highlight: "für gemeinsame Pläne.",
    lede: "Ein Haus, zwei Haushalte – für viele Lebensmodelle die passende Lösung.",
    items: [
      {
        icon: "heart-handshake",
        label: "Baupartner",
        description:
          "Mit Freunden oder Bekannten bauen – ein Grundstück, eine Planung, zwei eigene Zuhause.",
      },
      {
        icon: "users",
        label: "Familien",
        description:
          "Eltern und erwachsene Kinder Tür an Tür – nah beieinander und jeder mit eigener Haustür.",
      },
      {
        icon: "key-round",
        label: "Vermieter",
        description:
          "Eine Hälfte selbst bewohnen, die andere vermieten – das Konzept lässt beides zu.",
      },
      {
        icon: "home",
        label: "Mehr Platz",
        description:
          "Beim Doppelhaus 28-299 erhält jede Hälfte ein Obergeschoss ohne Dachschrägen und einen Wohn- und Essbereich von rund 42 m².",
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
    highlight: "Doppelhaus.",
    items: [
      {
        id: "unterschied-zweifamilienhaus",
        question:
          "Was ist der Unterschied zwischen Doppelhaus und Zweifamilienhaus?",
        answer:
          "Beim Doppelhaus stehen zwei Haushälften nebeneinander, jede mit eigenem Eingang und meist über beide Etagen. Beim Zweifamilienhaus liegen zwei Wohnungen in der Regel übereinander in einem Gebäude. Beide Varianten planen wir.",
      },
      {
        id: "haelften-planen",
        question: "Können beide Haushälften unterschiedlich geplant werden?",
        answer:
          "Innenraumaufteilung und Ausstattung stimmen Sie je Haushälfte ab. Für Fassade und Dach empfehlen wir ein gemeinsames Konzept – häufig gibt auch der Bebauungsplan ein einheitliches Erscheinungsbild vor.",
      },
      {
        id: "vermieten",
        question: "Kann ich eine Haushälfte vermieten?",
        answer:
          "Ja, das Konzept eignet sich für Eigennutzung ebenso wie für Vermietung. Zu Finanzierung und steuerlichen Fragen beraten Sie Ihre Bank und Ihr Steuerberater.",
      },
      {
        id: "kosten",
        question: "Was kostet ein Doppelhaus aus Holz?",
        answer:
          "Der Preis hängt von Größe, Grundriss, Ausbaustufe und Ausstattung ab. Preisbeispiele finden Sie bei unseren Bestseller-Häusern; Ihr individuelles Angebot erstellen wir auf Grundlage Ihrer Planung.",
      },
      {
        id: "kfw-foerderung",
        question:
          "Wie wird die KfW-Förderung bei zwei Wohneinheiten berechnet?",
        answer:
          "KfW-Förderkredite werden in der Regel je Wohneinheit gewährt. Welche Programme und Beträge für Ihr Vorhaben infrage kommen, hängt von den jeweils gültigen Förderbedingungen ab – dazu beraten wir Sie gemeinsam mit Ihrer Bank.",
      },
    ],
  },

  seoText: {
    heading:
      "Doppelhaus als Fertighaus aus Holz – zwei Haushälften, eine Planung",
    sections: [
      {
        heading: "Warum ein Doppelhaus?",
        body: "Ein Doppelhaus ist für viele der Weg zum eigenen Haus mit Garten, wenn Grundstück und Planung gemeinsam genutzt werden sollen. Zwei Haushälften stehen Wand an Wand, jede mit eigenem Eingang, eigenen Wohnräumen und eigener Haustechnik. Das passt zu Bauherrengemeinschaften aus Freunden oder Bekannten, zu Familien, die nah beieinander wohnen möchten, und zu Bauherren, die eine Hälfte selbst nutzen und die andere vermieten. Unsere Doppelhaus-Entwürfe bieten insgesamt rund 227 bis 295 m² Wohnfläche – mit Satteldach und einer Eingangsüberdachung, die in den Carport übergeht, oder mit Walmdach und einem Obergeschoss ohne störende Dachschrägen.",
      },
      {
        heading: "Zwei Entwürfe, zwei Charaktere",
        body: "Das Doppelhaus 38-238-125 setzt auf ein Satteldach mit 38° Neigung und eine markante Eingangsüberdachung, die fließend in den Carport übergeht. Im Erdgeschoss liegen Wohn- und Essbereich, im Obergeschoss die Schlafräume – eine klassische Aufteilung mit Platz für die ganze Familie in jeder Haushälfte. Das Doppelhaus 28-299 mit Walmdach richtet sich an gehobene Ansprüche: Jede Hälfte bietet einen Wohn- und Essbereich von rund 42 m² mit zwei Terrassenausgängen, ein Arbeitszimmer, einen großen Haustechnikraum und im Obergeschoss Elternschlafzimmer mit Ankleide, zwei Kinderzimmer und ein großes Familienbad – ohne störende Dachschrägen.",
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
    lede: "Name, E-Mail und Ort genügen – Sie erhalten den Katalog mit allen Doppelhaus-Entwürfen als PDF per E-Mail.",
  },

  midPageCta: {
    eyebrow: "Kostenlos und unverbindlich",
    heading: "Holen Sie sich jetzt den",
    highlight: "Hauskatalog.",
    lede: "Alle Doppelhaus-Entwürfe mit Grundrissen und Hausdaten – dazu unsere weiteren Haustypen, als PDF per E-Mail.",
    tone: "brand",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
  },
};
