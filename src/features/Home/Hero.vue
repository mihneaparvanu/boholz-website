<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { ref, computed } from "vue";
import type { HeroSlide } from "./home.types";
import Button from "@/components/ui/Button.vue";
import { ArrowRight } from "lucide-vue-next";

const props = defineProps<{
  slides: HeroSlide[];
}>();

const index = ref(0);

useIntervalFn(() => {
  index.value = (index.value + 1) % props.slides.length;
}, 3000);

const slide = computed(() => props.slides[index.value]);
</script>

<template>
  <section class="hero subgrid">
    <div class="layout">
      <div class="heading">
        <h1>Einfach einkommen.</h1>
        <h2>Ihr Zuhause, meisterhaft vollendet.</h2>
      </div>
      <div class="bottom">
        <div class="proof">
          <span>Bewährte Spitzenqualität</span>
        </div>
        <div class="action">
          <Button>
            {{ slide.title }}
            <template #trailing> <ArrowRight /> </template>
          </Button>
        </div>
      </div>
    </div>
    <Transition name="crossfade">
      <img
        :key="slide.id"
        :src="slide.heroImgURL ?? undefined"
        :alt="slide.title"
        width="1200"
        height="800"
        class="background full-width"
      />
    </Transition>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100dvh;
  margin-top: calc(-1 * (var(--navbar-height) + var(--navbar-offset) * 2));
  color: var(--clr-surface-primary);
}

.layout {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
  height: 100%;
  padding-block-end: var(--spacing-5);
}

.heading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);

  h2 {
    font-size: var(--fs-h4);
  }
}

.background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: var(--clr-content-secondary);
  z-index: -1;
  /* subtle ken-burns while a slide is on screen */
  animation: ken-burns 8s ease-out forwards;
}

@keyframes ken-burns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.06);
  }
}

/* <Transition name="crossfade"> hooks */
.crossfade-enter-active,
.crossfade-leave-active {
  transition: opacity 800ms ease;
}
.crossfade-enter-from,
.crossfade-leave-to {
  opacity: 0;
}
/* keep both images stacked during the swap */
.crossfade-leave-active {
  position: absolute;
}

.bottom {
  display: flex;
  justify-content: space-between;
  width: 100%;

  proof {
    span {
      text-transform: uppercase;
    }
  }

  .action button {
    height: var(--control-height-md);
    padding-inline: var(--spacing-3);
    background-color: var(--clr-surface-primary);
    color: var(--clr-accent-secondary);
    border-radius: var(--radius-sm);
    font-weight: 500;
    transition:
      background 160ms ease,
      transform 160ms ease;
  }

  .action button:hover {
    background-color: var(--clr-surface-secondary);
  }
}
</style>
