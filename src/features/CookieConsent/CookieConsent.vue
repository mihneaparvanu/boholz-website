<script setup lang="ts">
import { ref } from "vue";
import ConsentNotice from "./ConsentNotice.vue";
import ConsentPreferences from "./ConsentPreferences.vue";

const noticeVisible = ref(false);
const prefVisible = ref(false);
</script>

<template>
  <div v-if="noticeVisible || prefVisible" class="root">
    <ConsentPreferences v-if="prefVisible" />
    <ConsentNotice
      v-if="noticeVisible && !prefVisible"
      v-model:prefVisible="prefVisible"
    />
  </div>
</template>

<style scoped>
.root {
  position: fixed;
  bottom: var(--spacing-4);
  left: 0;
  right: 0;
  max-width: 40%;
  margin-inline: auto;
  padding: var(--spacing-3);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 10;

  @media (--below-desktop) {
    max-width: none;
  }
}
</style>
