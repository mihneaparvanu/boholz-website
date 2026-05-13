<script setup lang="ts">
import { ref, computed } from "vue";
import { Motion, AnimatePresence } from "motion-v";

import BoholzLogo from "../../components/BoholzLogo.vue";
import NavbarSheet from "./NavbarSheet.vue";
import NavbarDrop from "./NavbarDrop.vue";
import NAV_ROUTES from "../../utils/routes";
import { Menu } from "lucide-vue-next";
import type { HouseCategory } from "../../types/models";

const props = defineProps<{
  categories: HouseCategory[];
  currentPath: string;
}>();

const selectedCategory = ref<HouseCategory>(props.categories[0]);

const selectCategory = (category: HouseCategory) => {
  selectedCategory.value = category;
};

const resetCategory = () => {
  selectedCategory.value = props.categories[0];
};

const selectedHeroMedia = computed(
  () => selectedCategory.value?.media.find((m) => m.isHero)?.media,
);

const isSheetOpen = ref(false);
const isDropOpen = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const openDrop = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  isDropOpen.value = true;
};

const scheduleDrop = () => {
  closeTimer = setTimeout(() => {
    isDropOpen.value = false;
    resetCategory();
  }, 150);
};
</script>
<template>
  <nav class="navbar wrapper">
    <div class="nav-content">
      <div class="logo-links">
        <a class="logo" href="/"> <BoholzLogo class="logo-svg" /></a>

        <ul class="links">
          <li
            v-for="route in NAV_ROUTES"
            :key="route.path"
            @mouseenter="
              route.path === '/hauser' && props.currentPath !== '/hauser'
                ? openDrop()
                : scheduleDrop()
            "
          >
            <a :href="route.path" :data-is-current="currentPath === route.path"
              >{{ route.label }}
            </a>
          </li>
        </ul>
      </div>
      <div class="cta"></div>
      <button class="sheet-trigger" @click="isSheetOpen = !isSheetOpen">
        <Menu />
      </button>
    </div>
    <NavbarSheet :routes="NAV_ROUTES" :data-is-open="isSheetOpen" />
    <div
      class="drop-container"
      @mouseenter="openDrop"
      @mouseleave="scheduleDrop"
    >
      <AnimatePresence>
        <Motion
          v-if="isDropOpen"
          tag="div"
          :initial="{ opacity: 0, y: -3 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: -3 }"
          :transition="{ duration: 0.2, ease: 'easeOut' }"
        >
          <NavbarDrop>
            <template #leading>
              <ul class="house-categories">
                <li
                  v-for="category in props.categories"
                  :key="category.id"
                  @mouseenter="selectCategory(category)"
                >
                  <a :href="`/hauser?category=${category.slug}`">{{
                    category.name
                  }}</a>
                </li>
              </ul>
              <TitleLinks
            /></template>
            <template #trailing>
              <AnimatePresence mode="wait">
                <Motion
                  :key="selectedCategory.id"
                  tag="a"
                  class="categories-showcase"
                  :href="`/hauser?category=${selectedCategory.slug}`"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  :exit="{ opacity: 0 }"
                  :transition="{ duration: 0.15 }"
                >
                  <div class="text-content">
                    <h3 class="title">{{ selectedCategory.name }}</h3>
                    <p>{{ `Entdecken Sie alle ${selectedCategory.name}` }}</p>
                  </div>
                  <div class="image-wrapper">
                    <img
                      v-if="selectedHeroMedia"
                      :src="selectedHeroMedia.path"
                      :alt="selectedHeroMedia.alt ?? selectedCategory.name"
                    />
                  </div>
                </Motion>
              </AnimatePresence>
            </template>
          </NavbarDrop>
        </Motion>
      </AnimatePresence>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  padding: var(--spacing-3) var(--spacing-5);

  .nav-content {
    grid-column: content;
    background-color: var(--clr-surface-primary);
    display: flex;
    align-items: center;
    height: var(--spacing-6);
    padding: 0 var(--spacing-4);
    border-radius: var(--radius-lg);
    justify-content: space-between;

    .logo-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .logo {
      width: var(--sz-3xl);
    }

    .links {
      display: none;
      gap: var(--spacing-2);

      a[data-is-current="true"] {
        color: var(--clr-accent-secondary);
      }

      @media (--from-desktop) {
        display: flex;
      }
    }

    .sheet-trigger {
      color: var(--clr-content-secondary);
      display: block;

      @media (--from-desktop) {
        display: none;
      }
    }
  }

  &[data-sheet-open="true"] .nav-content {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .navbar-sheet {
    &[data-is-open="false"] {
      display: none;
    }

    @media (--from-desktop) {
      display: none;
    }
  }

  .drop-container {
    grid-column: content;
    position: relative;

    .house-categories {
      display: flex;
      width: fit-content;
      flex-direction: column;
      gap: var(--spacing-2);

      li {
        width: fit-content;
      }
    }

    .categories-showcase {
      display: flex;
      flex-direction: column;
      justify-content: end;
      position: relative;
      overflow: hidden;
      border-radius: var(--radius-lg);
      gap: var(--spacing-4);
      align-items: start;
      height: 100%;

      &:hover,
      &:focus {
        opacity: 1;
      }

      .text-content {
        z-index: 1;
        padding-inline-start: var(--spacing-4);
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
  }
}
</style>
