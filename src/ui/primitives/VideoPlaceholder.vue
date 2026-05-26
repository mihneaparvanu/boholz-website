<script setup lang="ts">
import { computed } from "vue";
import { motion, useReducedMotion } from "motion-v";
import { PlayCircle, Film, Video } from "lucide-vue-next";

type Ratio = "16/9" | "21/9" | "1/1" | "4/5" | "4/3";
type Variant = "play" | "film" | "video";

const props = withDefaults(
  defineProps<{
    aspectRatio?: Ratio;
    slotId: string;
    label?: string;
    caption?: string;
    variant?: Variant;
  }>(),
  {
    aspectRatio: "16/9",
    variant: "play",
  },
);

const reduced = useReducedMotion();

const iconSize = computed(() => {
  switch (props.aspectRatio) {
    case "1/1":
    case "4/5":
      return 56;
    case "21/9":
      return 64;
    default:
      return 56;
  }
});

const IconComponent = computed(() => {
  switch (props.variant) {
    case "film":
      return Film;
    case "video":
      return Video;
    default:
      return PlayCircle;
  }
});

const ratioStyle = computed(() => ({
  aspectRatio: props.aspectRatio.replace("/", " / "),
}));
</script>

<template>
  <figure class="slot" :data-video-slot="slotId">
    <div class="surface" :style="ratioStyle" aria-hidden="true">
      <motion.div
        class="icon"
        :animate="reduced ? undefined : { opacity: [0.55, 0.92, 0.55] }"
        :transition="
          reduced
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        "
      >
        <component :is="IconComponent" :size="iconSize" :stroke-width="1.25" />
      </motion.div>
      <span v-if="label" class="label">{{ label }}</span>
    </div>
    <figcaption v-if="caption" class="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.slot {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
  margin: 0;
}

.surface {
  display: grid;
  place-items: center;
  gap: var(--spacing-2);
  width: 100%;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(
      circle at 30% 25%,
      color-mix(in srgb, var(--clr-content-tertiary) 6%, transparent) 0%,
      transparent 55%
    ),
    linear-gradient(
      135deg,
      var(--clr-surface-secondary) 0%,
      var(--clr-surface-tertiary) 100%
    );
  border: 1px solid var(--clr-border-secondary);
  overflow: hidden;
  isolation: isolate;
  padding: var(--spacing-3);
}

.icon {
  display: grid;
  place-items: center;
  color: var(--clr-content-tertiary);
}

.label {
  font-size: var(--fs-body-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--clr-content-tertiary);
  font-weight: var(--font-weight-medium);
  text-align: center;
  max-width: 32ch;
}

.caption {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
  text-align: center;
  margin: 0;
}
</style>
