<script setup lang="ts">
import { Check, X } from "lucide-vue-next";

export type ComparisonSide = {
  title: string;
  caption?: string;
  items: string[];
};

withDefaults(
  defineProps<{
    left: ComparisonSide;
    right: ComparisonSide;
    /** Which side carries the accent. Default 'right' (the desirable choice). */
    accent?: "left" | "right" | "none";
  }>(),
  {
    accent: "right",
  },
);
</script>

<template>
  <div class="compare">
    <article class="side" :data-accent="accent === 'left'">
      <header class="head">
        <h3 class="title">{{ left.title }}</h3>
        <p v-if="left.caption" class="caption">{{ left.caption }}</p>
      </header>
      <ul class="list" role="list">
        <li v-for="item in left.items" :key="item" class="row">
          <span class="icon negative" aria-hidden="true">
            <X :size="16" :stroke-width="2" />
          </span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </article>

    <article class="side" :data-accent="accent === 'right'">
      <header class="head">
        <h3 class="title">{{ right.title }}</h3>
        <p v-if="right.caption" class="caption">{{ right.caption }}</p>
      </header>
      <ul class="list" role="list">
        <li v-for="item in right.items" :key="item" class="row">
          <span class="icon positive" aria-hidden="true">
            <Check :size="16" :stroke-width="2" />
          </span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </article>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3);
}

@media (--from-tablet) {
  .compare {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
  }
}

.side {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  min-width: 0;
}

.side[data-accent="true"] {
  border-color: color-mix(in srgb, var(--clr-accent-primary) 35%, transparent);
  background: color-mix(
    in srgb,
    var(--clr-accent-primary) 3%,
    var(--clr-surface-primary)
  );
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.title {
  font-size: var(--fs-h5);
  font-weight: var(--font-weight-medium);
  line-height: var(--lh-heading);
  letter-spacing: var(--ls-heading);
  color: var(--clr-content-primary);
  margin: 0;
}

.caption {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  margin: 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin: 0;
  padding: 0;
  color: var(--clr-content-secondary);
}

.row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  column-gap: var(--spacing-2);
  line-height: var(--lh-body);
}

.icon {
  display: inline-grid;
  place-items: center;
  /* Optical alignment with first line of text. */
  padding-block-start: 0.18em;
}

.icon.negative {
  color: var(--clr-content-quaternary);
}

.icon.positive {
  /* Larger card surface → primary accent per the project rule. */
  color: var(--clr-accent-primary);
}
</style>
