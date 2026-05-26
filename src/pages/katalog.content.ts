import { Compass, Euro, ImageIcon, Layers3, Ruler, type LucideIcon } from 'lucide-vue-next';

export type CatalogBenefit = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const benefits: CatalogBenefit[] = [
  {
    icon: Layers3,
    title: "Komplette Hausübersicht",
    body: "Alle Modelle — Bungalow, Einfamilienhaus, Doppelhaus, Stadtvilla und Mehrfamilienhaus — auf einen Blick.",
  },
  {
    icon: Ruler,
    title: "Grundrisse & Ausstattung",
    body: "Maßstabsgetreue Grundrisse, Wandaufbauten und unsere Standard­ausstattung im Detail.",
  },
  {
    icon: Euro,
    title: "Preisindikationen",
    body: "Orientierungspreise pro Modell — transparent, ohne versteckte Posten, mit KfW-Förderhinweisen.",
  },
  {
    icon: ImageIcon,
    title: "Beispielprojekte",
    body: "Realisierte BoHolz-Häuser in Bild und Zahlen — von der Bodenplatte bis zur Schlüsselübergabe.",
  },
  {
    icon: Compass,
    title: "Nächste Schritte zur Beratung",
    body: "Ein klarer Fahrplan vom Hauskatalog über die Bedarfsanalyse bis zum persönlichen Angebot.",
  },
];
