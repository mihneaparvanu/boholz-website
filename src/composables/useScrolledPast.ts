import { computed, type ComputedRef } from "vue";
import { useWindowScroll } from "@vueuse/core";

/**
 * Reactive boolean: has the window been scrolled past `threshold` px from the top?
 * Wraps @vueuse/core's `useWindowScroll`. Use it to flip a UI mode based on
 * vertical scroll position — e.g. transparent → solid navbar past a hero.
 */
export function useScrolledPast(threshold: number): ComputedRef<boolean> {
  const { y } = useWindowScroll();
  return computed(() => y.value > threshold);
}
