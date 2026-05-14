import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
const errors = [];
page.on("pageerror", e => errors.push("PAGE: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("CONS: " + m.text()); });
await page.goto("http://localhost:4321/ui-preview", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
// Try to dismiss vite error overlay if present
await page.evaluate(() => {
  document.querySelectorAll("vite-error-overlay, astro-dev-overlay, astro-dev-toolbar").forEach(el => el.remove());
});
await page.waitForTimeout(500);
await page.screenshot({ path: "./ui.png", fullPage: true });
console.log("ERRORS:", errors.length ? JSON.stringify(errors, null, 2) : "[]");
await browser.close();
