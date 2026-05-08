# Reka UI Select — How it works

## The mental model

Reka Select is a **controlled compound component**. There is no single `<Select options={...} />` — instead you compose a tree of pieces, each responsible for one thing. Reka handles all the ARIA, keyboard, and portal logic; you own the data and the styling.

---

## The pieces

| Component | What it does |
|---|---|
| `SelectRoot` | Owns the open/value state. The brain. |
| `SelectTrigger` | The button the user clicks to open the dropdown. |
| `SelectValue` | Renders the currently selected label inside the trigger. |
| `SelectIcon` | Optional chevron/icon slot inside the trigger. |
| `SelectPortal` | Teleports the dropdown out of your DOM tree (avoids z-index/overflow issues). |
| `SelectContent` | The dropdown panel itself. |
| `SelectViewport` | Scroll container inside the panel. |
| `SelectItem` | One option row. Carries the `value`. |
| `SelectItemText` | The visible label of an item. |
| `SelectItemIndicator` | The checkmark shown when an item is selected. |
| `SelectLabel` | Non-selectable heading inside a group. |
| `SelectGroup` | Groups items under a label. |
| `SelectSeparator` | A visual dividing line. |

---

## Minimal working example

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from "reka-ui";

const selected = ref("price-asc");
</script>

<template>
  <SelectRoot v-model="selected">
    <SelectTrigger>
      <SelectValue placeholder="Sort by…" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent>
        <SelectViewport>
          <SelectItem value="price-asc">
            <SelectItemText>Price: low → high</SelectItemText>
            <SelectItemIndicator>✓</SelectItemIndicator>
          </SelectItem>

          <SelectItem value="price-desc">
            <SelectItemText>Price: high → low</SelectItemText>
            <SelectItemIndicator>✓</SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
```

### What happens here step by step

1. `v-model="selected"` on `SelectRoot` is a two-way bind. When the user picks an item, `selected` updates. You can also set it programmatically.
2. `SelectValue` reads the active value from `SelectRoot` and renders the matching `SelectItemText`. The `placeholder` shows when nothing is selected yet.
3. `SelectPortal` moves the dropdown to `<body>` at runtime, so it's never clipped by `overflow: hidden` on a parent.
4. `SelectItem value="price-asc"` — the `value` prop is the raw data key. It's what your `v-model` receives. It's never shown directly to the user.
5. `SelectItemText` is the human-readable label. This is also what `SelectValue` copies into the trigger when that item is active.
6. `SelectItemIndicator` only renders when the item is selected — use it for a checkmark.

---

## Passing items as props (your actual use case)

You'll almost always want to drive the items from outside the component:

```vue
<!-- Parent -->
<SortButton v-model="sort" :options="sortOptions" />
```

```ts
// In the parent or a constants file
const sortOptions = [
  { value: "price-asc",  label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
  { value: "newest",     label: "Newest first" },
];
```

```vue
<!-- SortButton.vue -->
<script setup lang="ts">
import { SelectRoot, SelectTrigger, SelectValue, SelectPortal,
         SelectContent, SelectViewport, SelectItem, SelectItemText,
         SelectItemIndicator } from "reka-ui";

interface Option {
  value: string;
  label: string;
}

const props = defineProps<{ options: Option[] }>();
const model = defineModel<string>();
</script>

<template>
  <SelectRoot v-model="model">
    <SelectTrigger>
      <SelectValue placeholder="Sort by…" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent>
        <SelectViewport>
          <SelectItem
            v-for="opt in props.options"
            :key="opt.value"
            :value="opt.value"
          >
            <SelectItemText>{{ opt.label }}</SelectItemText>
            <SelectItemIndicator>✓</SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
```

`defineModel<string>()` is the Vue 3.4 shorthand for a two-way `modelValue` prop + `update:modelValue` emit. From the parent it's just `v-model="sort"`.

---

## Grouped options with labels

```vue
<SelectViewport>
  <SelectGroup>
    <SelectLabel>Price</SelectLabel>
    <SelectItem value="price-asc">
      <SelectItemText>Low → High</SelectItemText>
    </SelectItem>
    <SelectItem value="price-desc">
      <SelectItemText>High → Low</SelectItemText>
    </SelectItem>
  </SelectGroup>

  <SelectSeparator />

  <SelectGroup>
    <SelectLabel>Date</SelectLabel>
    <SelectItem value="newest">
      <SelectItemText>Newest first</SelectItemText>
    </SelectItem>
  </SelectGroup>
</SelectViewport>
```

`SelectLabel` is purely visual — it's not selectable and doesn't affect the value.

---

## Key prop reference

| Prop | On | Type | What it does |
|---|---|---|---|
| `v-model` / `modelValue` | `SelectRoot` | `string` | The selected value |
| `defaultValue` | `SelectRoot` | `string` | Initial value, uncontrolled |
| `disabled` | `SelectRoot` | `boolean` | Disables the whole select |
| `placeholder` | `SelectValue` | `string` | Text when nothing selected |
| `value` | `SelectItem` | `string` | The data key for this option |
| `disabled` | `SelectItem` | `boolean` | Makes one option unselectable |

---

## Common mistake

`SelectValue` does **not** take a static label. This is wrong:

```vue
<!-- ❌ This always shows "Test", ignores selection -->
<SelectValue selectedLabel="Test" />
```

`SelectValue` derives its label automatically from the selected `SelectItem`'s `SelectItemText`. Just pass `placeholder` for the empty state and leave it alone.
