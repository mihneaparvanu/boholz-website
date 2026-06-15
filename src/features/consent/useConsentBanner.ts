import { ref } from "vue";
import type { ConsentV1 } from "./consent.zod";

const open = ref(false);
const consent = ref<ConsentV1 | null>(null);

export function useConsentBanner() {
  return {
    open,
    consent,
    show: () => (open.value = true),
    hide: () => (open.value = false),
    setConsent: (c: ConsentV1) => (consent.value = c),
  };
}
