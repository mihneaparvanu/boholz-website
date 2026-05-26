import type { Section } from "@/features/section-navigator/SectionNavigator.vue";

export const sections: Section[] = [
  { id: "karte", eyebrow: "01", label: "Karte" },
  { id: "musterhaeuser", eyebrow: "02", label: "Musterhäuser" },
  { id: "bueros-bw", eyebrow: "03", label: "Büros Baden-Württemberg" },
  { id: "bueros-by", eyebrow: "04", label: "Büros Bayern" },
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

export type Buero = {
  name: string;
  address: string;
};

// Source-of-truth data preserved verbatim from the previous page.
// No phone/email is published per office at this level — only the central HQ
// (Bad Kissingen) has those, and the canonical place for them is kontakt.astro.
// We provide a Google-Maps "Standort öffnen" link per office; the LocationsMap
// already exposes the full marker-card detail.
export const buerosBW: Buero[] = [
  {
    name: "Vertriebsbüro Wenkheim",
    address: "Lindenstraße 6, 97956 Wenkheim",
  },
  {
    name: "Vertriebsbüro Horb-Nordstetten",
    address: "Axel-Lipp-Straße 20, 72160 Horb-Nordstetten",
  },
  {
    name: "Vertriebsbüro Schwäbisch Gmünd",
    address: "Liegnitzerweg 4, 73527 Schwäbisch Gmünd",
  },
  {
    name: "Vertriebsbüro Villingen-Schwenningen",
    address: "Zwergsteigstraße 4, 78048 Villingen-Schwenningen",
  },
  {
    name: "Vertriebsbüro Rielasingen-Worblingen",
    address: "Konrad-Zuse-Str. 4, 78239 Rielasingen-Worblingen",
  },
  {
    name: "Vertriebsbüro Schwarzwald",
    address: "Martinstraße 42, 79848 Bonndorf im Schwarzwald",
  },
];

export const buerosBY: Buero[] = [
  {
    name: "Vertriebsbüro Hammelburg",
    address: "Zum Bauholz 3, 97762 Hammelburg",
  },
  {
    name: "Zentrale Bad Kissingen",
    address: "Ostring 1, 97688 Bad Kissingen",
  },
  {
    name: "Vertriebsbüro München",
    address: "Tangastraße 31, 81827 München",
  },
  {
    name: "Vertriebsbüro Werneck",
    address: "Bühler Ring, Vasbühl, 97440 Werneck",
  },
];
