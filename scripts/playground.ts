// injectGTM playground — edit, save, run:
//   bun x tsx scripts/playground.ts
// Delete when working in consent.ts.

// In real life: document.head, document.createElement, window.dataLayer.
// Here we mock them so we can SEE what the function pushed/created.

type MockEl = { tag: string; id: string; async: boolean; src: string };
let mockHead: MockEl[] = [];
let mockDataLayer: unknown[] | undefined; // undefined to start — matches window default

const mockDoc = {
  head: {
    appendChild(el: MockEl) {
      mockHead.push(el);
    },
  },
  getElementById(id: string): MockEl | null {
    return mockHead.find((e) => e.id === id) ?? null;
  },
  createElement(_tag: string): MockEl {
    return { tag: _tag, id: "", async: false, src: "" };
  },
};

const mockWin = {
  get dataLayer(): unknown[] | undefined {
    return mockDataLayer;
  },
  set dataLayer(v: unknown[] | undefined) {
    mockDataLayer = v;
  },
};

const GTM_SCRIPT_ID = "gtm-script";

// ─── your function ────────────────────────────────────────────

// ─── live tests ───────────────────────────────────────────────
console.log("─── tests ───\n");

console.log(
  "BEFORE: head =",
  mockHead.length,
  "scripts, dataLayer =",
  mockWin.dataLayer,
);

injectGTM("GTM-XXXX111");

console.log("\nAFTER 1st call:");
console.log("  head:     ", mockHead);
console.log("  dataLayer:", mockWin.dataLayer);
//   expected: head has 1 script with id="gtm-script", async=true, src ends in "id=GTM-XXXX111"
//   expected: dataLayer is [{ "gtm.start": <number>, event: "gtm.js" }]

// ─── idempotency check ───────────────────────────────────────
injectGTM("GTM-XXXX111");

console.log("\nAFTER 2nd call (must be idempotent):");
console.log("  head:     ", mockHead.length, "script(s) — should still be 1");
console.log(
  "  dataLayer:",
  mockWin.dataLayer?.length,
  "event(s) — should still be 1",
);

// ─── tip ──────────────────────────────────────────────────────
// `obj.foo ||= []` is short for: if (!obj.foo) obj.foo = [];
// Only assigns when the left side is falsy — perfect for "init if missing."
