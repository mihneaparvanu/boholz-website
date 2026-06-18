<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import VueTurnstile from "vue-turnstile";
import { contactFormSections } from "./data/contact.schema";
import { type FormField } from "./types/contact.types";
import { contactSchema, emptyContactForm } from "./data/contact.zod";
import TextField from "./components/TextField.vue";
import RadioField from "./components/RadioField.vue";
import ConsentField from "./components/ConsentField.vue";

const state = reactive({ ...emptyContactForm });

const turnstileToken = ref("");
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
const submitting = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);

const isValid = computed(() => contactSchema.safeParse(state).success);

const fieldComponents: Record<FormField["type"], unknown> = {
  text: TextField,
  email: TextField,
  tel: TextField,
  radio: RadioField,
  "checkbox-group": RadioField,
  consent: ConsentField,
};

async function onSubmit() {
  submitError.value = null;
  submitting.value = true;

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...state,
        turnstileToken: turnstileToken.value,
      }),
    });

    if (res.ok) {
      submitSuccess.value = true;
      return;
    }

    submitError.value =
      res.status === 422
        ? "Bitte überprüfen Sie Ihre Eingaben."
        : res.status === 403
          ? "Sicherheitsprüfung fehlgeschlagen. Bitte laden Sie die Seite neu."
          : "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
  } catch {
    submitError.value =
      "Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form v-if="!submitSuccess" novalidate @submit.prevent="onSubmit">
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
        v-model="state[f.name as keyof typeof state]"
      />
    </div>

    <VueTurnstile
      v-model="turnstileToken"
      :site-key="SITE_KEY"
      theme="light"
      language="de"
      size="flexible"
    />

    <p v-if="submitError" class="error" role="alert">{{ submitError }}</p>

    <button
      type="submit"
      class="submit"
      :disabled="!turnstileToken || !isValid || submitting"
    >
      {{ submitting ? "Wird gesendet..." : "Anfrage senden" }}
    </button>
  </form>

  <div v-else class="success" role="status">
    <h3>Vielen Dank!</h3>
    <p>
      Wir haben Ihre Anfrage erhalten und melden uns in Kürze. Den Hauskatalog
      können Sie auf unserer Katalog-Seite anfordern.
    </p>
  </div>
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

.error {
  color: var(--clr-status-warning);
  font-size: var(--fs-body-sm);
  margin: 0;
}

.success {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: color-mix(in srgb, var(--clr-accent-secondary) 10%, transparent);
  border-radius: var(--radius-sm);
}

.submit {
  align-self: flex-start;
  padding: var(--spacing-2) var(--spacing-3);
  margin-block-start: var(--spacing-2);
  background: var(--clr-accent-secondary);
  color: var(--clr-surface-primary);
  border: none;
  border-radius: var(--radius-sm);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition:
    background 160ms ease,
    box-shadow 160ms ease,
    transform 80ms ease;
}

.submit:hover {
  background: var(--clr-accent-primary);
}

.submit:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 30%, transparent);
}

.submit:active {
  transform: translateY(1px);
}

.submit:disabled {
  background: var(--clr-border-secondary);
  color: var(--clr-content-tertiary);
  cursor: not-allowed;
}

.submit:disabled:hover {
  background: var(--clr-border-secondary);
}
</style>
