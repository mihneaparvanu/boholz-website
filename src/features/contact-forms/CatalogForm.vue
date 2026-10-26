<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import VueTurnstile from "vue-turnstile";
import {
  catalogContactSection,
  catalogConsentSection,
} from "./data/catalog.schema";
import { catalogSchema, emptyCatalogForm } from "./data/catalog.zod";
import { type FormField } from "./types/contact.types";
import TextField from "./components/TextField.vue";
import RadioField from "./components/RadioField.vue";
import ConsentField from "./components/ConsentField.vue";

const props = defineProps<{
  /** Which pair of PDFs the lead gets. "bestseller" swaps the Hauskatalog
      for the Kurzkatalog on the Bestseller landing; default pair applies
      elsewhere (home, other landings, /katalog). */
  variant?: "default" | "bestseller";
}>();

const state = reactive({ ...emptyCatalogForm });

// The form's reward for the lead's data is the Infopaket: Imagebroschüre,
// catalog (Hauskatalog, or Kurzkatalog on the bestseller landing).
// NOTE: absolute CDN URLs on purpose — this is a client-hydrated island and
// `getMediaURL()` resolves to an empty base in the browser bundle (PUBLIC_
// vars aren't inlined at build), which would 404. The media host is stable.
// Version query busts Cloudflare's edge cache (max-age 30d) on PDF swaps.
const ASSETS = "https://boholz-haus.de/m";

type Download = { label: string; url: string; coverUrl: string; alt: string };

const IMAGEBROSCHUERE: Download = {
  label: "Imagebroschüre",
  url: `${ASSETS}/pdf/boholz-imagebroschuere-2026-10b.pdf?v=2026-10b`,
  coverUrl: `${ASSETS}/images/landing/imagebroschuere-2026-10b-cover.webp`,
  alt: "BoHolz Imagebroschüre — Titelseite",
};
const HAUSKATALOG: Download = {
  label: "Hauskatalog",
  url: `${ASSETS}/pdf/boholz-hauskatalog-2026-10.pdf?v=2026-10`,
  coverUrl: `${ASSETS}/images/landing/hauskatalog-2026-10-cover.webp`,
  alt: "BoHolz Hauskatalog — Titelseite",
};
const KURZKATALOG: Download = {
  label: "Bestseller-Katalog",
  url: `${ASSETS}/pdf/boholz-kurzkatalog-2026-10.pdf?v=2026-10`,
  coverUrl: `${ASSETS}/images/landing/kurzkatalog-2026-10-cover.webp`,
  alt: "BoHolz Bestseller-Katalog — Titelseite",
};

const downloads = computed<Download[]>(() => [
  IMAGEBROSCHUERE,
  HAUSKATALOG,
  KURZKATALOG,
]);
// German enumeration: "A, B und C" — comma-separated, "und" before the last,
// no comma before "und".
const joinDe = (items: string[]) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} und ${items.at(-1)}`;
const downloadsLabelUnd = computed(() =>
  joinDe(downloads.value.map((d) => d.label)),
);

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
      window.dataLayer?.push({ event: "generate_lead", form_type: "katalog" });
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
      <span v-if="!submitting" class="cover-stack cover-stack--sm" aria-hidden="true">
        <img
          v-for="d in downloads"
          :key="d.url"
          :src="d.coverUrl"
          alt=""
          loading="lazy"
        />
      </span>
      <span>{{
        submitting ? "Wird gesendet..." : "Infopaket anfordern"
      }}</span>
    </button>
  </form>

  <div v-else class="success" role="status">
    <h3>Vielen Dank!</h3>
    <p>
      Ihre Anfrage ist bei uns eingegangen. Sie können {{ downloadsLabelUnd }}
      direkt hier herunterladen — wir melden uns zudem persönlich bei Ihnen.
    </p>

    <span class="cover-stack cover-stack--lg" aria-hidden="true">
      <img
        v-for="d in downloads"
        :key="d.url"
        :src="d.coverUrl"
        :alt="d.alt"
        loading="lazy"
      />
    </span>

    <div class="downloads">
      <a
        v-for="d in downloads"
        :key="d.url"
        :href="d.url"
        download
        class="download"
      >
        {{ d.label }} herunterladen (PDF)
      </a>
    </div>
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

/* ── Cover stack — two book-cover thumbs, slightly tilted toward each other,
   close together with a shared drop shadow + rounded corners. --sm sits
   inside the submit button; --lg appears on the success screen. */
.cover-stack {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding-block: 2px; /* breathing room so rotation never clips */
}
.cover-stack img {
  display: block;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
  object-fit: cover;
  transition: transform 180ms ease;
}
.cover-stack img:first-child {
  transform: rotate(-8deg);
  margin-inline-end: -14px;
  z-index: 1;
}
.cover-stack img:nth-child(2) {
  transform: rotate(0deg);
  margin-inline-end: -14px;
  z-index: 2;
}
.cover-stack img:nth-child(3) {
  transform: rotate(8deg);
  z-index: 3;
}
/* button-sized fan of three (fits beside the "Infopaket anfordern" label) */
.cover-stack--sm img {
  height: 54px;
  width: auto;
}
/* success-screen fan (hero-sized) */
.cover-stack--lg {
  align-self: center;
  margin-block: var(--spacing-3) var(--spacing-2);
}
.cover-stack--lg img {
  height: 200px;
  width: auto;
  border-color: var(--clr-border-secondary);
  box-shadow: 0 8px 24px
    color-mix(in srgb, var(--clr-content-primary) 18%, transparent);
}

/* Download links stacked under the success covers. */
.downloads {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
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
  width: 100%;
  text-align: center;
  padding: var(--spacing-2) var(--spacing-3);
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
