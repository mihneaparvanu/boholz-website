<script setup lang="ts">
import Button from "@/ui/primitives/Button.vue";

const emit = defineEmits<{
  choose: [preset: "all" | "middle" | "essential"];
}>();
</script>

<template>
  <div class="btns">
    <Button
      @click="emit('choose', 'all')"
      size="md"
      variant="primary"
      tone="secondary"
      aria-label="Alle Cookies akzeptieren, einschließlich Statistik und Marketing"
    >
      Alle akzeptieren
    </Button>
    <Button
      @click="emit('choose', 'middle')"
      size="md"
      variant="primary"
      tone="secondary"
      aria-label="Nur essenzielle und Statistik-Cookies akzeptieren"
    >
      Statistik erlauben
    </Button>
    <Button
      @click="emit('choose', 'essential')"
      size="md"
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

  /* Equal columns: `flex: 1` (basis 0) makes width content-independent, and
     `min-width: 0` lets them shrink past the buttons' `white-space: nowrap`
     min-content width instead of overflowing the row. */
  & > * {
    flex: 1;
    min-width: 0;
  }

  /* Mobile: stack so each button is full-width — the pattern Button.vue
     documents for inline button rows (avoids the squeezed/overflowing row). */
  @media (--mobile) {
    flex-direction: column;
  }
}
</style>
