<script setup lang="ts">
import { House, Check } from "lucide-vue-next";
import Button from "@/ui/primitives/Button.vue";
import type { HouseModel } from "@/db/models";
import { formatCurrency } from "@/lib/format";
import { includesFoundation } from "@/lib/derive";
import { ROUTES } from "@/features/navigation/routes";

defineProps<{
  model: HouseModel;
  lede: string | null;
}>();
</script>

<template>
  <aside class="card">
    <a v-if="model.category" class="eyebrow" :href="`${ROUTES.houses}?category=${model.category.slug}`">
      <House :size="14" :stroke-width="2" aria-hidden="true" />
      <span>{{ model.category.name }}</span>
    </a>

    <header class="head">
      <h1 class="title">{{ model.title }}</h1>
      <template v-if="model.price">
        <p class="price">
          <span class="ab">ab</span>
          <span class="amount">
            {{ formatCurrency(model.price) }}<template v-if="model.isFeatured">*</template>
          </span>
        </p>
        <p v-if="includesFoundation(model.slug)" class="included">
          <Check :size="14" :stroke-width="2.25" aria-hidden="true" />
          <span>inklusive Bodenplatte</span>
        </p>
      </template>
    </header>

    <p v-if="lede" class="lede">{{ lede }}</p>

    <div class="actions">
      <Button variant="primary" size="md" href="/kontakt">
        Beratungstermin
      </Button>
      <Button variant="tertiary" size="md" href="/katalog">
        Katalog bestellen
      </Button>
      <p class="footnote" v-if="model.price && model.isFeatured">
        *Die Preise gelten für die Ausbaustufe „fast fertig“ in der
        Energieeffizienzklasse 55 nach der aktuellen Bau- und
        Leistungsbeschreibung Stand 03/2026. Gültig nur bei Bauort in
        Deutschland.
      </p>
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
  text-decoration: none;
  transition: color 160ms ease;
}

.eyebrow:hover {
  color: var(--clr-accent-secondary);
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

/* Value tag under the price — visually distinct from body copy so it reads
   as a positive inclusion rather than a duplicated disclaimer. */
.included {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
}

.included :deep(svg) {
  flex-shrink: 0;
  color: var(--pastell-oliv-alt);
}

.footnote {
  margin: 0;
  font-size: var(--fs-body-sm);
  line-height: 1.5;
  color: var(--clr-content-secondary);
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
