export type Email = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type EmailRouting = Pick<Email, "to" | "from">;
export type EmailContent = Omit<Email, "to" | "from">;

const domain = process.env.MAIN_DOMAIN || "boholz-haus.de";
const prodRouting: EmailRouting = {
  to: `info@${domain}`,
  from: `noreply@${domain}`,
};

const devDomain = process.env.DEV_DOMAIN;
const devRouting: EmailRouting = {
  to: `mihnea@${devDomain}`,
  from: `noreply@${devDomain}`,
};

export const emailConfig =
  process.env.NODE_ENV === "production" ? prodRouting : devRouting;

const TENANT = process.env.MS_GRAPH_TENANT_ID;
const CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID;
const CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET;

async function fetchAccessToken(): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(tokenUrl, { method: "POST", body });

  const json = (await res.json()) as { access_token?: string };
  if (!res.ok || !json.access_token) throw new Error(`token ${res.status}`);
  return json.access_token;
}

export async function sendEmail(
  content: EmailContent,
): Promise<{ ok: boolean; error?: string }> {
  const completeEmail: Email = { ...emailConfig, ...content };

  const from = completeEmail.from;
  const to = process.env.LEAD_EMAIL_TO || completeEmail.to;
  const payload = {
    message: {
      subject: completeEmail.subject,
      body: { contentType: "HTML", content: completeEmail.html },
      toRecipients: [
        {
          emailAddress: { address: to },
        },
      ],
      ...(completeEmail.replyTo
        ? { replyTo: [{ emailAddress: { address: completeEmail.replyTo } }] }
        : {}),
    },
    saveToSentItems: false,
  };

  if (!from || !to) {
    return { ok: false, error: "No email from / to" };
  }

  try {
    const token = await fetchAccessToken();
    const sendUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(from)}/sendMail`;
    const res = await fetch(sendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 202) return { ok: true };
    return { ok: false, error: `Graph: ${res.status}: ${await res.text()}` };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
