<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "reka-ui";
</script>

<template>
  <div class="sort-button">
    <SelectRoot>
      <SelectTrigger>
        <SelectValue placeholder="Test" />
      </SelectTrigger>
    </SelectRoot>
  </div>
</template>

<style scoped>
.sort-button {
}
</style>
