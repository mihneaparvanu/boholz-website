<script setup lang="ts">
defineProps<{
  title: string;
  selected?: boolean;
}>();
</script>

<template>
  <button
    class="chip"
    type="button"
    :data-selected="selected ? '' : undefined"
    :aria-pressed="selected ? 'true' : 'false'"
  >
    {{ title }}
  </button>
</template>

<style scoped>
.chip {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--control-height-sm);
  min-width: var(--control-height-sm);
  padding-inline: var(--spacing-2);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-md);
  background: var(--clr-surface-primary);
  color: var(--clr-content-primary);
  font: inherit;
  font-size: var(--fs-body-sm);
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.chip:hover {
  border-color: var(--clr-border-tertiary);
  background: color-mix(
    in srgb,
    var(--clr-accent-primary) 4%,
    var(--clr-surface-primary)
  );
}

.chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.chip[data-selected] {
  background: var(--clr-accent-primary);
  border-color: var(--clr-accent-primary);
  color: var(--clr-surface-primary);
}

.chip[data-selected]:hover {
  background: var(--clr-accent-secondary);
  border-color: var(--clr-accent-secondary);
}
</style>
