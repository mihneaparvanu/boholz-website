import type { SectionContent } from "@/layouts/section.types";

/**
 * Per-section content for the homepage. `eyebrow` is the small-caps label
 * rendered above the heading; `id` is the in-page anchor target consumed by
 * the SectionNavigator.
 *
 * SectionContent is the kit's `<Section>` shape; the extra fields are
 * homepage-only metadata that the page composer reads directly.
 */
export type HomeSection = SectionContent & {
  id: string;
  eyebrow: string;
  /** Rail label — short enough to fit a pill. */
  navLabel: string;
};

export const homeSections = {
  categories: {
    id: "katalog",
    eyebrow: "Katalog",
    navLabel: "Katalog",
    heading1: "Fertighäuser in Zimmermannsqualität",
    heading2: "für Menschen mit",
    highlight: "Anspruch.",
    subheading:
      "Unsere barrierefreien Fertighäuser aus Holz vereinen höchste Energieeffizienz mit meisterhaftem Handwerk. So sparen Sie Energiekosten und gewinnen wertvolle Lebensqualität für die ganze Familie.",
  },
  trust: {
    id: "vertrauen",
    eyebrow: "Vertrauen",
    navLabel: "Vertrauen",
    heading1: "Ihr Vertrauen",
    highlight: "fest verankert.",
    subheading:
      "Wir bauen nicht nur Häuser, wir bauen Sicherheit. Mit zertifizierter Qualität aus Deutschland und Garantien, auf die Sie sich verlassen können.",
  },
  overview: {
    id: "auszeichnung",
    eyebrow: "Auszeichnung",
    navLabel: "Auszeichnung",
    heading1: "Besser gebaut.",
    heading2: "Schneller geliefert.",
    highlight: "Sorgenfrei gelebt.",
    subheading:
      "BoHolz vereint meisterhafte Präzision mit höchster Energieeffizienz. Für Sie bedeutet das: schneller Einzug, erstklassige Lebensqualität und dauerhaft niedrige Energiekosten.",
  },
  finishes: {
    id: "ausbaustufen",
    eyebrow: "Ausbaustufen",
    navLabel: "Ausbaustufen",
    heading1: "Ihr Traumhaus.",
    highlight: "Ihr Weg.",
    subheading:
      "Ein Hausbau ist eine ganz persönliche Reise. Wir bieten Ihnen vier flexible Ausbaustufen – vom Ausbauhaus bis zur schlüsselfertigen Übergabe. So behalten Sie die volle Kontrolle über Ihr Projekt, Ihren Zeitplan und Ihr Budget.",
  },
  qa: {
    id: "fragen",
    eyebrow: "Fragen",
    navLabel: "Fragen",
    heading1: "Klarheit schafft",
    highlight: "Vertrauen.",
    subheading:
      "Mit BoHolz haben Sie bereits die Antwort auf die Frage nach Ihrem Traumhaus gefunden. Für alle weiteren Details – von der Bauweise bis zur Finanzierung – haben wir hier das Wichtigste übersichtlich für Sie zusammengefasst.",
  },
  contact: {
    id: "kontakt",
    eyebrow: "Kontakt",
    navLabel: "Kontakt",
    heading1: "Sprechen Sie",
    heading2: "mit uns",
    highlight: "persönlich.",
    subheading:
      "Buchen Sie eine Vor-Ort-Beratung — wir nehmen uns Zeit für Ihr Projekt.",
  },
} as const satisfies Record<string, HomeSection>;
