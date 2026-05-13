# Maps Masterclass — Ausstellung Page (Musterhäuser Locations)

> Stack context: Astro 6 + Vue 3 + vanilla-extract + reka-ui  
> Data: `showhouses` table already has `lat`, `lng`, `address`, `city`

---

## 1. How Maps Work — The Mental Model

### 1.1 The World Is Flat (on screen)

The Earth is a sphere. To render it on a flat screen you need a **map projection**.
Every web map you've ever seen uses the **Web Mercator projection** (EPSG:3857), which wraps longitude → X and latitude → Y onto a flat square.

```
Latitude  (-90 to +90)  → Y axis (inverted, top = 90°N)
Longitude (-180 to +180) → X axis
```

Web Mercator distorts area near the poles (Greenland looks as big as Africa) but preserves angles, which makes navigation feel correct.

### 1.2 Tiles — The Fundamental Primitive

A map is a **grid of 256×256 px (or 512×512 px) images** called tiles. The grid is indexed by three numbers:

```
{z}/{x}/{y}
 │   │   └── row within the grid at zoom z
 │   └─────── column within the grid at zoom z
 └─────────── zoom level (0 = whole world in 1 tile, 22 = building-level detail)
```

At zoom **0** → 1 tile covers the entire world.  
At zoom **1** → 2×2 = 4 tiles.  
At zoom **z** → 2ᶻ × 2ᶻ tiles.

Tiles are fetched from a **tile server** via a URL template:

```
https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

The map library calculates which tiles are currently visible (based on viewport + zoom), fetches them in parallel, and stitches them together.

#### Raster vs Vector tiles

| | Raster tiles | Vector tiles |
|---|---|---|
| Format | PNG/JPEG | PBF (Protobuf) |
| Styling | Fixed, baked into the image | Dynamic, applied client-side |
| Custom colors | ✗ Can't change | ✓ Full control |
| Retina / HiDPI | Needs separate @2x tiles | Scales perfectly |
| Offline | Easy to cache | Needs font/sprite assets too |
| Bundle overhead | Near zero (library is tiny) | Larger (WebGL renderer) |
| Best library | Leaflet | MapLibre GL JS |

### 1.3 Markers and Overlays

On top of the tile layer the library paints an **overlay layer** — your pins, polygons, popups.

```
┌─────────────────────────────────┐
│  Overlay (DOM / Canvas / WebGL) │  ← your markers, popups, custom SVG
│  Tile layer (Canvas / WebGL)    │  ← background imagery
└─────────────────────────────────┘
```

Coordinates are always in `[longitude, latitude]` (GeoJSON convention) or `[latitude, longitude]` (Leaflet convention — this trips everyone up once).

### 1.4 Coordinate Systems

```
WGS84 (GPS)   → [lat, lng]  → what your DB stores
Web Mercator  → [x, y] in meters → what the tile server uses internally
Screen pixels → what the browser paints
```

The library handles all three conversions for you.

---

## 2. Free Tile Providers

You never need to host tiles yourself for a project like this. Good free options:

| Provider | License | Notes |
|---|---|---|
| **OpenStreetMap** | ODbL (attribution required) | Default, no key needed |
| **Carto (Voyager/Positron)** | Free tier | Beautiful minimal styles, no API key for basic use |
| **Stadia Maps** | Free tier (no key for low traffic) | Stamen-style tiles (watercolor, toner, terrain) |
| **MapTiler** | Free tier (100k req/month) | Hosts OpenMapTiles vector tiles — best for MapLibre |
| **Protomaps** | Apache 2 / free self-host | Single-file planet PMTiles, can self-host on CDN |

---

## 3. Library Comparison

### 3.1 Leaflet

- **Size**: ~42 KB gzipped (CSS + JS)
- **Renderer**: DOM + Canvas
- **Tiles**: Raster only (natively)
- **DX**: Imperative API, but very simple — `L.map`, `L.tileLayer`, `L.marker`
- **Customization**: Limited without plugins; you can use custom HTML markers
- **Vue wrapper**: `@vue-leaflet/vue-leaflet` (~10 KB extra)

```bash
npm install leaflet @vue-leaflet/vue-leaflet
```

```vue
<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps<{
  locations: { lat: number; lng: number; title: string }[];
}>();
const zoom = 6;
const center = [51.1657, 10.4515]; // Germany center
</script>

<template>
  <LMap :zoom="zoom" :center="center" style="height: 500px">
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© OpenStreetMap contributors"
    />
    <LMarker
      v-for="loc in locations"
      :key="loc.title"
      :lat-lng="[loc.lat, loc.lng]"
    >
      <LPopup>{{ loc.title }}</LPopup>
    </LMarker>
  </LMap>
</template>
```

**Verdict**: Best choice if you want zero friction and a raster map background is fine. No WebGL, works in all environments.

---

### 3.2 MapLibre GL JS ★ Recommended

- **Size**: ~250 KB gzipped (WebGL renderer included)
- **Renderer**: WebGL
- **Tiles**: Vector (native) + raster (supported)
- **DX**: More setup than Leaflet, but fully declarative once configured
- **Customization**: Full style spec — change any color, font, layer order, add 3D extrusions, custom layers
- **Vue wrapper**: `vue-maplibre-gl` (~5 KB extra)

```bash
npm install maplibre-gl vue-maplibre-gl
```

MapLibre GL JS is the open-source fork of Mapbox GL JS v1 (Apache 2 license). It uses a **style document** — a single JSON that defines tile sources, fonts, sprites, and all visual layers.

```ts
// Example MapLibre style using MapTiler's free OpenStreetMap style
const MAP_STYLE = "https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY";

// Or a self-contained minimal style pointing at OSM raster tiles:
const RASTER_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};
```

```vue
<script setup lang="ts">
import { MglMap, MglMarker, MglPopup } from "vue-maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{
  locations: { lat: number; lng: number; title: string }[];
}>();
</script>

<template>
  <MglMap
    :map-style="RASTER_STYLE"
    :center="[10.4515, 51.1657]"
    :zoom="5.5"
    style="height: 500px"
  >
    <MglMarker
      v-for="loc in locations"
      :key="loc.title"
      :coordinates="[loc.lng, loc.lat]"
    >
      <template #marker>
        <!-- fully custom HTML marker — use your own SVG or component -->
        <div class="custom-pin">🏠</div>
      </template>
      <MglPopup>
        <strong>{{ loc.title }}</strong>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
```

**Verdict**: Best choice for a premium, brand-matched experience. Lets you match the BoHolz color palette exactly. The 250 KB overhead is justified once.

---

### 3.3 OpenLayers

- **Size**: ~400 KB gzipped (full build)
- **DX**: Complex, enterprise-grade API
- **Customization**: Extremely powerful (routing, WMS, WFS, projections)
- **Vue wrapper**: `vue3-openlayers`

**Verdict**: Overkill for a Musterhäuser pin map. Skip unless you need advanced GIS features.

---

### 3.4 Decision Matrix for BoHolz

| | Leaflet | MapLibre GL JS |
|---|---|---|
| Bundle size | ✅ 42 KB | ⚠️ 250 KB |
| DX simplicity | ✅ Excellent | ✅ Good |
| Custom marker styling | ✅ Any HTML | ✅ Any HTML |
| Custom map color palette | ✗ Not possible | ✅ Full style spec |
| SSR/Astro compatible | ✅ (client:only) | ✅ (client:only) |
| Free tiles, no API key | ✅ OSM | ✅ OSM raster |
| Retina displays | ⚠️ Needs @2x tiles | ✅ Native |
| Performance (100+ markers) | ✅ Good | ✅ Excellent |

**Recommendation: MapLibre GL JS + `vue-maplibre-gl`**

The extra ~200 KB is worth it for BoHolz because:
- You can match the exact brand palette (`--boholz-blau`, `--pastell-bg`) in the vector tile style
- You get crisp rendering on any screen density
- Custom HTML markers are first-class
- The vector tile style from MapTiler free tier covers Germany at high quality

---

## 4. Implementation Guide for the Ausstellung Page

### 4.1 Install

```bash
npm install maplibre-gl vue-maplibre-gl
```

### 4.2 Data Loader

Add a loader to `src/data/loaders.ts`:

```ts
import { showhouses } from "../db/schema";

export async function getAllShowhouses(): Promise<Showhouses[]> {
  return db.select().from(showhouses).where(/* active only if needed */);
}
```

### 4.3 Astro Page — `src/pages/ausstellung.astro`

```astro
---
import Layout from "../layouts/Layout.astro";
import Section from "../layouts/Section.astro";
import ShowhousesMap from "../features/ShowhousesMap/ShowhousesMap.vue";
import { getAllShowhouses } from "../data/loaders";

const showhouses = await getAllShowhouses();
---

<Layout title="Ausstellung – Musterhäuser">
  <Section>
    <h1>Unsere Musterhäuser</h1>
    <p>Besuchen Sie uns vor Ort und erleben Sie Ihre Traumhaus-Vision hautnah.</p>
  </Section>

  <ShowhousesMap
    client:only="vue"
    showhouses={showhouses}
  />
</Layout>
```

> **`client:only="vue"`** is mandatory — MapLibre uses `window` and the DOM, which don't exist at build time. This directive tells Astro to skip SSR entirely for this component.

### 4.4 Vue Map Component

```
src/features/ShowhousesMap/
  ShowhousesMap.vue        ← wrapper, handles state
  components/
    MapPin.vue             ← custom SVG pin
    ShowhouseCard.vue      ← popup / sidebar card
```

**ShowhousesMap.vue**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MglMap, MglMarker, MglPopup, MglNavigationControl } from "vue-maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Showhouses } from "../../types/models";
import MapPin from "./components/MapPin.vue";
import ShowhouseCard from "./components/ShowhouseCard.vue";

const props = defineProps<{ showhouses: Showhouses[] }>();

const selected = ref<Showhouses | null>(null);

// Minimal style — OSM raster, no API key needed
const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm-layer", type: "raster", source: "osm" }],
};

// Germany center
const initialCenter: [number, number] = [10.4515, 51.1657];
const initialZoom = 5.8;
</script>

<template>
  <div class="map-wrapper">
    <MglMap
      :map-style="mapStyle"
      :center="initialCenter"
      :zoom="initialZoom"
      class="map"
    >
      <MglNavigationControl position="top-right" />

      <MglMarker
        v-for="house in showhouses"
        :key="house.id"
        :coordinates="[Number(house.lng), Number(house.lat)]"
        @click="selected = house"
      >
        <template #marker>
          <MapPin :active="selected?.id === house.id" />
        </template>
      </MglMarker>
    </MglMap>

    <ShowhouseCard
      v-if="selected"
      :showhouse="selected"
      @close="selected = null"
    />
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  height: 70vh;
  min-height: 480px;
}

.map {
  width: 100%;
  height: 100%;
}
</style>
```

### 4.5 Custom Marker — `MapPin.vue`

```vue
<script setup lang="ts">
defineProps<{ active?: boolean }>();
</script>

<template>
  <div class="pin" :class="{ 'pin--active': active }">
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
      <path
        d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
        :fill="active ? 'var(--boholz-blau-alt)' : 'var(--boholz-blau)'"
      />
      <circle cx="16" cy="16" r="6" fill="white" />
    </svg>
  </div>
</template>

<style scoped>
.pin {
  cursor: pointer;
  transform: translateY(-100%);
  transition: transform 100ms ease;
}

.pin--active {
  transform: translateY(-100%) scale(1.2);
}

.pin:hover {
  transform: translateY(-100%) scale(1.1);
}
</style>
```

### 4.6 Popup Card — `ShowhouseCard.vue`

```vue
<script setup lang="ts">
import type { Showhouses } from "../../../types/models";

defineProps<{ showhouse: Showhouses }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div class="card">
    <button class="card__close" @click="emit('close')" aria-label="Schließen">
      ✕
    </button>
    <h3 class="card__title">{{ showhouse.title }}</h3>
    <p class="card__address">{{ showhouse.address }}</p>
    <p class="card__city">{{ showhouse.city }}</p>
    <a :href="`/haus/${showhouse.slug}`" class="card__link">
      Mehr erfahren →
    </a>
  </div>
</template>

<style scoped>
.card {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  translate: -50% 0;
  width: min(380px, calc(100% - 2rem));
  background: var(--warm-gray-900);
  border: 1px solid var(--warm-gray-700);
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.card__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--warm-gray-400);
  font-size: 1rem;
}

.card__title {
  font-family: var(--font-heading);
  margin-block-end: 0.25rem;
}

.card__link {
  display: inline-block;
  margin-block-start: 1rem;
  color: var(--boholz-blau-alt);
  text-decoration: none;
  font-weight: 500;
}

.card__link:hover {
  text-decoration: underline;
}
</style>
```

---

## 5. SSR / Astro Gotchas

| Issue | Cause | Fix |
|---|---|---|
| `window is not defined` | MapLibre calls `window` at import time | Always use `client:only="vue"` |
| Marker icons broken | Leaflet resolves icon paths at runtime | Use `@vue-leaflet/vue-leaflet` which patches this automatically |
| Map renders 0×0 | Parent has no height | Set explicit `height` on the map container **and** its parents |
| Map appears grey / missing tiles | CORS or tile URL wrong | Check network tab; use OSM template exactly as shown |
| Double `!important` CSS clash | MapLibre CSS conflicts with reset | Import maplibre CSS **before** your own stylesheets, or scope to `.map` |

---

## 6. Upgrading to a Branded Vector Style (Optional)

Once you have a [MapTiler free account](https://maptiler.com) (no credit card, 100k requests/month free):

```ts
const mapStyle = `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.PUBLIC_MAPTILER_KEY}`;
```

Then fork the style in the MapTiler Studio and:
- Set water color → `var(--pastell-petrol)` equivalent
- Set land color → `var(--pastell-bg)` equivalent  
- Set roads → `var(--warm-gray-600)`
- Remove unnecessary label layers

The result is a map that looks like it was designed specifically for BoHolz.

---

## 7. Quick Start Checklist

- [ ] `npm install maplibre-gl vue-maplibre-gl`
- [ ] Add `PUBLIC_MAPTILER_KEY` to `.env` (optional, OSM raster works without it)
- [ ] Create `src/pages/ausstellung.astro`
- [ ] Create `src/features/ShowhousesMap/ShowhousesMap.vue` with `client:only="vue"`
- [ ] Add `getAllShowhouses()` loader to `src/data/loaders.ts`
- [ ] Add `/ausstellung` route to `src/data/navigation.ts`
- [ ] Verify `lat`/`lng` are not null in the DB for all showhouse rows
- [ ] Test: `Number(house.lat)` since Drizzle returns `numeric` columns as strings

---

## 8. Key Numbers to Remember

| Fact | Value |
|---|---|
| MapLibre GL JS gzipped | ~250 KB |
| Leaflet gzipped | ~42 KB |
| OSM tile request limit | Unlimited for low-traffic sites (fair use) |
| MapTiler free tier | 100,000 tile requests / month |
| Germany bounding box | SW: 47.3°N 5.9°E — NE: 55.1°N 15.0°E |
| Germany center (approx.) | 51.17°N, 10.45°E |
| Good default zoom for Germany | 5.5–6 |
| Zoom for city level | 12–13 |
| Zoom for building level | 17–18 |
