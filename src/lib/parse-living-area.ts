/**
 * Parse a `living_area`-style numeric value into a Number.
 *
 * The DB column `house_models.living_area` is Postgres `numeric`, which
 * drizzle returns as a string (e.g. "104.94"). Some legacy/imported rows
 * carry units or German-locale decimals ("104,94 m²", "104.94"). This
 * normalizer accepts:
 *   - null/undefined → null
 *   - finite numbers → unchanged
 *   - strings with optional trailing units, German comma, leading/trailing
 *     whitespace → parsed
 *
 * Returns `null` whenever the input can't be coerced to a finite number,
 * so callers can push "missing data" to the end of a sorted list.
 */
export function parseLivingArea(
  value: string | number | null | undefined,
): number | null {
  if (value == null) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  const trimmed = value.trim();
  if (trimmed === "") return null;
  // Grab the leading numeric token. Accepts "." or "," as decimal sep.
  const match = trimmed.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;
  const n = Number(match[0].replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
