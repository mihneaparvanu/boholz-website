<script setup lang="ts">
import "@/style/form.css";
import type { RadioField } from "@/features/ContactForms/types/contact.types";
defineProps<{
  field: RadioField;
}>();
const model = defineModel<string>();
</script>

<template>
  <fieldset class="field">
    <legend>
      {{ field.label }}
      <span v-if="field.required" aria-hidden="true" class="required">*</span>
    </legend>
    <div class="radio-btns" role="radiogroup" :aria-required="field.required">
      <label
        v-for="opt in field.options"
        :key="opt.value"
        class="radio-btn"
        :data-checked="model === opt.value"
      >
        <input
          type="radio"
          :name="field.name"
          :value="opt.value"
          :required="field.required"
          v-model="model"
        />
        <span>{{ opt.label }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.required {
  color: var(--clr-accent-primary);
  margin-inline-start: var(--spacing-0);
}

.radio-btns {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
}

.radio-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-2);
  min-height: var(--control-height-md);
  border: 1px solid var(--clr-border-tertiary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--clr-content-secondary);
  background: var(--clr-surface-primary);
  width: 100%;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.radio-btn:hover {
  border-color: var(--clr-border-quaternary);
  color: var(--clr-content-primary);
}

.radio-btn[data-checked="true"] {
  border-color: var(--clr-accent-primary);
  background: color-mix(in srgb, var(--clr-accent-primary) 6%, var(--clr-surface-primary));
  color: var(--clr-content-primary);
}

.radio-btn:has(input:focus-visible) {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-accent-primary) 22%, transparent);
  border-color: var(--clr-accent-primary);
}

.radio-btn input {
  appearance: none;
  margin: 0;
  width: var(--sz-md);
  height: var(--sz-md);
  border: 1px solid var(--clr-border-quaternary);
  border-radius: var(--radius-full);
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.radio-btn input::before {
  content: "";
  width: 50%;
  height: 50%;
  border-radius: var(--radius-full);
  background: var(--clr-accent-primary);
  transform: scale(0);
  transition: transform 140ms ease;
}

.radio-btn input:checked {
  border-color: var(--clr-accent-primary);
}

.radio-btn input:checked::before {
  transform: scale(1);
}

@media (--from-desktop) {
  .radio-btn {
    width: fit-content;
  }
}
</style>
