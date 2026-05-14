<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { ref, computed } from "vue";
import type { HouseModel } from "@/types/models";

type HeroModel = Pick<HouseModel, "id" | "slug" | "title"> & {
  heroImgURL: string | null;
};

const props = defineProps<{
  models: HeroModel[];
}>();

const index = ref(0);

useIntervalFn(() => {
  index.value = (index.value + 1) % props.models.length;
}, 3000);

const model = computed(() => props.models[index.value]);
</script>

<template>
  <section class="hero full-width">
    <div class="layout">
      <div class="heading">
        <h1>Einfach einkommen.</h1>
        <h2>Ihr Zuhause, meisterhaft vollendet.</h2>
      </div>
      <div class="footer">
        <div class="proof"></div>
        <div class="action">
          <button type="button">{{ model.title }}</button>
        </div>
      </div>
    </div>
    <img
      :src="model.heroImgURL ?? undefined"
      alt="Stadtvilla in einem Bergtal bei Sonnenuntergang"
      width="1200"
      height="800"
      class="background"
    />
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
  width: 100%;
  height: 100%;
}

.heading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding-block-end: var(--spacing-5);
  padding-inline-start: var(--spacing-5);

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
</style>
