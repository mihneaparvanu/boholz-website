<script setup lang="ts">
import { X } from "lucide-vue-next";

const isOpen = defineModel<boolean>("isOpen", { required: true });

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: "Fläche ↑", value: "livingArea_asc" },
  { label: "Fläche ↓", value: "livingArea_desc" },
  { label: "Preis ↑", value: "price_asc" },
  { label: "Preis ↓", value: "price_desc" },
  { label: "Schlafzimmer ↑", value: "bedrooms_asc" },
  { label: "Schlafzimmer ↓", value: "bedrooms_desc" },
  { label: "Etagen ↑", value: "floorCount_asc" },
  { label: "Etagen ↓", value: "floorCount_desc" },
];
</script>

<template>
  <div class="page-wrapper" @click="isOpen = false" v-if="isOpen">
    <div class="filter-sort-pane">
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
          <div class="sort-options">
            <h5>Sortieren</h5>
            <div
              class="sort-option"
              v-for="option in sortOptions"
              :key="option.value"
            >
              {{ option.label }}
            </div>
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
.filter-sort-pane {
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
  }
}
</style>
