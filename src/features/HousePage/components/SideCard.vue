<script setup lang="ts">
import { House } from "lucide-vue-next";
import Button from "@/components/ui/Button.vue";
import type { HouseModel } from "@/types/models";
import { formatCurrency } from "@/utils/format";

const props = defineProps<{
  model: HouseModel;
  descriptionPlaceholder: string;
}>();
</script>

<template>
  <aside class="card">
    <div v-if="model.category" class="eyebrow">
      <House :size="14" :stroke-width="2" aria-hidden="true" />
      <span>{{ model.category.name }}</span>
    </div>

    <header class="head">
      <h1 class="title">{{ model.title }}</h1>
      <p v-if="model.price" class="price">
        <span class="ab">ab</span>
        <span class="amount">{{ formatCurrency(model.price) }}</span>
      </p>
    </header>

    <p class="lede">{{ descriptionPlaceholder }}</p>

    <div class="actions">
      <Button variant="primary" size="md" href="/kontakt">
        Beratungstermin
      </Button>
      <Button variant="tertiary" size="md" href="/kontakt#katalog">
        Katalog bestellen
      </Button>
    </div>
  </aside>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-1);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  text-transform: uppercase;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  color: var(--clr-content-secondary);
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.title {
  margin: 0;
  font-size: var(--fs-h4);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--ls-heading);
  line-height: var(--lh-heading);
}

.price {
  margin: 0;
  display: inline-flex;
  align-items: baseline;
  gap: var(--spacing-1);
}

.ab {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
}

.amount {
  font-size: var(--fs-h6);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
}

.lede {
  margin: 0;
  color: var(--clr-content-secondary);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

@media (--from-desktop) {
  .card {
    padding: var(--spacing-4);
  }
}
</style>
