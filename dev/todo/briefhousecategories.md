# Brief — sorting house categories in a custom order

A walkthrough of `getCategories()` in `src/db/loaders.ts`: what each step does,
why the first attempt broke, and the simplest way to enforce a custom order.

## What `getCategories` is supposed to do

Three sequential steps. Each takes the previous step's output as input —
they are **not nested**, they run one after another.

1. **Fetch** rows from Postgres via Drizzle → `data`
2. **Resolve** R2 paths into full URLs → `resolved`
3. **Sort** the rows into the canonical order → `return`

## The broken first attempt (annotated)

```ts
const data = await db.query.houseCategories.findMany({
  where: not(inArray(houseCategories.slug, HIDDEN_CATEGORY_SLUGS)),
  with: {
    media: {
      with: { media: true },
      orderBy: (categoryMedia, { asc }) => [asc(categoryMedia.sortOrder)],
    },
  })                       // ← closed findMany's options object with `)` instead of `}`

  const rank = new Map(...) // ← these statements are now SYNTACTICALLY
  return data.sort(...)     //   inside the findMany() argument list. Nonsense.
});                          // ← stray closer

const resolved = resolveMediaPaths(...)  // ← unreachable, you already returned
return resolved.sort(...)                // ← duplicate of the old logic
```

The post-query work was placed *inside* the query call. JavaScript objects
don't run code — the `findMany({...})` argument is just a config object;
`where`, `with`, `orderBy` are keys it reads. You cannot drop `const` /
`return` statements in there.

## The clean shape

```ts
export async function getCategories(): Promise<HouseCategory[]> {
  // 1. fetch
  const data = await db.query.houseCategories.findMany({
    where: not(inArray(houseCategories.slug, HIDDEN_CATEGORY_SLUGS)),
    with: {
      media: {
        with: { media: true },
        orderBy: (categoryMedia, { asc }) => [asc(categoryMedia.sortOrder)],
      },
    },
  });

  // 2. resolve R2 paths
  const resolved = resolveMediaPaths(data as unknown as HouseCategory[]);

  // 3. sort by canonical order
  return resolved.sort((a, b) => (order[a.slug] ?? 99) - (order[b.slug] ?? 99));
}
```

## The simplest sort: a plain object dictionary

```ts
const order: Record<string, number> = {
  bestseller: 0,
  einfamilienhaus: 1,
  bungalow: 2,
  generationenhaus: 3,
  zweifamilienhaus: 4,
};

return resolved.sort((a, b) => (order[a.slug] ?? 99) - (order[b.slug] ?? 99));
```

Read it as: "look up each slug's number, subtract — smaller wins."

- `order[a.slug]` is the dictionary lookup.
- `?? 99` means "if the slug isn't listed, treat it as 99 so it sinks to
  the bottom" — safer than crashing when a new DB category appears before
  the dictionary is updated.
- `Array.sort`'s comparator returns negative → `a` first, positive → `b`
  first, zero → equal. Subtracting ranks gives the right sign.

## The type-safe version (Swift-enum style)

A plain object accepts any string. If you want the compiler to police the
slug list (autocomplete the slugs, error on typos), declare the order as a
literal tuple and derive a union type from it:

```ts
export const CATEGORY_ORDER = [
  "bestseller",
  "einfamilienhaus",
  "bungalow",
  "generationenhaus",
  "zweifamilienhaus",
] as const satisfies readonly string[];

export type CategorySlug = (typeof CATEGORY_ORDER)[number];

const rank = new Map(CATEGORY_ORDER.map((s, i) => [s, i] as const));
return resolved.sort(
  (a, b) =>
    (rank.get(a.slug) ?? Infinity) - (rank.get(b.slug) ?? Infinity),
);
```

`CATEGORY_ORDER.map((s, i) => [s, i])` turns the array into
`[["bestseller", 0], ["einfamilienhaus", 1], ...]`. `new Map(...)` turns
those pairs into a lookup: `rank.get("bestseller")` → `0`.

Pick this version when you want compile-time guarantees. Pick the plain
object when you don't.

## Why SCREAMING_SNAKE_CASE on constants

Convention. JS/TS communities use `SCREAMING_SNAKE_CASE` for module-level
constants that never change (`MAX_RETRIES`, `API_URL`) as a visual cue:
"this is a fixed value, not a variable." `camelCase` works identically —
nothing breaks. The codebase already uses caps for `BESTSELLER_CATEGORY_ID`
in `src/lib/constants.ts`, so caps fits here.

## Where category order is enforced today

Only one place: `src/db/loaders.ts` inside `getCategories()`. Every
consumer (navbar dropdown, CategorySlider, HousesPage filter rail,
CategoriesShowcase) iterates the array `getCategories()` returns, so a
single sort here propagates everywhere.

## Note on "bestseller"

The bestseller category is a **real DB row** with its own UUID and the
same columns as every other category. What's virtual is its **membership**:
no `house_models.category_id` points at it. Models belong to their real
category (Bungalow, Stadtvilla, …), and bestseller members are derived
client-side by filtering `houseModels.isFeatured === true`. See
`BESTSELLER_CATEGORY_ID` in `src/lib/constants.ts`.
