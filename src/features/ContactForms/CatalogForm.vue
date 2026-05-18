<script setup lang="ts">
import { reactive, computed } from "vue";
import {
  catalogContactSection,
  catalogVersandSection,
  catalogPostalSection,
  catalogConsentSection,
} from "./data/catalog.schema";
import { emptyCatalogForm } from "./data/catalog.zod";
import { type FormField } from "./types/contact.types";
import TextField from "./components/TextField.vue";
import RadioField from "./components/RadioField.vue";
import ConsentField from "./components/ConsentField.vue";

const state = reactive({ ...emptyCatalogForm });

const fieldComponents: Record<FormField["type"], unknown> = {
  text: TextField,
  email: TextField,
  tel: TextField,
  radio: RadioField,
  "checkbox-group": RadioField,
  consent: ConsentField,
};

const wantsPostal = computed(() => state.versandart === "post");
</script>

<template>
  <form novalidate>
    <!-- Kontaktdaten -->
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

    <!-- Versandart -->
    <div class="group" :aria-labelledby="`section-${catalogVersandSection.id}`">
      <h3 :id="`section-${catalogVersandSection.id}`" class="heading">
        {{ catalogVersandSection.heading }}
      </h3>
      <component
        v-for="f in catalogVersandSection.fields"
        :key="f.name"
        :is="fieldComponents[f.type]"
        :field="f"
        v-model="state[f.name as keyof typeof state]"
      />
    </div>

    <!-- Postanschrift — revealed only when Postversand is chosen.
         Minimal v-if; Zod schema only validates address fields when
         versandart === "post". -->
    <div
      v-if="wantsPostal"
      class="group postal"
      :aria-labelledby="`section-${catalogPostalSection.id}`"
    >
      <h3 :id="`section-${catalogPostalSection.id}`" class="heading">
        {{ catalogPostalSection.heading }}
      </h3>
      <component
        v-for="f in catalogPostalSection.fields"
        :key="f.name"
        :is="fieldComponents[f.type]"
        :field="f"
        v-model="state[f.name as keyof typeof state]"
      />
    </div>

    <!-- Einwilligung -->
    <div class="group">
      <component
        v-for="f in catalogConsentSection.fields"
        :key="f.name"
        :is="fieldComponents[f.type]"
        :field="f"
        v-model="state[f.name as keyof typeof state]"
      />
    </div>

    <button type="submit" class="submit">Katalog anfordern</button>
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

/* Postal reveal: subtle entry so the new block doesn't snap in.
   Just opacity + a small offset — height animations on auto are
   what we always avoid. */
.postal {
  animation: postal-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes postal-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .postal {
    animation: none;
  }
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
