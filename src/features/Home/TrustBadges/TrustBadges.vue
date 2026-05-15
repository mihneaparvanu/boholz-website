<script setup lang="ts">
import Card from "@/components/ui/Card.vue";
import type { TrustBadge } from "./trust-badges.content";

defineProps<{
  badges: TrustBadge[];
}>();
</script>

<template>
  <div class="badges">
    <Card
      v-for="b in badges"
      :key="b.title"
      :title="b.title"
      :value="b.value"
      :suffix="b.suffix"
      :icon="b.icon"
    />
  </div>
</template>

<style scoped>
.badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--spacing-3);
  width: 100%;
}
</style>
