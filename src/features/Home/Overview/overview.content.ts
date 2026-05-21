import type { IconName } from "@/utils/icons";
import type { OverviewCardData } from "./overview.types";
import { getMediaURL } from "@/utils/media";

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
  image: {
    url: getMediaURL("/images/stock/lifestyle/craftsmanship-factory.webp"),
    alt: "BoHolz Fachkraft bei der Vorfertigung eines Holzelements im Werk",
    width: 2560,
    height: 1664,
  },
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
export const overviewCardsSecondary: OverviewCardData[] = [
  {
    heading: "Echtes Holz",
    subheading:
      "Diffusionsoffener Holzbau aus PEFC-zertifizierten deutschen Wäldern — atmungsaktiv, langlebig, klimapositiv.",
    image: {
      url: getMediaURL("/images/photography/timber-grain.webp"),
      alt: "Detailaufnahme massiver Holzmaserung",
      width: 2560,
      height: 893,
    },
  },
  {
    heading: "Energieeffizienz",
    subheading:
      "Mindestens KfW-40-Standard serienmäßig — niedrige Energiekosten ab dem ersten Tag, förderfähig zum Bauantrag.",
    image: {
      url: getMediaURL("/images/stock/lifestyle/energy-efficiency-heatpump.webp"),
      alt: "Moderne Luft-Wärmepumpe an der Fassade eines BoHolz Hauses",
      width: 2688,
      height: 1536,
    },
  },
  {
    heading: "Individuelle Planung",
    subheading:
      "Vom Grundriss bis zur Materialwahl in Ihrem Tempo geplant — gemeinsam mit unseren Architekten, nicht gegen sie.",
    image: {
      url: getMediaURL("/images/stock/lifestyle/house-planning-office.webp"),
      alt: "Architektin bespricht einen Hausgrundriss am Planungstisch",
      width: 4608,
      height: 3584,
    },
  },
  {
    heading: "Smart Living",
    subheading:
      "Vernetzte Haustechnik vorbereitet — Heizung, Licht und Sicherheit von einer Hand, ohne Nachrüst-Kabelsalat.",
    image: {
      url: getMediaURL("/images/stock/lifestyle/smart-living.webp"),
      alt: "Smart-Home-Steuerung in einem modernen Wohnraum",
      width: 2048,
      height: 1374,
    },
  },
];

/**
 * @deprecated kept for type compatibility while no callers consume it.
 * Removed in a future cleanup once nothing imports `overviewCards`.
 */
export const overviewCards: OverviewCardData[] = [featuredCard];
