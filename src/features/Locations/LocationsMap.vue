<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { MglMap, MglNavigationControl } from "@indoorequal/vue-maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { LocationWithAgents } from "../../types/models";
import LocationCard from "./LocationCard.vue";
import LocationMarker from "./LocationMarker.vue";
import { getBrandedStyle, GERMANY_CENTER, GERMANY_ZOOM } from "./mapStyle";

const props = defineProps<{ locations: LocationWithAgents[] }>();

// `numeric` columns come back as `string | null` from Drizzle — drop nulls and
// coerce to numbers so MapLibre can use the coordinates.
const validLocations = computed(() =>
  props.locations.filter((l) => l.lat !== null && l.lng !== null),
);

// Fetched once, then handed to <MglMap> as a static prop. shallowRef avoids
// deep-reactivity over a large style JSON.
const mapStyle = shallowRef<StyleSpecification | null>(null);
getBrandedStyle().then((s) => (mapStyle.value = s));

const selected = ref<LocationWithAgents | null>(null);
</script>

<template>
  <div class="map-wrapper">
    <MglMap
      v-if="mapStyle"
      :map-style="mapStyle"
      :center="GERMANY_CENTER"
      :zoom="GERMANY_ZOOM"
      :attribution-control="{ compact: true }"
    >
      <MglNavigationControl position="top-right" :show-compass="false" />

      <LocationMarker
        v-for="loc in validLocations"
        :key="loc.id"
        :location="loc"
        :active="selected?.id === loc.id"
        @select="selected = loc"
      />
    </MglMap>

    <Transition name="card">
      <LocationCard
        v-if="selected"
        :location="selected"
        @close="selected = null"
      />
    </Transition>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 480px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--clr-border-secondary);
}

.map-wrapper :deep(.maplibregl-map) {
  width: 100%;
  height: 100%;
}

.map-wrapper :deep(.maplibregl-ctrl-group) {
  border-radius: var(--radius-sm);
  border: 1px solid var(--clr-border-secondary);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.map-wrapper :deep(.maplibregl-ctrl-attrib) {
  background: var(--clr-surface-primary);
  color: var(--clr-content-tertiary);
  font-size: var(--fs-body-sm);
}

.card-enter-active,
.card-leave-active {
  transition:
    opacity 180ms ease,
    translate 180ms ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  translate: 0 12px;
}
</style>
