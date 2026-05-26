import { getMediaURL } from '@/lib/media';

import type { Section } from "@/features/section-navigator/SectionNavigator.vue";
import type { IconListItem } from "@/ui/primitives/IconList.vue";

export const sections: Section[] = [
  { id: "ablauf", eyebrow: "01", label: "Der Ablauf" },
  { id: "architektur", eyebrow: "02", label: "Architektur" },
  { id: "smart-home", eyebrow: "03", label: "Smart Home" },
  { id: "finanzierung", eyebrow: "04", label: "Finanzierung" },
  { id: "ausbaustufen", eyebrow: "05", label: "Ausbaustufen" },
  { id: "nachhaltigkeit", eyebrow: "06", label: "Nachhaltigkeit" },
];

export const smartHomeFeatures: IconListItem[] = [
  {
    icon: "smartphone-nfc",
    label: "Intuitive Steuerung",
    description:
      "Steuern Sie Ihr BoHolz-Haus bequem über Tablet oder Wandpanel mit einer benutzerfreundlichen Oberfläche.",
  },
  {
    icon: "thermometer",
    label: "Individueller Komfort",
    description:
      "Regulieren Sie Raumtemperaturen individuell, steuern Sie Rollläden und sehen Sie, wer an der Haustür klingelt.",
  },
  {
    icon: "shield",
    label: "Erhöhte Sicherheit",
    description:
      "Mit integrierten Sicherheitssystemen behalten Sie die Kontrolle über Ihr Zuhause, auch wenn Sie nicht da sind.",
  },
  {
    icon: "sparkles",
    label: "Maßgeschneidert",
    description:
      "Von Beleuchtungssteuerung bis Lichtszenen — wir entwickeln ein individuelles Konzept für Ihr intelligentes Zuhause.",
  },
];

// Architektur — three editorial beats, alternating image/text. The
// fallback images live under /landing/uebersicht/ (already cropped for
// editorial use) and /content/advantage/ for variety.
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
    imageURL: getMediaURL("/images/landing/uebersicht/lifestyle-01.webp"),
    imageAlt:
      "Offener Wohnbereich mit großzügiger Tageslichtführung — individuell geplanter Grundriss",
  },
  {
    eyebrow: "Fassade",
    heading: "Außen, wie Sie es sich vorstellen.",
    body: "Klassisch verputzt, mit Holzakzenten oder vollflächig in Holz — die Fassade definiert den ersten Eindruck. Aus einer abgestimmten Palette wählen Sie Materialien, Farben und Proportionen, die zum Ort passen.",
    imageURL: getMediaURL("/images/landing/uebersicht/lifestyle-04.webp"),
    imageAlt:
      "Moderne Holzfassade eines BoHolz-Hauses — wählbare Materialität für die Außenwirkung",
  },
  {
    eyebrow: "Innen & außen",
    heading: "Aus einer Hand, ohne Übergabeverluste.",
    body: "Wer plant, baut. Vom ersten Skizzenstrich bis zur fertigen Innenraumgestaltung bleibt das Projekt in einer Hand — keine Schnittstellen zwischen Architekt, Generalunternehmer und Innenausbau, keine Reibungsverluste in Detail und Termin.",
    imageURL: getMediaURL("/images/landing/uebersicht/lifestyle-05.webp"),
    imageAlt:
      "Detailliert ausgestalteter Wohnraum — Innenausbau und Architektur aus einer Hand",
  },
];

export const nachhaltigkeitImageA = getMediaURL(
  "/images/content/advantage/nachhaltigkeit/hero.webp",
);
export const nachhaltigkeitImageB = getMediaURL(
  "/images/photography/timber-grain.webp",
);

export const ctaImage = getMediaURL("/images/brand/brochure-vertical.webp");
