<script setup lang="ts">
import { X } from "lucide-vue-next";
import { sortOptions } from "./filter-panel.options";
import OptionsButton from "./OptionsButton.vue";

const isOpen = defineModel<boolean>("isOpen", { required: true });
const sortOption = defineModel<string>("sortOption", { required: true });
</script>

<template>
  <div class="page-wrapper" @click="isOpen = false" v-if="isOpen">
    <div class="filter-panel">
      <div class="control-panel">
        <div class="close-action">
          <button @click="isOpen = false">
            <X />
          </button>
        </div>
        <div class="filter-sort">
          <div class="filter-options">
            <h5>Filtern</h5>
          </div>
          <h5>Sortieren</h5>
          <div class="sort-options">
            <OptionsButton
              class="sort-option"
              v-for="option in sortOptions"
              :key="option.value + option.direction"
              :title="option.label"
              @click="sortOption = option.value + option.direction"
            >
            </OptionsButton>
          </div>
        </div>
      </div>
      <div class="buttons"></div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 15;
}
.filter-panel {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  width: 30%;
  height: 100vh;
  background-color: var(--clr-surface-primary);
  justify-content: space-between;
  z-index: 20;

  .control-panel {
    padding: var(--spacing-4);

    .close-action {
      display: flex;
      justify-content: end;
    }

    .sort-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }
  }
}
</style>
