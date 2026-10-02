/**
 * Landing content — Generationenhaus (/haeuser/generationenhaus).
 *
 * Copy source: Marketing (Mario Beckstein), "Landingpage-Texte: Generationen-
 * haus", Stand 29.09.2026. EmpCo/UWG-clean (no environmental/superlative
 * claims, no unbacked prices). DRAFT — pending BoHolz (Christoph Schmidt) +
 * legal sign-off; the routes are noindex.
 */
import type { LandingPageContent } from "./landing.types";

export const generationenhausContent: LandingPageContent = {
  seo: {
    title: "Mehrgenerationenhaus aus Holz bauen | BoHolz-Haus",
    description:
      "Generationenhaus in Holzbauweise: Einliegerwohnung oder zwei Wohneinheiten, individuell geplant – nah beieinander, jeder mit eigener Tür. Jetzt beraten lassen.",
    focusKeyword: "Mehrgenerationenhaus bauen",
  },

  hero: {
    eyebrow: "Mehrgenerationenhaus aus Holz",
    heading: "Gemeinsam wohnen.",
    highlight: "Eigenständig leben.",
    lede: "Die Enkel sind in wenigen Schritten bei Oma und Opa – und abends schließt jeder seine eigene Tür. Wir planen Ihr Generationenhaus in Holzbauweise so, wie Ihre Familie zusammenleben möchte.",
    imageAlt: "Generationenhaus aus Holz von BoHolz-Haus",
    imageFallbackPath: "/images/brand/hero.webp",
    preferredCategorySlug: "generationenhaus",
    primaryCta: { label: "Hauskatalog kostenlos anfordern", href: "#anfordern" },
    secondaryCta: { label: "Persönliches Angebot anfragen", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Ihre Vorteile",
    heading: "Ihr Generationenhaus",
    highlight: "auf einen Blick.",
    lede: "Vier Punkte, die das Zusammenleben mehrerer Generationen erleichtern.",
  },
  benefits: [
    {
      icon: "key-round",
      title: "Getrennte Wohnbereiche",
      body: "Einliegerwohnung oder zweite Wohneinheit mit eigenen Räumen – für Nähe ohne Enge.",
      tone: "leaf",
    },
    {
      icon: "home",
      title: "Ohne Treppen im Alltag",
      body: "Die Einliegerwohnung lässt sich im Erdgeschoss planen – auf Wunsch mit barrierefreien Details.",
      tone: "forest",
    },
    {
      icon: "wrench",
      title: "Flexibel nutzbar",
      body: "Heute für die Eltern, später als Büro oder zur Vermietung – die Wohneinheit passt sich Ihren Plänen an.",
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
    heading: "Häuser mit",
    highlight: "Einliegerwohnung.",
    lede: "Einfamilienhäuser, Bungalows und Zweifamilienhäuser, die für das Wohnen mehrerer Generationen planbar sind.",
    categorySlugs: ["generationenhaus", "zweifamilienhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Eindrücke",
    heading: "Generationenhäuser von BoHolz",
    highlight: "in Bildern.",
    lede: "Ansichten und Visualisierungen unserer Entwürfe. Abbildungen können Sonderausstattungen enthalten.",
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-04.webp",
    imageAlt: "Generationenhaus von BoHolz-Haus",
    allowPlaceholder: true,
  },

  featureBody: {
    eyebrow: "Mehrere Generationen, ein Haus",
    heading: "Nähe, wenn Sie sie wollen.",
    highlight: "Freiraum, wenn Sie ihn brauchen.",
    lede: "Ein Haus, das zwei Haushalte verbindet, ohne sie zu vermischen.",
    paragraphs: [
      "Ob Einliegerwohnung im Erdgeschoss oder zwei Wohneinheiten auf eigenen Etagen: Wir planen Grundrisse, in denen jede Generation ihren eigenen Bereich hat – mit eigenem Bad, eigener Küche und auf Wunsch eigenem Eingang.",
      "Und wenn sich das Leben ändert, wird die Einliegerwohnung zum Büro, zur Wohnung für erwachsene Kinder oder zur vermieteten Einheit.",
    ],
    imageFallbackPath: "/images/landing/uebersicht/lifestyle-06.webp",
    imageAlt: "Individuell geplantes Generationenhaus von BoHolz-Haus",
    reverse: false,
  },

  audience: {
    eyebrow: "Für wen geeignet",
    heading: "Das Generationenhaus",
    highlight: "für Ihre Familie.",
    lede: "Viele Familien möchten näher zusammenrücken – jede auf ihre Weise.",
    items: [
      {
        icon: "users",
        label: "Großeltern und Enkel",
        description:
          "Kurze Wege für gemeinsame Nachmittage und Hilfe im Alltag – und trotzdem ein eigener Haushalt.",
      },
      {
        icon: "key-round",
        label: "Erwachsene Kinder",
        description:
          "Die erste eigene Wohnung – unter dem Dach der Familie und doch mit eigener Tür.",
      },
      {
        icon: "heart-handshake",
        label: "Füreinander da",
        description:
          "Wenn die Eltern Unterstützung brauchen, sind Sie in wenigen Schritten bei ihnen.",
      },
      {
        icon: "coins",
        label: "Vermieter auf Zeit",
        description:
          "Solange die Familie die Einliegerwohnung nicht nutzt, kann sie vermietet werden.",
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
    highlight: "Generationenhaus.",
    items: [
      {
        id: "was-ist-ein-generationenhaus",
        question: "Was ist ein Generationenhaus?",
        answer:
          "Ein Haus, in dem mehrere Generationen in getrennten Wohneinheiten unter einem Dach leben – etwa mit Einliegerwohnung oder als Zweifamilienhaus.",
      },
      {
        id: "einliegerwohnung-oder-zweifamilienhaus",
        question:
          "Einliegerwohnung oder Zweifamilienhaus – was passt besser?",
        answer:
          "Eine Einliegerwohnung ist eine kleinere, untergeordnete Wohnung im Haus. Beim Zweifamilienhaus sind beide Wohnungen meist ähnlich groß. Welche Variante baurechtlich und finanziell zu Ihnen passt, klären wir in der Planung.",
      },
      {
        id: "welche-entwuerfe-eignen-sich",
        question: "Welche Entwürfe eignen sich?",
        answer:
          "Mit Einliegerwohnung planbar sind unter anderem die Einfamilienhäuser 35-181-150, 22-173-190 und 28-194-170 sowie der Bungalow 22-134. Grundsätzlich passen wir jeden Entwurf an Ihre Wohnsituation an.",
      },
      {
        id: "kfw-foerderung",
        question:
          "Wie wird die KfW-Förderung bei zwei Wohneinheiten berechnet?",
        answer:
          "KfW-Förderkredite werden in der Regel je Wohneinheit gewährt. Welche Programme und Beträge für Ihr Vorhaben infrage kommen, hängt von den jeweils gültigen Förderbedingungen ab – dazu beraten wir Sie gemeinsam mit Ihrer Bank.",
      },
      {
        id: "kosten",
        question: "Was kostet ein Generationenhaus aus Holz?",
        answer:
          "Der Preis hängt von Größe, Grundriss, Ausbaustufe und Ausstattung ab. Preisbeispiele finden Sie bei unseren Bestseller-Häusern; Ihr individuelles Angebot erstellen wir auf Grundlage Ihrer Planung.",
      },
    ],
  },

  seoText: {
    heading:
      "Mehrgenerationenhaus bauen – gemeinsam wohnen mit BoHolz-Haus",
    sections: [
      {
        heading: "Mehrere Generationen unter einem Dach",
        body: "Immer mehr Familien möchten wieder näher zusammenrücken: Großeltern, die bei der Kinderbetreuung helfen, erwachsene Kinder mit eigener Wohnung oder Eltern, die im Alter in der Nähe ihrer Familie leben möchten. Ein Generationenhaus macht das möglich, ohne dass jemand auf seinen eigenen Haushalt verzichten muss. Bei BoHolz-Haus planen wir dafür Häuser mit Einliegerwohnung oder mit zwei Wohneinheiten auf getrennten Etagen – mit eigener Küche, eigenem Bad und auf Wunsch eigenem Eingang. Geeignet sind etwa unsere Einfamilienhäuser 35-181-150, 22-173-190 und 28-194-170, der Bungalow 22-134 oder das Pultdachhaus 21-349-225 für Hanggrundstücke.",
      },
      {
        heading: "Heute Familie, morgen Büro oder Mietwohnung",
        body: "Ein Generationenhaus sollte mit den Lebensphasen mitgehen. Deshalb planen wir die Einliegerwohnung so, dass sie sich später anders nutzen lässt – als Büro, als Wohnung für erwachsene Kinder oder als vermietete Einheit. Liegt die Einliegerwohnung im Erdgeschoss, bleibt der Alltag der älteren Generation ohne Treppen. Auf Wunsch planen wir dort weitere barrierefreie Details wie breitere Türen oder mehr Bewegungsfläche im Bad. Welche Lösung baurechtlich und finanziell zu Ihnen passt, klären wir gemeinsam in der Planungsphase.",
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
