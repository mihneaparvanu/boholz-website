<script setup lang="ts">
import { ref } from "vue";

import BoholzLogo from "../../components/BoholzLogo.vue";
import NavbarSheet from "./NavbarSheet.vue";
import NavbarDrop from "./NavbarDrop.vue";
import NAV_ROUTES from "../../utils/routes";
import { Menu } from "lucide-vue-next";
import type { NavbarCategory } from "../../data/loaders";

const props = defineProps<{
  categories: NavbarCategory[];
  currentPath: string;
}>();

const selectedCategory = ref<NavbarCategory | null>(null);

const selectCategory = (category: NavbarCategory) => {
  selectedCategory.value = category;
};
const isSheetOpen = ref(false);
const isDropOpen = ref(false);
</script>
<template>
  <nav class="navbar subgrid">
    <div class="nav-content">
      <div class="logo-links">
        <a class="logo" href="/"> <BoholzLogo class="logo-svg" /></a>

        <ul class="links">
          <li
            v-for="route in NAV_ROUTES"
            :key="route.path"
            @mouseover="
              route.path === '/hauser' && props.currentPath !== '/hauser'
                ? (isDropOpen = true)
                : (isDropOpen = false)
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
    <div class="drop-container" @mouseleave="isDropOpen = false">
      <NavbarDrop v-if="isDropOpen">
        <template #leading>
          <ul class="house-categories">
            <li
              v-for="category in props.categories"
              :key="category.id"
              @mouseover="selectCategory(category)"
              @mouseleave="selectedCategory = null"
            >
              <a :href="`/hauser?category=${category.slug}`">{{
                category.name
              }}</a>
            </li>
          </ul>
        </template>
        <template #trailing>
          <div v-if="selectedCategory" class="categories-showcase">
            <div class="text-content">
              <h3 class="title">{{ selectedCategory?.name }}</h3>
              <p>{{ `Entdecken Sie alle ${selectedCategory?.name}` }}</p>
            </div>
            <div class="image-wrapper">
              <img
                v-if="selectedCategory?.heroImage"
                :src="selectedCategory.heroImage.path"
                :alt="selectedCategory.heroImage.alt ?? selectedCategory.name"
              />
            </div>
          </div>
        </template>
      </NavbarDrop>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;

  .nav-content {
    background-color: var(--clr-surface-primary);
    display: flex;
    align-items: center;
    padding: var(--spacing-3) var(--spacing-4);
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

  .navbar-sheet {
    &[data-is-open="false"] {
      display: none;
    }

    @media (--from-desktop) {
      display: none;
    }
  }

  .drop-container {
    position: relative;

    .house-categories {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
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

      .text-content {
        z-index: 1;
        padding: var(--spacing-2) 0;
        .title {
          font-size: var(--fs-h6);
        }
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
