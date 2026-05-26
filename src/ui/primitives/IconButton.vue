<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    href?: string;
    selected?: boolean;
    ariaLabel?: string;
  }>(),
  {},
);
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : 'button'"
    :href="href"
    class="icon-btn"
    :data-selected="selected"
    :aria-label="ariaLabel ?? label"
    :aria-pressed="selected"
  >
    <span class="icon-btn-icon">
      <slot name="icon" />
    </span>
    <span class="icon-btn-label">{{ label }}</span>
  </component>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-0);
  padding: var(--spacing-2) var(--spacing-3);
  min-width: calc(var(--control-height-lg) + var(--spacing-2));
  background: var(--clr-surface-secondary);
  color: var(--clr-content-secondary);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.icon-btn:hover {
  background: var(--clr-surface-primary);
  color: var(--clr-content-primary);
  border-color: var(--clr-border-secondary);
}

.icon-btn[data-selected="true"] {
  background: color-mix(in srgb, var(--clr-accent-primary) 8%, var(--clr-surface-primary));
  border-color: var(--clr-accent-primary);
  color: var(--clr-accent-secondary);
}

.icon-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-accent-primary) 22%, transparent);
}

.icon-btn-icon {
  display: grid;
  place-items: center;
  width: var(--fs-h5);
  height: var(--fs-h5);
}

.icon-btn-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke-width: 1.5;
}

.icon-btn-label {
  font-size: var(--fs-body-sm);
  font-weight: 400;
  line-height: var(--lh-tight);
}
</style>
