<script setup lang="ts">
import { computed } from "vue";
import { useConsentBanner } from "./useConsentBanner";
import { CONSENT_PRESETS } from "./consent.zod";
const { consent, show } = useConsentBanner();

type PresetKey = keyof typeof CONSENT_PRESETS;

const activePreset = computed<PresetKey | null>(() => {
  const c = consent.value;
  if (!c) return null;
  if (c.analytics && c.marketing) return "all";
  if (c.analytics) return "middle";
  return "essential";
});

const DISPLAY = {
  all: { label: "Alle akzeptiert", tone: "ok" },
  middle: { label: "Statistik aktiv", tone: "ok" },
  essential: { label: "Statistik aktiv", tone: "warn" },
} as const satisfies Record<PresetKey, { label: string; tone: "ok" | "warn" }>;

const display = computed(() =>
  activePreset.value
    ? DISPLAY[activePreset.value]
    : { label: "Ihre Privatsphäre", tone: "neutral" as const },
);

withDefaults(
  defineProps<{
    size?: number | string;
  }>(),
  { size: 30 },
);
</script>

<template>
  <button @click="show" class="btn" :data-tone="display.tone">
    <span class="icon">
      <svg
        :width="size"
        :height="(Number(size) / 30) * 14"
        viewBox="0 0 30 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.2 0H7C3.1 0 0 3.1 0 7C0 10.9 3.1 14 7 14H22.2C26.1 14 29.2 10.9 29.2 7C29.2 3.1 26 0 22.2 0ZM1.2 7C1.2 3.8 3.8 1.2 7 1.2H16.9L13.8 12.8H7C3.8 12.8 1.2 10.2 1.2 7Z"
          fill="currentColor"
        />
        <path
          d="M24.2 4.0001C24.4 4.2001 24.4 4.6001 24.2 4.8001L22.1 7.0001L24.3 9.2001C24.5 9.4001 24.5 9.8001 24.3 10.0001C24.1 10.2001 23.7 10.2001 23.5 10.0001L21.3 7.8001L19.1 10.0001C18.9 10.2001 18.5 10.2001 18.3 10.0001C18.1 9.8001 18.1 9.4001 18.3 9.2001L20.4 7.0001L18.2 4.8001C18 4.6001 18 4.2001 18.2 4.0001C18.4 3.8001 18.8 3.8001 19 4.0001L21.2 6.2001L23.4 4.0001C23.6 3.8001 24 3.8001 24.2 4.0001Z"
          fill="var(--clr-surface-primary, #fff)"
        />
        <path
          d="M12.3 4.09995C12.5 4.29995 12.6 4.69995 12.4 4.89995L8.19998 9.79995C8.09998 9.89995 7.99998 9.99995 7.89998 9.99995C7.69998 10.1 7.39998 10.1 7.19998 9.89995L4.99998 7.69995C4.79998 7.49995 4.79998 7.09995 4.99998 6.89995C5.19998 6.69995 5.59998 6.69995 5.79998 6.89995L7.59998 8.59995L11.4 4.09995C11.6 3.89995 12 3.89995 12.3 4.09995Z"
          fill="currentColor"
        />
      </svg>
    </span>
    Ihre Privatsphäre-Einstellungen
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  font: inherit;

  .icon {
    display: inline-flex;
    vertical-align: middle;
  }
}

.btn[data-tone="neutral"] > .icon {
  color: var(--clr-accent-secondary);
}

.btn[data-tone="ok"] > .icon {
  color: var(--clr-accent-secondary);
}
.btn[data-tone="warn"] > .icon {
  color: var(--clr-status-warning);
}
</style>
