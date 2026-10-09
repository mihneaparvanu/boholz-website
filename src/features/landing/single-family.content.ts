/**
 * Landing content — Einfamilienhaus (/wohnen/einfamilienhaus).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Einfamilien-
 * haus", Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative
 * claims, no unbacked prices; EH40 only as the optional upgrade). DRAFT —
 * pending BoHolz (Christoph) + legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const singleFamilyContent: LandingPageContent = {
  seo: {
    title: "Einfamilienhaus aus Holz bauen | BoHolz-Haus",
    description:
      "Ihr Einfamilienhaus aus Holz: individuell geplant, in Rot am See gefertigt und auf Wunsch schlüsselfertig übergeben. Jetzt Imagebroschüre kostenlos anfordern.",
    focusKeyword: "Einfamilienhaus aus Holz",
  },

  hero: {
    eyebrow: "Einfamilienhaus aus Holz",
    heading: "Ein Zuhause,",
    highlight: "in dem Ihre Familie wächst.",
    lede: "Der erste Kaffee auf der eigenen Terrasse, Kinderlachen im Garten, ein Zimmer für jeden – so fühlt sich Ankommen an. Wir planen Ihr Einfamilienhaus in Holzbauweise individuell und übergeben es auf Wunsch schlüsselfertig.",
    imageAlt: "Einfamilienhaus aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/brand/hero.webp",
    preferredCategorySlug: "einfamilienhaus",
    primaryCta: { label: "Imagebroschüre kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Worauf Sie sich",
    highlight: "verlassen können.",
    lede: "Vier Punkte, die jedes BoHolz-Einfamilienhaus ausmachen.",
  },
  benefits: [
    {
      icon: "pencil",
      title: "Frei geplanter Grundriss",
      body: "Raumaufteilung, Zimmerzahl und Wohnfläche richten sich nach Ihrer Familie – vom Hauswirtschaftsraum bis zur Speisekammer.",
      tone: "leaf",
    },
    {
      icon: "layers",
      title: "Wandaufbau KfW 55",
      body: "Holz-Aktiv-Wand mit 60 mm Holzfaserdämmplatte und Holzrahmenkonstruktion: U-Wert 0,164 W/(m²K), in der Plus-Variante 0,143 W/(m²K).",
      tone: "forest",
    },
    {
      icon: "hammer",
      title: "Vier Ausbaustufen",
      body: "Vom Ausbauhaus für handwerklich Begabte bis zur schlüsselfertigen Übergabe – Sie entscheiden, wie viel Sie selbst übernehmen.",
      tone: "sage",
    },
    {
      icon: "award",
      title: "Made in Germany",
      body: "Gefertigt bei unserem Partner Keitel-Haus in Rot am See-Brettheim – eine Werksbesichtigung ist nach Vereinbarung möglich.",
      tone: "accent",
    },
  ],

  houses: {
    eyebrow: "Hausmodelle",
    heading: "Unsere",
    highlight: "Einfamilienhäuser.",
    lede: "Vom kompakten Familienhaus bis zum Entwurf mit Einliegerwohnung – mit Satteldach, Erker oder Zwerchhaus, jeder Entwurf individuell anpassbar.",
    categorySlugs: ["einfamilienhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Einfamilienhäuser von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Einfamilienhaus von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Individuelle Planung",
    heading: "Ihr Grundriss.",
    highlight: "Ihre Handschrift.",
    lede: "Kein Haus nach Raster – sondern eines, das zu Ihrem Alltag passt.",
    paragraphs: [
      "Unsere Hausentwürfe sind Ideen, keine Vorgaben. Sie wünschen sich mehr Platz im Wohnbereich, ein zusätzliches Kinderzimmer oder ein ruhiges Arbeitszimmer? Gemeinsam verändern wir jeden Entwurf, bis er zu Ihnen passt.",
      "Von der ersten Skizze über die Bemusterung bis zur Schlüsselübergabe begleiten wir Sie persönlich – bis Sie sagen: „Genau so will ich wohnen.“",
    ],
    imageFallbackPath: "/images/landing/interiors/einfamilienhaus/efh-fildern-wohnen-hell.jpg",
    imageAlt: "Individuell geplantes Einfamilienhaus von BoHolz-Haus",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Das Einfamilienhaus",
    highlight: "für Ihre Lebenssituation.",
    lede: "Ob junge Familie, Paar oder mit Arbeitsplatz zu Hause – wir planen so, wie Sie leben.",
    items: [
      {
        icon: "users",
        label: "Familien",
        description:
          "Kinderzimmer, Rückzugsorte und eine offene Wohnküche als Treffpunkt – Platz für den Alltag mit Kindern.",
      },
      {
        icon: "heart-handshake",
        label: "Paare",
        description:
          "Kompakt geplant oder mit Reserve für später – Ihr erstes gemeinsames Haus, zugeschnitten auf Ihre Pläne.",
      },
      {
        icon: "briefcase",
        label: "Homeoffice",
        description:
          "Ein separates Arbeitszimmer im Erdgeschoss, das Wohnen und Arbeiten klar voneinander trennt.",
      },
      {
        icon: "home",
        label: "Mehrere Generationen",
        description:
          "Ausgewählte Entwürfe sind mit Einliegerwohnung planbar – für Eltern, erwachsene Kinder oder zur Vermietung.",
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
    highlight: "Einfamilienhaus.",
    items: [
      {
        id: "individuell",
        question: "Kann ich mein Einfamilienhaus individuell planen?",
        answer:
          "Ja. Jeder unserer Entwürfe dient als Ausgangspunkt – Grundriss, Fassade, Dachform und Ausstattung passen wir gemeinsam mit Ihnen an. Für die Architekturleistungen empfehlen wir Ihnen auf Wunsch das Planungsbüro Brettheim.",
      },
      {
        id: "kosten",
        question: "Was kostet ein Einfamilienhaus aus Holz?",
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
      {
        id: "ausbaustufen",
        question: "Was bedeuten die vier Ausbaustufen?",
        answer:
          "Sie wählen zwischen Ausbauhaus, Technikfertig, Fast fertig und Schlüsselfertig. Je früher die Übergabe, desto mehr Arbeiten können Sie in Eigenleistung übernehmen.",
      },
      {
        id: "besichtigen",
        question: "Kann ich ein BoHolz-Haus vorher besichtigen?",
        answer:
          "Ja. In unseren Musterhäusern in Bad Vilbel und Fellbach erleben Sie Bauweise und Ausstattung vor Ort. Nach Vereinbarung können Sie auch das Werk von Keitel-Haus in Rot am See-Brettheim besuchen.",
      },
    ],
  },

  seoText: {
    heading:
      "Einfamilienhaus aus Holz bauen – individuell geplant mit BoHolz-Haus",
    sections: [
      {
        heading: "Ein Einfamilienhaus, das zu Ihrem Leben passt",
        body: "Ein Einfamilienhaus ist für viele der Ort, an dem Familie ihren Mittelpunkt findet. Deshalb planen wir bei BoHolz-Haus nicht nach Raster, sondern nach Ihrem Alltag. Unsere Entwürfe – vom kompakten Familienhaus mit Satteldach bis zum großzügigen Haus mit Einliegerwohnung – sind Ausgangspunkte. Sie wünschen sich eine offene Wohnküche, ein Gäste- oder Arbeitszimmer im Erdgeschoss, einen Elternbereich mit Ankleide oder eine Speisekammer? All das planen wir gemeinsam mit Ihnen ein. Auch Dachform, Kniestock, Fassade und Carport oder Garage stimmen wir auf Ihre Wünsche und auf den Bebauungsplan Ihres Grundstücks ab.",
      },
      {
        heading: "Mit Homeoffice, Einliegerwohnung oder kompakt geplant",
        body: "Viele unserer Einfamilienhaus-Entwürfe denken über den heutigen Alltag hinaus. Beim Einfamilienhaus 22-162-190 liegt das Homeoffice in einem separaten Bereich im Erdgeschoss, sodass Sie auch bei Trubel ungestört arbeiten können. Die Entwürfe 35-181-150, 22-173-190 und 28-194-170 sind mit Einliegerwohnung planbar – für Eltern, erwachsene Kinder, als Büro oder zur Vermietung. Kompakte Entwürfe wie das Einfamilienhaus 38-128-125 mit rund 117 m² Wohnfläche verzichten auf raumnehmende Flure und nutzen die Fläche für das tägliche Wohnen.",
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
    heading: "Einfamilienhaus",
    highlight: "von innen.",
    lede: "Einblicke in Ausstattung und Raumgefühl. Die Abbildungen zeigen Musterhäuser und können Sonderausstattungen enthalten.",
    images: [
      { src: "/images/landing/interiors/einfamilienhaus/efh-fildern-wohnen-hell.jpg", alt: "Wohnbereich – Einfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/einfamilienhaus/efh-kofelblick-wohnen-arbeiten.jpg", alt: "Wohnbereich – Einfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/einfamilienhaus/efh-kofelblick-wohnen-kamin.jpg", alt: "Wohnbereich – Einfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/einfamilienhaus/efh-kofelblick-wohnen-kueche.jpg", alt: "Wohn- & Kochbereich – Einfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/einfamilienhaus/efh-kofelblick-essen.jpg", alt: "Essbereich – Einfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/einfamilienhaus/efh-kofelblick-bad.jpg", alt: "Badezimmer – Einfamilienhaus (Musterhaus)" },
    ],
  },

  leadForm: {
    eyebrow: "Kostenlose Imagebroschüre",
    heading: "Die Imagebroschüre",
    highlight: "kostenlos anfordern.",
    lede: "Name, E-Mail und Ort genügen – Sie erhalten unsere komplette Imagebroschüre mit allen Haustypen als PDF per E-Mail: vom Bungalow über die Stadtvilla bis zum Einfamilien-, Doppel- und Generationenhaus.",
  },

  midPageCta: {
    eyebrow: "Kostenlos und unverbindlich",
    heading: "Holen Sie sich jetzt den",
    highlight: "Imagebroschüre.",
    lede: "Unsere komplette Imagebroschüre mit allen Haustypen – Grundrisse und Hausdaten zu jedem Entwurf, als PDF per E-Mail.",
    tone: "brand",
    primaryCta: { label: "Imagebroschüre kostenlos anfordern", href: "#anfordern" },
  },
};
