<script setup lang="ts">
import BoholzLogo from "@/ui/icons/BoholzLogo.vue";
import { ROUTES } from "@/features/navigation/routes";

withDefaults(
  defineProps<{
    /** Drives the underlying logo coloring. "brand" = two-tone, "mono" = currentColor. */
    tone?: "brand" | "mono";
  }>(),
  { tone: "brand" },
);
</script>

<template>
  <a class="logo" :href="ROUTES.home" aria-label="BoHolz Haus – Startseite">
    <BoholzLogo :tone="tone" aria-hidden="true" />
  </a>
</template>

<style scoped>
.logo {
  display: inline-flex;
  width: var(--sz-3xl);
  color: inherit;
  transition: color 160ms ease;
}
</style>
