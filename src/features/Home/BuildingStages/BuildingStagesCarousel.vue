<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder.vue";
import type { BuildingStage } from "./building-stages.types";

const props = defineProps<{
  stages: BuildingStage[];
}>();

const track = ref<HTMLElement | null>(null);
const canPrev = ref(false);
const canNext = ref(true);

function step(direction: 1 | -1) {
  const el = track.value;
  if (!el) return;
  const first = el.querySelector<HTMLElement>(".card");
  // Snap one card + gap; fall back to ~80% viewport width.
  const delta = first
    ? first.getBoundingClientRect().width +
      parseFloat(getComputedStyle(el).columnGap || "0")
    : el.clientWidth * 0.8;
  el.scrollBy({ left: delta * direction, behavior: "smooth" });
}

function updateEdges() {
  const el = track.value;
  if (!el) return;
  canPrev.value = el.scrollLeft > 2;
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
}

onMounted(() => {
  updateEdges();
  track.value?.addEventListener("scroll", updateEdges, { passive: true });
  window.addEventListener("resize", updateEdges);
});

onBeforeUnmount(() => {
  track.value?.removeEventListener("scroll", updateEdges);
  window.removeEventListener("resize", updateEdges);
});

const ariaLabel = computed(
  () => `Ausbaustufen — ${props.stages.length} Stufen`,
);
</script>

<template>
  <div class="root" :aria-label="ariaLabel" role="region">
    <div class="controls">
      <button
        type="button"
        class="nav"
        :disabled="!canPrev"
        aria-label="Vorherige Stufe"
        @click="step(-1)"
      >
        <ChevronLeft :size="20" />
      </button>
      <button
        type="button"
        class="nav"
        :disabled="!canNext"
        aria-label="Nächste Stufe"
        @click="step(1)"
      >
        <ChevronRight :size="20" />
      </button>
    </div>

    <ol ref="track" class="track">
      <li v-for="(stage, i) in stages" :key="stage.slug" class="card">
        <div class="frame">
          <img
            v-if="stage.imageURL"
            :src="stage.imageURL"
            :alt="stage.title"
            loading="lazy"
          />
          <ImagePlaceholder v-else />
        </div>
        <h3 class="title">
          <span class="index">{{ String(i + 1).padStart(2, "0") }}</span>
          {{ stage.title }} <span class="rule" aria-hidden="true">—</span>
        </h3>
        <p class="copy">{{ stage.description }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.root {
  position: relative;
  width: 100%;
}

/* ── Prev/Next controls — top-right, mirrors the reference layout. */
.controls {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
  margin-block-end: var(--spacing-4);
}

.nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--control-height-md);
  height: var(--control-height-md);
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--clr-border-tertiary);
  color: var(--clr-accent-primary);
  cursor: pointer;
  transition:
    border-color 160ms ease,
    color 160ms ease,
    background 160ms ease;
}

.nav:hover:not(:disabled) {
  border-color: var(--clr-accent-primary);
  background: var(--clr-surface-secondary);
}

.nav:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.nav:disabled {
  color: var(--clr-content-quaternary);
  border-color: var(--clr-border-secondary);
  cursor: not-allowed;
}

/* ── Horizontal scroll-snap track ── */
.track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 80%;
  column-gap: var(--spacing-3);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  /* Full-bleed across the section padding so the next card peeks in. */
  width: 100vw;
  margin-inline: calc(var(--padding-inline) * -1);
  padding-inline: var(--padding-inline);
}

.track::-webkit-scrollbar {
  display: none;
}

@media (--from-tablet) {
  .track {
    grid-auto-columns: calc((100% - var(--spacing-3)) / 2);
    column-gap: var(--spacing-4);
  }
}

@media (--from-desktop) {
  .track {
    grid-auto-columns: calc((100% - var(--spacing-4) * 2) / 3);
    /* Inside the content column; no full-bleed needed at desktop. */
    width: 100%;
    margin-inline: 0;
    padding-inline: 0;
    overflow-x: visible;
    scroll-snap-type: none;
  }
}

/* ── Card ── */
.card {
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  min-width: 0;
}

.frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--clr-surface-secondary);
}

.frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  margin: 0;
  font-size: var(--fs-h5);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
}

.index {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-regular);
  color: var(--clr-content-tertiary);
  letter-spacing: var(--tracking-eyebrow);
}

.rule {
  color: var(--clr-content-tertiary);
}

.copy {
  margin: 0;
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
}
</style>
