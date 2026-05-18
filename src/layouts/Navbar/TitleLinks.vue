<script setup lang="ts">
import type { Location } from "@/layouts/types/models";
import { ROUTES } from "@/utils/routes";

const { showhouses } = defineProps<{
  showhouses: Location[];
}>();
</script>

<template>
  <div class="title-links">
    <p class="title">Musterhäuser</p>
    <ul class="links">
      <li v-for="showhouse in showhouses" :key="showhouse.id">
        <a :href="ROUTES.musterhaus(showhouse.slug)">{{ showhouse.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.title-links {
  font-size: var(--fs-body);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);

  .links {
    font-size: var(--fs-body-sm);
    color: var(--clr-content-tertiary);
  }
}
</style>
