/**
 * Landing content — Bestseller (/haeuser/bestseller).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Bestseller",
 * Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative claims, no
 * unbacked prices; the "ab" prices are transcribed verbatim from the legally
 * reviewed docx, "Fast fertig" / Effizienzhaus 55, Stand 03/2026, inkl.
 * Bodenplatte und Architektenleistung). DRAFT — pending BoHolz (Christoph) +
 * legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const bestsellerContent: LandingPageContent = {
  seo: {
    title: "Fertighaus-Bestseller mit Preisen | BoHolz-Haus",
    description:
      "Sechs Bestseller-Häuser aus Holz mit Preis inkl. Bodenplatte und Architektenleistung – Bungalow, Stadtvilla, Einfamilien-, Doppel- und Generationenhaus.",
    focusKeyword: "Fertighaus Preise",
  },

  hero: {
    eyebrow: "Unsere Bestseller",
    heading: "Sechs Häuser,",
    highlight: "in die man sich verliebt.",
    lede: "Sie möchten wissen, was Ihr neues Zuhause kostet – bevor Sie wochenlang planen? Unsere sechs Bestseller sind durchgeplant und kosten ab 314.395 €* – inklusive Bodenplatte und Architektenleistung.",
    imageAlt: "Bestseller-Häuser aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/models/einfamilienhaus/22-162-190/gallery/einfamilienhaus-22-162-190-gallery-exterior-2-2026.webp",
    preferredCategorySlug: "einfamilienhaus",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Warum ein",
    highlight: "Bestseller?",
    lede: "Vier Gründe, mit einem Bestseller in Ihr Bauvorhaben zu starten.",
  },
  benefits: [
    {
      icon: "coins",
      title: "Preis von Anfang an",
      body: "Ab-Preise inklusive Bodenplatte und Architektenleistung für die Ausbaustufe „Fast fertig“ – eine klare Grundlage für Ihre Finanzierung.",
      tone: "leaf",
    },
    {
      icon: "zap",
      title: "Schneller entscheiden",
      body: "Grundriss, Hausdaten und Preis liegen bereits vor. Sie starten direkt mit Anpassungen und Bemusterung statt mit einem leeren Blatt.",
      tone: "forest",
    },
    {
      icon: "home",
      title: "Live erleben",
      body: "Den Bestseller Fellbach 148 besichtigen Sie in unserem Musterhaus in Fellbach – Räume, Materialien und Ausstattung zum Anfassen.",
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
    highlight: "Bestseller.",
    lede: "Bungalow, Stadtvilla, Einfamilienhaus, Doppelhaushälfte und Generationenhaus – sechs Entwürfe mit Preis, jeder individuell anpassbar.",
    categorySlugs: null,
    featuredOnly: true,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Unsere Bestseller",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Bestseller. Abbildungen können Sonderausstattungen enthalten, etwa Photovoltaik oder Pool.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Bestseller-Haus von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Die Favoriten unserer Bauherren",
    heading: "Durchdachte Grundrisse.",
    highlight: "Klare Preise.",
    lede: "Häuser, die vieles vereinen, was sich unsere Bauherren wünschen – und die trotzdem Ihre Handschrift tragen können.",
    paragraphs: [
      "Offene Wohnbereiche, ein Arbeitszimmer, Rückzugsorte für Eltern und Kinder: In unseren Bestsellern steckt, wonach Bauherren uns immer wieder fragen. Grundriss, Hausdaten und Preis liegen bereits vor – Sie wissen von Anfang an, woran Sie sind.",
      "Jeder Bestseller bleibt ein Ausgangspunkt: Details passen wir gemeinsam mit Ihnen an und kalkulieren die Änderungen für Ihr Angebot. Den Bestseller Fellbach 148 erleben Sie in unserem Musterhaus in Fellbach live.",
    ],
    imageFallbackPath: "/images/landing/interiors/einfamilienhaus/efh-kofelblick-wohnen-kueche.jpg",
    imageAlt: "Durchdachter Grundriss eines BoHolz-Bestsellers",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Ein Bestseller",
    highlight: "für jede Lebenssituation.",
    lede: "Vom kompakten Bungalow bis zum Generationenhaus – finden Sie Ihren Favoriten.",
    items: [
      {
        icon: "heart-handshake",
        label: "Paare und Best Ager",
        description:
          "Der Bestseller Komfort 116 bringt alles auf eine Ebene – kompakt, bequem und ohne Treppen.",
      },
      {
        icon: "users",
        label: "Familien",
        description:
          "Family 150, Fellbach 148 und Weitblick 140 bieten Kinderzimmer, Arbeitszimmer und viel Platz zum Zusammenleben.",
      },
      {
        icon: "building-2",
        label: "Baupartner",
        description:
          "Mit dem Bestseller Twin 138 bauen Sie als Doppelhaushälfte – gemeinsam mit Nachbarn, Freunden oder Familie.",
      },
      {
        icon: "home",
        label: "Mehrere Generationen",
        description:
          "Der Bestseller Plus 223 verbindet zwei Haushalte mit Einliegerwohnung unter einem Dach.",
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
    heading: "Ihre Fragen zu",
    highlight: "unseren Bestsellern.",
    items: [
      {
        id: "preis-enthalten",
        question: "Was ist im Preis enthalten?",
        answer:
          "Die Preise gelten für die Ausbaustufe „Fast fertig“ nach der Bau- und Leistungsbeschreibung Stand 03/2026, inklusive Bodenplatte und Architektenleistung, bei Bauort in Deutschland. Das Grundstück ist nicht enthalten; welche weiteren Kosten für Ihr Vorhaben anfallen, besprechen wir im Beratungsgespräch.",
      },
      {
        id: "veraendern",
        question: "Kann ich einen Bestseller verändern?",
        answer:
          "Ja. Jeder Bestseller lässt sich anpassen – vom Grundriss bis zur Ausstattung. Änderungen und eine andere Ausbaustufe können den Preis verändern; wir kalkulieren Ihr individuelles Angebot.",
      },
      {
        id: "schneller",
        question: "Geht es mit einem Bestseller schneller?",
        answer:
          "Grundriss und Hausdaten sind bereits ausgearbeitet, Sie steigen also direkt in Anpassung und Bemusterung ein. Wie lange Genehmigung und Bau dauern, hängt von Ihrem Grundstück und dem Bauamt ab; die Termine werden im Bauvertrag festgelegt.",
      },
      {
        id: "besichtigen",
        question: "Kann ich einen Bestseller besichtigen?",
        answer:
          "Ja. Der Bestseller Fellbach 148 steht als Musterhaus in Fellbach, Höhenstraße Platz 36. Unsere Bauweise erleben Sie außerdem im Musterhaus Bad Vilbel.",
      },
      {
        id: "ausbaustufen",
        question:
          "Gibt es die Bestseller auch in anderen Ausbaustufen oder als Effizienzhaus 40?",
        answer:
          "Ja. Neben „Fast fertig“ sind Ausbauhaus, Technikfertig und Schlüsselfertig möglich. Auf Wunsch planen wir als Effizienzhaus 40, optional mit QNG-Zertifizierung – Voraussetzung für bestimmte KfW-Förderprogramme.",
      },
    ],
  },

  seoText: {
    heading:
      "Fertighaus-Bestseller mit Preis – sechs Holzhäuser von BoHolz-Haus",
    sections: [
      {
        heading: "Was unsere Bestseller ausmacht",
        body: "Viele Bauherren möchten früh wissen, was ihr Haus kostet und wie es aussieht. Genau dafür gibt es unsere Bestseller: sechs ausgearbeitete Entwürfe in Holzbauweise mit festgelegten Hausdaten und Ab-Preis. Die Auswahl reicht vom Bungalow Komfort 116 mit rund 107 m² Wohnfläche über die Doppelhaushälfte Twin 138, die Stadtvilla Weitblick 140 und die Einfamilienhäuser Family 150 und Fellbach 148 bis zum Generationenhaus Plus 223 mit Einliegerwohnung und rund 210 m² Wohnfläche. Den Bestseller Fellbach 148 können Sie in unserem Musterhaus in Fellbach besichtigen.",
      },
      {
        heading: "Preise verständlich erklärt",
        body: "Alle Bestseller-Preise beziehen sich auf die Ausbaustufe „Fast fertig“ als Effizienzhaus 55 nach unserer Bau- und Leistungsbeschreibung Stand 03/2026 und enthalten Bodenplatte und Architektenleistung. Sie gelten für Bauorte in Deutschland. Wählen Sie eine andere Ausbaustufe – Ausbauhaus, Technikfertig oder Schlüsselfertig –, eine Planung als Effizienzhaus 40 oder individuelle Änderungen am Grundriss, kalkulieren wir Ihr Angebot entsprechend. Das Grundstück ist im Preis nicht enthalten. Im Beratungsgespräch gehen wir gemeinsam durch, welche weiteren Kosten für Ihr Bauvorhaben anfallen.",
      },
      {
        heading: "Vom Bestseller zu Ihrem Zuhause",
        body: "Weil Grundriss und Hausdaten bereits vorliegen, beginnt Ihre Planung nicht bei null. Im ersten Gespräch – im Musterhaus Fellbach, in Bad Vilbel oder bei einer Vor-Ort-Beratung – wählen Sie Ihren Favoriten und besprechen Ihre Wünsche. Danach folgen Anpassung des Entwurfs, Bauantrag und Finanzierung, die Bemusterung bei Keitel-Haus in Rot am See-Brettheim und schließlich Fertigung, Montage und Übergabe. Ein Leitsatz begleitet uns dabei: „Ein Haus wie unser eigenes.“",
      },
      {
        heading: "Klar beschriebener Wandaufbau",
        body: "Holz-Aktiv-Wand mit 60 mm Holzfaserdämmplatte und Holzrahmenkonstruktion: U-Wert 0,164 W/(m²K), in der Plus-Variante 0,143 W/(m²K).",
      },
    ],
  },

  gallery: {
    eyebrow: "Eindrücke",
    heading: "Unsere Bestseller",
    highlight: "von innen.",
    lede: "Einblicke in Ausstattung und Raumgefühl unserer meistgebauten Entwürfe. Die Abbildungen zeigen Musterhäuser und können Sonderausstattungen enthalten.",
    images: [
      { src: "/images/landing/interiors/einfamilienhaus/efh-kofelblick-wohnen-kueche.jpg", alt: "Wohn- & Kochbereich – Einfamilienhaus (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-fuerth-wohnen.jpg", alt: "Wohnbereich – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/stadtvilla/stadtvilla-mannheim-essen.jpg", alt: "Essbereich – Stadtvilla (Musterhaus)" },
      { src: "/images/landing/interiors/bungalow/bungalow-159-wohnen-hell.jpg", alt: "Wohnbereich – Bungalow (Musterhaus)" },
      { src: "/images/landing/interiors/kubus/kubus-grafenberg-essen.jpg", alt: "Essbereich – Kubushaus (Musterhaus)" },
      { src: "/images/landing/interiors/stadtvilla/stadtvilla-weingarten-wohnen.jpg", alt: "Wohnbereich – Stadtvilla (Musterhaus)" },
    ],
  },

  leadForm: {
    eyebrow: "Beratungstermin",
    heading: "Ihren Bestseller",
    highlight: "persönlich kennenlernen.",
    lede: "Nennen Sie uns Ihren Favoriten und Ihren Bauort – wir melden uns persönlich bei Ihnen, um einen Termin zu vereinbaren.",
  },

  midPageCta: {
    eyebrow: "Persönlich und unverbindlich",
    heading: "Ihr Bestseller –",
    highlight: "Ihr persönliches Angebot.",
    lede: "Wählen Sie Ihren Favoriten – wir besprechen Grundstück, Ausbaustufe und Wünsche und erstellen daraus Ihr individuelles Angebot.",
    tone: "brand",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
  },
};
