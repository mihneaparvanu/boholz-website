<script setup lang="ts">
import Card from "@/components/ui/Card.vue";
import { LucideShieldCheck, LucideLeaf, LucideAward } from "lucide-vue-next";

const badges = [
  { icon: LucideShieldCheck, title: "100% Made in Germany", value: "25" },
  { icon: LucideAward, title: "Zertifizierte Qualität", value: "12" },
  { icon: LucideLeaf, title: "Nachhaltig & CO₂-neutral", value: "100" },
];
</script>

<template>
  <div class="badges">
    <Card
      v-for="b in badges"
      :key="b.title"
      :title="b.title"
      :value="b.value"
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
