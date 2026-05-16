import type { IconName } from "@/utils/icons";
import type { OverviewCardData } from "./overview.types";

/**
 * The featured card leads the section — Boholz's strongest single claim.
 * Kept as an `<OverviewCard>` so it carries visual weight against the
 * four denser IconList rows below.
 */
export const featuredCard: OverviewCardData = {
  heading: "Höchste Bauqualität",
  subheading:
    "Massive Kreuzlagenholz-Wände, präzise im Werk vorgefertigt — jedes Detail vom Meister geprüft, jedes Haus gebaut für Generationen.",
  featured: true,
};

export interface OverviewPillar {
  icon: IconName;
  label: string;
  description: string;
}

/**
 * The four supporting differentiators — each one line, 8–15 words.
 * Rendered as `<IconList>` rows below the featured card.
 */
export const overviewPillars: OverviewPillar[] = [
  {
    icon: "tree-deciduous",
    label: "Echtes Holz",
    description:
      "Diffusionsoffener Holzbau aus PEFC-zertifizierten deutschen Wäldern — atmungsaktiv, langlebig, klimapositiv.",
  },
  {
    icon: "zap",
    label: "Energieeffizienz",
    description:
      "Mindestens KfW-40-Standard serienmäßig — niedrige Energiekosten ab dem ersten Tag, förderfähig zum Bauantrag.",
  },
  {
    icon: "compass",
    label: "Individuelle Planung",
    description:
      "Vom Grundriss bis zur Materialwahl in Ihrem Tempo geplant — gemeinsam mit unseren Architekten, nicht gegen sie.",
  },
  {
    icon: "wifi",
    label: "Smart Living",
    description:
      "Vernetzte Haustechnik vorbereitet — Heizung, Licht und Sicherheit von einer Hand, ohne Nachrüst-Kabelsalat.",
  },
];

/**
 * @deprecated kept for type compatibility while no callers consume it.
 * Removed in a future cleanup once nothing imports `overviewCards`.
 */
export const overviewCards: OverviewCardData[] = [featuredCard];
