<script setup lang="ts">
import { computed } from "vue";
import type { HouseCategory } from "@/types/models";
import { BESTSELLER_CATEGORY_ID } from "@/data/constants";
import CategorySlider from "@/features/CategorySlider/CategorySlider.vue";

const props = defineProps<{
  categories: HouseCategory[];
}>();

// Bestseller is a virtual aggregate category — exclude it from the home showcase.
const visibleCategories = computed(() =>
  props.categories.filter((c) => c.id !== BESTSELLER_CATEGORY_ID),
);
</script>

<template>
  <div class="showcase">
    <CategorySlider :categories="visibleCategories" />
    <div class="info">
      <p>Ab <span class="price">200.000€</span> zzgl. Überführung.</p>
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

.price {
  display: inline-block;
  color: var(--clr-content-secondary);
  font-weight: 500;
}
</style>
