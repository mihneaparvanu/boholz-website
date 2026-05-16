<script setup lang="ts">
type Variant = "primary" | "secondary" | "tertiary" | "ghost";
type Size = "sm" | "md" | "lg";

withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    href?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    variant: "primary",
    size: "md",
    type: "button",
  },
);
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : type"
    :href="href"
    :disabled="!href && disabled ? true : undefined"
    :aria-disabled="href && disabled ? 'true' : undefined"
    :aria-label="ariaLabel"
    class="btn"
    :data-variant="variant"
    :data-size="size"
  >
    <span v-if="$slots.leading" class="btn-icon"><slot name="leading" /></span>
    <span class="btn-label"><slot /></span>
    <span v-if="$slots.trailing" class="btn-icon"
      ><slot name="trailing"
    /></span>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  transition:
    background 160ms ease,
    color 300ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 80ms ease;
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.btn:active:not([disabled], [aria-disabled="true"]) {
  transform: translateY(1px);
}

.btn[disabled],
.btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-label {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

/* ── Sizes ─────────────────────────────────────────
   Use min-height for the tap-target floor, and padding-block for the
   visual breathing room. This way the button breathes properly when
   font-size grows (mobile uses larger fs-body relative to its viewport)
   and never feels squashed. min-height stays as the floor for short
   labels. */
.btn[data-size="sm"] {
  min-height: var(--control-height-sm);
  padding-block: var(--spacing-1);
  padding-inline: var(--spacing-2);
  font-size: var(--fs-body-sm);
  border-radius: var(--radius-sm);
  gap: var(--spacing-1);
}

.btn[data-size="md"] {
  min-height: var(--control-height-md);
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-3);
  font-size: var(--fs-body);
  border-radius: var(--radius-md);
}

.btn[data-size="lg"] {
  min-height: var(--control-height-lg);
  padding-block: var(--spacing-3);
  padding-inline: var(--spacing-4);
  font-size: var(--fs-body-lg);
  border-radius: var(--radius-lg);
  gap: var(--spacing-3);
}

/* Mobile: bump padding-block one step per size so the label has real
   breathing room. We also drop the min-height floors — padding alone now
   pushes every size above the 44px tap target, and keeping min-height was
   pinning short labels to the top/bottom of the box (the "squashed" look). */
@media (--mobile) {
  .btn[data-size="sm"] {
    min-height: 0;
    padding-block: var(--spacing-2);
    padding-inline: var(--spacing-3);
  }
  .btn[data-size="md"] {
    min-height: 0;
    padding-block: var(--spacing-3);
    padding-inline: var(--spacing-4);
  }
  .btn[data-size="lg"] {
    min-height: 0;
    padding-block: var(--spacing-4);
    padding-inline: var(--spacing-5);
  }
}

/* ── Variants ────────────────────────────────────── */
.btn[data-variant="primary"] {
  background: var(--clr-accent-primary);
  color: var(--clr-surface-primary);
  border-color: var(--clr-accent-primary);
}
.btn[data-variant="primary"]:hover:not([disabled], [aria-disabled="true"]) {
  background: var(--clr-accent-secondary);
  border-color: var(--clr-accent-secondary);
}

.btn[data-variant="secondary"] {
  background: var(--clr-surface-primary);
  color: var(--clr-accent-primary);
  border-color: var(--clr-border-secondary);
}
.btn[data-variant="secondary"]:hover:not([disabled], [aria-disabled="true"]) {
  color: var(--clr-accent-secondary);
  border-color: var(--clr-accent-secondary);
}

.btn[data-variant="tertiary"] {
  background: var(--clr-surface-primary);
  color: var(--clr-content-secondary);
  border-color: var(--clr-border-secondary);
}
.btn[data-variant="tertiary"]:hover:not([disabled], [aria-disabled="true"]) {
  color: var(--clr-accent-secondary);
  border-color: var(--clr-accent-secondary);
}

.btn[data-variant="ghost"] {
  background: transparent;
  color: var(--clr-accent-primary);
  border-color: transparent;
}
.btn[data-variant="ghost"]:hover:not([disabled], [aria-disabled="true"]) {
  color: var(--clr-accent-secondary);
  background: color-mix(in srgb, var(--clr-accent-primary) 8%, transparent);
}
</style>
