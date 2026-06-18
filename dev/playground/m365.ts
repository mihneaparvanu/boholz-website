/**
 * M365 / Microsoft Graph sendMail smoke test.
 *
 * Run with:  bun dev/playground/m365.ts
 *
 * Two-step flow:
 *   1. Trade client_id + client_secret for an access_token
 *      (OAuth 2.0 client_credentials grant).
 *   2. POST that token + a tiny email payload to Graph's /sendMail.
 *
 * If both steps return 2xx → the M365 wire-up is good and we can
 * safely swap the sendEmail() stub for the real Graph call.
 *
 * Common failure modes & what they mean:
 *   - 401 AADSTS7000215     wrong client secret VALUE
 *   - 401 AADSTS700016      wrong client_id / wrong tenant
 *   - 403 ErrorAccessDenied app lacks Mail.Send permission OR
 *                            admin consent not granted yet
 *   - 404 on /users/{from}  noreply@boholz-haus.de mailbox doesn't
 *                            exist in this tenant
 */

export {};

const TENANT = process.env.MS_GRAPH_TENANT_ID;
const CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID;
const CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET;

if (!TENANT || !CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "Missing one of MS_GRAPH_TENANT_ID / MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET",
  );
}

const FROM = "noreply@boholz-haus.de";
const TO = "mihnea@sadnights.com";

// ─── Step 1: get an access token ──────────────────────────────────────

console.log("→ requesting access token …");

const tokenBody = new URLSearchParams();
tokenBody.append("client_id", CLIENT_ID);
tokenBody.append("client_secret", CLIENT_SECRET);
tokenBody.append("scope", "https://graph.microsoft.com/.default");
tokenBody.append("grant_type", "client_credentials");

const tokenRes = await fetch(
  `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
  { method: "POST", body: tokenBody },
);

const tokenJson = (await tokenRes.json()) as {
  access_token?: string;
  error?: string;
  error_description?: string;
};

if (!tokenRes.ok || !tokenJson.access_token) {
  console.error("✗ token request failed", tokenRes.status, tokenJson);
  process.exit(1);
}

console.log("✓ token acquired (length", tokenJson.access_token.length + ")");

// ─── Step 2: send an actual email ─────────────────────────────────────

console.log(`→ sending mail from ${FROM} to ${TO} …`);

const mailPayload = {
  message: {
    subject: "BoHolz M365 smoke test",
    body: {
      contentType: "Text",
      content:
        "Wenn diese Nachricht ankommt, funktioniert die Graph-Anbindung. ✅",
    },
    toRecipients: [{ emailAddress: { address: TO } }],
  },
  saveToSentItems: false,
};

const sendRes = await fetch(
  `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(FROM)}/sendMail`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailPayload),
  },
);

// Graph returns 202 Accepted with no body on success.
if (sendRes.status === 202) {
  console.log("✓ Graph accepted the message — check your inbox.");
  process.exit(0);
}

const errBody = await sendRes.text();
console.error("✗ sendMail failed", sendRes.status, errBody);
process.exit(1);
