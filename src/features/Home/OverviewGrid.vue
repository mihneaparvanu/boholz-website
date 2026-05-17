<script setup lang="ts">
import OverviewCard from "./OverviewCard.vue";
import type { OverviewCardData } from "./home.types";
import { getMediaURL } from "@/utils/media";

const LOREM =
  "Unsere Wände bestehen aus massivem Kreuzlagenholz – ohne Folien, ohne Styropor. Diese diffusionsoffene Bauweise reguliert die Luftfeuchtigkeit natürlich und bietet gleichzeitig hervorragenden Schallschutz. Ein Haus, gebaut für Generationen.";

const cards: OverviewCardData[] = [
  {
    heading: "Höchste Bauqualität",
    subheading: LOREM,
    featured: true,
    image: {
      url: getMediaURL("/images/pages/dein-zuhause/hero-bauen.jpg"),
      alt: "BoHolz Fertighaus in hochwertiger Bauweise",
      width: 2000,
      height: 776,
    },
  },
  {
    heading: "Echtes Holz",
    subheading: LOREM,
    image: {
      url: getMediaURL("/images/pages/dein-zuhause/ausbaustufen.jpg"),
      alt: "Holzbau im Innenausbau",
      width: 500,
      height: 300,
    },
  },
  {
    heading: "Energieeffizienz",
    subheading: LOREM,
    image: {
      url: getMediaURL("/images/pages/dein-zuhause/foerderung.jpg"),
      alt: "Modernes energieeffizientes BoHolz Haus",
      width: 500,
      height: 300,
    },
  },
  {
    heading: "Individuelle Planung",
    subheading: LOREM,
    image: {
      url: getMediaURL("/images/pages/unser-versprechen/qualitaet.jpg"),
      alt: "Planungsgespräch für ein BoHolz Fertighaus",
      width: 500,
      height: 300,
    },
  },
  {
    heading: "Smart Living",
    subheading: LOREM,
    image: {
      url: getMediaURL("/images/pages/uber-uns/value-1.jpg"),
      alt: "Digital vernetztes Smart-Home-Konzept",
      width: 800,
      height: 500,
    },
  },
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
