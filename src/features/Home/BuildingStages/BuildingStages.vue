<script setup lang="ts">
import { computed, ref } from "vue";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder.vue";
import VideoPlaceholder from "@/components/ui/VideoPlaceholder.vue";
import type { BuildingStage } from "./building-stages.types";

const props = defineProps<{
  stages: BuildingStage[];
}>();

const activeSlug = ref<string>(props.stages[0].slug);
const selected = computed(
  () =>
    props.stages.find((s) => s.slug === activeSlug.value) ?? props.stages[0],
);
</script>

<template>
  <TabsRoot
    v-model="activeSlug"
    :default-value="props.stages[0].slug"
    class="root"
  >
    <TabsList class="options" aria-label="Ausbaustufen">
      <TabsTrigger
        v-for="stage in stages"
        :key="stage.slug"
        :value="stage.slug"
        class="option"
      >
        {{ stage.title }}
      </TabsTrigger>
    </TabsList>

    <!-- Single content panel keyed off `selected` — Reka still owns
         a11y wiring via TabsContent, we just render the resolved media
         once instead of mounting one panel per stage. -->
    <TabsContent :value="selected.slug" :force-mount="true" as-child>
      <figure class="hero">
        <div class="frame">
          <img
            v-if="selected.imageURL"
            :src="selected.imageURL"
            :alt="selected.title"
          />
          <ImagePlaceholder v-else />
        </div>
        <figcaption>{{ selected.description }}</figcaption>
      </figure>
    </TabsContent>

    <!-- Desktop-only support media. -->
    <div class="support">
      <VideoPlaceholder
        slot-id="home-factory-loop"
        aspect-ratio="16/9"
        label="Werksrundgang"
        caption="Bald verfügbar — Atmosphäre aus der Vorfertigung."
      />
    </div>
  </TabsRoot>
</template>

<style scoped>
.root {
  display: grid;
  width: 100%;
  /* Mobile default: single column — stages list on top, picture below,
     so the picture has the full content width to render the stage. */
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "options"
    "hero";
  column-gap: var(--spacing-4);
  row-gap: var(--spacing-4);
  align-items: start;
}

@media (--from-tablet) {
  .root {
    /* Tablet keeps the two-column compact layout — there's enough
       horizontal room for the tabs alongside the picture. */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    grid-template-areas: "options hero";
  }
}

@media (--from-desktop) {
  .root {
    /* Desktop: stages on top, picture below, support beside. */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      "options options"
      "hero    support";
  }
}

/* ── Tabs ────────────────────────────────────────── */
.options {
  grid-area: options;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  align-items: stretch;
}

@media (--from-desktop) {
  .options {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-3);
    margin-block-end: var(--spacing-4);
  }
}

.option {
  background: transparent;
  border: 0;
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-2);
  min-height: 44px;
  font: inherit;
  font-size: var(--fs-h6);
  font-weight: var(--font-weight-regular);
  color: var(--clr-content-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  text-align: start;
}

.option:hover {
  color: var(--clr-accent-secondary);
}

.option[data-state="active"] {
  color: var(--clr-accent-secondary);
}

.option:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

/* ── Hero (picture + caption) ────────────────────── */
.hero {
  grid-area: hero;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin: 0;
  min-width: 0;
}

.frame {
  position: relative;
  width: 100%;
  /* Mobile: 4/3 landscape so the stage photo reads cleanly across the
     full content width without dominating vertical space. */
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--clr-surface-secondary);
}

@media (--from-tablet) {
  .frame {
    /* Tablet keeps the prior 4/5 portrait so the side-by-side layout
       reads correctly next to the vertical tabs list. */
    aspect-ratio: 4 / 5;
  }
}

@media (--from-desktop) {
  .frame {
    aspect-ratio: auto;
    height: 60dvh;
  }
}

.frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero figcaption {
  display: none;
  color: var(--clr-content-secondary);
  font-size: var(--fs-body-sm);
  max-width: 60ch;
}

@media (--from-desktop) {
  .hero figcaption {
    display: block;
    font-size: var(--fs-body);
  }
}

/* ── Support (desktop-only video) ────────────────── */
.support {
  grid-area: support;
  display: none;
}

@media (--from-desktop) {
  .support {
    display: block;
  }
}
</style>
