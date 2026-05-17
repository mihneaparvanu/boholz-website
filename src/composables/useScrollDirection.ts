import { onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * Reactive scroll direction. `'up'` on initial paint and at the very top of
 * the document; flips to `'down'` once the user has scrolled past `threshold`
 * pixels downward without an intervening upward scroll. Designed for hiding
 * a sticky navbar on scroll down and revealing it on scroll up.
 *
 * Uses passive listener + rAF coalescing; ignores micro-scrolls under
 * `minDelta` to avoid jitter from iOS rubber-banding or trackpad noise.
 */
export function useScrollDirection(
  options: { threshold?: number; minDelta?: number } = {},
): Ref<"up" | "down"> {
  const { threshold = 64, minDelta = 6 } = options;
  const direction = ref<"up" | "down">("up");

  let lastY = 0;
  let ticking = false;
  let frame = 0;

  const update = (): void => {
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) >= minDelta) {
      if (delta > 0 && y > threshold) direction.value = "down";
      else if (delta < 0) direction.value = "up";
      lastY = y;
    }
    ticking = false;
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    frame = requestAnimationFrame(update);
  };

  onMounted(() => {
    lastY = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    if (frame) cancelAnimationFrame(frame);
  });

  return direction;
}
