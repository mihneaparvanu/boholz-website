<script setup lang="ts">
import { LucideInfo } from "lucide-vue-next";
import type { HouseCategory } from "@/types/models";
import CategorySlider from "@/features/CategorySlider/CategorySlider.vue";

defineProps<{
  categories: HouseCategory[];
}>();
</script>

<template>
  <div class="showcase">
    <CategorySlider :categories="categories" />
    <div class="info">
      <p>Ab <span class="price">200.000€ </span> zzgl. Überführung.</p>
      <p>
        Attraktive Finanzierungsmöglichkeiten.
        <span class="hint"><LucideInfo /></span>
      </p>
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

.hint {
  display: inline-block;
  width: var(--fs-body-lg);
  height: var(--fs-body-lg);
  color: var(--clr-content-secondary);
  vertical-align: middle;
  cursor: help;
}
</style>
