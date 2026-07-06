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
      "Besuchen Sie unser Ausstellungshaus in der Musterhausausstellung Eigenheim und Garten in Bad Vilbel.",
    state: "Hessen",
  },
  {
    slug: "fellbach",
    name: "Musterhaus Fellbach",
    address:
      "Besuchen Sie unser Ausstellungshaus in der Musterhausausstellung Traumhaus in Fellbach.",
    state: "Baden-Württemberg",
  },
];

