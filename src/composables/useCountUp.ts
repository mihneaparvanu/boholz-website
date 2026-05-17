import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";

/**
 * Parse a value string into a numeric target + suffix.
 * "100%" → { target: 100, suffix: "%" }
 * "18"   → { target: 18,  suffix: "" }
 * "n/a"  → null (caller renders the string as-is, no animation).
 */
export function parseCountTarget(
  raw: string,
): { target: number; suffix: string } | null {
  const match = raw.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const target = Number(match[1].replace(",", "."));
  if (!Number.isFinite(target)) return null;
  return { target, suffix: match[2] };
}

interface UseCountUpOptions {
  /** Animation duration in ms. */
  duration?: number;
  /** IntersectionObserver threshold (0–1). */
  threshold?: number;
}

interface UseCountUpResult {
  /** Attach to the element that should trigger the count when in view. */
  targetEl: Ref<HTMLElement | null>;
  /** Integer value to render each frame (rounded). */
  display: Ref<number>;
}

/**
 * Count from 0 → `to` once, when the watched element scrolls into view.
 * - Uses `requestAnimationFrame` and an `easeOutExpo` curve (precise, no bounce).
 * - Respects `prefers-reduced-motion: reduce` — snaps to the final value.
 * - Fires exactly once; observer disconnects after triggering.
 */
export function useCountUp(
  to: number,
  options: UseCountUpOptions = {},
): UseCountUpResult {
  const { duration = 1600, threshold = 0.3 } = options;

  const targetEl = ref<HTMLElement | null>(null);
  const display = ref(0);

  let rafId: number | null = null;
  let observer: IntersectionObserver | null = null;
  let started = false;

  // easeOutExpo — decelerates hard then settles. Reads as confident, not flashy.
  const ease = (t: number): number =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  function run() {
    if (started) return;
    started = true;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      display.value = to;
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      display.value = Math.round(ease(t) * to);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(tick);
  }

  onMounted(() => {
    const el = targetEl.value;
    if (!el || typeof IntersectionObserver === "undefined") {
      // SSR / unsupported — show the final value.
      display.value = to;
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer?.disconnect();
            observer = null;
            break;
          }
        }
      },
      { threshold },
    );
    observer.observe(el);
  });

  onBeforeUnmount(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    observer?.disconnect();
  });

  return { targetEl, display };
}
