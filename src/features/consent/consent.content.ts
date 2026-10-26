import type { ConsentType, ConsentButton } from "./consent.types";

export const CONSENT_ORDER = [
  "marketing",
  "analytics",
  "none",
] as const satisfies readonly ConsentType[];

// Wording is legal text: it records what the visitor agreed to. Changes need
// BoHolz's sign-off, not ours. See the note in ConsentHeader.astro.
export const CONSENT_BUTTONS: Record<ConsentType, ConsentButton> = {
  marketing: {
    title: "Alle akzeptieren",
    ariaLabel:
      "Alle Cookies akzeptieren, einschließlich Statistik und Marketing",
  },
  analytics: {
    title: "Nur Statistik",
    ariaLabel: "Statistik-Cookies erlauben, Marketing ablehnen",
  },
  none: {
    title: "Ablehnen",
    ariaLabel: "Statistik und Marketing ablehnen, keine Cookies setzen",
  },
};

export const CONSENT_SETTINGS = {
  marketing: { label: "Alle akzeptiert", tone: "ok" },
  analytics: { label: "Nur Statistik", tone: "ok" },
  none: { label: "Abgelehnt", tone: "warn" },
} as const satisfies Record<
  ConsentType,
  { label: string; tone: "ok" | "warn" }
>;

/** Shown before a choice exists — the only state the server can know. */
export const UNDECIDED_LABEL = "Ihre Privatsphäre";
