<script setup lang="ts">
import BoholzLogo from "../components/BoholzLogo.vue";
</script>
<template>
  <nav class="navbar full-width">
    <div class="logo"><BoholzLogo class="logo-svg" /></div>
    <div class="links"></div>
    <div class="cta"></div>
  </nav>
</template>
<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem var(--padding-inline);
  background-color: var(--clr-surface-primary);
}

.logo {
  width: var(--sz-3xl); /* Resize cleanly with CSS wrapper! */
}
</style>
