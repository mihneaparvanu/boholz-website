<script setup lang="ts">
import BoholzLogo from "../components/BoholzLogo.astro";
</script>
<template>
  <nav class="navbar full-width">
    <div class="logo"><BoholzLogo className="logo" width="200" /></div>
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
</style>
