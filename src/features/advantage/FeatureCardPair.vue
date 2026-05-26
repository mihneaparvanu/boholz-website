<script setup lang="ts">
import EditorialCard from "@/ui/primitives/EditorialCard.vue";
import type { FeatureCard } from "./advantage.types";

defineProps<{
  left: FeatureCard;
  right: FeatureCard;
  /**
   * Optional accent on one card — "left" or "right" tints the title and
   * elevates that card subtly. "none" (default) treats both as equal.
   * Use when one option is the recommended upgrade (e.g. ECO Nature Plus).
   */
  accent?: "none" | "left" | "right";
  /**
   * Override the image aspect ratio on both cards. Use for technical
   * diagrams that should sit taller than the default 4 / 3 (e.g. vertical
   * wall cross-sections in the Wandaufbau pair).
   */
  imageAspect?: string;
}>();

function toImage(card: FeatureCard): { src: string; alt: string } {
  return { src: card.imageURL, alt: card.imageAlt };
}
</script>

<template>
  <div class="pair">
    <EditorialCard
      :title="left.title"
      :eyebrow="left.eyebrow"
      :icon="left.icon"
      :description="left.lede"
      :bullets="left.bullets"
      :image="toImage(left)"
      :image-aspect="imageAspect"
      :accent="accent === 'left'"
    />
    <EditorialCard
      :title="right.title"
      :eyebrow="right.eyebrow"
      :icon="right.icon"
      :description="right.lede"
      :bullets="right.bullets"
      :image="toImage(right)"
      :image-aspect="imageAspect"
      :accent="accent === 'right'"
    />
  </div>
</template>

<style scoped>
.pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  width: 100%;
}

@media (--from-tablet) {
  .pair {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
