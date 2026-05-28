import type { StyleSpecification } from "maplibre-gl";

// ─── Camera defaults ────────────────────────────────────────────────────────
// Coordinates are always [lng, lat] in MapLibre (GeoJSON order).
export const GERMANY_CENTER: [number, number] = [10.4515, 51.1657];
export const GERMANY_ZOOM = 6.0;

// [westLng, southLat, eastLng, northLat]. Lock the camera to Germany with
// <MglMap :max-bounds="GERMANY_BOUNDS" />.
export const GERMANY_BOUNDS: [number, number, number, number] = [
  5.8663, 47.2701, 15.0419, 55.0581,
];

// Classic OSM raster tiles — matches the look on boholz-haus.de exactly
// (cream/beige base, colored roads, green parks, blue water, German labels).
// Served by FOSSGIS e.V. (https://www.openstreetmap.de/germanstyle.html).
const OSM_TILE_URL = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// Raster style — no client-side paint overrides, the tiles are already the
// look the client signed off on.
export async function getBrandedStyle(): Promise<StyleSpecification> {
  return {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [OSM_TILE_URL],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 19,
        attribution: OSM_ATTRIBUTION,
      },
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
}
