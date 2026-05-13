<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from "vue";
import maplibregl, { Map as MaplibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const container = useTemplateRef<HTMLDivElement>("container");
let map: MaplibreMap | null = null;

onMounted(() => {
  if (!container.value) return;

  map = new maplibregl.Map({
    container: container.value,
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [10.4515, 51.1657], // [lng, lat] — Germany centroid
    zoom: 5.5,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <!-- The container needs an explicit height. MapLibre reads offsetHeight
       at construction time and creates the WebGL canvas to match. -->
  <div ref="container" class="map" />
</template>

<style scoped>
.map {
  width: 100%;
  height: 70vh;
  min-height: 480px;
}
</style>
