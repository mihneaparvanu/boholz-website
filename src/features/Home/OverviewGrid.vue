<script setup lang="ts">
import OverviewCard from "./OverviewCard.vue";
import type { OverviewCardData } from "./home.types";

const LOREM =
  "Unsere Wände bestehen aus massivem Kreuzlagenholz – ohne Folien, ohne Styropor. Diese diffusionsoffene Bauweise reguliert die Luftfeuchtigkeit natürlich und bietet gleichzeitig hervorragenden Schallschutz. Ein Haus, gebaut für Generationen.";

const cards: OverviewCardData[] = [
  { heading: "Höchste Bauqualität", subheading: LOREM, featured: true },
  { heading: "Echtes Holz", subheading: LOREM },
  { heading: "Energieeffizienz", subheading: LOREM },
  { heading: "Individuelle Planung", subheading: LOREM },
  { heading: "Smart Living", subheading: LOREM },
];
</script>

<template>
  <div class="overview-grid">
    <OverviewCard
      v-for="card in cards"
      :key="card.heading"
      :data="card"
      :class="{ main: card.featured }"
    />
  </div>
</template>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2);
}

.main {
  grid-column: 1 / -1;
}
</style>
