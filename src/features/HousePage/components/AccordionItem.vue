<script setup lang="ts">
import { ref } from "vue";
import { ChevronUp } from "lucide-vue-next";
import Separator from "./Separator.vue";

const props = defineProps<{
  label: string;
}>();

const isOpen = ref(false);
</script>

<template>
  <div class="item-wrapper" :data-is-open="isOpen">
    <Separator />
    <div
      class="feature-item"
      @click="isOpen = !isOpen"
      role="button"
      :aria-expanded="isOpen"
    >
      <span>{{ props.label }}</span>
      <ChevronUp />
    </div>
    <div class="item-content"><slot /></div>
  </div>
</template>

<style scoped>
.item-wrapper {
  &[data-is-open="true"] {
    svg {
      transform: rotate(180deg);
    }
    .item-content {
      display: block;
    }
  }
}
.feature-item {
  padding-block: var(--spacing-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  cursor: pointer;
}
.item-content {
  display: none;
}
</style>
