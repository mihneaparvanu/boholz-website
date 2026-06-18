<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import VueTurnstile from "vue-turnstile";
import {
  catalogContactSection,
  catalogConsentSection,
} from "./data/catalog.schema";
import { catalogSchema, emptyCatalogForm } from "./data/catalog.zod";
import { type FormField } from "./types/contact.types";
import { getMediaURL } from "@/lib/media";
import TextField from "./components/TextField.vue";
import RadioField from "./components/RadioField.vue";
import ConsentField from "./components/ConsentField.vue";

const state = reactive({ ...emptyCatalogForm });

const brochureUrl = getMediaURL("/pdf/boholz-hauskatalog.pdf");
const brochureCoverUrl = getMediaURL("/pdf/boholz-hauskatalog-cover.webp");

const turnstileToken = ref("");
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
const submitting = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);

const fieldComponents: Record<FormField["type"], unknown> = {
  text: TextField,
  email: TextField,
  tel: TextField,
  radio: RadioField,
  "checkbox-group": RadioField,
  consent: ConsentField,
};

const isValid = computed(() => catalogSchema.safeParse(state).success);

async function onSubmit() {
  submitError.value = null;
  submitting.value = true;

  try {
    const res = await fetch("/api/catalog", {
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
    <div class="group" :aria-labelledby="`section-${catalogContactSection.id}`">
      <h3 :id="`section-${catalogContactSection.id}`" class="heading">
        {{ catalogContactSection.heading }}
      </h3>
      <component
        v-for="f in catalogContactSection.fields"
        :key="f.name"
        :is="fieldComponents[f.type]"
        :field="f"
        v-model="state[f.name as keyof typeof state]"
      />
    </div>

    <div class="group">
      <component
        v-for="f in catalogConsentSection.fields"
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
      {{ submitting ? "Wird gesendet..." : "Katalog anfordern" }}
    </button>
  </form>

  <div v-else class="success" role="status">
    <h3>Vielen Dank!</h3>
    <p>
      Ihre Katalog-Anfrage ist bei uns eingegangen. Sie können den Hauskatalog
      direkt hier herunterladen — wir melden uns zudem persönlich bei Ihnen.
    </p>

    <img
      :src="brochureCoverUrl"
      alt="BoHolz Hauskatalog — Titelseite"
      class="cover"
      width="240"
      height="339"
      loading="lazy"
    />

    <a :href="brochureUrl" download class="download">
      Hauskatalog herunterladen (PDF)
    </a>
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

.cover {
  align-self: center;
  width: 240px;
  height: auto;
  margin-block: var(--spacing-3) var(--spacing-2);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 16px
    color-mix(in srgb, var(--clr-content-primary) 12%, transparent);
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

.download {
  align-self: flex-start;
  width: 100%;
  text-align: center;
  padding: var(--spacing-2) var(--spacing-3);
  margin-block-start: var(--spacing-2);
  background: var(--clr-accent-secondary);
  color: var(--clr-surface-primary);
  border-radius: var(--radius-sm);
  font: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 160ms ease,
    box-shadow 160ms ease,
    transform 80ms ease;
}

.download:hover {
  background: var(--clr-accent-primary);
}

.download:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 30%, transparent);
}

.download:active {
  transform: translateY(1px);
}
</style>
