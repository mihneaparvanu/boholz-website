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
      <div v-if="model.category" class="category-label">
        <House />
        <span>{{ model.category.name }}</span>
      </div>
      <span class="highlight-item" v-if="model.details?.familiesCount"
        >{{ model.details.familiesCount }} Familien</span
      >
    </div>
    <div class="heading-group">
      <h3>{{ model.title }}</h3>
      <span v-if="model.price">ab {{ formatCurrency(model.price) }}</span>
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
    gap: var(--spacing-2);
  }

  .category-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);

    span {
      text-transform: uppercase;
      font-size: var(--fs-body-sm);
      color: var(--clr-content-secondary);
      font-weight: 500;
    }
  }

  .highlight-item {
    background-color: var(--clr-surface-tertiary);
    padding: var(--spacing-0) var(--spacing-1);
    border: 2px solid var(--clr-border-primary);
    border-radius: var(--radius-md);
  }

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
</style>
