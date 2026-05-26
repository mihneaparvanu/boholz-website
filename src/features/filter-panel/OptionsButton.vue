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
  /* Border-less chip — the chip itself is the only interactive token here,
     so we lean on subtle background tinting (resting → hover → selected)
     instead of a hairline outline. The previous variant read as "a button
     inside a container", which is the look the design pass wanted gone. */
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--control-height-md);
  min-width: var(--control-height-md);
  padding-inline: var(--spacing-3);
  border-radius: var(--radius-full);
  background: var(--clr-surface-secondary);
  color: var(--clr-content-secondary);
  font: inherit;
  font-size: var(--fs-body-sm);
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.chip:hover {
  background: color-mix(
    in srgb,
    var(--clr-accent-primary) 10%,
    var(--clr-surface-secondary)
  );
  color: var(--clr-content-primary);
}

.chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.chip[data-selected] {
  background: var(--clr-accent-primary);
  color: var(--clr-pure-white);
}

.chip[data-selected]:hover {
  background: var(--clr-accent-secondary);
}
</style>
