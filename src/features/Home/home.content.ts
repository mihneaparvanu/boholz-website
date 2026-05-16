import type { SectionContent } from "@/layouts/section.types";

export const homeSections = {
  categories: {
    heading1: "Fertighäuser in Zimmermannsqualität",
    heading2: "für Menschen mit",
    highlight: "Anspruch.",
    subheading:
      "Unsere barrierefreien Fertighäuser aus Holz vereinen höchste Energieeffizienz mit meisterhaftem Handwerk. So sparen Sie Energiekosten und gewinnen wertvolle Lebensqualität für die ganze Familie.",
  },
  trust: {
    heading1: "Ihr Vertrauen",
    highlight: "fest verankert.",
    subheading:
      "Wir bauen nicht nur Häuser, wir bauen Sicherheit. Mit zertifizierter Qualität aus Deutschland und Garantien, auf die Sie sich verlassen können.",
  },
  overview: {
    heading1: "Besser gebaut.",
    heading2: "Schneller geliefert.",
    highlight: "Sorgenfrei gelebt.",
    subheading:
      "BoHolz vereint meisterhafte Präzision mit höchster Energieeffizienz. Für Sie bedeutet das: schneller Einzug, erstklassige Lebensqualität und dauerhaft niedrige Energiekosten.",
  },
  finishes: {
    heading1: "Ihr Traumhaus.",
    highlight: "Ihr Weg.",
    subheading:
      "Ein Hausbau ist eine ganz persönliche Reise. Wir bieten Ihnen vier flexible Ausbaustufen – vom Ausbauhaus bis zur schlüsselfertigen Übergabe. So behalten Sie die volle Kontrolle über Ihr Projekt, Ihren Zeitplan und Ihr Budget.",
  },
  qa: {
    heading1: "Klarheit schafft",
    highlight: "Vertrauen.",
    subheading:
      "Mit BoHolz haben Sie bereits die Antwort auf die Frage nach Ihrem Traumhaus gefunden. Für alle weiteren Details – von der Bauweise bis zur Finanzierung – haben wir hier das Wichtigste übersichtlich für Sie zusammengefasst.",
  },
} as const satisfies Record<string, SectionContent>;
