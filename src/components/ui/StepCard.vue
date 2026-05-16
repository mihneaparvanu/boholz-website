<script setup lang="ts">
import { computed } from "vue";
import { getIcon, type IconName } from "@/utils/icons";

const props = withDefaults(
  defineProps<{
    step: number;
    title: string;
    description?: string;
    /** Optional Lucide icon name shown in the card header. */
    icon?: IconName;
  }>(),
  {},
);

const IconComponent = computed(() =>
  props.icon ? getIcon(props.icon) : null,
);
</script>

<template>
  <article class="card">
    <header class="head">
      <span class="num" aria-hidden="true">{{
        String(step).padStart(2, "0")
      }}</span>
      <component
        v-if="IconComponent"
        :is="IconComponent"
        class="icon"
        :size="18"
        :stroke-width="1.75"
        aria-hidden="true"
      />
    </header>
    <h3 class="title">{{ title }}</h3>
    <p v-if="description" class="desc">{{ description }}</p>
    <div v-if="$slots.default" class="body"><slot /></div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  min-width: 0;
  height: 100%;
}

.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-2);
  margin-block-end: var(--spacing-1);
}

.num {
  font-family: var(--font-secondary);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--clr-content-tertiary);
  font-feature-settings: "tnum";
}

.icon {
  color: var(--clr-content-secondary);
}

.title {
  font-family: var(--font-primary);
  font-size: var(--fs-h5);
  font-weight: var(--font-weight-medium);
  line-height: var(--lh-heading);
  color: var(--clr-content-primary);
  letter-spacing: var(--ls-heading);
  margin: 0;
}

.desc {
  margin: 0;
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
}

.body {
  color: var(--clr-content-secondary);
}
</style>
