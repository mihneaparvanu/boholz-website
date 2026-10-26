import { type ConsentType } from "./consent.types";

const GTM_ID = import.meta.env.PUBLIC_GTM_ID;
export const BANNER_ID = "consent-banner";

export type ConsentV1 = { v: 1; analytics: boolean; marketing: boolean };

export const CONSENT_PRESETS = {
  marketing: { v: 1, analytics: true, marketing: true },
  analytics: { v: 1, analytics: true, marketing: false },
  none: { v: 1, analytics: false, marketing: false },
} as const satisfies Record<ConsentType, ConsentV1>;

export const COOKIE_NAME = "boholz_consent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const GTM_SCRIPT_ID = "gtm-script";

export function getCookie(name: string) {
  const raw = document.cookie.split("; ");
  const foundConsent = raw.find((c) => c.startsWith(name + "="));
  if (foundConsent) {
    const eqIndex = foundConsent.indexOf("=");
    const value = foundConsent.slice(eqIndex + 1);
    return decodeURIComponent(value);
  }
  return null;
}

function isConsentV1(x: unknown): x is ConsentV1 {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;

  return (
    o.v === 1 &&
    typeof o.analytics === "boolean" &&
    typeof o.marketing === "boolean"
  );
}

export function readConsent(raw: string | null): ConsentV1 | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isConsentV1(parsed)) return null;
  return parsed;
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

export function injectGTM(): void {
  window.dataLayer ||= [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const s = document.createElement("script");
  s.id = GTM_SCRIPT_ID;
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

  document.head.appendChild(s);
}

type ConsentSignal = "granted" | "denied";

type GoogleConsentState = Record<
  "ad_storage" | "ad_user_data" | "ad_personalization" | "analytics_storage",
  ConsentSignal
>;

export const CONSENT_DEFAULT: GoogleConsentState = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

export function toGoogleConsent(c: ConsentV1): GoogleConsentState {
  const analytics = c.analytics ? "granted" : "denied";
  const marketing = c.marketing ? "granted" : "denied";

  return {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
  };
}

export function gtag(
  _command: "consent",
  _mode: "default" | "update",
  _state: GoogleConsentState,
) {
  window.dataLayer ||= [];
  window.dataLayer.push(arguments);
}

export function applyConsent(preset: ConsentType) {
  const c = CONSENT_PRESETS[preset];
  writeConsent(c);
  gtag("consent", "update", toGoogleConsent(c));
  if (!c.analytics && c.marketing) clearTrackingCookies();
}
