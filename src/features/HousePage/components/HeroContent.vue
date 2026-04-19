<script setup lang="ts">
import { House } from "lucide-vue-next";
import type { HouseModel } from "../../../types/models";
import { formatCurrency } from "../../../utils/format";

const props = defineProps<{
  model: HouseModel;
}>();
</script>

<template>
  <div class="hero-content">
    <div class="meta">
      <div class="category-label">
        <House />
        <span>{{ model.category?.name }}</span>
      </div>
      <span>{{ model.details?.familiesCount }} Familien</span>
    </div>
    <div class="headline">
      <div class="heading-group">
        <h3>{{ model.title }}</h3>
        <span>ab {{ formatCurrency(model.price ?? 0) }}</span>
      </div>
      <p>{{ model.category?.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.hero-content {
  padding-block: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);

  .meta,
  .headline {
    display: flex;
    align-items: center;
  }

  .category-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);

    span {
      text-transform: uppercase;
      color: var(--clr-content-secondary);
    }
  }

  .headline {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
    .heading-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-1);

      h3 {
        font-size: var(--fs-h5);
        font-weight: 400;
      }

      p {
        color: var(--clr-content-tertiary);
      }
    }
  }
}
</style>
