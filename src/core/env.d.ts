/// <reference types="astro/client" />

// Ambient platform declarations. A .d.ts with no top-level import/export is
// already global, so no `declare global` wrapper is needed here.

interface Window {
  /** GTM's command queue. Created by consent.ts before GTM itself loads. */
  dataLayer?: unknown[];
}

interface HTMLElementEventMap {
  // TypeScript ships the CommandEvent interface but has no entry for it in the
  // event map, so addEventListener("command", …) hands back a plain Event.
  command: CommandEvent;
}

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    // Invoker Commands (Baseline Dec 2025). Astro's attribute types don't carry
    // them yet; drop these two lines once they do.
    command?: string;
    commandfor?: string;
  }
}
