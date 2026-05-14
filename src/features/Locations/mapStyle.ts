import type { StyleSpecification } from "maplibre-gl";

// A MapLibre "style" is a JSON document describing tile sources + paint rules.
// Free, no API key, fully hosted: https://openfreemap.org
//   "positron"  — minimal light-gray (best base for branded markers)
//   "liberty"   — colorful OSM Liberty look
//   "bright"    — high-contrast OSM Bright
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Coordinates are always [lng, lat] in MapLibre (GeoJSON order).
export const GERMANY_CENTER: [number, number] = [10.4515, 51.1657];
export const GERMANY_ZOOM = 5.6;

// [westLng, southLat, eastLng, northLat]. Lock the camera to Germany with
// <MglMap :max-bounds="GERMANY_BOUNDS" />.
export const GERMANY_BOUNDS: [number, number, number, number] = [
  5.8663, 47.2701, 15.0419, 55.0581,
];

// ─── Brand palette (resolved from CSS custom properties) ────────────────────
// MapLibre's WebGL renderer needs literal color strings, so we resolve the
// design tokens from src/style/design-system.css at runtime via
// getComputedStyle. design-system.css stays the single source of truth.
function readBrandTokens() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  return {
    pastellBg: v("--clr-surface-secondary"), // land
    pastellPetrol: v("--pastell-petrol"), // water
    pastellOliv: v("--pastell-oliv"), // parks / wood
    warmGray800: v("--warm-gray-800"), // minor roads / labels bg
    warmGray700: v("--warm-gray-700"), // buildings
    warmGray500: v("--warm-gray-500"), // major roads
    warmGray300: v("--warm-gray-300"), // label text
  };
}

// Per-layer paint overrides. Keys are Positron layer IDs — discover them with:
//   const s = await fetch(MAP_STYLE_URL).then(r => r.json());
//   console.log(s.layers.map(l => `${l.id}  (${l.type})`));
// Anything not listed here keeps its Positron default.
function buildLayerOverrides(
  brand: ReturnType<typeof readBrandTokens>,
): Record<string, Record<string, unknown>> {
  return {
    background: { "background-color": brand.pastellBg },
    water: { "fill-color": brand.pastellPetrol },
    water_name: { "text-color": brand.warmGray300 },
    park: { "fill-color": brand.pastellOliv, "fill-opacity": 0.25 },
    "landcover-wood": {
      "fill-color": brand.pastellOliv,
      "fill-opacity": 0.2,
    },
    "landuse-residential": { "fill-color": brand.warmGray800 },
    building: { "fill-color": brand.warmGray700 },
    road_minor: { "line-color": brand.warmGray700 },
    road_secondary_tertiary: { "line-color": brand.warmGray500 },
    road_major: { "line-color": brand.warmGray500 },
    road_motorway: { "line-color": brand.warmGray300 },
  };
}

// Fetch Positron, walk its layers, and apply our paint overrides.
// Returns a StyleSpecification suitable for <MglMap :map-style="...">.
export async function getBrandedStyle(): Promise<StyleSpecification> {
  const overrides = buildLayerOverrides(readBrandTokens());

  const res = await fetch(MAP_STYLE_URL);
  if (!res.ok) throw new Error(`Failed to load map style: ${res.status}`);
  const style = (await res.json()) as StyleSpecification;

  for (const layer of style.layers) {
    const override = overrides[layer.id];
    if (!override) continue;
    // `paint` is optional in the spec — initialize before merging.
    // The cast keeps us out of the discriminated-union weeds; each override
    // key is valid for its layer type.
    (layer as any).paint = { ...(layer as any).paint, ...override };
  }

  return style;
}
