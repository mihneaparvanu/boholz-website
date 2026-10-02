/**
 * Landing content — Kubus (/haeuser/kubus).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Kubus",
 * Stand 29.09.2026. EmpCo/UWG-clean (no environmental/climate claims, no
 * superlatives, no unbacked prices/promises). DRAFT — pending BoHolz
 * (Christoph Schmidt) + legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const kubusContent: LandingPageContent = {
  seo: {
    title: "Kubushaus als Fertighaus aus Holz | BoHolz-Haus",
    description:
      "Kubushaus in Holzbauweise: Flachdach, klare Linien und ein Obergeschoss ohne Dachschrägen – individuell geplant. Entwürfe ansehen, Hauskatalog kostenlos.",
    focusKeyword: "Kubushaus Fertighaus",
  },

  hero: {
    eyebrow: "Kubushaus aus Holz",
    heading: "Klare Linien.",
    highlight: "Starker Charakter.",
    lede: "Sie lieben geradlinige Formen, große Fenster und eine Architektur, die nicht jeder hat? Ein Kubus mit Flachdach und Attika setzt ein deutliches Zeichen – geplant in Holzbauweise nach Ihren Wünschen.",
    imageAlt: "Kubushaus aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/brand/hero.webp",
    preferredCategorySlug: "kubus",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihr Kubus",
    highlight: "auf einen Blick.",
    lede: "Vier Merkmale, die unsere Kubushäuser prägen.",
  },
  benefits: [
    {
      icon: "building-2",
      title: "Obergeschoss ohne Schrägen",
      body: "Das Flachdach macht die volle Fläche im Obergeschoss nutzbar – für Möbel, Schränke und helle Räume.",
      tone: "leaf",
    },
    {
      icon: "sparkles",
      title: "Markante Fassade",
      body: "Abgesetzte Holzfassade, überdachter Eingang und große Fensterflächen – je nach Entwurf bereits eingeplant.",
      tone: "forest",
    },
    {
      icon: "arrow-right",
      title: "Kurze Wege",
      body: "Beim Kubus 0-166 gelangen Sie aus der Doppelgarage direkt in den Hauswirtschaftsraum.",
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
    highlight: "Kubushäuser.",
    lede: "Flachdach mit Attika, klare Kanten, zwei Vollgeschosse – vom kompakten Entwurf bis zur großzügigen Kubusvilla.",
    categorySlugs: ["kubus"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Kubushäuser von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Kubushaus von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Moderne Architektur",
    heading: "Reduziert in der Form.",
    highlight: "Großzügig im Raum.",
    lede: "Zwei volle Ebenen, klar gegliedert – innen wie außen.",
    paragraphs: [
      "Durch das Flachdach wird die gesamte Fläche im Obergeschoss nutzbar – ohne Dachschrägen. Große Fensterflächen, abgesetzte Holzfassaden und überdachte Eingänge geben jedem Kubus sein eigenes Gesicht.",
      "Ob mit Doppelgarage oder großem Balkon: Wir planen die Details, die Ihren Kubus zu Ihrem Zuhause machen.",
    ],
    imageFallbackPath: "/images/landing/interiors/kubus/kubus-fuerth-wohnen.jpg",
    imageAlt: "Kubushaus von BoHolz-Haus",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Der Kubus",
    highlight: "für Ihren Stil.",
    lede: "Für Menschen, die Architektur nicht dem Zufall überlassen.",
    items: [
      {
        icon: "users",
        label: "Moderne Familien",
        description:
          "Schlafzimmer mit Ankleide, zwei helle Kinderzimmer und flexibel nutzbare Räume auf beiden Ebenen.",
      },
      {
        icon: "compass",
        label: "Architekturliebhaber",
        description:
          "Geradlinige Form und Flachdach – ein Haus, das zeitgenössisches Bauen sichtbar macht.",
      },
      {
        icon: "briefcase",
        label: "Homeoffice",
        description:
          "Zusätzliche Räume auf beiden Ebenen – als Arbeitszimmer oder Gästezimmer nutzbar.",
      },
      {
        icon: "sun",
        label: "Draußen zu Hause",
        description:
          "Beim Kubus 0-190 gehört ein 23 m² großer Balkon zum Entwurf.",
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
    highlight: "Kubushaus.",
    items: [
      {
        id: "was-ist-ein-kubushaus",
        question: "Was ist ein Kubushaus?",
        answer:
          "Ein Haus mit würfelähnlicher, geradliniger Form und Flachdach, meist über zwei Vollgeschosse. Die Architektur ist vom Bauhaus-Stil inspiriert.",
      },
      {
        id: "flachdach-bauen",
        question: "Darf ich überall einen Kubus mit Flachdach bauen?",
        answer:
          "Dachform und Geschosszahl müssen zum Bebauungsplan Ihres Grundstücks passen. Das klären wir gemeinsam mit Ihnen, bevor die Planung startet.",
      },
      {
        id: "garage",
        question: "Kann ich den Kubus mit Garage planen?",
        answer:
          "Ja. Beim Kubus 0-166 ist eine Doppelgarage mit direktem Zugang zum Hauswirtschaftsraum eingeplant; der Kubus 0-190 lässt sich mit Garage oder Carport ergänzen.",
      },
      {
        id: "kosten",
        question: "Was kostet ein Kubushaus aus Holz?",
        answer:
          "Der Preis hängt von Größe, Grundriss, Ausbaustufe und Ausstattung ab. Preisbeispiele finden Sie bei unseren Bestseller-Häusern; Ihr individuelles Angebot erstellen wir auf Grundlage Ihrer Planung.",
      },
      {
        id: "energie",
        question:
          "Welchen Energiestandard haben Ihre Häuser – und welche Förderung ist möglich?",
        answer:
          "Unsere Häuser erfüllen die Anforderungen des Gebäudeenergiegesetzes (GEG). Auf Wunsch planen wir als Effizienzhaus 40, optional mit QNG-Zertifizierung – Voraussetzung für bestimmte KfW-Förderprogramme. Welche Förderung für Ihr Vorhaben infrage kommt, besprechen wir gemeinsam.",
      },
    ],
  },

  seoText: {
    heading:
      "Kubushaus als Fertighaus aus Holz – moderne Architektur mit Flachdach",
    sections: [
      {
        heading: "Warum ein Kubus?",
        body: "Ein Kubushaus steht für klare Linien, ein Flachdach mit Attika und eine Architektur, die an den Bauhaus-Stil erinnert. Weil es keine Dachschrägen gibt, lässt sich die Fläche im Obergeschoss vollständig nutzen – für Schlafzimmer mit Ankleide, helle Kinderzimmer und zusätzliche Räume für Arbeit oder Gäste. Unsere Kubus-Entwürfe bieten rund 165 bis 176 m² Wohnfläche und mehr, mit abgesetzter Holzfassade, überdachtem Eingang, Doppelgarage mit direktem Zugang zum Hauswirtschaftsraum oder einem 23 m² großen Balkon. Wie bei allen BoHolz-Häusern ist jeder Entwurf ein Ausgangspunkt: Grundriss, Fassade und Fensterflächen planen wir gemeinsam mit Ihnen.",
      },
      {
        heading: "Kubus 0-166 und Kubusvilla 0-190 im Detail",
        body: "Der Kubus 0-166 bietet rund 165 m² Wohnfläche: Aus der Doppelgarage gelangen Sie direkt in den Hauswirtschaftsraum, auf beiden Ebenen gibt es je einen zusätzlichen Raum für Gäste oder Arbeit, im Obergeschoss ein Schlafzimmer mit Ankleide und zwei helle Kinderzimmer. Die Kubusvilla 0-190 mit rund 176 m² Wohnfläche setzt mit einem 23 m² großen Balkon einen markanten Akzent; großzügig geschnittene, helle Räume prägen den Grundriss. Beide Entwürfe passen wir an Ihre Wünsche an.",
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

  gallery: {
    eyebrow: "Eindrücke",
    heading: "Kubushaus",
    highlight: "von innen.",
    lede: "Einblicke in Ausstattung und Raumgefühl. Die Abbildungen zeigen Musterhäuser und können Sonderausstattungen enthalten.",
    images: [
      { src: "/images/landing/interiors/kubus/kubus-fuerth-wohnen.jpg", alt: "Wohnbereich – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-grafenberg-wohnen.jpg", alt: "Wohnbereich – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-fuerth-essen.jpg", alt: "Essbereich – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-grafenberg-essen.jpg", alt: "Essbereich – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-fuerth-kueche.jpg", alt: "Küche – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-fuerth-schlafzimmer.jpg", alt: "Schlafbereich – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-grafenberg-bad.jpg", alt: "Badezimmer – Kubushaus (Musterhaus)" },
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
