<script setup lang="ts">
import { computed } from "vue";
import { Star } from "lucide-vue-next";

import type { HouseCategory } from "@/db/models";
import { isBestsellerCategory } from "@/lib/bestseller";

const props = defineProps<{
  category: HouseCategory;
}>();

const thumbnail = computed(() => {
  return props.category.media.find((m) => m.isThumbnail);
});

const imageURL = computed(() => {
  return thumbnail.value?.media.path ?? "";
});

const isBestseller = computed(() => isBestsellerCategory(props.category));

const initials = computed(() =>
  props.category.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join(""),
);
</script>
<template>
  <div class="category-thumbnail" :data-is-bestseller="isBestseller">
    <div class="house-model-circle">
      <img
        v-if="imageURL"
        :src="imageURL"
        :alt="category.name"
        :width="thumbnail?.media.width"
        :height="thumbnail?.media.height"
        class="model-image"
      />
      <span v-else class="fallback" aria-hidden="true">{{ initials }}</span>
      <span
        v-if="isBestseller"
        class="badge"
        aria-label="Beliebteste Auswahl"
        title="Beliebteste Auswahl"
      >
        <Star
          :size="11"
          :stroke-width="0"
          fill="currentColor"
          aria-hidden="true"
        />
      </span>
    </div>
    <div class="text-wrapper">
      <span>{{ category.name }}</span>
    </div>
  </div>
</template>
<style scoped>
.category-thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;

  &[data-is-selected="true"] {
    .house-model-circle {
      border-color: var(--clr-accent-primary);
    }

    .text-wrapper span {
      color: var(--clr-content-primary);
    }
  }

  /* Bestseller — quiet brand-blue ring + a small star chip nestled on the
     circle. Stays visible whether selected or not; the badge is the cue,
     not the colour. */
  &[data-is-bestseller="true"] {
    .house-model-circle {
      border-color: color-mix(
        in srgb,
        var(--clr-accent-secondary) 55%,
        transparent
      );
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--clr-accent-secondary) 10%, transparent);
    }

    .text-wrapper span {
      color: var(--clr-content-primary);
      font-weight: var(--font-weight-medium);
    }
  }

  &[data-is-bestseller="true"][data-is-selected="true"] .house-model-circle {
    border-color: var(--clr-accent-secondary);
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--clr-accent-secondary) 18%, transparent);
  }

  .house-model-circle {
    position: relative;
    cursor: pointer;
    --size: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    /* Belt-and-suspenders square sizing: explicit width AND height + flex
       guards so a parent flex stretch or unexpected text wrap can't squash
       one axis and produce ovals. */
    width: var(--size);
    height: var(--size);
    min-width: var(--size);
    min-height: var(--size);
    aspect-ratio: 1 / 1;
    flex: 0 0 auto;
    border: 2px solid var(--clr-border-primary);
    overflow: visible;
    background: var(--clr-surface-secondary, var(--clr-surface-primary));

    @media (--below-desktop) {
      --size: 80px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--radius-full);
    }

    .fallback {
      font-size: var(--fs-body-sm);
      font-weight: var(--font-weight-medium);
      letter-spacing: var(--tracking-eyebrow);
      color: var(--clr-content-secondary);
    }

    .badge {
      position: absolute;
      top: -2px;
      right: -2px;
      display: inline-grid;
      place-items: center;
      width: 20px;
      height: 20px;
      border-radius: var(--radius-full);
      background: var(--clr-accent-secondary);
      color: var(--clr-pure-white);
      border: 2px solid var(--clr-surface-primary);
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
      pointer-events: none;
    }
  }

  .text-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    span {
      font-size: var(--fs-body-sm);
      font-weight: 400;
      color: var(--clr-content-tertiary);
      text-align: center;
      word-break: break-word;
      hyphens: auto;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      @media (--below-desktop) {
        font-size: var(--fs-body);
      }
    }
  }
}
</style>
