<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import type { HouseModel } from "@/types/models";

const props = defineProps<{
  model: HouseModel;
}>();

type Img = HouseModel["media"][number]["media"];

const slides = computed<Img[]>(() => {
  const hero = props.model.media.find((m) => m.isHero)?.media;
  const rest = props.model.media
    .filter((m) => !m.isHero && !m.isThumbnail)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((m) => m.media);
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
      <img
        v-if="slides[index]"
        :src="slides[index].path"
        :alt="slides[index].alt || ''"
        :width="slides[index].width ?? undefined"
        :height="slides[index].height ?? undefined"
      />
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
  object-fit: contain;
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
