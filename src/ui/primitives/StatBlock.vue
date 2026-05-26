<script setup lang="ts">
import { computed } from "vue";
import { getIcon, type IconName } from "@/lib/icons";

const props = withDefaults(
  defineProps<{
    /** The big number / value (string so units like "12 mo" work). */
    value: string;
    /** Short label below the value. */
    label: string;
    /** Optional caption further down (small explainer). */
    caption?: string;
    /** Optional Lucide icon name, e.g. 'leaf', 'award'. */
    icon?: IconName;
    align?: "start" | "center";
  }>(),
  {
    align: "start",
  },
);

const IconComponent = computed(() => (props.icon ? getIcon(props.icon) : null));
</script>

<template>
  <article class="stat" :data-align="align">
    <component
      v-if="IconComponent"
      :is="IconComponent"
      class="icon"
      :size="20"
      :stroke-width="1.75"
      aria-hidden="true"
    />
    <p class="value">{{ value }}</p>
    <p class="label">{{ label }}</p>
    <p v-if="caption" class="caption">{{ caption }}</p>
  </article>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  min-width: 0;
}

.stat[data-align="center"] {
  align-items: center;
  text-align: center;
}

.icon {
  /* Primary accent on the icon — a larger visual element per the project rule.
     Override per usage by setting `--stat-icon-color` on the parent. */
  color: var(--stat-icon-color, var(--clr-accent-primary));
  margin-block-end: var(--spacing-1);
}

.value {
  font-family: var(--font-primary);
  font-size: var(--fs-h2);
  font-weight: var(--font-weight-light);
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-heading);
  color: var(--clr-content-primary);
  font-variant-numeric: tabular-nums;
  margin: 0;
}

.label {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--clr-content-secondary);
  margin: 0;
}

.caption {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  margin: 0;
  margin-block-start: var(--spacing-1);
  line-height: var(--lh-body);
  max-width: 32ch;
}
</style>
