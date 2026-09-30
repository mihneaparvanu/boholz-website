/**
 * Landing content — Stadtvilla (/haeuser/stadtvilla).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Stadtvilla",
 * Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative claims,
 * no unbacked prices; EH40 only as the optional upgrade). DRAFT — pending
 * BoHolz (Christoph Schmidt) + legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const stadtvillaContent: LandingPageContent = {
  seo: {
    title: "Stadtvilla als Fertighaus aus Holz | BoHolz-Haus",
    description:
      "Stadtvilla in Holzbauweise: zwei Vollgeschosse, Walmdach und ein Grundriss nach Ihren Wünschen. Entwürfe ansehen und Hauskatalog kostenlos anfordern.",
    focusKeyword: "Stadtvilla Fertighaus",
  },

  hero: {
    eyebrow: "Stadtvilla aus Holz",
    heading: "Zwei volle Etagen.",
    highlight: "Ein Auftritt mit Haltung.",
    lede: "Sie kommen nach Hause – und vor Ihnen steht ein Haus mit klaren Linien, flach geneigtem Walmdach und viel Raum auf zwei Vollgeschossen. Wir planen Ihre Stadtvilla in Holzbauweise nach Ihren Wünschen.",
    imageAlt: "Stadtvilla aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/brand/hero.webp",
    preferredCategorySlug: "stadtvilla",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihre Stadtvilla",
    highlight: "auf einen Blick.",
    lede: "Vier Merkmale, die unsere Stadtvillen prägen.",
  },
  benefits: [
    {
      icon: "building-2",
      title: "Zwei Vollgeschosse",
      body: "Ein großzügiges Obergeschoss für Schlafzimmer, Kinderzimmer und ein Familienbad – Raum für alle.",
      tone: "leaf",
    },
    {
      icon: "compass",
      title: "Klare Architektur",
      body: "Walmdach mit 22° Neigung, ruhige Fassaden und auf Wunsch farblich abgesetzte Elemente.",
      tone: "forest",
    },
    {
      icon: "key-square",
      title: "Garage mit kurzen Wegen",
      body: "Doppelgarage mit direktem Zugang zum Hauswirtschaftsraum – je nach Entwurf integriert oder optional ergänzbar.",
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
    highlight: "Stadtvillen.",
    lede: "Mit Walmdach, zwei Vollgeschossen und Arbeitszimmer im Erdgeschoss – auf Wunsch mit Doppelgarage, jeder Entwurf individuell anpassbar.",
    categorySlugs: ["stadtvilla"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Stadtvillen von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Stadtvilla von BoHolz-Haus",
    allowPlaceholder: true,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Die Stadtvilla",
    highlight: "für Ihren Lebensentwurf.",
    lede: "Für alle, die Platz, klare Formen und einen eleganten Auftritt suchen.",
    items: [
      {
        icon: "users",
        label: "Familien",
        description:
          "Zwei gleich große Kinderzimmer, ein Familienbad und ein offener Wohnbereich – Raum für den gemeinsamen Alltag.",
      },
      {
        icon: "compass",
        label: "Architekturliebhaber",
        description:
          "Klare Formen und ein markanter Auftritt – eine Stadtvilla setzt ein Zeichen in Ihrer Nachbarschaft.",
      },
      {
        icon: "briefcase",
        label: "Homeoffice",
        description:
          "Ein Arbeitszimmer im Erdgeschoss, räumlich getrennt vom Familienleben im Obergeschoss.",
      },
      {
        icon: "heart-handshake",
        label: "Gastgeber",
        description:
          "Bei ausgewählten Entwürfen zwei zusätzliche Räume – für Gäste, Hobby oder Arbeit.",
      },
    ],
  },

  featureBody: {
    eyebrow: "Architektur & Raum",
    heading: "Elegant von außen.",
    highlight: "Großzügig von innen.",
    lede: "Eine Stadtvilla, die repräsentativen Auftritt und Familienalltag verbindet.",
    paragraphs: [
      "Zwei Vollgeschosse schaffen ein großzügiges Obergeschoss – für Kinderzimmer, ein Familienbad und einen Elternbereich mit Ankleide. Im Erdgeschoss öffnet sich der Wohn- und Essbereich zum Garten.",
      "Fassade, Fensteraufteilung, Farbakzente und Garage planen wir gemeinsam mit Ihnen – bis Ihre Stadtvilla genau Ihren Vorstellungen entspricht.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-06.webp",
    imageAlt: "Stadtvilla von BoHolz-Haus, elegant von außen und großzügig von innen",
    reverse: false,
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
    heading: "Ihre Fragen zur",
    highlight: "Stadtvilla.",
    items: [
      {
        id: "unterschied",
        question:
          "Was unterscheidet eine Stadtvilla von einem klassischen Einfamilienhaus?",
        answer:
          "Eine Stadtvilla hat zwei Vollgeschosse und meist ein flach geneigtes Walm- oder Zeltdach. So entsteht im Obergeschoss viel nutzbare Fläche ohne ausgeprägte Dachschrägen.",
      },
      {
        id: "garage",
        question: "Kann ich meine Stadtvilla mit Garage planen?",
        answer:
          "Ja. Bei der Stadtvilla 22-166 ist eine Doppelgarage mit direktem Zugang zum Hauswirtschaftsraum integriert; bei anderen Entwürfen lässt sie sich optional ergänzen.",
      },
      {
        id: "bebauungsplan",
        question: "Darf ich auf meinem Grundstück eine Stadtvilla bauen?",
        answer:
          "Ob zwei Vollgeschosse zulässig sind, regelt der Bebauungsplan Ihres Grundstücks. Das klären wir gemeinsam mit Ihnen, bevor die Planung startet.",
      },
      {
        id: "kosten",
        question: "Was kostet eine Stadtvilla aus Holz?",
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
      "Stadtvilla als Fertighaus in Holzbauweise – zwei Vollgeschosse, individuell geplant",
    sections: [
      {
        heading: "Warum eine Stadtvilla?",
        body: "Die Stadtvilla verbindet den Wunsch nach viel Wohnraum mit einer klaren, repräsentativen Architektur. Typisch sind zwei Vollgeschosse, ein flach geneigtes Walmdach und eine meist quadratische oder rechteckige Grundform. Im Obergeschoss entstehen dadurch Räume ohne ausgeprägte Dachschrägen – gut nutzbar für Schlafzimmer, Kinderzimmer, ein großes Familienbad und einen Elternbereich mit Ankleide. Unsere Stadtvillen-Entwürfe bieten rund 155 bis 165 m² Wohnfläche und lassen sich um Arbeitszimmer, Gästezimmer, Speisekammer oder eine Doppelgarage mit direktem Zugang zum Hauswirtschaftsraum ergänzen. Fassadengestaltung und farblich abgesetzte Elemente geben jeder Stadtvilla ihren eigenen Charakter.",
      },
      {
        heading:
          "Arbeitszimmer, Ankleide und Garage – so planen Sie Ihre Stadtvilla",
        body: "Bei der Stadtvilla 22-157 zieht sich ein lichtdurchfluteter Wohn- und Essbereich entlang der gesamten Gartenseite, ergänzt durch ein Arbeitszimmer im Erdgeschoss. Im Obergeschoss liegen zwei gleich große Kinderzimmer, ein Familienbad und ein Elternbereich mit eigenem Ankleideraum auf rund 24 m². Farblich abgesetzte Fassadenelemente geben diesem Entwurf einen modernen Auftritt. Die Stadtvilla 22-166 integriert eine Doppelgarage mit direktem Zugang zum Hauswirtschaftsraum und bietet zwei zusätzliche Räume für Homeoffice oder Gäste.",
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
    lede: "Name, E-Mail und Ort genügen – Sie erhalten den Katalog mit allen Stadtvillen-Entwürfen als PDF per E-Mail.",
  },

  midPageCta: {
    eyebrow: "Kostenlos und unverbindlich",
    heading: "Holen Sie sich jetzt den",
    highlight: "Hauskatalog.",
    lede: "Alle Stadtvillen-Entwürfe mit Grundrissen und Hausdaten – dazu unsere weiteren Haustypen, als PDF per E-Mail.",
    tone: "brand",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
  },
};
