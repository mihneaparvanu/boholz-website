import { getMediaURL } from "@/lib/media";

import type { IconListItem } from "@/ui/primitives/IconList.vue";
import type {
  EditorialProse,
  FeatureCard,
  WallAssembly,
} from "./advantage.types";

/**
 * Shared advantage copy — the construction-quality beats that /bauen-mit-boholz
 * and every /haus/<slug> model page render from one source.
 *
 * It lived inline in `pages/bauen-mit-boholz.astro` while that page was the
 * only consumer. The model pages are the second consumer, so per the
 * co-location rule it graduates here, next to the components that render it
 * (`WallAssembly.astro`, `FeatureCardPair.vue`, `IconList.vue`).
 *
 * The specifications are quoted from the Bau- und Leistungsbeschreibung
 * (BLB September 2026) and were moved here unchanged — the figures below are
 * the ones already approved and live on /bauen-mit-boholz. The wall layers
 * print "OSB₄" where the BLB prints "OSB4"; left as-is on purpose, since
 * changing it would silently re-word a published page.
 *
 *   U-Werte, Brandschutz, Schallschutz — BLB 09/2026, S. 15
 *   Layer lists 1–8                    — BLB 09/2026, S. 15
 */

// ── Section 06 — Wandaufbau (Holz-Aktiv-Wand / Holz-Aktiv-Wand plus).
//
// Cross-section diagrams from the Imagebroschüre (S. 16); the numbered
// layers beside each diagram are the BLB's own build-up, outside → inside.
// Both walls share the layer sequence — only the timber frame + insulation
// (200 → 240 mm) and the resulting U-Wert differ.
const wandaufbauStandardImg = getMediaURL(
  "/images/content/advantage/wandaufbau/wandaufbau-standard-diagram2-2026-10.webp",
);
const wandaufbauPlusImg = getMediaURL(
  "/images/content/advantage/wandaufbau/wandaufbau-plus-diagram2-2026-10.webp",
);

export const wallAssemblies: WallAssembly[] = [
  {
    name: "Holz-Aktiv-Wand",
    imageURL: wandaufbauStandardImg,
    imageAlt:
      "Holz-Aktiv-Wand — beschrifteter Wandaufbau-Querschnitt mit nummerierten Bauteilschichten 1–8",
    imageWidth: 1075,
    imageHeight: 905,
    layers: [
      "hochwertiger, diffusionsoffener Silikonharz-Edelputz, helle Tönung, durchgefärbt",
      "Grundputz aus Armierungsmasse und vollflächiges Gittergewebe",
      "60 mm Holzfaserdämmplatte",
      "200 mm Holzrahmenkonstruktion",
      "200 mm Knauf Insulation (WLG 035) zwischen den Rahmen",
      "12 mm OSB₄-Platte",
      "0,2 mm Luftdichtheitsebene (Papier oder Vlies)",
      "12,5 mm Gipskarton Feuerschutzplatte",
    ],
    specs: [
      { term: "U-Wert", value: "0,164 W/(m²K)" },
      { term: "Brandschutz", value: "F30-B" },
      { term: "Schallschutz", value: "Rw = 47 dB" },
    ],
  },
  {
    name: "Holz-Aktiv-Wand",
    nameSuffix: "plus",
    imageURL: wandaufbauPlusImg,
    imageAlt:
      "Holz-Aktiv-Wand plus — beschrifteter Wandaufbau-Querschnitt mit nummerierten Bauteilschichten 1–8",
    imageWidth: 1095,
    imageHeight: 905,
    layers: [
      "hochwertiger, diffusionsoffener Silikonharz-Edelputz, helle Tönung, durchgefärbt",
      "Grundputz aus Armierungsmasse und vollflächiges Gittergewebe",
      "60 mm Holzfaserdämmplatte",
      "240 mm Holzrahmenkonstruktion",
      "240 mm Knauf Insulation (WLG 035) zwischen den Rahmen",
      "12 mm OSB₄-Platte",
      "0,2 mm Luftdichtheitsebene (Papier oder Vlies)",
      "12,5 mm Gipskarton Feuerschutzplatte",
    ],
    specs: [
      { term: "U-Wert", value: "0,143 W/(m²K)" },
      { term: "Brandschutz", value: "F30-B" },
      { term: "Schallschutz", value: "Rw = 47 dB" },
    ],
    note: "auch KfW-G + KfW-QNG geeignet",
  },
];

export const wallAssemblyIntro: EditorialProse = {
  body: 'Unsere Außenwand „Holz-Aktiv-Wand" verbindet einen diffusionsoffenen Wandaufbau mit Holzfaserdämmung. Die Konstruktion trägt zum Wärmeschutz im Winter und zum sommerlichen Hitzeschutz bei.',
  emphasis:
    "Gleichzeitig ermöglicht der diffusionsoffene Aufbau die Wasserdampfdiffusion durch die einzelnen Bauteilschichten.",
};

export const wallAssemblyFollowup: {
  heading: string;
  prose: EditorialProse;
} = {
  heading: "Diffusionsoffen & feuchtigkeitsregulierend",
  prose: {
    body: "Der diffusionsoffene Aufbau unserer Außenwand ermöglicht die Wasserdampfdiffusion durch die aufeinander abgestimmten Bauteilschichten. Dadurch trägt die Konstruktion zu einem ausgeglichenen Feuchtehaushalt innerhalb der Wand bei.",
    emphasis:
      "In Verbindung mit der Holzfaserdämmung unterstützt der Wandaufbau sowohl den Wärmeschutz im Winter als auch den sommerlichen Hitzeschutz. So werden Feuchteschutz, Wärmeschutz und Wohnkomfort sinnvoll miteinander verbunden.",
  },
};

export const wallAssemblyBenefits: IconListItem[] = [
  { icon: "layers", label: "Diffusionsoffener Wandaufbau" },
  { icon: "thermometer", label: "Angenehmes Raumklima zu jeder Jahreszeit" },
  { icon: "leaf", label: "Klar definierte Wärmedämmeigenschaften" },
  { icon: "shield", label: "Schutz vor Feuchtigkeit und Schimmelbildung" },
];

// ── Section 05 — Holzfaserdämmung side-by-side (Sommer vs Winter).
export const holzfaserSommer: FeatureCard = {
  eyebrow: "Sommer",
  title: "Hitzeschutz bis in die Nacht",
  lede:
    "Die Holzfaserdämmplatte verzögert sommerliche Hitze um Stunden — Schlafräume bleiben kühl, wenn die Außentemperatur kippt.",
  bullets: [
    "11 Stunden Phasenverschiebung — das entspricht über 50 cm Mineraldämmung; die Hitze erreicht den Innenraum erst abends, wenn es draußen längst kühl ist",
    "92 % Temperaturpuffer (TAV 8 %) — bei 40 °C Außendifferenz kommen nur 3,2 °C im Innenraum an",
    "Hohe Wärmespeicherkapazität (2100 J/(kg·K)) — angenehme Dachgeschosstemperaturen ohne stromintensive Klimageräte",
  ],
  icon: "sun",
  imageURL: getMediaURL(
    "/images/content/advantage/holzfaserdaemmung/sommer.webp",
  ),
  imageAlt:
    "Sommerlicher Hitzeschutz dank Holzfaserdämmung — kühles Innenklima trotz hoher Außentemperaturen",
};

export const holzfaserWinter: FeatureCard = {
  eyebrow: "Winter",
  title: "Wärme bleibt, wo sie hingehört",
  lede:
    "Diffusionsoffen und dämmstark zugleich — die Holzfaser hält die Heizenergie im Haus und reguliert dabei die Raumfeuchte.",
  bullets: [
    "Lambda-Nennwert 0,036 W/(mK), Bemessungswert 0,038",
    "Diffusionsoffen — Feuchtigkeit kann nach außen, ohne dass Wärme entweicht",
    "GUTEX Thermoflex — von ÖKO-TEST mit „Sehr gut“ ausgezeichnet, baubiologisch hervorragend",
  ],
  icon: "thermometer",
  imageURL: getMediaURL(
    "/images/content/advantage/holzfaserdaemmung/winter.webp",
  ),
  imageAlt:
    "Winterlicher Wärmeerhalt — Holzfaserdämmung hält die Heizenergie im Haus",
};

export const hitzeschutzschild: { heading: string; prose: EditorialProse } = {
  heading: "So funktioniert das Hitzeschutzschild",
  prose: {
    body: "An heißen Sommertagen entstehen zwischen Dachziegeln und Dämmebene bis zu 80 °C. Die 24 cm starke Holzfaserdämmung zwischen den Sparren dämpft diese Spitzen so stark, dass sie den Innenraum erst rund 11 Stunden später erreichen — am Abend.",
    emphasis:
      "Bis dahin gibt die Dämmung die gespeicherte Wärme längst wieder an die kühle Nachtluft ab. Im Wohnraum kommt sie gar nicht erst an.",
  },
};

// Vorteile der flexiblen Holzfaserdämmung — übernommen von der alten
// boholz-haus.de Seite "Flexible Holzfaserdämmung".
export const woodFibreBenefits: IconListItem[] = [
  { icon: "thermometer", label: "Hervorragende Dämmleistung (λ 0,036 W/(mK))" },
  { icon: "sun", label: "Ausgezeichneter sommerlicher Hitzeschutz" },
  { icon: "home", label: "Winterlicher Kälteschutz durch hohe Wärmespeicherkapazität" },
  { icon: "shield", label: "Hoher Schallschutz" },
  { icon: "layers", label: "Feuchtigkeitsregulierend & dampfdiffusionsoffen" },
  { icon: "tree-deciduous", label: "Rohstoff Holz" },
  { icon: "leaf", label: "Angenehmes, ausgeglichenes Raumklima" },
  { icon: "award", label: "GUTEX Thermoflex — ÖKO-TEST „Sehr gut“" },
];

// ── Section 03 — 16 gute Gründe (serienmäßige Ausstattung).
export const sechzehnGruende: IconListItem[] = [
  {
    icon: "leaf",
    label:
      "Diffusionsoffene ausgedämmte Außenwände — optional mit Holzfaserdämmplatte für sommerlichen Hitzeschutz",
  },
  {
    icon: "layers",
    label: "Diffusionsoffener Wandaufbau — auf Wunsch für ein Effizienzhaus 40",
  },
  {
    icon: "shield",
    label: "Optional gedämmte Bodenplatte zur Einhaltung der KfW-Vorgaben",
  },
  {
    icon: "home",
    label:
      "Dachkonstruktion mit einer Schneelast von 2,5 kN/m² bereits im Standard enthalten",
  },
  {
    icon: "thermometer",
    label:
      "Dämmung der Dachflächen bis in den letzten Winkel Ihres Hauses spart wertvolle Energie",
  },
  {
    icon: "messages-square",
    label:
      "Schallreduzierung durch innovative PhoneStrip-Entkopplungsstreifen zwischen Erdgeschoss und Dachgeschoss",
  },
  {
    icon: "lock",
    label:
      "Sicherheitsgeprüfte massive Holzhaustüre (RCN2 Verriegelung) mit barrierefreiem Zugang",
  },
  {
    icon: "sun",
    label: "Gedämmte Rollläden und effektiver Sonnenschutz dank Alulamellen",
  },
  {
    icon: "shield",
    label: "Fenster mit Dreifachverglasung",
  },
  {
    icon: "ruler",
    label: "Granitfensterbänke mit hochwertiger zweiter Dichtungsebene",
  },
  {
    icon: "layers",
    label:
      "Innenwände zusätzlich beidseitig mit OSB 4 beplankt und voll ausgedämmt",
  },
  {
    icon: "tree-deciduous",
    label: "Massive Echtholztreppe",
  },
  {
    icon: "home",
    label:
      "Barrierefreie und bodengleich geflieste Dusche mit Edelstahlablaufrinne",
  },
  {
    icon: "zap",
    label: "Wärmepumpenkonzepte namhafter Hersteller",
  },
  {
    icon: "thermometer",
    label:
      "Individuelle Temperaturregelung dank intelligenter Wärmepumpenkonzepte",
  },
  {
    icon: "hammer",
    label:
      "Made in Germany — Fertighaus-Manufaktur mit hoher Qualität, großer Flexibilität und traditioneller Handwerksleistung",
  },
];

// ── Section 07 — Haus- & Energietechnik.
// Deliberately hedged copy ("Je nach Hausplanung", "kann", "hängt unter
// anderem von") — availability, not a promise. Do not tighten it.
export const energietechnik: IconListItem[] = [
  {
    icon: "zap",
    label: "Wärmepumpen",
    description:
      "Ab der technikfertigen Ausbaustufe stehen verschiedene Wärmepumpenlösungen zur Verfügung. Je nach Hausplanung kommen Systeme etablierter Hersteller wie Nibe oder Tecalor zum Einsatz. Auswahl und Dimensionierung werden auf das Gebäude und seinen Wärmebedarf abgestimmt.",
  },
  {
    icon: "sun",
    label: "Photovoltaik",
    description:
      "Wir beraten Sie bei der Planung einer passenden Photovoltaikanlage – auf Wunsch einschließlich Stromspeicher. Die Nutzung des selbst erzeugten Stroms kann den Strombezug aus dem öffentlichen Netz reduzieren. Der erreichbare Eigenversorgungsanteil hängt unter anderem von Anlagengröße, Ertrag und persönlichem Stromverbrauch ab.",
  },
  {
    icon: "leaf",
    label: "Angenehmes Raumklima",
    description:
      "Der diffusionsoffene Wandaufbau ermöglicht die Wasserdampfdiffusion durch die einzelnen Bauteilschichten und unterstützt den Feuchtehaushalt innerhalb der Wandkonstruktion. Gemeinsam mit der abgestimmten Gebäude- und Anlagentechnik trägt er zu einem angenehmen Raumklima bei.",
  },
];
