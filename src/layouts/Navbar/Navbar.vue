<script setup lang="ts">
import { ref } from "vue";

import BoholzLogo from "../../components/BoholzLogo.vue";
import NavbarSheet from "./NavbarSheet.vue";
import NAV_ROUTES from "../../utils/routes";
import { Menu } from "lucide-vue-next";

const isSheetOpen = ref(false);
</script>
<template>
  <nav class="navbar subgrid">
    <div class="nav-content">
      <div class="logo-links">
        <a class="logo" href="/"> <BoholzLogo class="logo-svg" /></a>

        <ul class="links">
          <li v-for="route in NAV_ROUTES" :key="route.path">
            <a :href="route.path">{{ route.label }}</a>
          </li>
        </ul>
      </div>
      <div class="cta"></div>
      <button class="sheet-trigger" @click="isSheetOpen = !isSheetOpen">
        <Menu />
      </button>
    </div>
    <NavbarSheet :routes="NAV_ROUTES" :data-is-open="isSheetOpen" />
  </nav>
</template>
<style scoped>
.navbar {
  position: sticky;
  top: 0;
  background-color: var(--clr-surface-primary);
  display: grid;
  grid-template-columns: subgrid;
  z-index: 10;

  .nav-content {
    display: flex;
    align-items: center;
    padding-block: 2rem;
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
}
</style>
