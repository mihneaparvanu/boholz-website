---
title: "TypeScript Type Modeling — A Swift Developer's Masterclass"
author: "BoHolz"
---

# TypeScript Type Modeling — A Swift Developer's Masterclass

A practical, opinionated walkthrough of how to think about types in TypeScript when your brain is wired for Swift and SwiftUI. Read it linearly the first time; treat it as a reference after.

---

## Part 0: The One Idea That Changes Everything

Swift is **nominally typed**. TypeScript is **structurally typed**.

This single difference explains *every* "TypeScript feels loose" feeling you've ever had.

### Nominal typing (Swift)

```swift
struct A { let x: Int }
struct B { let x: Int }

let a = A(x: 1)
let b: B = a   // ❌ Compile error — A and B are different types
```

Even though `A` and `B` have identical shapes, Swift treats them as **distinct types** because they have different **names**. Identity = name.

### Structural typing (TypeScript)

```ts
type A = { x: number };
type B = { x: number };

const a: A = { x: 1 };
const b: B = a;   // ✅ Fine — same shape = same type
```

TypeScript doesn't care that you wrote `A` and `B` separately. It checks the **shape**. Identity = structure.

### Why this matters

This is the source of every reaction you'll have:

| You feel | Reality |
|---|---|
| "TypeScript lets me pass anything." | No — it lets you pass anything *that has the right shape*. |
| "I can create a type out of nothing with `Pick`." | Yes — because identity is structure, you can construct shapes algebraically. |
| "Swift forces clarity; TS just vibes." | Swift forces *naming*. TS enforces *shape*. Different rigor, same goal. |
| "Two types with the same fields should mean different things!" | In TS, if you want that, you have to **encode the difference into the shape**. (See: branded types, Part 9.) |

TypeScript is not less strict than Swift. It's strict along a different axis. Once you stop expecting nominal behavior, the language stops feeling weird.

---

## Part 1: The Building Blocks — A Side-by-Side

| Swift | TypeScript | Notes |
|---|---|---|
| `struct` (value) | `type` or `interface` | TS objects are reference types; immutability is opt-in via `readonly` / `as const`. |
| `class` (reference) | `class` | Closest 1:1, but rarely used for data — TS prefers plain object types. |
| `protocol` | `interface` (or `type`) | TS interfaces are *implicit* — anything matching the shape satisfies them, no `: Interface` declaration needed. |
| `enum` (cases only) | `"a" \| "b" \| "c"` (string literal union) | TS has a `enum` keyword, but modern TS avoids it. Unions are leaner. |
| `enum` with associated values | Discriminated union | The single most underrated TS feature for Swift devs. See Part 6. |
| `typealias Foo = String` | `type Foo = string` | Same idea. |
| `let x: Int` (immutable binding) | `const x: number` | Same. |
| `var x: Int` (mutable) | `let x: number` | Yes, the keywords are flipped. Yes, it's annoying. |
| `Optional<T>` / `T?` | `T \| undefined` or `T \| null` | TS has two flavors of "nothing." Pick one and stick with it (`undefined` is conventional). |
| `Result<T, E>` | `{ ok: true; value: T } \| { ok: false; error: E }` | A discriminated union models this perfectly. |
| `[String: Int]` (Dictionary) | `Record<string, number>` or `{ [key: string]: number }` | Different syntax, same semantics. |
| `[String]` (Array) | `string[]` or `Array<string>` | Same. |
| `(Int, String)` (tuple) | `[number, string]` | TS tuples are arrays with fixed-length, typed positions. |
| Generic `<T: Comparable>` | `<T extends Comparable>` | `extends` in generics means "must be assignable to." |
| `where` clauses | Conditional types `T extends U ? X : Y` | More powerful but harder to read. Part 8. |
| `associatedtype` | Generic type parameter | TS doesn't separate associated types from generics. |
| Property wrappers (`@State`) | Composables (`ref()`, `defineModel()`) or decorators | Decorators exist but are rare outside frameworks. Vue composables are the closest mental model. |
| `KeyPath<Root, Value>` | `keyof T` + indexed access types | TS goes further with template literal types. |
| `Codable` | Zod schema + `z.infer<typeof schema>`, or Drizzle's `InferSelectModel` | No magic Codable — you pick where validation happens. |
| `final class` | `type` (since types can't be extended) | A `class` in TS can always be subclassed unless you make the constructor private. |

Memorize this table. Half of "TS is weird" goes away once these mappings are second nature.

---

## Part 2: `type` vs `interface` — The Question Everyone Asks

```ts
type User = {
  id: number;
  name: string;
};

interface User {
  id: number;
  name: string;
}
```

**Both work. Both are used. Both compile to the same thing at runtime (nothing).**

Practical differences:

| | `type` | `interface` |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Union / intersection / mapped / conditional | ✅ | ❌ (can only `extends`) |
| Declaration merging | ❌ | ✅ (two `interface User { ... }` blocks combine) |
| Tuples, primitives, function types | ✅ | ❌ |
| Performance (TS compiler) | Slightly slower for huge unions | Slightly faster |

**The opinion I'd give a Swift dev**: use `type` for everything. It's the closest thing to a Swift `typealias`/`struct` definition, it handles every shape, and it never silently merges with another declaration somewhere else (which is the one trap `interface` has).

Use `interface` only when:
- Authoring a library and you want consumers to be able to *extend* your types via declaration merging.
- Working in a codebase that has already chosen `interface`.

Swift analog: `type` is `typealias` + `struct` rolled into one. `interface` is `protocol` (because protocols also support extension and merging). In application code, you almost always want `type`.

---

## Part 3: The Three-Layer Model Hierarchy

This is the *practical* answer to "how many model types should I have?"

Swift instinct: one struct per concept per layer. iOS apps often end up with `UserDTO`, `User`, `UserViewModel`, `UserCellModel`, `UserDetailModel`, etc.

TypeScript answer: three layers, not five. Use derivation, not duplication.

### Layer 1: Entity types (the "DB struct")

One per database table. Inferred, not hand-written.

```ts
// src/types/models.ts
import { InferSelectModel } from "drizzle-orm";
import { houseModels, media, agents } from "@/db/schema";

export type HouseModel = InferSelectModel<typeof houseModels>;
export type Media = InferSelectModel<typeof media>;
export type Agent = InferSelectModel<typeof agents>;
```

**Swift analog**: `struct User: Codable` matching your JSON. Except here the type is derived from the schema — change the column, the type updates automatically. No drift.

### Layer 2: Composite types (entity + relations)

When you fetch an entity with its relations, the loader returns a richer shape. Name it.

```ts
export type HouseModelWithMedia = HouseModel & {
  media: Media[];
  thumbnail: Media | null;
};
```

**Swift analog**: a `struct HouseWithMedia` that contains a `House` and `[Media]`. In TS, intersection (`&`) merges fields — no nesting needed unless you want it.

### Layer 3: View models (per-feature display shape)

When a specific feature needs a trimmed/transformed shape, give it a name in that feature.

```ts
// src/features/HomePage/types.ts
export type HeroSlide = Pick<HouseModel, "id" | "slug" | "title"> & {
  heroImgURL: string | null;
};
```

The loader returns `HeroSlide[]`. The component declares `models: HeroSlide[]`. There's exactly one definition of "what a hero slide looks like," and it lives next to the feature that uses it.

**Swift analog**: a SwiftUI `HeroSlide` struct with the four fields it needs. Same instinct, expressed via `Pick` + intersection instead of hand-writing the fields.

### The rule

| Density | When |
|---|---|
| ~15 entity types | One per table. Always named. Drizzle-inferred. |
| ~10 composite types | One per common entity-with-relations bundle. Named at the project level. |
| ~15–20 view models | One per feature surface area. Named at the feature level. |

That's ~40 named types for a substantial app. Swift might have 200+ for the same app. The TS count is lower not because TS is loose, but because **derivation replaces duplication**.

---

## Part 4: Utility Types — TS's Type Algebra

This is the part that feels like cheating coming from Swift. Use it shamelessly.

### `Pick<T, K>` — extract specific properties

```ts
type User = { id: number; name: string; email: string; password: string };

type UserPublic = Pick<User, "id" | "name">;
// = { id: number; name: string }
```

**Swift**: you'd hand-write `struct UserPublic { let id: Int; let name: String }`. Then when `User.id` becomes a `UUID`, you change `UserPublic` too. In TS, `Pick` automatically tracks the source.

### `Omit<T, K>` — exclude specific properties

```ts
type UserSafe = Omit<User, "password">;
// = { id: number; name: string; email: string }
```

**Swift**: same struct-with-fewer-fields chore. TS: one expression, refactor-safe.

### `Partial<T>` — make all properties optional

```ts
type UserPatch = Partial<User>;
// = { id?: number; name?: string; email?: string; password?: string }
```

Used for PATCH endpoints, form drafts, optional config overrides. **Swift**: you'd write a separate struct with `Optional` on every field, or use `Codable` keyed unwrapping.

### `Required<T>` — make all properties required

The inverse. Rarely used in app code; useful when a type has optional fields you've already validated.

### `Readonly<T>` — make all properties immutable

```ts
type FrozenUser = Readonly<User>;
```

**Swift analog**: every field becomes `let`. In TS, `Readonly` is shallow — for deep immutability you write a recursive type or trust `as const`.

### `Record<K, V>` — keyed dictionary type

```ts
type StatusByUserId = Record<number, "active" | "banned">;
// = { [key: number]: "active" | "banned" }

type ThemeColors = Record<"primary" | "secondary" | "danger", string>;
// = { primary: string; secondary: string; danger: string }
```

When `K` is a union of literals, `Record` enforces that **every key is present**. This is the exhaustive-mapping pattern.

**Swift**: `[Int: String]` for the dictionary; for exhaustive mapping you'd use an enum with a stored property.

### `Exclude<U, V>` and `Extract<U, V>` — filter unions

```ts
type Color = "red" | "green" | "blue" | "yellow";
type Warm = Extract<Color, "red" | "yellow">;  // "red" | "yellow"
type Cool = Exclude<Color, "red" | "yellow">;  // "green" | "blue"
```

**Swift**: cases of an enum are not filterable — you'd write a second enum.

### `NonNullable<T>` — strip `null` and `undefined`

```ts
type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>;  // User
```

### `ReturnType<F>` and `Parameters<F>`

```ts
function getHero() { return { id: 1, slug: "home-100" }; }
type Hero = ReturnType<typeof getHero>;          // { id: number; slug: string }
type HeroArgs = Parameters<typeof getHero>;       // []
```

**Swift**: you can't ask "what does this function return?" as a type expression. TS lets you. Use it everywhere — your loaders' return types become your view-model types for free:

```ts
export type HeroSlide = Awaited<ReturnType<typeof getHeroModels>>[number];
```

That single line says "a hero slide is one element of whatever `getHeroModels()` resolves to." If the loader changes its return shape, the type updates automatically.

### `Awaited<T>` — unwrap a Promise

`Awaited<Promise<User>>` is `User`. Composes with `ReturnType` for async functions, as above.

### Mental model

Swift's type system is a **noun catalog**: you list the structs, classes, enums, protocols. Adding a new shape means writing a new noun.

TS's type system is a **calculus**: you have base types and operators (`|`, `&`, `Pick`, `Omit`, `keyof`, `extends`, conditional types). Adding a new shape often means writing an expression.

Both are rigorous. The TS approach scales differently — once you internalize the operators, you stop writing 80% of the structs you'd write in Swift.

---

## Part 5: Unions and Intersections — The Two Big Operators

### Union (`A | B`) — "this OR that"

```ts
type Result = "success" | "error";
type Id = string | number;
type User = AdminUser | RegularUser;
```

**Swift analog**: an enum's cases form a kind of union. `enum Result { case success, error }` lists the cases.

The TS twist: a union doesn't have to be wrapped in a name. `string | number` is a type you can use anywhere, on the fly.

### Intersection (`A & B`) — "this AND that"

```ts
type Timestamped = { createdAt: Date };
type Identifiable = { id: number };
type Entity = Timestamped & Identifiable;
// = { createdAt: Date; id: number }
```

**Swift analog**: protocol composition. `Timestamped & Identifiable` in Swift is two protocols combined. In TS, intersection works on any types — concrete or abstract.

### Why intersections are weird at first

In Swift, `&` is for protocol composition. In TS, `&` *merges fields* — including incompatible ones, which results in `never`:

```ts
type A = { x: number };
type B = { x: string };
type C = A & B;
// C is { x: never } — no value can satisfy both
```

That's actually useful: TS tells you the intersection is uninhabitable. Swift's compiler would just refuse to compose two protocols with conflicting requirements.

---

## Part 6: Discriminated Unions — The Real Answer to Swift Enums

This is the single feature you should master first. It's how TS does Swift's `enum` with associated values, and it's *better* in some ways.

### Swift

```swift
enum LoadState<T> {
    case idle
    case loading
    case success(T)
    case failure(Error)
}
```

### TypeScript

```ts
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; value: T }
  | { status: "failure"; error: Error };
```

The `status` field is the **discriminant** — a literal-typed field that lets TS narrow the union when you check it.

### Narrowing with `switch`

```ts
function render<T>(state: LoadState<T>) {
  switch (state.status) {
    case "idle":     return "Press start";
    case "loading":  return "Loading…";
    case "success":  return `Got ${state.value}`;   // TS knows .value exists here
    case "failure":  return `Error: ${state.error.message}`;
  }
}
```

The compiler narrows `state` to the specific variant inside each `case`. Just like Swift's `switch` with pattern matching on the case.

### Exhaustiveness check

```ts
function render<T>(state: LoadState<T>): string {
  switch (state.status) {
    case "idle":     return "Press start";
    case "loading":  return "Loading…";
    case "success":  return `Got ${state.value}`;
    case "failure":  return `Error: ${state.error.message}`;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
```

The `never` assignment in `default` makes TS error if you add a new variant to `LoadState` but forget to handle it. **This is the equivalent of Swift's exhaustive switch.** It's manual in TS, but it works the same way.

### Why discriminated unions are better than Swift enums for one thing

You can **add a variant from outside the original definition**:

```ts
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; value: T }
  | { status: "failure"; error: Error };

// In a different file, for a specific feature:
type LoadStateWithRetry<T> = LoadState<T> | { status: "retrying"; attempt: number };
```

Swift enums can't be extended with new cases. TS unions can. This is a huge unlock for evolving APIs.

### Where Swift wins

Swift's enums carry runtime tags automatically. TS discriminated unions require you to *manually* maintain the `status` (or whatever) field. There's no `case .success(let value)` shorthand — you write `if (state.status === "success") { state.value }`.

But that's a small price for compositionality.

---

## Part 7: `keyof`, Indexed Access, and Mapped Types

These are TS's answer to Swift's `KeyPath`.

### `keyof T` — the union of property names

```ts
type User = { id: number; name: string; email: string };
type UserKey = keyof User;
// = "id" | "name" | "email"
```

**Swift analog**: `KeyPath<User, _>` lets you point at a property. `keyof User` gives you the set of property *names*.

### Indexed access — "look up a property by key"

```ts
type UserName = User["name"];   // string
type UserField = User[keyof User];  // number | string
```

You can index a type by a key. This is how you'd say "the type of the `name` field" without hard-coding it.

**Swift analog**: there isn't a great one. KeyPaths give you a value-level reference; TS gives you a type-level reference.

### Mapped types — "transform every property"

```ts
type Stringify<T> = { [K in keyof T]: string };

type User = { id: number; age: number; active: boolean };
type StringifiedUser = Stringify<User>;
// = { id: string; age: string; active: string }
```

You can iterate the keys of `T` and re-type each one. `Partial`, `Required`, `Readonly`, `Record` are all built on this primitive.

**Swift analog**: a generic struct that recursively builds a new struct from another — you'd have to write a macro for this. TS does it inline.

### Putting it together — a real example

```ts
type FormErrors<T> = { [K in keyof T]?: string };

type ContactForm = { name: string; email: string; message: string };
type ContactFormErrors = FormErrors<ContactForm>;
// = { name?: string; email?: string; message?: string }
```

A typed errors object that *always* matches your form shape, free.

---

## Part 8: Conditional Types — `where` Clauses on Steroids

This is the deep end. Skim it the first time.

```ts
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<"hello">;  // "yes"
type B = IsString<42>;       // "no"
```

`T extends U ? X : Y` reads as "if T is assignable to U, then X, otherwise Y." It's a type-level ternary.

### A practical use

```ts
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type A = Unwrap<Promise<string>>;  // string
type B = Unwrap<number>;            // number
```

`infer U` introduces a fresh type variable inside the condition. This is how `Awaited`, `ReturnType`, and `Parameters` are defined in the standard lib.

### When to write your own

Rarely. The built-in utility types cover 90% of cases. Reach for `extends ? :` only when you're building a library or modeling something genuinely complex (form schemas, routers, ORM queries). For application code, stick to `Pick`, `Omit`, `Partial`, `Record`, and discriminated unions.

**Swift analog**: associated type constraints with `where` clauses. Conceptually similar; TS's version is more expressive and less ergonomic.

---

## Part 9: Branded Types — Faking Nominal Typing When You Need It

Sometimes you want Swift's nominal behavior: `UserId` and `PostId` are both strings, but you should never confuse them.

```ts
type Brand<T, B> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

function getUser(id: UserId) { /* ... */ }

const u = "abc" as UserId;
const p = "xyz" as PostId;

getUser(u);  // ✅
getUser(p);  // ❌ Type error — PostId is not a UserId
```

The `__brand` field doesn't exist at runtime — it's purely a type-level marker. The intersection with `& { readonly __brand: "UserId" }` makes the structural shapes diverge, so TS now treats them as distinct.

**Swift analog**: literally what Swift gives you by default. `struct UserId { let value: String }` and `struct PostId { let value: String }` are different types.

### When to use it

- Database IDs from different tables.
- Currency amounts: `Cents`, `Dollars`.
- Sanitized vs raw strings: `SafeHtml`, `RawUserInput`.
- Anywhere a primitive type carries domain meaning that should be enforced.

Don't overuse it. For internal data that flows through one function, structural typing is fine. Use brands where confusion would be a real bug.

---

## Part 10: Type Inference — Stop Annotating Everything

Coming from Swift, you'll instinctively type every variable. Resist it.

### TS infers more than you think

```ts
const x = 42;                    // x: 42 (literal type)
let y = 42;                       // y: number
const arr = [1, 2, 3];            // arr: number[]
const user = { id: 1, name: "a" }; // user: { id: number; name: string }
const f = (n: number) => n * 2;   // f: (n: number) => number
```

You don't need `: number`, `: string[]`, `: () => void` on these. TS knows.

### When to annotate

| Annotate | Don't annotate |
|---|---|
| Function parameters (always) | Local variables with literal initializers |
| Public function return types (defensive) | Internal helper return types |
| Empty containers (`const ids: number[] = []`) | Containers with elements |
| Reused types worth naming | One-off intermediate shapes |
| `defineProps<{ ... }>()` in Vue (required) | `computed(() => ...)` return values |

**Swift analog**: Swift also infers, but its inference is more conservative. TS will happily infer deeply nested generic types. Trust it.

### `as const` — narrowing inference to literals

```ts
const variants = ["primary", "secondary", "ghost"];
// variants: string[]

const variants = ["primary", "secondary", "ghost"] as const;
// variants: readonly ["primary", "secondary", "ghost"]

type Variant = typeof variants[number];
// = "primary" | "secondary" | "ghost"
```

`as const` is your "narrowest possible" inference toggle. Use it on config arrays, option lists, and anywhere you want a union type derived from a value.

**Swift analog**: implicit. Swift always uses the most specific type. TS defaults to the widest type that's safe and lets you narrow on demand.

---

## Part 11: Zod — The Codable You Always Wanted

Swift's `Codable` does two things: it describes a shape *and* validates JSON at runtime. TypeScript's built-in types do neither at runtime — they're erased.

For boundaries (forms, API requests, env vars, query strings), use **Zod**:

```ts
import { z } from "zod";

const ContactForm = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

type ContactForm = z.infer<typeof ContactForm>;
// = { name: string; email: string; message: string }
```

You get:
- A runtime validator (parses and throws on invalid input).
- A static type, inferred from the schema.

**Swift analog**: `struct ContactForm: Codable` does both. In TS, you do them with one library and one expression.

### When to use Zod

- Form submissions.
- HTTP request/response bodies.
- `process.env` parsing.
- Anything crossing a trust boundary.

### When not to use Zod

- Internal data already shaped by Drizzle (the DB enforces shape; the inferred type is enough).
- Component props (TS already checks them at compile time; no runtime validation needed).

---

## Part 12: The Mental Translation Table

The one you keep open while writing TS for the first three months.

| You think (Swift) | You write (TS) |
|---|---|
| `struct User { let id: Int }` | `type User = { id: number }` |
| `let users: [User]` | `const users: User[] = []` |
| `protocol Identifiable { var id: Int { get } }` | `type Identifiable = { id: number }` |
| `User & Timestamped` (protocol composition) | `User & Timestamped` (intersection) |
| `enum Status { case active, banned }` | `type Status = "active" \| "banned"` |
| `enum Result<T, E> { case success(T), failure(E) }` | `type Result<T, E> = { ok: true; value: T } \| { ok: false; error: E }` |
| `Optional<User>` / `User?` | `User \| undefined` |
| Force unwrap `user!` | Non-null assertion `user!` (same syntax, similar danger) |
| `if let u = user { ... }` | `if (user) { ... }` (TS narrows) |
| `guard let u = user else { return }` | `if (!user) return;` (TS narrows the rest of the scope) |
| `[String: Int]` | `Record<string, number>` |
| `(Int, String)` | `[number, string]` |
| `where T: Hashable` | `<T extends Hashable>` |
| `\User.name` (KeyPath) | `keyof User` (key) / `User["name"]` (value type) |
| `User.self` (metatype) | `typeof User` if `User` is a value, otherwise no equivalent |
| `final class` | (default for `type`; for `class`, no built-in `final`) |
| `defer { cleanup() }` | `try { ... } finally { cleanup() }` |
| `weak var` | (no equivalent; GC handles it) |
| `lazy var` | Getter or `const x = (() => expensive())()` |
| Computed property | Getter / `computed()` in Vue |
| Property observer (`didSet`) | `watch()` in Vue |
| `@State`, `@Binding` | `ref()`, `defineModel()` |
| `EnvironmentValues` | `provide()` / `inject()` |
| `PreferenceKey` | `emit()` / events |
| `Codable` | Zod + `z.infer<>` |

---

## Part 13: This Project's Conventions

The rules, in priority order:

1. **Entity types**: inferred from Drizzle. Live in `src/types/models.ts`. Never hand-written.

   ```ts
   export type HouseModel = InferSelectModel<typeof houseModels>;
   ```

2. **Composite types** (entity + relations): named at the project level, also in `src/types/models.ts`.

   ```ts
   export type HouseModelWithMedia = HouseModel & { media: Media[] };
   ```

3. **View models** (per-feature display shapes): named in a `types.ts` co-located with the feature.

   ```ts
   // src/features/HomePage/types.ts
   export type HeroSlide = Pick<HouseModel, "id" | "slug" | "title"> & {
     heroImgURL: string | null;
   };
   ```

4. **Loaders declare return types** by relying on the view model:

   ```ts
   export async function getHeroModels(limit = 6): Promise<HeroSlide[]> {
     // ...
   }
   ```

   Or — even better — let the view model be derived *from* the loader:

   ```ts
   export type HeroSlide = Awaited<ReturnType<typeof getHeroModels>>[number];
   ```

5. **Component props**: use the view model directly.

   ```ts
   defineProps<{ models: HeroSlide[] }>();
   ```

6. **Don't name one-off shapes.** If a value is computed inside one function and consumed once, let TS infer it.

7. **Don't write `any`.** Per the CLAUDE.md rule. Use `unknown` if you genuinely don't know, then narrow with type guards.

8. **Use `Pick` / `Omit` / `Partial` / `Record` aggressively.** Derived shapes are always preferable to hand-written duplicates.

9. **Brand IDs only when confusion would be a real bug** (e.g., two ID types passed to the same function).

10. **Zod at trust boundaries.** Forms, API requests, env vars. Not internal data.

---

## Part 14: A Diagnostic Checklist

When a type feels wrong, run through this:

### "It feels like I'm duplicating a struct"

- [ ] Can `Pick` or `Omit` express it instead?
- [ ] Is this just an existing type with one extra field? Use `T & { extra: ... }`.
- [ ] Is this the return shape of a function? Use `ReturnType<typeof fn>`.
- [ ] Is this a Promise unwrap? Use `Awaited<...>`.

### "Two types are getting confused"

- [ ] Are they structurally identical? They *should* be confused — that's TS working as designed.
- [ ] Do they have different *meanings*? Brand them.
- [ ] Is one a subtype of the other? Use intersection to make the relationship explicit.

### "TS won't narrow this union"

- [ ] Does the union have a discriminant field? Add one (`status: "loading" | "success"`).
- [ ] Are you checking the right way? `typeof`, `instanceof`, `in`, equality on literal fields all narrow.
- [ ] Is this an `unknown` you forgot to validate? Use a Zod schema or a type guard.

### "I have too many types"

- [ ] Are some of them one-off internal shapes? Delete them; let TS infer.
- [ ] Are some of them trivial subsets of another? Replace with `Pick`/`Omit`.
- [ ] Is there a layer-of-abstraction mismatch (entity vs view model)? Consolidate to the three-layer model.

### "I have too few types"

- [ ] Are loader return types implicit? Name them.
- [ ] Are component props inline-typed but used in multiple places? Name them.
- [ ] Are domain concepts like `UserId` represented as raw strings? Brand them.

---

## Part 15: The Final Word

Swift forced you to write a struct for every concept. That discipline carries over — keep wanting to name your types, keep wanting them to express domain meaning. That instinct is correct.

What changes is *how you express it*. TypeScript hands you a calculus instead of a catalog. The same domain model that took 12 Swift structs takes 4 TS types: one entity, one composite, two view models, with the rest derived in expressions.

The mistake Swift devs make is one of two extremes:

- **Translate Swift literally**: write 200 types, get drift between them, lose the refactor-safety the calculus would give you.
- **Give up and use `any`**: throw away the type system because "TS is loose anyway."

The middle path — name what carries meaning, derive what carries only structure — is where TypeScript pays off. It's not Swift with fewer keystrokes. It's a different way to model the same thing, with its own rigor.

Once it clicks, you'll find yourself reaching for `Pick` and `Omit` the way you used to reach for new structs — and you'll write half the code for the same safety.

---

*The Swift compiler enforces that you name your types.*
*The TypeScript compiler enforces that your types behave.*
*Different oaths. Same gods.*
