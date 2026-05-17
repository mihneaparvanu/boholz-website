import type { SectionContent } from "@/layouts/section.types";

export const homeSections = {
  categories: {
    heading: "Fertighäuser in Zimmermannsqualität für Menschen mit",
    highlightWord: "Anspruch.",
    subheading:
      "Unsere barrierefreien Fertighäuser aus Holz vereinen höchste Energieeffizienz mit meisterhaftem Handwerk. So sparen Sie Energiekosten und gewinnen wertvolle Lebensqualität für die ganze Familie.",
  },
  trust: {
    heading: "Ihr Vertrauen",
    highlightWord: "fest verankert.",
    subheading:
      "Wir bauen nicht nur Häuser, wir bauen Sicherheit. Mit zertifizierter Qualität aus Deutschland und Garantien, auf die Sie sich verlassen können.",
  },
  overview: {
    heading: "Besser gebaut. Schneller geliefert.",
    highlightWord: "Sorgenfrei gelebt.",
    subheading:
      "BoHolz vereint meisterhafte Präzision mit höchster Energieeffizienz. Für Sie bedeutet das: schneller Einzug, erstklassige Lebensqualität und dauerhaft niedrige Energiekosten.",
  },
  finishes: {
    heading: "Ihr Traumhaus.",
    highlightWord: "Ihr Weg.",
    subheading:
      "Ein Hausbau ist eine ganz persönliche Reise. Wir bieten Ihnen vier flexible Ausbaustufen – vom Ausbauhaus bis zur schlüsselfertigen Übergabe. So behalten Sie die volle Kontrolle über Ihr Projekt, Ihren Zeitplan und Ihr Budget.",
  },
} as const satisfies Record<string, SectionContent>;
