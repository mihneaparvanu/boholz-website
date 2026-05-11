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
        <div class="filter-options">
          <div class="filter-option" v-for="option in filterOptions">
            <h5>{{ option.label }}</h5>
            <OptionsButton
              v-if="option.kind === 'boolean'"
              :title="option.label"
              @click="selectFilter(option, true)"
            ></OptionsButton>
            <div class="filter-option-values">
              <OptionsButton
                v-if="option.kind === 'count'"
                v-for="val in option.values"
                :key="val"
                :title="val.toString()"
                @click="selectFilter(option, val)"
              ></OptionsButton>
              <OptionsButton
                v-if="option.kind === 'enum'"
                v-for="opt in option.options"
                :key="opt"
                :title="opt.toString()"
                @click="selectFilter(option, opt)"
              ></OptionsButton>
            </div>
          </div>
        </div>
      </div>
      <div class="trailing-buttons">
        <button @click="filter = null">Alle löschen</button>
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
  background-color: var(--clr-overlay);
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

    .filter-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);

      .filter-option {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-1);

        .filter-option-values {
          display: flex;
          gap: var(--spacing-1);
          flex-wrap: wrap;
        }
      }
    }
  }

  .trailing-buttons {
    --margin: var(--spacing-4);
    margin-block: 0 var(--margin);
    margin-inline: var(--margin) 0;
    display: flex;
    button {
      height: var(--control-height-md);
      padding: 0 var(--spacing-3);
      border: 1px solid var(--clr-accent-secondary);
      color: var(--clr-accent-secondary);
      border-radius: var(--radius-sm);
      font: inherit;
      font-weight: 400;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }
  }
}
</style>
