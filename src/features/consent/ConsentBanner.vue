<script setup lang="ts">
import ConsentHeader from "./ConsentHeader.vue";
import ConsentButtons from "./ConsentButtons.vue";
import { CONSENT_PRESETS } from "./consent.zod";
import { injectGTM, writeConsent } from "./consent";
import { useConsentBanner } from "./useConsentBanner";

const props = defineProps<{
  gtmId: string;
  initialOpen: boolean;
}>();

const { open, hide, setConsent } = useConsentBanner();
open.value = props.initialOpen;

function onChoose(preset: "all" | "middle" | "essential") {
  const consent = CONSENT_PRESETS[preset];
  writeConsent(consent);
  setConsent(consent);
  if (consent.analytics || consent.marketing) {
    injectGTM(props.gtmId);
  }
  hide();
}
</script>

<template>
  <div v-if="open" class="popup">
    <ConsentHeader />
    <ConsentButtons @choose="onChoose" />
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  inset-inline: var(--spacing-3);
  bottom: var(--spacing-3);
  max-width: 55%;
  margin-inline: auto;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 10;

  @media (--below-desktop) {
    max-width: none;
  }
}
</style>
