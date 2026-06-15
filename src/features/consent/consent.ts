import { consentSchema, type ConsentV1 } from "./consent.zod";
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const COOKIE_NAME = "boholz_consent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const GTM_SCRIPT_ID = "gtm-script";

function getCookie(name: string) {
  const raw = document.cookie.split("; ");
  const foundConsent = raw.find((c) => c.startsWith(name + "="));
  if (foundConsent) {
    const eqIndex = foundConsent.indexOf("=");
    const value = foundConsent.slice(eqIndex + 1);
    return decodeURIComponent(value);
  }
  return null;
}

export function readConsent(raw: string | null): ConsentV1 | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const result = consentSchema.safeParse(parsed);
  if (!result.success) return null;
  return result.data;
}

export function writeConsent(c: ConsentV1) {
  const json = JSON.stringify(c);
  const encoded = encodeURIComponent(json);
  const secure = location.protocol === "https:";
  let cookieString = `${COOKIE_NAME}=${encoded}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
  document.cookie = cookieString;
}

export function clearConsent() {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/`;
}

export function clearTrackingCookies(): void {
  const raw = document.cookie.split("; ");
  const names = raw.map((c) => c.slice(0, c.indexOf("=")));
  const matches = names.filter(
    (n) =>
      n === "_ga" || n === "_gid" || n === "_gcl_au" || n.startsWith("_ga_"),
  );

  matches.forEach((m) => (document.cookie = `${m}=; Max-Age=0; Path=/`));
}

export function injectGTM(id: string): void {
  if (document.getElementById(GTM_SCRIPT_ID)) {
    return;
  }
  window.dataLayer ||= [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const s = document.createElement("script");
  s.id = GTM_SCRIPT_ID;
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;

  document.head.appendChild(s);
}
