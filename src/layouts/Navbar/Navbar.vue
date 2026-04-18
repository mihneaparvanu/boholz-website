<script setup lang="ts">
import BoholzLogo from "../../components/BoholzLogo.vue";
import NavbarSheet from "./NavbarSheet.vue";

import NAV_ROUTES from "../../utils/routes";
</script>
<template>
  <nav class="navbar full-width">
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
    </div>
    <NavbarSheet :routes="NAV_ROUTES" />
  </nav>
</template>
<style scoped>
.navbar {
  position: sticky;
  top: 0;
  background-color: var(--clr-surface-primary);

  .nav-content {
    display: flex;
    align-items: center;
    padding: 2rem var(--padding-inline);
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
  }

  .navbar-sheet {
    @media (--from-desktop) {
      display: none;
    }
  }
}
</style>
