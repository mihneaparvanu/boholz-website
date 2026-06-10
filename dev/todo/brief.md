# Remaining TODOs

## 1. Cookie consent — DSGVO/TTDDDG compliant consent layer

**Goal.** Replace the current stub UI in `src/features/cookie-consent/` with a real consent system: persisted user decision, three categories (essential / analytics / marketing), Google Analytics 4 loaded under Consent Mode v2 but dormant until granted, and an accessible preferences dialog that can be re-opened from the cookie policy page.

**Why now.** The legal pages (`/datenschutz`, `/cookies`) already promise the user a banner, a `cookie_consent` cookie, GA4, and the ability to revisit preferences. Today none of that exists — the policy describes a site that doesn't ship. Either we deliver the policy or we trim the policy; we are delivering.

**External constraints we have already committed to.**

- One `cookie_consent` cookie / localStorage key with a 1-year retention (per `/cookies` legal text).
- Three categories shown in the preferences table: _Technisch notwendig_ (always on), _Analyse_, _Marketing_.
- GA4 listed as the only analytics tool; no marketing pixels in inventory yet, but the category must exist so we don't re-prompt the day we add one.
- Brand: minimalist, no dark patterns (equal-weight "Accept all" and "Reject all" buttons, no pre-checked optional categories).

**Out of scope (for now).**

- Marketing pixels (Meta, LinkedIn). The category exists; no pixel is wired.
- Per-vendor consent (we consent to whole categories, not to individual vendors).
- Server-side consent logging — purely client-side persistence.
- A separate IAB TCF integration. Overkill for this site.

**Open questions to resolve before coding.**

- GA4 measurement ID (`G-XXXXXXXXXX`) — get it from the client or create a property under the BoHolz Google account.
- Policy version: we start at `1`. We bump it (and re-prompt all users) whenever categories or vendors change.
- Should the "open preferences" trigger live on every page (e.g. footer link "Cookie-Einstellungen") or only on `/cookies`? Default: footer everywhere.

**Locked decisions.**

- Categories: `essential | analytics | marketing`. Marketing category exists in code but unused today.
- Banner = 3 escalation buttons: `Nur essenzielle` / `Analyse erlauben` / `Alle akzeptieren`. No fine-grained dialog.
- Re-open trigger: existing footer link `Ihre Privatsphäre-Einstellungen` (currently `href=""`) — dispatches `boholz:open-consent` on `window`.
- Persistence: first-party `cookie_consent` cookie, 1-year `Max-Age`, `SameSite=Lax`, `Secure` in prod. Lets the server skip injecting GA4 when consent denied.
- Policy version: single global integer, starts at `1`.
- State layer: a `useConsent()` composable in `src/features/cookie-consent/`. No Pinia.
- SSR guards: every storage read/write begins with `typeof window === 'undefined'` early exit.
- Hydration flicker: composable exposes `isReady` flag — banner renders only when `isReady && !hasDecision`.
- Pre-hydration head script in `Layout.astro` reads cookie + sets `data-consent` on `<html>` so GA4 can stay un-injected and CSS can hide the banner before paint. (Ring 4 polish.)

**Acceptance.**

- First-time visitor sees the notice; no GA4 hits fire until they decide.
- Decision persists across reloads, survives Chrome's "clear browsing data on close" (because it's in localStorage, not session storage).
- Re-opening the preferences from the footer prefills the user's current choices.
- Lighthouse a11y for the dialog: 100.
- A second visit one year later (or after a `version` bump) re-prompts.

---

## 2. Contact form — two-email send on submission

**Goal.** When a visitor submits the contact form (any variant: `/kontakt`, contact field on house pages, Vor-Ort-Beratung CTA), two transactional emails go out:

1. **Internal notification** → `info@boholz-haus.de` containing the lead's name, email, phone, message, source page, and timestamp.
2. **Visitor auto-reply** → the email the visitor entered, thanking them and **attaching the BoHolz brochure PDF** (or linking to it if attachment size is a concern with the provider).

**Why now.** The form UI exists and is wired; submission is untested. Without this, every lead is silently dropped.

**External constraints.**

- Email provider — we have no transactional provider configured yet. Candidates: Resend (best DX, EU region available), Postmark (reliability champion), Brevo/Mailjet (German-market favored, has free tier). DNS records for SPF/DKIM/DMARC must be set on `boholz-haus.de`.
- Sender: `noreply@boholz-haus.de` (or `kontakt@`). The reply-to on the visitor auto-reply should be `info@boholz-haus.de` so the visitor's natural reply goes to the inbox.
- The brochure PDF must live at a stable public URL (R2) and be referenced by a `media` row.
- German-language copy in both emails. Brand-consistent HTML template, plaintext fallback.

**Out of scope (for now).**

- A full CRM integration (HubSpot, Pipedrive, etc.).
- SMS / WhatsApp notifications.
- A double-opt-in for the auto-reply (the visitor initiated contact, no DOI is legally required for a one-shot transactional reply).
- Retry queue / dead-letter inspection UI — we rely on the provider's built-in retry + email-alert-on-failure.

**Open questions.**

- Provider choice (Resend recommended — EU data residency, EU sending region, dev-friendly Bun-compatible SDK).
- Brochure file: which PDF exactly, where does it live, what filename does the visitor see?
- Should the auto-reply attach (heavier email, may bounce on small-mailbox recipients) or link (lighter, but one extra click for the customer)? Default: link, with a 1-click download URL on R2.
- Honeypot vs. CAPTCHA: I'd prefer a honeypot + timing trap (zero UX cost) and only escalate to CAPTCHA if we see spam.

**Acceptance.**

- Submitting a form on staging delivers both emails to the right inboxes within 30 s.
- Failure (provider down, invalid email) shows a graceful error to the user and logs server-side without losing the lead (write to DB or fallback inbox).
- DMARC report shows the domain passes alignment.
- Visitor can click the brochure link/attachment and the PDF downloads.

---
