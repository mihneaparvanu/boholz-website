<script setup lang="ts">
import { type ConsentField } from "@/features/ContactForms/types/contact.types";
import "@/style/form.css";
defineProps<{ field: ConsentField }>();
const model = defineModel<boolean>();
</script>

<template>
  <label class="consent" :data-checked="model === true">
    <input
      type="checkbox"
      :id="field.name"
      :name="field.name"
      :required="field.required"
      :aria-required="field.required"
      v-model="model"
    />
    <span>
      {{ field.label }}
      <span v-if="field.required" aria-hidden="true" class="required">*</span>
    </span>
  </label>
</template>

<style scoped>
.consent {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-1);
  color: var(--clr-content-secondary);
  cursor: pointer;
  font-size: var(--fs-body-sm);
  line-height: var(--lh-body);
}

.required {
  color: var(--clr-accent-primary);
  margin-inline-start: var(--spacing-0);
}

input {
  appearance: none;
  margin: 0;
  flex-shrink: 0;
  width: var(--sz-md);
  height: var(--sz-md);
  border: 1px solid var(--clr-border-quaternary);
  border-radius: var(--radius-sm);
  background: var(--clr-surface-primary);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
  margin-block-start: 0.15em;
}

input::before {
  content: "";
  width: 40%;
  height: 40%;
  border-radius: var(--radius-full);
  transform: scale(0);
  transition: transform 140ms ease;
}

input:checked {
  border-color: var(--clr-accent-primary);
  background: var(--clr-accent-primary);
}

input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 22%, transparent);
}

.consent:hover input:not(:checked) {
  border-color: var(--clr-border-quaternary);
}
</style>
