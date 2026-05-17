import { getMediaURL } from "@/utils/media";
import type { BuildPhase } from "./bauphasen.types";

const base = "/images/content/bauphasen";

/**
 * The three narrative phases of building with BoHolz.
 *
 * Long-form `description` strings mirror the StepCard copy that already lives
 * on /dein-zuhause "01 · Der Ablauf" — kept verbatim so swapping the page
 * over to consume this file (instead of inlining the StepCards) is a no-op
 * for the visible copy.
 *
 * `teaser` is the homepage-strip variant — one sentence, ~10 words, so all
 * three phases read fast at a glance on mobile.
 */
export const buildPhases: BuildPhase[] = [
  {
    slug: "grundstein",
    title: "Der Grundstein wird gelegt",
    description:
      "Planung, Grundstück, Finanzierung — wir legen die Basis für Ihr Projekt.",
    teaser:
      "Planung, Grundstück, Finanzierung — die Basis für Ihr Projekt.",
    icon: "compass",
    imageURL: getMediaURL(`${base}/phase-01-grundstein.webp`),
  },
  {
    slug: "traeume",
    title: "Träume in Realität verwandeln",
    description:
      "Architektur, Bauantrag und Bemusterung — Ihr Haus nimmt Form an.",
    teaser:
      "Architektur, Bauantrag, Bemusterung — Ihr Haus nimmt Form an.",
    icon: "pencil",
    imageURL: getMediaURL(`${base}/phase-02-traeume.webp`),
  },
  {
    slug: "bauphase",
    title: "Die heiße Bauphase beginnt",
    description:
      "Vom Keller bis zur Schlüsselübergabe — Vorfertigung, Montage, Innenausbau.",
    teaser:
      "Vorfertigung, Montage, Innenausbau — bis zur Schlüsselübergabe.",
    icon: "hammer",
    imageURL: getMediaURL(`${base}/phase-03-bauphase.webp`),
  },
];

/** Hero used at the top of /dein-zuhause. */
export const bauphasenHeroImageURL = getMediaURL(`${base}/hero.webp`);
