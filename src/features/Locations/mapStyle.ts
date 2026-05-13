// A MapLibre "style" is a JSON document describing tile sources + paint rules.
// Free, no API key, fully hosted: https://openfreemap.org
//   "positron"  — minimal light-gray (best for branded markers on top)
//   "liberty"   — colorful OSM Liberty look
//   "bright"    — high-contrast OSM Bright
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

// Coordinates are always [lng, lat] in MapLibre (GeoJSON order).
export const GERMANY_CENTER: [number, number] = [10.4515, 51.1657];
export const GERMANY_ZOOM = 5.6;

// [westLng, southLat, eastLng, northLat]. Useful if you want to lock the
// camera to Germany: <MglMap :max-bounds="GERMANY_BOUNDS" />
export const GERMANY_BOUNDS: [number, number, number, number] = [
  5.8663, 47.2701, 15.0419, 55.0581,
];
