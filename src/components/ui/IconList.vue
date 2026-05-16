<script setup lang="ts">
import { getIcon, type IconName } from "@/utils/icons";

export type IconListItem = {
  icon: IconName;
  label: string;
  description?: string;
};

withDefaults(
  defineProps<{
    items: IconListItem[];
    density?: "tight" | "comfortable";
    /** Columns at desktop. Default 1; pages can request 2 or 4 (e.g. 16 reasons). */
    columns?: 1 | 2 | 4;
  }>(),
  {
    density: "comfortable",
    columns: 1,
  },
);
</script>

<template>
  <ul class="list" :data-density="density" :data-columns="columns" role="list">
    <li v-for="(item, i) in items" :key="i" class="row">
      <span class="icon" aria-hidden="true">
        <component :is="getIcon(item.icon)" :size="18" :stroke-width="1.75" />
      </span>
      <div class="text">
        <p class="label">{{ item.label }}</p>
        <p v-if="item.description" class="desc">{{ item.description }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--row-gap, var(--spacing-3));
  padding: 0;
  margin: 0;
}

.list[data-density="tight"] {
  --row-gap: var(--spacing-2);
}

@media (--from-tablet) {
  .list[data-columns="2"],
  .list[data-columns="4"] {
    grid-template-columns: 1fr 1fr;
    column-gap: var(--spacing-4);
  }
}

@media (--from-desktop) {
  .list[data-columns="4"] {
    grid-template-columns: repeat(4, 1fr);
  }
}

.row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  column-gap: var(--spacing-2);
  min-width: 0;
}

.icon {
  display: inline-grid;
  place-items: center;
  /* Optical alignment with first line of label text. */
  padding-block-start: 0.15em;
  color: var(--clr-content-secondary);
}

.text {
  min-width: 0;
}

.label {
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
  margin: 0;
  line-height: var(--lh-heading);
}

.desc {
  margin: var(--spacing-0) 0 0 0;
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
}
</style>
