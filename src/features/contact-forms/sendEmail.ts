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

export const emailConfig = process.env.NODE_ENV === "production" ? prodRouting : devRouting();

export async function sendEmail(
  content: EmailContent
): Promise<{ ok: boolean; error?: string }> {
  const completeEmail: Email = { ...emailConfig, ...content };

  console.log("[sendEmail stub]", {
    ...completeEmail,
    htmlLength: completeEmail.html.length,
    textLength: completeEmail.text.length,
  });
  
  return { ok: true };
}
