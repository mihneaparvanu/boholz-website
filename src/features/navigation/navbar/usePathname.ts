import { onMounted, ref, type Ref } from 'vue';

/**
 * Reactive `window.location.pathname`. Resolves on mount on the client and
 * stays stable for the lifetime of the page — each navigation is a full
 * reload (MPA), so the island re-mounts and reads a fresh value.
 */
export function usePathname(): Ref<string> {
  const pathname = ref(
    typeof window === "undefined" ? "/" : window.location.pathname,
  );

  onMounted(() => {
    pathname.value = window.location.pathname;
  });

  return pathname;
}
