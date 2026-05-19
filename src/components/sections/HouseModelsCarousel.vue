<script setup lang="ts">
/**
 * HouseModelsCarousel — horizontal scroll-snap row of HouseModelCard.
 *
 * Mobile: snap-scroll with a small peek of the next card on the right edge
 *         so users know there's more.
 * Tablet: 2 cards visible + peek.
 * Desktop: 3 cards visible + ~half-card peek. Prev/Next chevron buttons sit
 *          in the section header (we expose them via a header slot so the
 *          parent controls layout — but we own the carousel state).
 *
 * Touch scrolling is native + scroll-snap. Buttons drive `scrollBy` —
 * declarative behaviour wraps the imperative scroll only because the browser
 * has no declarative API for it.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import HouseModelCard from "./HouseModelCard.vue";
import type { HouseModelCardProps } from "./HouseModelCard.vue";
import CategoryThumbnail from "@/features/CategorySlider/components/CategoryThumbnail.vue";
import type { HouseCategory } from "@/types/models";

const props = defineProps<{
  models: HouseModelCardProps[];
  categories?: HouseCategory[];
  /** Accessible label for the scrollable region. */
  ariaLabel?: string;
}>();

// Default selection lands on the Bestseller category if present — it's
// the canonical "start here" entry across every category surface. Falls
// back to the first category if Bestseller hasn't been seeded yet.
const selected = ref<HouseCategory | null>(
  props.categories?.find((c) => c.slug === "bestseller") ??
    props.categories?.[0] ??
    null,
);

const select = (category: HouseCategory) => {
  selected.value = category;
};

const displayModels = computed(() => {
  if (!selected.value) return props.models;
  return props.models.filter((m) => m.categoryID === selected.value?.id);
});

const trackRef = ref<HTMLElement | null>(null);
const canPrev = ref(false);
const canNext = ref(true);

const updateAffordances = () => {
  const el = trackRef.value;
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth;
  canPrev.value = el.scrollLeft > 4;
  canNext.value = el.scrollLeft < max - 4;
};

const scrollByCard = (direction: 1 | -1) => {
  const el = trackRef.value;
  if (!el) return;
  // Scroll by one card-width (first child is the canonical card). Falls back
  // to 80% of the viewport if no children for some reason.
  const first = el.querySelector<HTMLElement>(".cell");
  const step = first
    ? first.getBoundingClientRect().width + 24
    : el.clientWidth * 0.8;
  el.scrollBy({ left: direction * step, behavior: "smooth" });
};

let observer: ResizeObserver | null = null;
onMounted(() => {
  const el = trackRef.value;
  if (!el) return;
  updateAffordances();
  el.addEventListener("scroll", updateAffordances, { passive: true });
  observer = new ResizeObserver(updateAffordances);
  observer.observe(el);
});

onBeforeUnmount(() => {
  const el = trackRef.value;
  el?.removeEventListener("scroll", updateAffordances);
  observer?.disconnect();
});

// Disable buttons when there's nothing to scroll to. Visually we keep them
// rendered (consistent header layout) but `aria-disabled` + pointer-events
// off.
const prevDisabled = computed(() => !canPrev.value);
const nextDisabled = computed(() => !canNext.value);
</script>

<template>
  <div class="carousel">
    <div v-if="props.categories?.length" class="category-thumbnails">
      <CategoryThumbnail
        v-for="category in categories"
        :key="category.slug"
        :category="category"
        :data-is-selected="category.id === selected?.id"
        @click="select(category)"
      />
    </div>
    <div class="controls" role="group" aria-label="Navigation">
      <button
        type="button"
        class="chev"
        :aria-disabled="prevDisabled"
        :tabindex="prevDisabled ? -1 : 0"
        aria-label="Vorheriges Modell"
        @click="scrollByCard(-1)"
      >
        <ChevronLeft :size="18" :stroke-width="1.75" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="chev"
        :aria-disabled="nextDisabled"
        :tabindex="nextDisabled ? -1 : 0"
        aria-label="Nächstes Modell"
        @click="scrollByCard(1)"
      >
        <ChevronRight :size="18" :stroke-width="1.75" aria-hidden="true" />
      </button>
    </div>

    <div
      ref="trackRef"
      class="track"
      role="region"
      :aria-label="ariaLabel ?? 'Hausmodelle'"
      tabindex="0"
    >
      <div v-for="m in displayModels" :key="m.id" class="cell">
        <HouseModelCard
          :id="m.id"
          :slug="m.slug"
          :name="m.name"
          :code="m.code"
          :image="m.image"
          :image-alt="m.imageAlt"
          :specs="m.specs"
          :category-i-d="m.categoryID"
          :price-hint="m.priceHint"
          :href="m.href"
        />
      </div>
      <!-- A trailing spacer keeps the last card's right-edge breathing room
           equal to the leading inset, even when scroll-padding lands. -->
      <div class="cell cell-spacer" aria-hidden="true"></div>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  width: 100%;
}

.category-thumbnails {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: var(--spacing-2);

  @media (--below-desktop) {
    /* Native horizontal scroll, full-bleed across the section padding */
    justify-content: flex-start;
    gap: var(--spacing-3);
    width: 100vw;
    margin-inline: calc(var(--padding-inline) * -1);
    padding-inline: var(--padding-inline);
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > * {
      scroll-snap-align: center;
      flex: 0 0 auto;
    }
  }
}

/* Controls — right-aligned chevron pair. Hidden on touch (mobile) where the
   native scroll is the affordance plus the peek-next pattern. The visual
   peek already telegraphs scrollability; chevrons would be redundant. */
.controls {
  display: none;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-1);
}

@media (--from-tablet) {
  .controls {
    display: flex;
  }
}

.chev {
  display: inline-grid;
  place-items: center;
  width: var(--control-height-md);
  height: var(--control-height-md);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--clr-content-primary);
  /* Real visible hairline so the buttons read against the page surface,
     not just the slightly-grayer secondary surface. */
  border: 1px solid var(--clr-border-secondary);
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.chev:hover:not([aria-disabled="true"]) {
  background: var(--clr-surface-secondary);
  border-color: var(--clr-border-tertiary);
}

.chev:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.chev[aria-disabled="true"] {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

/* Track — horizontal scroll with snap. The track escapes the section's
   inline padding so cards can bleed to the viewport edge on mobile (peek
   effect), then re-pads via scroll-padding so snapped cards align to the
   content column. */
.track {
  display: flex;
  gap: var(--spacing-3);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* Padding rather than margin so scrollbars/track edges line up. */
  padding-block: var(--spacing-1);
  /* Hide native scrollbar — the chevrons (desktop) and the peek (mobile)
     are the affordances. */
  scrollbar-width: none;
}
.track::-webkit-scrollbar {
  display: none;
}

.track:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 22%, transparent);
  border-radius: var(--radius-md);
}

.cell {
  flex: 0 0 auto;
  scroll-snap-align: start;
  /* Card widths per breakpoint — each card reserves space minus the peek. */
  width: clamp(260px, 78vw, 360px);
  min-width: 0;
}

.cell-spacer {
  width: var(--spacing-1);
}

@media (--from-tablet) {
  .track {
    gap: var(--spacing-4);
  }
  .cell {
    /* 2 cards + ~half peek. Track padding accounts for the inset. */
    width: calc((100% - var(--spacing-4) * 2) / 2.3);
  }
}

@media (--from-desktop) {
  .track {
    gap: var(--spacing-5);
    /* Reset overflow visually with extra block padding so the hover lift
       on the arrow CTA isn't clipped. */
    padding-block: var(--spacing-2);
  }
  .cell {
    /* 3 cards + small peek of a 4th. */
    width: calc((100% - var(--spacing-5) * 3) / 3.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    scroll-behavior: auto;
  }
}
</style>
