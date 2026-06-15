<script setup lang="ts">
import { inject, ref } from "vue";
import ConsentHeader from "./ConsentHeader.vue";
import ConsentButtons from "./ConsentButtons.vue";
import { CONSENT_PRESETS } from "./consent.zod.ts";
import { injectGTM, writeConsent } from "./consent.ts";
const noticeVisible = ref(true);
const props = defineProps<{
  gtmId: string;
}>();

function onChoose(preset: "all" | "middle" | "essential") {
  const consent = CONSENT_PRESETS[preset];
  writeConsent(consent);
  if (consent.analytics || consent.marketing) {
    injectGTM(props.gtmId);
  }
}
</script>

<template>
  <div v-if="noticeVisible" class="popup">
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
