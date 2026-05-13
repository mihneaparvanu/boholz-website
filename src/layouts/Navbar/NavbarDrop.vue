<script setup lang="ts">
import { ref, computed } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import type { HouseCategory, Showhouse } from "../../types/models";
import { ROUTES } from "../../utils/routes";
import TitleLinks from "../../components/TitleLinks.vue";

const props = defineProps<{
  categories: HouseCategory[];
  showhouses: Showhouse[];
}>();

const selected = ref<HouseCategory>(props.categories[0]);

const heroMedia = computed(
  () => selected.value?.media.find((m) => m.isHero)?.media,
);
</script>

<template>
  <div class="drop-panel">
    <div class="drop-panel-nav">
      <ul class="links category">
        <li
          v-for="category in categories"
          :key="category.id"
          @mouseenter="selected = category"
        >
          <a :href="`/hauser?category=${category.slug}`">{{ category.name }}</a>
        </li>
      </ul>
      <div class="additional-links-list">
        <TitleLinks :showhouses="props.showhouses" />
        <div class="links cta">
          <a :href="ROUTES.contact">Entdecken sie unsere Hauser</a>
          <a :href="ROUTES.contact">Katalog anforden</a>
        </div>
      </div>
    </div>
    <AnimatePresence mode="wait">
      <Motion
        :key="selected.id"
        tag="a"
        class="category-showcase"
        :href="`/hauser?category=${selected.slug}`"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.15 }"
      >
        <div class="text-content">
          <h3 class="title">{{ selected.name }}</h3>
          <p>{{ `Entdecken Sie alle ${selected.name}` }}</p>
        </div>
        <div class="image-wrapper">
          <img
            v-if="heroMedia"
            :src="heroMedia.path"
            :alt="heroMedia.alt ?? selected.name"
          />
        </div>
      </Motion>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.drop-panel {
  --panel-padding: var(--spacing-2);
  --panel-b-radius: calc(var(--panel-padding) + var(--radius-md));
  border: 2px solid var(--clr-border-primary);
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  padding: var(--panel-padding);
  position: absolute;
  top: var(--spacing-4);
  width: 100%;
  background-color: var(--clr-surface-primary);
  border-radius: var(--panel-b-radius);
}

.drop-panel-nav {
  padding: var(--spacing-4);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-0);
  font-size: var(--fs-body-lg);

  .links {
    display: flex;
    width: fit-content;

    flex-direction: column;
    gap: var(--spacing-2);

    li {
      width: fit-content;
    }
  }

  .additional-links-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    .links {
      font-size: var(--fs-body);
    }
  }
}

.category-showcase {
  display: flex;
  flex-direction: column;
  justify-content: end;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  gap: var(--spacing-4);
  align-items: start;
  height: 100%;

  &:hover,
  &:focus {
    opacity: 1;
  }

  .text-content {
    z-index: 1;
    padding: var(--spacing-3);
    color: var(--clr-surface-primary);

    .title {
      font-size: var(--fs-h6);
    }

    width: 100%;
    background: linear-gradient(
      360deg,
      rgba(0, 0, 0, 0.75) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    backdrop-filter: blur(1px);
  }

  .image-wrapper {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100%;

    img {
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
  }
}
</style>
