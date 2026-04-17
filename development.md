# BoHolz Development Brief: High-End Premium Prefab House Manufacturer from Germany

## 1. Technical Stack

- **Framework:** Astro (SSR Mode)
- **Frontend:** Vue.js (for interactive components)
- **Database:** Postgres 18 (External via Dokploy)
- **ORM:** Drizzle ORM
- **Animation:** GSAP + Lenis (Smooth Scroll)
- **Styling:** Vanilla & PostCSS

## 2. Core Implementation Phases

### Phase 1: The Data Layer (Drizzle)

- **Task:** Establish connection to `boholz-db` using the `DATABASE_URL`.
- **Standard:** Create a strictly typed schema in `src/db/schema.ts` that maps to the existing 18 house models.
- **Precision:** Ensure the `media` table points to the new `sorted-assets/` folder structure.

### Phase 2: The UX Layer (Lenis + GSAP)

- **Vibe:** Minimalist transitions. No aggressive easing.
- **Lenis:** Implement global smooth scrolling to ensure a premium, weighted feel.
- **GSAP:** Create "reveal" animations for house renders as they enter the viewport.

### Phase 3: Identity & Auth

- **Requirement:** Setup a secure admin area for BoHolz staff to edit house details.
- **Tool:** [Insert preferred choice, e.g., Lucia Auth or Auth.js].

## 3. Guiding Principles

- **Code Quality:** Use TypeScript for everything. No `any` types.
- **Performance:** Optimize for Largest Contentful Paint (LCP). Use the sorted WebP assets.
- **Aesthetics:** Maintain the high-precision German engineering aesthetic in the UI components.
