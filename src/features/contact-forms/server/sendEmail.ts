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

export type MailEnv = {
  MAIN_DOMAIN?: string;
  LEAD_EMAIL_TO?: string;
  MS_GRAPH_TENANT_ID: string;
  MS_GRAPH_CLIENT_ID: string;
  MS_GRAPH_CLIENT_SECRET: string;
};

async function fetchAccessToken(env: MailEnv): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${env.MS_GRAPH_TENANT_ID}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: env.MS_GRAPH_CLIENT_ID,
    client_secret: env.MS_GRAPH_CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(tokenUrl, { method: "POST", body });

  const json = (await res.json()) as { access_token?: string };
  if (!res.ok || !json.access_token) throw new Error(`token ${res.status}`);
  return json.access_token;
}

export async function sendEmail(
  env: MailEnv,
  content: EmailContent,
): Promise<{ ok: boolean; error?: string }> {
  const domain = env.MAIN_DOMAIN || "boholz-haus.de";
  const completeEmail: Email = {
    to: `info@${domain}`,
    from: `noreply@${domain}`,
    ...content,
  };

  const from = completeEmail.from;
  const to = env.LEAD_EMAIL_TO || completeEmail.to;
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
    const token = await fetchAccessToken(env);
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
