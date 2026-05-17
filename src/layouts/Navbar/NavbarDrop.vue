<script setup lang="ts">
import { ref, computed } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import type { HouseCategory, Location } from "@/types/models";
import { ROUTES } from "@/utils/routes";
import { BESTSELLER_CATEGORY_ID } from "@/data/constants";

const props = defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
}>();

const visibleCategories = computed(() =>
  props.categories.filter((c) => c.id !== BESTSELLER_CATEGORY_ID),
);

const selected = ref<HouseCategory>(visibleCategories.value[0]);

const heroMedia = computed(
  () => selected.value?.media.find((m) => m.isHero)?.media,
);

const EASE = [0.22, 1, 0.36, 1] as const;
const ctaLinks = [
  { label: "Entdecken sie unsere Hauser", href: ROUTES.contact },
  { label: "Katalog anforden", href: ROUTES.contact },
];
</script>

<template>
  <div class="drop-panel">
    <div class="drop-panel-nav">
      <ul class="links category">
        <Motion
          v-for="(category, i) in visibleCategories"
          :key="category.id"
          tag="li"
          :initial="{ opacity: 0, x: -8 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.32, delay: 0.05 + i * 0.035, ease: EASE }"
          @mouseenter="selected = category"
        >
          <a :href="`/hauser?category=${category.slug}`">{{ category.name }}</a>
        </Motion>
      </ul>
      <Motion
        tag="div"
        class="additional-links-list"
        :initial="{ opacity: 0, y: 6 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.12, ease: EASE }"
      >
        <div class="links cta">
          <Motion
            v-for="(link, i) in ctaLinks"
            :key="link.label"
            tag="a"
            :href="link.href"
            :initial="{ opacity: 0, y: 4 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.3, delay: 0.22 + i * 0.05, ease: EASE }"
          >
            {{ link.label }}
          </Motion>
        </div>
      </Motion>
    </div>
    <AnimatePresence mode="wait">
      <Motion
        :key="selected.id"
        tag="a"
        class="category-showcase"
        :href="`/hauser?category=${selected.slug}`"
        :initial="{ opacity: 0, scale: 1.02 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 1.02 }"
        :transition="{ duration: 0.32, ease: EASE }"
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

    a {
      transition: color 160ms ease;
    }

    a:hover,
    a:focus-visible {
      opacity: 1;
      color: var(--clr-accent-secondary);
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
