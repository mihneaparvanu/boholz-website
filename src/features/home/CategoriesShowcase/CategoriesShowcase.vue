<script setup lang="ts">
import { computed } from "vue";
import type { HouseCategory } from "@/db/models";
import { isBestsellerCategory } from "@/lib/bestseller";
import CategorySlider from "@/features/category-slider/CategorySlider.vue";

const props = defineProps<{
  categories: HouseCategory[];
}>();

// Bestseller is the umbrella — exclude it from the home typology showcase.
const visibleCategories = computed(() =>
  props.categories.filter((c) => !isBestsellerCategory(c)),
);
</script>

<template>
  <div class="showcase">
    <div class="info">
      <p>Attraktive Finanzierungsmöglichkeiten.</p>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-5);
  width: 100%;
}

.info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-0);
  text-align: center;
}
</style>
