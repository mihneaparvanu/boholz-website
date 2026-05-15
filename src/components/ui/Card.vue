<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Component } from "vue";
import {
  useTransition,
  useIntersectionObserver,
  TransitionPresets,
} from "@vueuse/core";

const props = defineProps<{
  title: string;
  value?: string | number;
  icon?: Component;
}>();

const isNumeric = computed(() => typeof props.value === "number");

// Source ref the transition tracks. Starts at 0; bumped to target when in view.
const source = ref(0);
const output = useTransition(source, {
  duration: 1600,
  transition: TransitionPresets.easeOutCubic,
});

// Display string: animated number when numeric, otherwise raw value.
const displayValue = computed(() =>
  isNumeric.value ? Math.round(output.value).toString() : (props.value ?? ""),
);

// Trigger when the card scrolls into view (once).
const cardEl = ref<HTMLElement | null>(null);
const { stop } = useIntersectionObserver(
  cardEl,
  ([entry]) => {
    if (!entry?.isIntersecting) return;
    if (isNumeric.value) source.value = props.value as number;
    stop();
  },
  { threshold: 0.4 },
);

// If the prop value changes after the first reveal, keep the animation honest.
watch(
  () => props.value,
  (v) => {
    if (typeof v === "number" && source.value !== 0) source.value = v;
  },
);
</script>

<template>
  <article ref="cardEl" class="card">
    <component v-if="icon" :is="icon" class="card-icon" aria-hidden="true" />
    <span v-if="value !== undefined" class="card-value">{{
      displayValue
    }}</span>
    <h4 class="card-title">{{ title }}</h4>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: var(--clr-surface-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--clr-border-secondary);
  min-width: 0;
}

.card-icon {
  width: var(--sz-2xl);
  height: var(--sz-2xl);
  color: var(--clr-accent-primary);
}

.card-value {
  font-family: var(--font-secondary);
  font-size: var(--fs-h1);
  line-height: var(--lh-tight);
  color: var(--clr-content-primary);
}

.card-title {
  font-size: var(--fs-h6);
  color: var(--clr-content-secondary);
  font-weight: 400;
}
</style>
