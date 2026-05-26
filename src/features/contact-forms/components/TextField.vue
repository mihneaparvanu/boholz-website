<script setup lang="ts">
import { type TextField } from "@/features/contact-forms/types/contact.types";
import "@/ui/style/form.css";
defineProps<{ field: TextField }>();
const model = defineModel<string>();
</script>

<template>
  <div class="field">
    <label :for="field.name">
      {{ field.label }}
      <span v-if="field.required" aria-hidden="true" class="required">*</span>
    </label>
    <input
      :id="field.name"
      :type="field.type"
      :name="field.name"
      :required="field.required"
      :placeholder="field.placeholder"
      :autocomplete="field.autocomplete"
      :aria-required="field.required"
      v-model="model"
    />
  </div>
</template>

<style scoped>
.required {
  color: var(--clr-accent-primary);
  margin-inline-start: var(--spacing-0);
}
</style>
