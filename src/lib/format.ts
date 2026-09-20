type Displayable = string | number | boolean;

export const formatMeters = (v: Displayable) => `${parseFloat(String(v))} m`;
export const formatDegrees = (v: Displayable) => `${v}°`;
export const formatBoolean = (v: Displayable) => (v ? "Ja" : "Nein");
export const formatSquareMeters = (v: Displayable) =>
  `${parseFloat(String(v))} m²`;
export const formatCurrency = (v: Displayable) =>
  `${Number(v).toLocaleString("de-DE")} €`;

/**
 * Body copy → meta description. Collapses whitespace, strips markdown
 * emphasis, and cuts at the last word boundary under `max` so a snippet
 * never ends mid-word. Returns undefined for empty input, so the caller
 * can omit the tag rather than emit an empty one.
 *
 * 155 is the practical desktop cut-off; Google rewrites beyond it anyway.
 */
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
