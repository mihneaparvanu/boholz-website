# Remaining TODOs

## Contact form — lead notification + brochure lead-magnet

**Goal.** When a visitor submits the contact form (any variant: `/kontakt`,
contact field on house pages, Vor-Ort-Beratung CTA):

1. **One internal notification email** → the client's inbox
   (`info@boholz-haus.de`) with the lead's name, email, phone, message, source
   page, and timestamp.
2. **The brochure is the lead magnet, delivered on-page** — the success screen
   shows an instant download link/button (PDF on MinIO). No email goes to the
   visitor; the link is shown to everyone who submits.

**Why now.** The form UI exists and is wired; submission is untested. Without
this, every lead is silently dropped.

**Locked approach (2026-06-15).**

- **Brochure = on-page download link**, not emailed. The PDF lives in the MinIO
  bucket (referenced by a `media` row), served via `getMediaURL()`. Removes
  arbitrary-recipient sending and hands the visitor the brochure in ~1 s.
- **Only one automated email: the internal lead notification** to the client
  inbox. The client may follow up personally; brochure delivery never depends on
  it.
- **Sender = `noreply@boholz-haus.de`** (professional From — no generic
  address). Sending _as_ the domain needs DKIM authorization, so:
  - **Preferred: Microsoft 365 Graph** `sendMail` (app-only / client-credentials)
    via their existing Outlook — free, perfect SPF/DKIM alignment. **Blocked on a
    one-time Global-Admin consent** (`Mail.Send` application permission). Access
    request in flight: asked Christoph to route me to whoever administers the
    M365 tenant (Axel = old Hetzner/server only, not the mailbox admin). (M365
    already includes Entra ID; no Azure subscription needed.)
  - **Fallback: Cloudflare Workers Paid** ($5/mo, billed to client) — onboard
    `boholz-haus.de` as a sending domain (DKIM records we add in our own
    Cloudflare DNS), send via REST API.
  - **Decision rule (2026-06-16):** if no usable answer on tenant admin by **this
    evening**, proceed with the Cloudflare Workers fallback and bill the client.
    The build below is provider-agnostic, so this choice is a one-line swap.
  - Both yield a real `noreply@boholz-haus.de`. `boholz-haus.de` MX stays on
    Outlook either way — do NOT repoint it.
- **Validation.** Astro server route `POST /api/contact` runs the existing zod
  schema server-side (`contactSchema` / `catalogSchema` `safeParse`) as the
  authority; 422 + `error.flatten()` on failure. Honeypot + timing trap (no
  CAPTCHA unless spam appears).
- **Email body.** Branded HTML built with MJML (table-based, CSS inlined for
  Outlook), logo via a MinIO URL, plaintext fallback. The internal notification
  can stay simple; polish only matters if a customer-facing reply is added later.
- **Lost-lead fallback.** If the send fails, persist the lead to a `leads` table
  in Postgres and surface a graceful error.
- **Buildable now (before Axel):** the `/api/contact` route, zod validation,
  honeypot, the island `fetch` + success screen with the brochure link, and the
  MJML template — all credential-independent. Abstract the real send behind a
  single `sendEmail()` so the Graph-vs-Cloudflare choice is one swap. Only the
  live authenticated send is blocked on admin access.

**Out of scope (for now).** CRM integration; SMS/WhatsApp; double-opt-in (a
one-shot transactional reply needs none); retry/dead-letter UI.

**Acceptance.**

- Submitting a form on staging delivers the internal notification to the client
  inbox within 30 s, and the success screen shows a working brochure download.
- Send failure or invalid input shows a graceful error and logs server-side
  without losing the lead (DB row).
- The notification email passes SPF/DKIM/DMARC alignment for `boholz-haus.de`.
