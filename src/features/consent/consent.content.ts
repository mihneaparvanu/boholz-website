import type { ConsentType, ConsentButton } from "./consent.types";

export const CONSENT_ORDER = [
  "marketing",
  "analytics",
  "none",
] as const satisfies readonly ConsentType[];

export const CONSENT_BUTTONS: Record<ConsentType, ConsentButton> = {
  marketing: {
    title: "Alle akzeptieren",
    ariaLabel:
      "Alle Cookies akzeptieren, einschließlich Statistik und Marketing",
  },
  analytics: {
    title: "Statistik erlauben",
    ariaLabel: "Nur essenzielle und Statistik-Cookies akzeptieren",
  },
  none: {
    title: "Nur essenzielle",
    ariaLabel:
      "Nur essenzielle Cookies akzeptieren, Statistik und Marketing ablehnen",
  },
};
