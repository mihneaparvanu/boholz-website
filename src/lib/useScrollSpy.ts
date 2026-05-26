import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

/**
 * Tracks which of a list of in-page section ids is currently "active" — the
 * one whose top has most recently crossed an activation line (positioned at
 * `topOffset` px below the viewport top to account for sticky chrome).
 *
 * Uses a single IntersectionObserver plus a passive scroll listener for
 * boundary precision. This is more robust than IO-visibility-ratio alone
 * for long sections that may span the entire viewport.
 *
 * Returns reactive `activeId`. Null only on first paint before mount; the
 * composable resolves to the first section id on mount.
 *
 * Performs no motion of its own. Consumers handle reduced-motion in CSS.
 */
export function useScrollSpy(
  ids: Ref<string[]>,
  options: { topOffset?: Ref<number> | number } = {},
): Ref<string | null> {
  const activeId = ref<string | null>(null);
  let observer: IntersectionObserver | null = null;
  let elements: HTMLElement[] = [];
  let onScroll: (() => void) | null = null;

  const getOffset = (): number => {
    const o = options.topOffset;
    if (o === undefined) return 0;
    return typeof o === "number" ? o : o.value;
  };

  const teardown = (): void => {
    observer?.disconnect();
    observer = null;
    elements = [];
    if (onScroll) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      onScroll = null;
    }
  };

  const setup = (): void => {
    teardown();
    const list = ids.value
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (list.length === 0) return;
    elements = list;

    const compute = (): void => {
      const offset = getOffset();
      // Activation line sits `offset` + a small fudge below viewport top.
      // The "active" section is the last one whose top is at-or-above it.
      let bestId: string | null = null;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 8) {
          bestId = el.id;
        } else {
          break;
        }
      }
      if (bestId === null && elements.length > 0) {
        bestId = elements[0].id;
      }
      // Snap to last when scrolled within 16px of document bottom — by then
      // the user clearly considers themselves in the final section.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 16;
      if (atBottom) {
        bestId = elements[elements.length - 1].id;
      }
      if (bestId !== activeId.value) {
        activeId.value = bestId;
      }
    };

    observer = new IntersectionObserver(compute, {
      rootMargin: `-${getOffset() + 8}px 0px -40% 0px`,
      threshold: [0, 0.01, 0.5, 1],
    });
    for (const el of elements) observer.observe(el);

    onScroll = compute;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    compute();
  };

  onMounted(() => {
    setup();
  });

  watch(
    ids,
    () => {
      if (typeof window !== "undefined") setup();
    },
    { deep: true },
  );

  onBeforeUnmount(() => {
    teardown();
  });

  return activeId;
}
