export type Displayable = number | boolean;

export const formatDegrees = (v: Displayable) => `${v}°`;
export const formatBoolean = (v: Displayable) => (v ? "Ja" : "Nein");
export const formatSquareMeters = (v: Displayable) =>
  `${parseFloat(String(v))} m²`;
export const formatCurrency = (v: Displayable) =>
  `${Number(v).toLocaleString("de-DE")} €`;

const BERLIN = { timeZone: "Europe/Berlin" } as const;

export function formatNewsDate(d: Date | string | null): string | null {
  return d
    ? new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: BERLIN.timeZone,
      }).format(new Date(d))
    : null;
}

export const toMetaDescription = (
  text: string | null | undefined,
  max = 155,
): string | undefined => {
  if (!text) return undefined;
  const clean = text
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…";
};
