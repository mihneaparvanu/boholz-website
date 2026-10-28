<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import type { HouseModelRecord } from "@/domain/house-models/houseModels.types";
import Image from "@/ui/primitives/Image.vue";

const props = defineProps<{
  model: HouseModelRecord;
}>();

type Img = HouseModelRecord["media"][number]["media"];

const slides = computed<Img[]>(() => {
  const hero = props.model.media.find((m) => m.isHero);
  const rest = props.model.media
    // the export preserved the loader's sortOrder as array order, so the
    // old .sort() here had nothing left to do
    .filter((m) => !m.isHero && !m.isThumbnail);
  return hero ? [hero, ...rest] : rest;
});

const index = ref(0);
const count = computed(() => slides.value.length);

const prev = (): void => {
  index.value = (index.value - 1 + count.value) % count.value;
};
const next = (): void => {
  index.value = (index.value + 1) % count.value;
};
</script>

<template>
  <figure class="hero">
    <div class="frame">
      <Image
        v-if="slides[index]"
        :path="slides[index].path"
        :alt="slides[index].alt ?? model.title"
        :width="slides[index].width"
        :height="slides[index].height"
        loading="eager"
      />
      <span v-if="slides[index]?.isAi" class="ai-badge">KI-generiert</span>
    </div>

    <div v-if="count > 1" class="paginator">
      <button
        type="button"
        class="nav-btn"
        aria-label="Vorheriges Bild"
        @click="prev"
      >
        <ChevronLeft :size="18" :stroke-width="2" />
      </button>
      <span class="counter">{{ index + 1 }} / {{ count }}</span>
      <button
        type="button"
        class="nav-btn"
        aria-label="Nächstes Bild"
        @click="next"
      >
        <ChevronRight :size="18" :stroke-width="2" />
      </button>
    </div>
  </figure>
</template>

<style scoped>
.hero {
  position: relative;
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--clr-surface-tertiary);
}

.frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-badge {
  position: absolute;
  inset-block-end: var(--spacing-2);
  inset-inline-start: var(--spacing-2);
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  font-size: 0.68rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.01em;
  line-height: 1.25;
  color: var(--clr-content-primary);
  background: color-mix(in srgb, var(--clr-pure-white-soft) 82%, transparent);
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
  pointer-events: none;
}

@media (--mobile) {
  .frame {
    aspect-ratio: 4 / 3;
  }
}

.paginator {
  position: absolute;
  inset-block-end: var(--spacing-3);
  inset-inline-end: var(--spacing-3);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1);
  background: var(--clr-pure-white-soft);
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow-1);
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--control-height-sm);
  height: var(--control-height-sm);
  border: 0;
  background: transparent;
  border-radius: var(--radius-full);
  color: var(--clr-content-primary);
  cursor: pointer;
  transition: background 160ms ease;
}

.nav-btn:hover {
  background: var(--clr-surface-secondary);
}

.nav-btn:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.counter {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
  padding-inline: var(--spacing-1);
  min-width: 3em;
  text-align: center;
}
</style>
