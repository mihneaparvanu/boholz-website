<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * WindowGrid — a 2×2 (or N×M on mobile: 1 col) editorial grid of
 * "windows" into rooms. Each frame holds a photographic moment with
 * a small room label pinned bottom-left. On scroll-into-view the
 * photos start a slow, restrained zoom (cubic-bezier(0.4,0,0.2,1),
 * 8s), creating an Aesop / Vipp-style sense that the building is
 * inhabited, not staged. Stops cleanly when out of view; never
 * loops imperatively. Respects prefers-reduced-motion.
 *
 * Why a stretch pattern for BoHolz: the brand sells lived-in
 * architecture, not floorplans. A row of static thumbnails reads
 * like a catalogue; gentle motion turns the same images into a
 * "look through the windows" mood piece — without bouncy springs.
 *
 * Vue (not Astro) because the in-view detection + reduced-motion
 * gating needs runtime. CSS-only `:hover` zoom would never fire on
 * touch devices, and `:has()` can't observe viewport intersection.
 */

interface WindowFrame {
  src: string;
  alt: string;
  /** Small room/space label rendered over the photo (eg "Wohnzimmer"). */
  label: string;
  /** Optional secondary line (eg "Modell Alpha 162.1"). */
  meta?: string;
}

const props = defineProps<{
  eyebrow?: string;
  heading: string;
  /** Italic-serif accent appended to the heading. */
  highlight?: string;
  lede?: string;
  /** 4 frames render as a 2×2 grid on tablet+. Fewer/more degrade. */
  frames: WindowFrame[];
}>();

const sectionEl = ref<HTMLElement | null>(null);
const isActive = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!sectionEl.value) return;
  // Respect reduced motion — don't even arm the observer.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      isActive.value = entry.isIntersecting;
    },
    { threshold: 0.2 },
  );
  observer.observe(sectionEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <section ref="sectionEl" class="windows" :data-active="isActive">
    <header class="copy">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2 class="head">
        {{ heading }}
        <span v-if="highlight" class="highlight"> {{ highlight }}</span>
      </h2>
      <p v-if="lede" class="lede">{{ lede }}</p>
    </header>

    <div class="grid">
      <figure
        v-for="(frame, i) in frames"
        :key="frame.src"
        class="frame"
        :style="{ '--delay': `${i * 220}ms` }"
      >
        <div class="media">
          <img :src="frame.src" :alt="frame.alt" loading="lazy" decoding="async" />
        </div>
        <figcaption class="caption">
          <span class="label">{{ frame.label }}</span>
          <span v-if="frame.meta" class="meta">{{ frame.meta }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.windows {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
  padding-block: var(--spacing-6);
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  max-width: 56ch;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
  margin-block-end: var(--spacing-1);
}

.head {
  margin: 0;
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--ls-heading);
  line-height: var(--lh-heading);
  color: var(--clr-content-primary);
}

.highlight {
  font-family: var(--font-secondary);
  font-style: italic;
  font-weight: var(--font-weight-regular);
}

.lede {
  margin: 0;
  font-size: var(--fs-body-lg);
  color: var(--clr-content-secondary);
  max-width: 52ch;
}

/* ── Grid ──
   Mobile: 1 column, generous portrait frames (windows are vertical).
   Tablet: 2 columns 4:3 landscape (closer to a real window aperture).
   Desktop: 2 columns, slightly taller. */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3);
}

@media (--from-tablet) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
  }
}

@media (--from-desktop) {
  .grid {
    gap: var(--spacing-5);
  }
}

.frame {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin: 0;
}

.media {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--clr-surface-secondary);
  aspect-ratio: 4 / 5;
  /* The "window frame" reads as a soft inset shadow so the photo feels
     recessed into the architecture. */
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--clr-pure-white) 12%, transparent);
}

@media (--from-tablet) {
  .media {
    aspect-ratio: 4 / 3;
  }
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* Resting transform: a hair scaled up so the start of the in-view zoom
     never reveals a gap at the edges. */
  transform: scale(1.02);
  transition: transform 8000ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* In-view: a restrained 4% zoom over 8s. Subliminal, not showy.
   Staggered with --delay per frame so the four windows don't pulse in unison. */
.windows[data-active="true"] .media img {
  transform: scale(1.06);
  transition-delay: var(--delay, 0ms);
}

.caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding-inline: var(--spacing-1);
}

.label {
  font-size: var(--fs-body);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
  letter-spacing: var(--ls-heading);
}

.meta {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
  text-align: end;
}

/* Reduced motion: hold the resting scale, never animate. */
@media (prefers-reduced-motion: reduce) {
  .media img {
    transform: scale(1);
    transition: none;
  }
  .windows[data-active="true"] .media img {
    transform: scale(1);
  }
}
</style>
