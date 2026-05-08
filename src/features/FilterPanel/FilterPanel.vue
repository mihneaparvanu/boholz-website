<script setup lang="ts">
import { X } from "lucide-vue-next";
import {
  type ActiveFilter,
  type FilterOption,
  type SortOption,
} from "./filter-panel.types";
import { sortOptions, filterOptions } from "./filter-panel.options";
import OptionsButton from "./OptionsButton.vue";

const isOpen = defineModel<boolean>("isOpen", { required: true });
const sort = defineModel<SortOption | null>("sort", { required: true });
const filter = defineModel<ActiveFilter | null>("filter", { required: true });

const selectFilter = (
  option: FilterOption,
  value: boolean | number | string,
) => {
  filter.value = { option, value } as ActiveFilter;
};
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
          <div class="filter-options" v-for="option in filterOptions">
            <h5>{{ option.label }}</h5>
            <div class="filter-options">
              <OptionsButton
                v-if="option.kind === 'boolean'"
                :title="option.label"
                @click="selectFilter(option, true)"
              ></OptionsButton>
              <OptionsButton
                v-if="option.kind === 'count'"
                v-for="val in option.values"
                :key="val"
                :title="val.toString()"
                @click="selectFilter(option, val)"
              ></OptionsButton>
            </div>
          </div>
          <h5>Sortieren</h5>
          <div class="sort-options">
            <OptionsButton
              class="sort-option"
              v-for="option in sortOptions"
              :key="option.value + option.direction"
              :title="option.label"
              @click="sort = option"
            >
            </OptionsButton>
          </div>
        </div>
        <div class="buttons"></div>
      </div>
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
