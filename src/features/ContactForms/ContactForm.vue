<script setup lang="ts">
import { reactive } from "vue";
import { contactFormSections } from "./data/contact.schema";
import { type FormField } from "./types/contact.types";
import { emptyContactForm } from "./data/contact.zod";
import TextField from "./components/TextField.vue";
import RadioField from "./components/RadioField.vue";
import ConsentField from "./components/ConsentField.vue";

const state = reactive({ ...emptyContactForm });

const fieldComponents: Record<FormField["type"], unknown> = {
  text: TextField,
  email: TextField,
  tel: TextField,
  radio: RadioField,
  "checkbox-group": RadioField,
  consent: ConsentField,
};
</script>

<template>
  <form novalidate>
    <div
      v-for="s in contactFormSections"
      :key="s.id"
      class="group"
      :aria-labelledby="s.heading ? `section-${s.id}` : undefined"
    >
      <h3 v-if="s.heading" :id="`section-${s.id}`" class="heading">
        {{ s.heading }}
      </h3>

      <component
        v-for="f in s.fields"
        :key="f.name"
        :is="fieldComponents[f.type]"
        :field="f"
        v-model="state[f.name]"
      />
    </div>

    <button type="submit" class="submit">Jetzt Katalog anfordern</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.heading {
  font-size: var(--fs-h5);
  margin: 0;
  font-weight: 500;
  color: var(--clr-content-primary);
}

.submit {
  align-self: flex-start;
  height: var(--control-height-md);
  padding-inline: var(--spacing-3);
  margin-block-start: var(--spacing-1);
  background: var(--clr-accent-primary);
  color: var(--clr-surface-primary);
  border: none;
  border-radius: var(--radius-sm);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 160ms ease,
    box-shadow 160ms ease,
    transform 80ms ease;
}

.submit:hover {
  background: var(--clr-accent-secondary);
}

.submit:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 30%, transparent);
}

.submit:active {
  transform: translateY(1px);
}
</style>
