import { getMediaURL } from '@/lib/media';

import type { Section } from "@/features/section-navigator/SectionNavigator.vue";

export const sections: Section[] = [
  { id: "ablauf", eyebrow: "01", label: "Der Ablauf" },
  { id: "architektur", eyebrow: "02", label: "Architektur" },
  { id: "finanzierung", eyebrow: "03", label: "Finanzierung" },
  { id: "ausbaustufen", eyebrow: "04", label: "Ausbaustufen" },
  { id: "nachhaltigkeit", eyebrow: "05", label: "Werkstoff Holz" },
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

export const nachhaltigkeitImageA = getMediaURL(
  "/images/content/advantage/nachhaltigkeit/hero.webp",
);
export const nachhaltigkeitImageB = getMediaURL(
  "/images/photography/log-stack.webp",
);

export const ctaImage = getMediaURL("/images/brand/home-hero.webp");
