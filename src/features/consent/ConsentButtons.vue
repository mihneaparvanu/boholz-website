<script setup lang="ts">
import Button from "@/ui/primitives/Button.vue";
</script>

<template>
  <div class="btns">
    <Button
      size="sm"
      variant="primary"
      tone="secondary"
      aria-label="Alle Cookies akzeptieren, einschließlich Statistik und Marketing"
    >
      Alle akzeptieren
    </Button>
    <Button
      size="sm"
      variant="primary"
      tone="secondary"
      aria-label="Nur essenzielle und Statistik-Cookies akzeptieren"
    >
      Statistik erlauben
    </Button>
    <Button
      size="sm"
      variant="primary"
      tone="secondary"
      aria-label="Nur essenzielle Cookies akzeptieren, Statistik und Marketing ablehnen"
    >
      Nur essenzielle
    </Button>
  </div>
</template>

<style scoped>
.btns {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: nowrap;

  & > * {
    width: 100%;
  }
}
</style>
