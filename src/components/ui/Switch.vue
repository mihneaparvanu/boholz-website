<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from "reka-ui";
import { Check, X } from "lucide-vue-next";
import { useId } from "vue";

const checked = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    id?: string;
    disabled?: boolean;
  }>(),
  {},
);

const switchId = props.id ?? useId();
</script>

<template>
  <div class="switch-wrap">
    <SwitchRoot
      :id="switchId"
      :model-value="checked"
      @update:model-value="(v) => (checked = v)"
      :default-value="checked"
      :disabled="disabled"
      class="switch"
      :aria-label="label"
    >
      <span class="track-icon" aria-hidden="true">
        <X v-if="checked" :size="14" :stroke-width="2.5" />
        <Check v-else :size="14" :stroke-width="2.5" />
      </span>
      <SwitchThumb class="thumb">
        <Check v-if="checked" :size="14" :stroke-width="2.5" aria-hidden="true" />
        <X v-else :size="14" :stroke-width="2.5" aria-hidden="true" />
      </SwitchThumb>
    </SwitchRoot>
    <label v-if="label" :for="switchId" class="switch-label">{{ label }}</label>
  </div>
</template>

<style scoped>
.switch-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
}

.switch {
  --switch-h: var(--control-height-md);
  --switch-pad: 3px;
  --thumb-size: calc(var(--switch-h) - var(--switch-pad) * 2);

  all: unset;
  position: relative;
  display: inline-block;
  width: calc(var(--switch-h) * 1.85);
  height: var(--switch-h);
  background: var(--clr-border-quaternary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    background 200ms ease,
    box-shadow 160ms ease;
}

.switch[data-state="checked"] {
  background: var(--clr-accent-primary);
}

.switch[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-accent-primary) 30%, transparent);
}

.track-icon {
  position: absolute;
  top: 50%;
  display: grid;
  place-items: center;
  width: var(--thumb-size);
  height: var(--thumb-size);
  translate: 0 -50%;
  color: var(--clr-surface-primary);
  pointer-events: none;
}

.switch[data-state="checked"] .track-icon {
  left: var(--switch-pad);
}

.switch[data-state="unchecked"] .track-icon {
  right: var(--switch-pad);
  color: var(--clr-surface-primary);
}

.thumb {
  display: grid;
  place-items: center;
  width: var(--thumb-size);
  height: var(--thumb-size);
  background: var(--clr-surface-primary);
  border-radius: var(--radius-full);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  color: var(--clr-accent-primary);
  transition: translate 240ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: translate;
}

.switch[data-state="checked"] .thumb {
  translate: calc(var(--switch-h) * 0.85 - var(--switch-pad)) 0;
}

.switch[data-state="unchecked"] .thumb {
  translate: var(--switch-pad) 0;
  color: var(--clr-content-tertiary);
}

.switch-label {
  font-size: var(--fs-body);
  color: var(--clr-content-primary);
  cursor: pointer;
  user-select: none;
}

.switch[data-disabled] ~ .switch-label {
  cursor: not-allowed;
}
</style>
