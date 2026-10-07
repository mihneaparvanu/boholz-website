<script setup lang="ts">
import { X } from "lucide-vue-next";

defineProps<{
  label: string;
}>();

defineEmits<{
  remove: [];
}>();
</script>

<template>
  <button
    class="filter-chip"
    type="button"
    @click="$emit('remove')"
    :aria-label="`Filter entfernen: ${label}`"
  >
    <span class="label">{{ label }}</span>
    <X :size="12" :stroke-width="2" aria-hidden="true" />
  </button>
</template>

<style scoped>
.filter-chip {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  min-height: var(--control-height-sm);
  max-width: 100%;
  padding-block: 2px;
  padding-inline: var(--spacing-2);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  background: color-mix(
    in srgb,
    var(--clr-accent-primary) 10%,
    var(--clr-surface-primary)
  );
  color: var(--clr-accent-secondary);
  font-size: var(--fs-body-sm);
  line-height: 1.2;
  cursor: pointer;
  /* Long labels ("Haustyp: Generationenhaus") wrap instead of being clipped. */
  white-space: normal;
  text-align: start;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.filter-chip:hover {
  background: color-mix(
    in srgb,
    var(--clr-accent-primary) 18%,
    var(--clr-surface-primary)
  );
}

.filter-chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.label {
  display: inline-block;
  min-width: 0;
  overflow-wrap: anywhere;
}

/* Keep the × from shrinking when the label wraps. */
.filter-chip svg {
  flex-shrink: 0;
}
</style>
