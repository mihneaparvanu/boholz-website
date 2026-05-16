import { onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * Reactive `window.location.pathname` that updates after Astro view transitions.
 * Needed when a Vue island is `transition:persist`ed: Astro replaces the DOM
 * under it but the island doesn't re-render, so any path-derived prop becomes
 * stale. Listen for `astro:after-swap` and refresh the ref.
 */
export function usePathname(): Ref<string> {
  const pathname = ref(
    typeof window === "undefined" ? "/" : window.location.pathname,
  );

  const sync = () => {
    pathname.value = window.location.pathname;
  };

  onMounted(() => {
    sync();
    document.addEventListener("astro:after-swap", sync);
  });

  onUnmounted(() => {
    document.removeEventListener("astro:after-swap", sync);
  });

  return pathname;
}
