import { getMediaURL } from "@/core/media/media";

import type { BuildPhase } from "@/features/build-phases/build-phases.types";
import type { BuildingStage } from "@/features/home/BuildingStages/building-stages.types";
import type { Section } from "@/features/section-navigator/SectionNavigator.vue";

export const sections: Section[] = [
  { id: "ablauf", eyebrow: "01", label: "Der Ablauf" },
  { id: "architektur", eyebrow: "02", label: "Architektur" },
  { id: "finanzierung", eyebrow: "03", label: "Finanzierung" },
  { id: "ausbaustufen", eyebrow: "04", label: "Ausbaustufen" },
  { id: "nachhaltigkeit", eyebrow: "05", label: "Werkstoff Holz" },
];

const phasesBase = "/images/content/bauphasen";

export const buildPhases: BuildPhase[] = [
  {
    slug: "grundstein",
    title: "Der Grundstein wird gelegt",
    description:
      "Planung, Grundstück, Finanzierung — wir legen die Basis für Ihr Projekt.",
    teaser: "Planung, Grundstück, Finanzierung — die Basis für Ihr Projekt.",
    icon: "compass",
    imageURL: getMediaURL(`${phasesBase}/phase-01-grundstein.webp`),
  },
  {
    slug: "traeume",
    title: "Träume in Realität verwandeln",
    description:
      "Architektur, Bauantrag und Bemusterung — Ihr Haus nimmt Form an.",
    teaser: "Architektur, Bauantrag, Bemusterung — Ihr Haus nimmt Form an.",
    icon: "pencil",
    imageURL: getMediaURL(`images/stock/lifestyle/craftsmanship-factory.webp`),
  },
  {
    slug: "bauphase",
    title: "Die heiße Bauphase beginnt",
    description:
      "Vom Keller bis zur Schlüsselübergabe — Vorfertigung, Montage, Innenausbau.",
    teaser: "Vorfertigung, Montage, Innenausbau — bis zur Schlüsselübergabe.",
    icon: "hammer",
    imageURL: getMediaURL(`${phasesBase}/phase-03-bauphase.webp`),
  },
];

export const buildPhasesHeroImageURL = getMediaURL(`${phasesBase}/hero.webp`);

export type ArchBeat = {
  eyebrow: string;
  heading: string;
  body: string;
  imageURL: string;
  imageAlt: string;
};

export const architekturBeats: ArchBeat[] = [
  {
    eyebrow: "Grundriss",
    heading: "Frei gestalten — bis zur letzten Wand.",
    body: "Offener Wohnbereich, separates Homeoffice, Einliegerwohnung oder großzügige Terrasse — Ihr Grundriss folgt Ihrem Leben, nicht einem Katalog. Wir planen die Räume so, wie Sie sie täglich nutzen werden.",
    imageURL: getMediaURL(
      "/images/models/einfamilienhaus/32-150-170/gallery/einfamilienhaus-32-150-170-gallery-ehf-02.webp",
    ),
    imageAlt:
      "BoHolz Family 150 mit Holzfassade — Einfamilienhaus mit frei geplantem Grundriss",
  },
  {
    eyebrow: "Fassade",
    heading: "Außen, wie Sie es sich vorstellen.",
    body: "Klassisch verputzt, mit Holzakzenten oder vollflächig in Holz — die Fassade definiert den ersten Eindruck. Aus einer abgestimmten Palette wählen Sie Materialien, Farben und Proportionen, die zum Ort passen.",
    imageURL: getMediaURL(
      "/images/models/stadtvilla/22-140-000/gallery/stadtvilla-22-140-000-gallery-sv-02.webp",
    ),
    imageAlt:
      "BoHolz Weitblick 140 mit Holzverschalung — wählbare Materialität für die Außenwirkung",
  },
  {
    eyebrow: "Innen & außen",
    heading: "Aus einer Hand, ohne Übergabeverluste.",
    body: "Wer plant, baut. Vom ersten Skizzenstrich bis zur fertigen Innenraumgestaltung bleibt das Projekt in einer Hand — keine Schnittstellen zwischen Architekt, Generalunternehmer und Innenausbau, keine Reibungsverluste in Detail und Termin.",
    imageURL: getMediaURL(
      "/images/models/mehrfamilienhaus/satteldorf/satteldorf-12-familienhaus.webp",
    ),
    imageAlt:
      "BoHolz Mehrfamilienhaus — 12-Familienwohnhaus",
  },
];

const stagesBase = getMediaURL("/images/stages");

export const buildingStages: BuildingStage[] = [
  {
    slug: "ausbauhaus",
    title: "Ausbauhaus",
    description:
      "Sie möchten selbst Hand anlegen? Wir liefern den Rohbau wetterfest und winddicht – Sie übernehmen den Innenausbau in Ihrem Tempo und sparen dabei spürbar Kosten.",
    imageURL: `${stagesBase}/shell.webp`,
  },
  {
    slug: "technikfertig",
    title: "Technikfertig",
    description:
      "Wir installieren die komplette Haustechnik – Heizung, Elektrik und Rohinstallation für Sanitär. Sie gestalten Wände, Böden und Oberflächen ganz nach Ihrem persönlichen Geschmack.",
    imageURL: `${stagesBase}/mechanically-complete.webp`,
  },
  {
    slug: "fast-fertig",
    title: "Fast fertig",
    description:
      "Nahezu bezugsfertig – nur die letzten Feinheiten wie Bodenbeläge und Wandgestaltung bleiben Ihnen überlassen. Eine ausgewogene Balance aus Eigenleistung und Komfort.",
    imageURL: `${stagesBase}/nearly-complete.webp`,
  },
  {
    slug: "schluesselfertig",
    title: "Schlüsselfertig",
    description:
      "Vom ersten Entwurf bis zum Einzug – wir übernehmen alles. Sie wählen die Einweihungsparty, wir bauen den Rest. Ihr BoHolz Haus wird schlüsselfertig und komplett bezugsfertig übergeben.",
    imageURL: `${stagesBase}/turnkey.webp`,
  },
];

export const sustainabilityImageA = getMediaURL(
  "/images/content/advantage/nachhaltigkeit/hero.webp",
);
export const sustainabilityImageB = getMediaURL(
  "/images/photography/log-stack.webp",
);

export const ctaImage = getMediaURL("/images/brand/home-hero.webp");
