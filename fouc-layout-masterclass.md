# FOUC, Layout Shifts & Design System Mastery

## A Brutally Practical Masterclass

---

## Part 1: FOUC — Flash of Unstyled Content

### What it actually is

FOUC happens when the browser renders HTML **before** CSS is available.  
You see raw, unstyled markup for a split second, then styles snap in.

The cause is always the same: **CSS loaded asynchronously or after paint**.

```html
<!-- CAUSES FOUC — script at the bottom, but deferred stylesheet -->
<head>
  <link
    rel="stylesheet"
    href="/styles.css"
    media="print"
    onload="this.media='all'"
  />
</head>

<!-- SAFE — CSS in head, render-blocking by design -->
<head>
  <link rel="stylesheet" href="/styles.css" />
</head>
```

Render-blocking CSS is **not a bug** — it is the intended mechanism to prevent FOUC.  
You only fight render-blocking when you have **too much** CSS not needed for the first paint.

---

### iOS equivalent

In UIKit, `viewDidLoad` fires before the first frame is drawn.  
In SwiftUI, the view body is evaluated synchronously before display.  
**There is no FOUC concept in native iOS.** The OS guarantees layout is resolved before anything is visible.

Web has no such guarantee — the browser will paint whatever it has right now.

---

### FOUC in Astro + Vue

Astro ships zero JavaScript by default. Static HTML + CSS = no FOUC.  
The risk arrives the moment you use:

- `client:load` — component hydrates after page load, SSR HTML shows first
- `client:idle` — hydrates when browser is idle
- `client:visible` — hydrates on scroll-into-view

**The SSR-rendered HTML is the FOUC frame.** If it looks good, you are fine.  
The SSR output is what the user sees before hydration. Design it accordingly.

```astro
<!-- This shows static HTML first, then Vue takes over -->
<!-- FOUC-safe as long as the static output is styled -->
<SortButton client:load />
```

**Rule**: Never hide an element during hydration and then show it. That is a FOUC in reverse.

---

### FOUC from fonts (the sneaky one)

```css
/* CAUSES font FOUC — browser shows fallback, then swaps */
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2");
  font-display: swap; /* <-- this is the tradeoff */
}

/* Prevents swap but delays text render */
font-display: block;

/* Best for body text — invisible for up to 3s, then fallback, no swap */
font-display: optional;
```

The real fix is **preloading** the font:

```html
<head>
  <link
    rel="preload"
    href="/fonts/myfont.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>
```

Astro does this automatically when you import fonts via `@astrojs/fonts` or reference them correctly.

---

## Part 2: CLS — Cumulative Layout Shift

### What it is

CLS is a Core Web Vital. Google scores it. It measures how much elements **jump around** after the first paint.

Score:

- `< 0.1` — Good
- `0.1–0.25` — Needs Improvement
- `> 0.25` — Poor (hurts SEO, hurts users)

---

### Cause 1: Images without dimensions

```html
<!-- BAD — browser has no idea how tall this will be until it loads -->
<img src="/photo.jpg" alt="house" />

<!-- GOOD — browser reserves space immediately -->
<img src="/photo.jpg" alt="house" width="800" height="600" />
```

```css
/* Also good — always set aspect-ratio on images */
img {
  aspect-ratio: 4 / 3;
  width: 100%;
  height: auto;
}
```

In iOS, `UIImageView` has a fixed frame. The image fills it. No shift, ever.  
Web images are inline elements with zero intrinsic size until the network responds.

---

### Cause 2: The SortButton width shift (you just lived this)

Your `SelectTrigger` was resizing as the selected option text changed.  
The browser re-laid out everything around it.

Fix — reserve space for the widest content:

```css
.trigger {
  min-width: 160px; /* floor — never narrower than this */
  white-space: nowrap; /* don't wrap on any option text */
}
```

The iOS equivalent is `setContentHuggingPriority` + `setContentCompressionResistancePriority`.  
In SwiftUI: `.frame(minWidth: 160)`.  
Same concept. Different syntax.

---

### Cause 3: Dynamic content injected above the fold

```vue
<!-- BAD — notification banner appears and pushes everything down -->
<div v-if="showBanner" class="banner">Update available</div>
<main>...</main>
```

Fix — always pre-allocate space even when empty:

```vue
<!-- GOOD — same height always, just invisible when not shown -->
<div class="banner" :class="{ visible: showBanner }">Update available</div>
```

```css
.banner {
  height: 48px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.banner.visible {
  opacity: 1;
  pointer-events: auto;
}
```

---

### Cause 4: Async data making the page taller

```vue
<!-- BAD — empty -> list appears -> layout shifts -->
<template>
  <ul>
    <li v-for="item in items">{{ item.name }}</li>
  </ul>
</template>
```

Fix — skeleton screens. Reserve the exact space:

```vue
<template>
  <ul>
    <template v-if="loading">
      <li v-for="i in 5" :key="i" class="skeleton" />
    </template>
    <template v-else>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </template>
  </ul>
</template>
```

```css
.skeleton {
  height: 64px; /* same as real item */
  background: var(--clr-surface-secondary);
  border-radius: var(--radius-sm);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
```

iOS equivalent: `UICollectionView` with placeholder cells.  
SwiftUI: `.redacted(reason: .placeholder)`.

---

## Part 3: Stacking Context Hell / Z-Index Hell

### What causes it

Every `position: relative/absolute/fixed/sticky` with a `z-index` creates a **stacking context**.  
Elements inside a stacking context can never visually escape it.

```css
/* This parent creates a stacking context */
.card {
  position: relative;
  z-index: 1;
  overflow: hidden; /* also creates it */
  transform: scale(1); /* also creates it */
  opacity: 0.99; /* ALSO creates it — insane but true */
}

/* This child's z-index: 9999 is STILL trapped inside .card */
.card .dropdown {
  z-index: 9999; /* useless outside the card's stacking context */
}
```

### The fix: Portal

A Portal teleports DOM nodes to the document body (or another target).  
It escapes all stacking contexts.

In Reka UI:

```vue
<SelectPortal>
  <SelectContent>...</SelectContent>
</SelectPortal>
```

This is why `SelectPortal` exists. Without it, your dropdown clips behind a parent with `overflow: hidden`.

Headless UI libraries all use this pattern. Radix, Reka, Headless UI — all portal their overlays.

**iOS equivalent**: `UIWindow` with a high `windowLevel`. Same idea — escape the normal view hierarchy.  
In SwiftUI: `.overlay(alignment:)` at the root level or using `ZStack` in the App root.

---

### Z-index system (stop using random numbers)

```css
/* Define a layer system as tokens */
:root {
  --z-below: -1;
  --z-base: 0;
  --z-raised: 10; /* cards, hover states */
  --z-dropdown: 100; /* menus, tooltips */
  --z-sticky: 200; /* sticky headers */
  --z-overlay: 300; /* modals, drawers */
  --z-toast: 400; /* notifications */
  --z-top: 500; /* emergency override */
}
```

Never type a raw z-index number. Always use a token.

---

## Part 4: Overflow Hidden Trap

`overflow: hidden` on a parent clips all children — **including portals that haven't rendered yet**.  
But more subtly, it clips anything `position: absolute` that should peek outside.

```css
/* Slider container - DO NOT add overflow: hidden to this if cards have dropdowns */
.slider {
  overflow: hidden; /* clips the dropdown inside HouseModelSelector */
}
```

Fix options in order of preference:

1. Use `SelectPortal` — teleports outside the overflow container
2. Use `overflow: clip` instead of `overflow: hidden` (doesn't create stacking context)
3. Remove `overflow: hidden` and clip with a wrapping mask/gradient instead

```css
/* Alternative: fade mask instead of hard clip */
.slider {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 5%,
    black 95%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    black 5%,
    black 95%,
    transparent
  );
}
```

---

## Part 5: Vue Reactivity Gotchas

### ref vs reactive

```ts
// ref — use for primitives, and honestly for everything
const count = ref(0);
count.value++; // mutate via .value

// reactive — use for objects you want to mutate directly
const state = reactive({ count: 0, name: "" });
state.count++; // no .value needed

// PROBLEM with reactive — you can't destructure it
const { count } = state; // ❌ loses reactivity
const { count } = toRefs(state); // ✅ each prop is a ref
```

**Rule of thumb**: Use `ref` for everything. Use `reactive` only when you have a closely coupled group of related values and know what you're doing.

---

### Array mutations

Vue 3 tracks arrays reactively, but there are still footguns:

```ts
const items = ref([1, 2, 3]);

// SAFE mutations
items.value.push(4);
items.value.splice(1, 1);
items.value = [...items.value, 4]; // replace entirely

// UNSAFE in Vue 2, fine in Vue 3 (Proxy-based)
items.value[0] = 99; // ✅ works in Vue 3
```

---

### Computed vs Watch

```ts
// computed — derive a value, memoized, reads like a ref
const sortedItems = computed(() =>
  [...items.value].sort((a, b) => a.price - b.price),
);

// watch — run a side effect when a value changes
watch(sortValue, (newVal) => {
  analytics.track("sort_changed", { value: newVal });
});

// watchEffect — run immediately and re-run on any reactive dependency
watchEffect(() => {
  document.title = `${items.value.length} houses`;
});
```

**Rule**: If you can express it as `computed`, never use `watch`.  
`watch` is for side effects only (API calls, analytics, DOM manipulation).

iOS comparison:

- `computed` → `@Derived` / `var derived: T { get { ... } }` in SwiftUI
- `watch` → `onChange(of:)` modifier or `didSet` on `@State`
- `watchEffect` → `.task {}` modifier (runs on appear + dependency change)

---

### defineModel — the v-model shorthand

```ts
// Old pattern
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
// ... emit('update:modelValue', newVal)

// New pattern (Vue 3.4+)
const model = defineModel<string>();
model.value = "new value"; // automatically emits update
```

Named model for multiple v-models:

```ts
const sort = defineModel<string | null>("sort");
const filter = defineModel<string[]>("filter");
```

In the parent:

```vue
<SortButton v-model:sort="sortValue" v-model:filter="activeFilters" />
```

---

## Part 6: Mastering Design Systems + CSS

### The mental model shift

iOS has a truth: **every view has a fixed size**. The system does the math.  
Web has a truth: **everything is a flow**. You are fighting entropy.

The solution is the same in both worlds: **constraints + tokens**.

- iOS: `NSLayoutConstraint` / SwiftUI `frame()`, `padding()`, `spacing()`
- Web: design tokens → CSS custom properties + a component contract

---

### Token hierarchy

```css
/* Tier 1 — Raw values. Never use directly in components. */
:root {
  --raw-blue-500: #3b82f6;
  --raw-gray-100: #f3f4f6;
  --raw-spacing-4: 16px;
  --raw-radius-md: 8px;
}

/* Tier 2 — Semantic tokens. Map raw values to meaning. */
:root {
  --clr-accent-primary: var(--raw-blue-500);
  --clr-surface-primary: var(--raw-gray-100);
  --spacing-4: var(--raw-spacing-4);
  --radius-md: var(--raw-radius-md);
}

/* Tier 3 — Component tokens. Scoped to a component. */
.button {
  --button-bg: var(--clr-accent-primary);
  --button-radius: var(--radius-md);
  background: var(--button-bg);
  border-radius: var(--button-radius);
}
```

**Why 3 tiers**: You can retheme the entire app by swapping Tier 2 values.  
Components never depend on raw values — only on semantic tokens.

iOS equivalent: `UIColor.systemBlue` (semantic) vs `UIColor(red:green:blue:)` (raw).  
SwiftUI: `Color.accentColor` vs `Color(red:green:blue:)`.

---

### Vanilla Extract — type-safe CSS tokens

```ts
// tokens.css.ts
import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    accentPrimary: "#3b82f6",
    surfacePrimary: "#f3f4f6",
  },
  spacing: {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
});
```

```ts
// button.css.ts
import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

export const base = style({
  display: "inline-flex",
  alignItems: "center",
  padding: `${vars.spacing["2"]} ${vars.spacing["4"]}`,
  borderRadius: vars.radius.md,
  border: "none",
  cursor: "pointer",
});

// Variants — like SwiftUI ButtonStyle
export const variants = styleVariants({
  primary: {
    background: vars.color.accentPrimary,
    color: "white",
  },
  ghost: {
    background: "transparent",
    border: `1px solid ${vars.color.accentPrimary}`,
    color: vars.color.accentPrimary,
  },
});
```

```vue
<script setup lang="ts">
import { base, variants } from "./button.css";
defineProps<{ variant?: "primary" | "ghost" }>();
</script>

<template>
  <button :class="[base, variants[variant ?? 'primary']]">
    <slot />
  </button>
</template>
```

**What you get**:

- TypeScript errors if you reference a token that doesn't exist
- Dead code elimination — unused styles are tree-shaken
- Zero runtime — all resolved at build time
- Autocomplete on every token

iOS equivalent: `ButtonStyle` protocol + `StyleSheet` enum.  
This is exactly the SwiftUI component model, just in CSS.

---

### Recipes — multi-variant components

```ts
// card.css.ts
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "./tokens.css";

export const card = recipe({
  base: {
    borderRadius: vars.radius.lg,
    padding: vars.spacing["4"],
    background: vars.color.surfacePrimary,
  },
  variants: {
    size: {
      sm: { padding: vars.spacing["2"] },
      md: { padding: vars.spacing["4"] },
      lg: { padding: vars.spacing["6"] },
    },
    elevated: {
      true: { boxShadow: "0 4px 16px rgba(0,0,0,0.12)" },
      false: {},
    },
  },
  defaultVariants: {
    size: "md",
    elevated: false,
  },
});
```

```vue
<div :class="card({ size: 'lg', elevated: true })">...</div>
```

This is **identical** to SwiftUI `.buttonStyle(MyStyle())` + `@Environment` propagation.  
The recipe IS the ViewModifier.

---

### How to organize CSS in a growing project

```
src/
  style/
    reset.css          ← baseline — only touch once
    tokens.css         ← all :root custom properties
    typography.css     ← font sizes, weights, line-heights
    breakpoints.css    ← media query helpers
    animations.css     ← shared keyframes
    layout.css         ← grid/flex utilities
  components/
    Button/
      Button.vue
      button.css.ts    ← Vanilla Extract for this component only
    Card/
      Card.vue
      card.css.ts
```

**Rule**: A component's CSS lives with the component.  
Global CSS files are only for tokens, resets, and typography.  
Never write component-specific styles in a global file.

---

### Scoped styles vs CSS modules vs Vanilla Extract

| Method              | Isolation     | Tokens      | Type Safety | Runtime |
| ------------------- | ------------- | ----------- | ----------- | ------- |
| `<style scoped>`    | Per component | Manual      | None        | None    |
| CSS Modules         | Per component | Manual      | Partial     | None    |
| Vanilla Extract     | Per file      | First class | Full        | None    |
| CSS-in-JS (emotion) | Per component | First class | Full        | **Yes** |

In Astro + Vue, `<style scoped>` is fine for small components.  
When you need reusable variants or a real design system, Vanilla Extract wins.

---

## Part 7: The Perfect Component Recipe

### What makes a component feel "perfect"

1. **It does one thing**
2. **It controls its own spacing internally (padding), not externally (margin)**
3. **It accepts a variant prop, not a class override**
4. **It uses slots for content, not props for strings**
5. **It is accessible by default**

```vue
<!-- BAD — the parent controls spacing, breaks encapsulation -->
<Button style="margin-top: 16px">Submit</Button>

<!-- GOOD — parent adds spacing via layout -->
<div class="form-actions">  <!-- form-actions has gap: 16px -->
  <Button>Cancel</Button>
  <Button variant="primary">Submit</Button>
</div>
```

---

### The Separator Principle

Never use `margin-bottom` on components. Use `gap` in the parent.

```css
/* BAD */
.card {
  margin-bottom: 24px;
}

/* GOOD — the card knows nothing about its siblings */
.card-grid {
  display: grid;
  gap: 24px;
}
.card {
  /* no margin */
}
```

iOS equivalent: `VStack(spacing: 24)`. The stack owns the spacing, not the child.

---

### Accessibility as structure

Every interactive element needs:

```vue
<button
  :aria-label="label ?? undefined"
  :aria-pressed="isActive"
  :aria-expanded="isOpen"
  :aria-disabled="disabled"
  :tabindex="disabled ? -1 : 0"
>
```

Reka UI handles most of this automatically — that's the point of headless UI.  
You get the ARIA for free; you provide the CSS.

In iOS, `UIAccessibilityElement` + `accessibilityLabel` + `accessibilityTraits`.  
SwiftUI: `.accessibilityLabel()` + `.accessibilityAddTraits(.isButton)`.

---

### The `all: unset` pattern

When building on top of HTML elements that carry browser defaults:

```css
.trigger {
  all: unset; /* strips ALL browser styles */
  box-sizing: border-box; /* restore this — all: unset removes it */
  /* now build from scratch */
  display: flex;
  cursor: pointer;
}
```

You did this in SortButton already. It's the right call for every custom interactive element.

---

### Data attribute targeting (Reka / headless UI)

Reka applies `data-*` attributes to reflect component state.  
Use them for state-driven styling instead of JavaScript class toggling:

```css
/* Trigger open state */
.trigger[data-state="open"] {
  border-color: var(--clr-accent-primary);
  background: var(--clr-surface-secondary);
}

/* Chevron rotation */
.trigger[data-state="open"] .chevron {
  transform: rotate(180deg);
}

/* Item hover */
.item[data-highlighted] {
  background: var(--clr-surface-secondary);
  outline: none;
}

/* Selected item */
.item[data-state="checked"] {
  color: var(--clr-accent-primary);
  font-weight: 600;
}
```

This is the same as SwiftUI's `ButtonStyle` receiving a `Configuration` with `isPressed`, `isEnabled` etc.  
State flows down. You react to it in CSS, not JS.

---

## Part 8: Diagnostic Checklist

When something looks wrong, run through this in order:

### Layout Shift

- [ ] Does the element have explicit dimensions? (`width`, `height`, `aspect-ratio`)
- [ ] Does the content change size after render? (async data, font swap, option change)
- [ ] Is `min-width`/`min-height` set to prevent collapse?
- [ ] Is a banner/notification injected above the fold?

### FOUC

- [ ] Is CSS loaded in `<head>`?
- [ ] Are fonts preloaded?
- [ ] Does the SSR output look correct before hydration?
- [ ] Is a `v-if` hiding something that should be `visibility: hidden`?

### Z-index / Clipping

- [ ] Is the problematic element inside a `position: relative` + `z-index` parent?
- [ ] Is there `overflow: hidden` on any ancestor?
- [ ] Is there `transform`, `opacity < 1`, or `filter` on any ancestor? (all create stacking contexts)
- [ ] Should this be inside a `Portal`?

### Vue Reactivity

- [ ] Are you accessing a `ref` without `.value` outside the template?
- [ ] Are you destructuring a `reactive` object?
- [ ] Is a `computed` depending on a value that changes but not re-evaluating?
- [ ] Are you mutating props directly?

### Design Token

- [ ] Are you using a semantic token or a raw value?
- [ ] Is this a one-off style or should it be a token?
- [ ] Can this be expressed as a variant on an existing component?

---

## Part 9: The iOS Dev Mental Translation Table

| iOS / SwiftUI                     | Web / Vue                                            |
| --------------------------------- | ---------------------------------------------------- |
| `@State`                          | `ref()`                                              |
| `@Binding`                        | `defineModel()` / `v-model`                          |
| `@Derived` / computed var         | `computed()`                                         |
| `onChange(of:)`                   | `watch()`                                            |
| `.task {}`                        | `watchEffect()` / `onMounted`                        |
| `ViewModifier`                    | Vanilla Extract `recipe()`                           |
| `ButtonStyle`                     | `styleVariants` / CSS class variants                 |
| `VStack(spacing:)`                | `display: flex; gap:`                                |
| `HStack`                          | `display: flex; flex-direction: row`                 |
| `ZStack`                          | `position: relative` + `position: absolute` children |
| `frame(minWidth:)`                | `min-width:`                                         |
| `Color.accentColor`               | `var(--clr-accent-primary)`                          |
| `accessibilityLabel`              | `aria-label`                                         |
| `UIWindow` (top level)            | `Portal`                                             |
| `clipsToBounds`                   | `overflow: hidden`                                   |
| `UIImageView` fixed frame         | `width` + `height` + `aspect-ratio`                  |
| `NSLayoutConstraint priority`     | `min-width` / `max-width`                            |
| `PreferenceKey` (pass data up)    | `emit()` / `v-model`                                 |
| `EnvironmentKey` (pass data down) | `provide()` / `inject()`                             |

---

## Quick Reference: Pandoc EPUB Export

```bash
pandoc fouc-layout-masterclass.md -o fouc-layout-masterclass.epub \
  --metadata title="FOUC & Layout Mastery" \
  --metadata author="m" \
  --toc
```

---

_The web is a flow-based system trying to look like a constraint-based system._  
_Your job is to impose constraints — through dimensions, tokens, and component contracts._  
_iOS does this for you. The web makes you earn it._
