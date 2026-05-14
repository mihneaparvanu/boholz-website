<script setup lang="ts">
import { reactive } from "vue";
import { contactFormSections } from "./data/contact.schema";
import { type FormField } from "./types/contact.types";
import { emptyContactForm } from "./data/contact.zod";
import TextField from "./components/TextField.vue";
import RadioField from "./components/RadioField.vue";

const state = reactive({ ...emptyContactForm });

const fieldComponents: Record<FormField["type"], unknown> = {
  text: TextField,
  email: TextField,
  tel: TextField,
  radio: RadioField,
  "checkbox-group": RadioField,
  consent: RadioField,
};
</script>

<template>
  <form class="contact-form" novalidate>
    <section
      v-for="s in contactFormSections"
      :key="s.id"
      class="contact-form__section"
      :aria-labelledby="s.heading ? `section-${s.id}` : undefined"
    >
      <h3 v-if="s.heading" :id="`section-${s.id}`" class="contact-form__heading">
        {{ s.heading }}
      </h3>

      <component
        v-for="f in s.fields"
        :key="f.name"
        :is="fieldComponents[f.type]"
        :field="f"
        v-model="state[f.name]"
      />
    </section>

    <button type="submit" class="contact-form__submit">
      Jetzt Katalog anfordern
    </button>
  </form>
</template>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
  margin-block: var(--spacing-5);
}

.contact-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.contact-form__heading {
  font-size: var(--fs-h5);
  margin: 0;
  font-weight: 500;
  color: var(--clr-content-primary);
}

.contact-form__submit {
  height: var(--control-height-lg);
  padding-inline: var(--spacing-4);
  background: var(--clr-accent-primary);
  color: var(--clr-surface-primary);
  border: none;
  border-radius: var(--radius-sm);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 160ms ease,
    box-shadow 160ms ease;
}

.contact-form__submit:hover {
  background: var(--clr-accent-secondary);
}

.contact-form__submit:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-accent-primary) 30%, transparent);
}

.contact-form__submit:active {
  transform: translateY(1px);
}
</style>
