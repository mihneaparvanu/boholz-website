<script setup lang="ts">
import { computed, ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import {
  type ActiveFilter,
  type FilterOption,
  type FilterState,
} from "./filter-panel.types";
import { filterOptions } from "./filter-panel.options";
import OptionsButton from "./OptionsButton.vue";

const props = defineProps<{ modelsCount: number }>();

const emit = defineEmits<{
  "filter-confirmed": [];
}>();

const filterState = defineModel<FilterState>("filterState", { required: true });
const isOpen = defineModel<boolean>("isOpen", { required: true });

const appendFilter = (filter: ActiveFilter, filters: ActiveFilter[]) => {
  const isDuplicate = filters.find((f) => f.value === filter.value);

  if (isDuplicate) return filters;
  return [...filters, filter];
};

const handleOptionSelect = (
  option: FilterOption,
  value: boolean | number | string,
) => {
  const selectedFilter = { option, value } as ActiveFilter;
  filterState.value = {
    status: "pending",
    filters: appendFilter(selectedFilter, filterState.value.filters),
  };
};

const handleFilterConfirmed = () => {
  if (filterState.value.status !== "pending") return;
  filterState.value = {
    status: "confirmed",
    filters: filterState.value.filters,
  };
  emit("filter-confirmed");
};

const handleReset = () => {
  filterState.value = { status: "inactive", filters: [] };
};
</script>

<template>
  <div class="page-wrapper" @click="isOpen = false" v-if="isOpen">
    <div class="filter-panel" @click.stop="">
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
              @click="handleOptionSelect(option, true)"
            ></OptionsButton>
            <div class="filter-option-values">
              <OptionsButton
                v-if="option.kind === 'count'"
                v-for="val in option.values"
                :key="val"
                :title="val.toString()"
                @click="handleOptionSelect(option, val)"
              ></OptionsButton>
              <OptionsButton
                v-if="option.kind === 'enum'"
                v-for="opt in option.options"
                :key="opt"
                :title="opt.toString()"
                @click="handleOptionSelect(option, opt)"
              ></OptionsButton>
            </div>
          </div>
        </div>
      </div>
      <div class="trailing-buttons">
        <button @click="handleReset">Alle löschen</button>
        <button @click="handleFilterConfirmed" class="confirm-btn">
          <span class="label"> Entdecken </span>
          <div class="count-box">
            <AnimatePresence mode="wait">
              <Motion
                :key="modelsCount"
                :initial="{ opacity: 0, y: 8 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: -8 }"
                :transition="{ duration: 0.25 }"
                class="count"
                >{{ modelsCount }}</Motion
              >
            </AnimatePresence>
          </div>
        </button>
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
  width: 100%;
  height: 100vh;
  background-color: var(--clr-surface-primary);
  justify-content: space-between;
  z-index: 20;

  @media (--from-tablet) {
    width: 60%;
  }

  @media (--from-desktop) {
    width: 30%;
  }

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
    margin-inline: var(--margin) var(--margin);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);

    @media (--from-wide) {
      flex-direction: row;
    }

    button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-1);
      height: var(--control-height-md);
      padding: 0 var(--spacing-5);
      border: 1px solid var(--clr-accent-secondary);
      color: var(--clr-accent-secondary);
      border-radius: var(--radius-sm);
      font: inherit;
      font-weight: 400;
      cursor: pointer;
      white-space: nowrap;
      position: relative;
      overflow: hidden;

      &.confirm-btn {
        background-color: var(--clr-accent-primary);
        color: var(--clr-surface-primary);
      }
    }

    .count-box {
      position: relative;
      height: 100%;
      display: flex;
      width: 2ch;
      margin-inline-end: var(--spacing-2);
    }
    .count {
      position: absolute;
      inset: 0;
      margin: auto;
      height: fit-content;
      text-align: center;
    }
  }
}
</style>
