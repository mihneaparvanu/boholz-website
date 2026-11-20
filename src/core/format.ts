const de = (v: number, fractionDigits?: number) =>
  v.toLocaleString(
    "de-DE",
    fractionDigits === undefined
      ? undefined
      : {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        },
  );

export const formatNumber = (v: number) => de(v);
export const formatDegrees = (v: number) => `${de(v)}°`;
export const formatCentimeters = (v: number) => `${de(v)} cm`;
export const formatSquareMeters = (v: number) => `${de(v)} m²`;

/** DIN 277 and WoFlV figures are declared to two decimals by convention, so
 *  116.2 reads "116,20 m²". The marketing Wohnfläche is not padded. */
export const formatRegulatedArea = (v: number) => `${de(v, 2)} m²`;

export const formatBoolean = (v: boolean) => (v ? "Ja" : "Nein");
export const formatCurrency = (v: number) => `${de(v)} €`;
export const formatPriceFrom = (v: number) => `ab ${formatCurrency(v)}`;

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
