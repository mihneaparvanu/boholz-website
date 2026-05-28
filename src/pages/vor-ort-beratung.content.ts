import type { Section } from "@/features/section-navigator/SectionNavigator.vue";

export const sections: Section[] = [
  { id: "karte", eyebrow: "01", label: "Karte" },
  { id: "musterhaeuser", eyebrow: "02", label: "Musterhäuser" },
  { id: "bueros", eyebrow: "03", label: "Vertriebsbüros" },
];

export type Showhouse = {
  slug: string;
  name: string;
  address: string;
  state: string;
};

export const musterhaeuser: Showhouse[] = [
  {
    slug: "bad-vilbel",
    name: "Musterhaus Bad Vilbel",
    address:
      "Besuchen Sie unser Ausstellungshaus in der Fertighauswelt Bad Vilbel.",
    state: "Hessen",
  },
  {
    slug: "fellbach",
    name: "Musterhaus Fellbach",
    address: "Höhenstraße – Platz 36, 70736 Fellbach.",
    state: "Baden-Württemberg",
  },
];

