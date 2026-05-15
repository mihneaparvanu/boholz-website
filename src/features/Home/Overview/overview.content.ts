import type { OverviewCardData } from "./overview.types";

const LOREM =
  "Unsere Wände bestehen aus massivem Kreuzlagenholz – ohne Folien, ohne Styropor. Diese diffusionsoffene Bauweise reguliert die Luftfeuchtigkeit natürlich und bietet gleichzeitig hervorragenden Schallschutz. Ein Haus, gebaut für Generationen.";

export const overviewCards: OverviewCardData[] = [
  { heading: "Höchste Bauqualität", subheading: LOREM, featured: true },
  { heading: "Echtes Holz", subheading: LOREM },
  { heading: "Energieeffizienz", subheading: LOREM },
  { heading: "Individuelle Planung", subheading: LOREM },
  { heading: "Smart Living", subheading: LOREM },
];
