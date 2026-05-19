<script setup lang="ts">
import { computed, ref } from "vue";
import { getIcon, type IconName } from "@/utils/icons";

export type IconListItem = {
  icon: IconName;
  label: string;
  description?: string;
};

const props = withDefaults(
  defineProps<{
    items: IconListItem[];
    density?: "tight" | "comfortable";
    /** Columns at desktop. Default 1; pages can request 2 or 4 (e.g. 16 reasons). */
    columns?: 1 | 2 | 4;
    /** When true, shows only the first few items with a toggle for the rest.
     *  Visible-when-collapsed: 4 on desktop, 3 on mobile. */
    collapsible?: boolean;
    /** Toggle copy when collapsed. */
    moreLabel?: string;
    /** Toggle copy when expanded. */
    lessLabel?: string;
  }>(),
  {
    density: "comfortable",
    columns: 1,
    collapsible: false,
    moreLabel: "Alle anzeigen",
    lessLabel: "Weniger anzeigen",
  },
);

const isOpen = ref(false);

const overflowsMobile = computed(
  () => props.collapsible && props.items.length > 3,
);
</script>

<template>
  <div class="wrap">
    <ul
      class="list"
      :data-density="density"
      :data-columns="columns"
      :data-collapsed="collapsible && !isOpen ? 'true' : null"
      role="list"
    >
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

    <button
      v-if="overflowsMobile"
      type="button"
      class="toggle"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? lessLabel : moreLabel }}
    </button>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

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

/* ── Progressive disclosure ───────────────────────
   Mobile (default): show items 1–3, hide the rest.
   Desktop:          show items 1–4, hide the rest. */
.list[data-collapsed="true"] .row:nth-child(n + 4) {
  display: none;
}

@media (--from-desktop) {
  .list[data-collapsed="true"] .row:nth-child(4) {
    display: grid;
  }
  .list[data-collapsed="true"] .row:nth-child(n + 5) {
    display: none;
  }
}

.row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  column-gap: var(--spacing-3);
  min-width: 0;
}

.icon {
  display: inline-grid;
  place-items: center;
  /* Optical alignment with first line of label text. */
  padding-block-start: 0.2em;
  color: var(--clr-content-secondary);
}

.text {
  min-width: 0;
}

.label {
  font-size: var(--fs-body-lg);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
  margin: 0;
  line-height: var(--lh-heading);
}

.desc {
  margin: var(--spacing-1) 0 0 0;
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
}

/* ── Toggle ─────────────────────────────────────── */
.toggle {
  all: unset;
  align-self: start;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding-block: var(--spacing-2);
  font-size: var(--fs-body);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
  transition: color 160ms ease;
}

.toggle::before {
  content: "+";
  display: inline-grid;
  place-items: center;
  width: 1.5em;
  height: 1.5em;
  border: 1px solid var(--clr-border-primary);
  border-radius: var(--radius-sm);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-regular);
  color: var(--clr-content-secondary);
  transition:
    color 160ms ease,
    border-color 160ms ease;
}

.toggle[aria-expanded="true"]::before {
  content: "−";
}

.toggle:hover {
  color: var(--clr-accent-secondary);
}

.toggle:hover::before {
  border-color: var(--clr-accent-secondary);
  color: var(--clr-accent-secondary);
}

.toggle:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
</style>
