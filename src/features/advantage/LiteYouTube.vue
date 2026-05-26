<script setup lang="ts">
import { ref } from "vue";
import { Play } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    /** YouTube video ID — e.g. "0abnY3Re-tU". */
    videoId: string;
    /** Poster image URL (R2). */
    posterURL: string;
    /** Accessible button label, also used as the loaded iframe title. */
    label: string;
    /** Optional caption shown under the video frame. */
    caption?: string;
    /** Aspect ratio for the frame. Defaults to 16/9. */
    aspectRatio?: string;
  }>(),
  {
    aspectRatio: "16 / 9",
  },
);

const loaded = ref(false);

function load() {
  loaded.value = true;
}

// Preconnect on hover/focus — warms the YouTube domains so the iframe load
// after click is materially faster. Idempotent (browser dedupes).
function warm() {
  const heads = [
    "https://www.youtube-nocookie.com",
    "https://i.ytimg.com",
    "https://s.ytimg.com",
  ];
  heads.forEach((href) => {
    if (document.head.querySelector(`link[data-lite-yt="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.dataset.liteYt = href;
    document.head.appendChild(link);
  });
}
</script>

<template>
  <figure class="wrap">
    <div class="frame" :style="{ aspectRatio }">
      <iframe
        v-if="loaded"
        :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`"
        :title="label"
        loading="lazy"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
        "
        allowfullscreen
      />
      <button
        v-else
        type="button"
        class="poster"
        :aria-label="`Video abspielen: ${label}`"
        @click="load"
        @mouseenter="warm"
        @focus="warm"
        @touchstart="warm"
      >
        <img :src="posterURL" :alt="label" loading="lazy" />
        <span class="scrim" aria-hidden="true" />
        <span class="play" aria-hidden="true">
          <Play :size="28" :stroke-width="2" fill="currentColor" />
        </span>
      </button>
    </div>
    <figcaption v-if="caption" class="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.wrap {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

.frame {
  position: relative;
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--clr-surface-tertiary);
  /* Resting elevation hint — flat by default, the play button supplies the
     affordance. */
}

.frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* ── Poster button ── */
.poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--clr-pure-white);
  /* Stack the layers and let them participate in transitions. */
  display: block;
  isolation: isolate;
}

.poster img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 320ms ease;
}

.scrim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at center,
      color-mix(in srgb, #000 28%, transparent) 0%,
      color-mix(in srgb, #000 0%, transparent) 55%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, #000 12%, transparent),
      color-mix(in srgb, #000 36%, transparent) 100%
    );
  transition: background 200ms ease;
}

.play {
  position: absolute;
  /* Optical centre — Lucide's Play glyph has more visual mass on the right
     edge of its bbox, so nudge the chip left by a hair when the icon sits
     inside it. The translate handles the centring; padding-inline-start
     receives the optical correction. */
  inset: 0;
  display: grid;
  place-items: center;
}

.play :deep(svg) {
  /* The chip itself — circular glass affordance over imagery. A dark base
     keeps the white play glyph legible regardless of poster brightness;
     the soft drop shadow guarantees separation on busy scenes. */
  padding: var(--spacing-3);
  background: color-mix(in srgb, #000 55%, transparent);
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--clr-pure-white) 18%, transparent);
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);
  box-shadow: 0 6px 24px color-mix(in srgb, #000 36%, transparent);
  /* Optical adjustment — Play triangle is right-heavy; nudge it 1.5px left
     inside the chip so it reads centred. */
  margin-inline-start: 1.5px;
  transition:
    transform 200ms ease,
    background 200ms ease,
    border-color 200ms ease;
}

/* Mobile: poster crops smaller, so the chip needs to read as a clear
   affordance against a tighter frame. Larger inner padding bumps the chip's
   visual footprint without changing the icon size. */
@media (--mobile) {
  .play :deep(svg) {
    padding: var(--spacing-4);
  }
}

.poster:hover img,
.poster:focus-visible img {
  transform: scale(1.02);
}

.poster:hover .scrim,
.poster:focus-visible .scrim {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, #000 18%, transparent),
    color-mix(in srgb, #000 44%, transparent) 100%
  );
}

.poster:hover .play :deep(svg),
.poster:focus-visible .play :deep(svg) {
  background: color-mix(in srgb, #000 65%, transparent);
  transform: scale(1.06);
}

.poster:focus-visible {
  outline: 2px solid var(--clr-pure-white);
  outline-offset: -2px;
}

.caption {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
  margin: 0;
  max-width: 60ch;
}

/* Honour reduced motion — no scale/scrim transitions. */
@media (prefers-reduced-motion: reduce) {
  .poster img,
  .scrim,
  .play :deep(svg) {
    transition: none;
  }

  .poster:hover img,
  .poster:focus-visible img,
  .poster:hover .play :deep(svg),
  .poster:focus-visible .play :deep(svg) {
    transform: none;
  }
}
</style>
