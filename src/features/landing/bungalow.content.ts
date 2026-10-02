/**
 * Landing content — Bungalow (/wohnen/bungalow).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Bungalow",
 * Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative claims, no
 * unbacked prices; EH40 only as the optional upgrade; „barrierefrei" only as
 * „auf Wunsch planbar"). DRAFT — pending BoHolz (Christoph Schmidt) + legal
 * sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const bungalowContent: LandingPageContent = {
  seo: {
    title: "Bungalow als Fertighaus aus Holz | BoHolz-Haus",
    description:
      "Bungalow aus Holz: alles auf einer Ebene, individuell geplant und auf Wunsch barrierefrei. Entwürfe mit 122 bis 141 m² ansehen – Hauskatalog kostenlos.",
    focusKeyword: "Bungalow Fertighaus",
  },

  hero: {
    eyebrow: "Bungalow aus Holz",
    heading: "Alles auf einer Ebene.",
    highlight: "Alles in Reichweite.",
    lede: "Keine Treppen, kurze Wege und der Garten direkt vor der Terrassentür – so entspannt kann Wohnen sein. Wir planen Ihren Bungalow in Holzbauweise individuell, auf Wunsch barrierefrei.",
    imageAlt: "Bungalow aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/models/bungalow/22-134/gallery/bungalow-22-134-gallery-exterior-2026.webp",
    preferredCategorySlug: "bungalow",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihr Bungalow",
    highlight: "auf einen Blick.",
    lede: "Vier Merkmale, die Sie im Alltag spüren.",
  },
  benefits: [
    {
      icon: "home",
      title: "Wohnen auf einer Ebene",
      body: "Kurze Wege zwischen Küche, Wohnbereich, Schlafzimmer und Bad – ohne eine einzige Treppenstufe im Haus.",
      tone: "leaf",
    },
    {
      icon: "check",
      title: "Barrierearm im Standard",
      body: "Bodengleich geflieste Dusche mit Edelstahlablaufrinne und Haustür mit Schwellenabdichtung für einen barrierefreien Zugang.",
      tone: "forest",
    },
    {
      icon: "sun",
      title: "Licht und Garten",
      body: "Giebelverglasung, bodentiefe Fensterfronten oder ein geschützter Freisitz öffnen den Wohnbereich nach draußen – je nach Entwurf.",
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
    highlight: "Bungalows.",
    lede: "Mit Satteldach, Walmdach oder kubischem Anbau – kompakt oder großzügig, auf Wunsch mit Einliegerwohnung.",
    categorySlugs: ["bungalow"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Bungalows von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer ebenerdigen Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Bungalow von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Wohnen ohne Treppen",
    heading: "Heute bequem.",
    highlight: "Auch in späteren Jahren.",
    lede: "Ein Grundriss, der sich Ihrem Leben anpasst – nicht umgekehrt.",
    paragraphs: [
      "Im Bungalow liegen Wohnen, Schlafen, Bad und Hauswirtschaft auf einer Ebene. Das macht den Alltag leichter – mit kleinen Kindern ebenso wie in späteren Lebensphasen.",
      "Breitere Türen, schwellenlose Übergänge, mehr Bewegungsfläche im Bad: Wir planen die Details, die Ihnen wichtig sind, von Anfang an mit ein.",
    ],
    imageFallbackPath: "/images/landing/interiors/bungalow/bungalow-159-wohnen-hell.jpg",
    imageAlt: "Individuell geplanter Bungalow von BoHolz-Haus",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Der Bungalow",
    highlight: "für jede Lebensphase.",
    lede: "Ob Sie jung bauen, sich verkleinern oder vorausplanen – ein Bungalow nimmt Ihnen die Treppen ab.",
    items: [
      {
        icon: "heart-handshake",
        label: "Wenn die Kinder ausziehen",
        description:
          "Weniger Fläche, mehr Leben: Ein Bungalow hat die passende Größe, wenn das Familienhaus zu groß geworden ist.",
      },
      {
        icon: "users",
        label: "Junge Familien",
        description:
          "Kinderwagen, Laufrad, Spielsachen – ohne Treppen bleibt alles im Blick und in Reichweite.",
      },
      {
        icon: "compass",
        label: "Vorausplaner",
        description:
          "Wer barrierefreie Details von Anfang an mitplant, schafft sich Spielraum für spätere Lebensphasen.",
      },
      {
        icon: "briefcase",
        label: "Homeoffice und Gäste",
        description:
          "Ein Gästezimmer, das auch als Arbeitszimmer funktioniert – bei ausgewählten Entwürfen bereits eingeplant.",
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
    highlight: "Bungalow.",
    items: [
      {
        id: "barrierefrei",
        question: "Kann ich meinen Bungalow barrierefrei planen?",
        answer:
          "Ja. Eine bodengleiche Dusche und ein Hauseingang mit Schwellenabdichtung sind bereits im Standard. Weitere Anforderungen – etwa breitere Türen oder Bewegungsflächen für Rollstuhlnutzer – planen wir auf Wunsch individuell mit Ihnen.",
      },
      {
        id: "grundstueck",
        question: "Wie groß muss das Grundstück für einen Bungalow sein?",
        answer:
          "Da alle Räume auf einer Ebene liegen, braucht ein Bungalow mehr Grundfläche als ein zweigeschossiges Haus mit gleicher Wohnfläche. Ob Ihr Grundstück und der Bebauungsplan passen, klären wir gemeinsam in der Planungsphase.",
      },
      {
        id: "einliegerwohnung",
        question: "Kann ein Bungalow eine Einliegerwohnung haben?",
        answer:
          "Ja. Der Bungalow 22-134 ist mit Einliegerwohnung oder separatem Homeoffice-Bereich planbar.",
      },
      {
        id: "kosten",
        question: "Was kostet ein Bungalow aus Holz?",
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
      "Bungalow als Fertighaus aus Holz – ebenerdig wohnen mit BoHolz-Haus",
    sections: [
      {
        heading: "Warum ein Bungalow?",
        body: "Ein Bungalow bringt alle Wohnräume auf eine Ebene: Wohnen, Kochen, Schlafen, Bad und Hauswirtschaftsraum sind ohne Treppe erreichbar. Das erleichtert den Alltag in jeder Lebensphase – für junge Familien mit Kinderwagen ebenso wie für Paare, deren Kinder ausgezogen sind und die sich verkleinern möchten. Unsere Bungalow-Entwürfe bieten rund 122 bis 141 m² Wohnfläche, mit Satteldach, Walmdach oder einem kubischen Anbau mit Flachdach. Große Wohn-, Ess- und Kochbereiche von rund 45 m², Giebelverglasung, bodentiefe Fenster oder ein geschützter Freisitz in der Mitte des Hauses schaffen eine enge Verbindung zum Garten.",
      },
      {
        heading: "Barrierefrei planen – von Anfang an",
        body: "Schon im Standard erhalten Sie eine bodengleich geflieste Dusche mit Edelstahlablaufrinne und eine Haustür mit Schwellenabdichtung für einen barrierefreien Zugang. Darüber hinaus planen wir auf Wunsch weitere Details mit ein: breitere Türen, schwellenlose Übergänge zur Terrasse, mehr Bewegungsfläche in Bad und Küche oder eine Smart-Home-Ausstattung, mit der Sie Rollläden und Raumtemperaturen per Tablet oder Wandpanel steuern. Was davon für Sie sinnvoll ist, besprechen wir in der Planung – damit Ihr Bungalow heute passt und auch in späteren Jahren.",
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
    heading: "Bungalow",
    highlight: "von innen.",
    lede: "Einblicke in Ausstattung und Raumgefühl. Die Abbildungen zeigen Musterhäuser und können Sonderausstattungen enthalten.",
    images: [
      { src: "/images/landing/interiors/bungalow/bungalow-159-wohnen-hell.jpg", alt: "Wohnbereich – Bungalow (Musterhaus)" },
      { src: "/images/landing/interiors/bungalow/bungalow-159-kueche.jpg", alt: "Küche – Bungalow (Musterhaus)" },
      { src: "/images/landing/interiors/bungalow/bungalow-159-schlafzimmer.jpg", alt: "Schlafbereich – Bungalow (Musterhaus)" },
      { src: "/images/landing/interiors/bungalow/bungalow-159-bad.jpg", alt: "Badezimmer – Bungalow (Musterhaus)" },
      { src: "/images/landing/interiors/bungalow/bungalow-bader-bad.jpg", alt: "Badezimmer – Bungalow (Musterhaus)" },
      { src: "/images/landing/interiors/bungalow/bungalow-bader-wohnen-essen.jpg", alt: "Badezimmer – Bungalow (Musterhaus)" },
      { src: "/images/landing/interiors/bungalow/bungalow-bader-wohnen-kueche-modern.jpg", alt: "Badezimmer – Bungalow (Musterhaus)" },
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
